import { useState, useEffect } from 'react'
import {
  Download, Plus, Search, Briefcase, TrendingUp,
  Calendar, Award, Eye, Star, Clock, LayoutGrid, List,
  X, ExternalLink, DollarSign
} from 'lucide-react'
import { motion } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

type AppStatus = 'applied' | 'viewed' | 'downloaded' | 'shortlisted' | 'interview' | 'offer' | 'rejected'

const STATUS_COLUMNS: { id: AppStatus; title: string; color: string; subtitle: string }[] = [
  { id: 'applied',     title: 'Applied',     color: '#4a9ef5', subtitle: 'Waiting for review' },
  { id: 'viewed',      title: 'Viewed',      color: '#7c6be8', subtitle: 'Recruiter reviewed' },
  { id: 'shortlisted', title: 'Shortlisted', color: '#f5703a', subtitle: 'Moving forward' },
  { id: 'interview',   title: 'Interview',   color: '#1ab87a', subtitle: 'Scheduled / completed' },
]

const statusIcon = (id: string, color: string, size = 14) => {
  const props = { size, style: { color } }
  if (id === 'applied')     return <Briefcase {...props} />
  if (id === 'viewed')      return <Eye {...props} />
  if (id === 'shortlisted') return <Star {...props} />
  return <Calendar {...props} />
}

interface AddModalProps {
  onClose: () => void
  onAdd: (app: any) => void
}

const AddModal = ({ onClose, onAdd }: AddModalProps) => {
  const [form, setForm] = useState({ company: '', position: '', location: '', salary_range: '', job_url: '', notes: '', status: 'applied' as AppStatus })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-dark-card border border-dark-border/50 rounded-2xl p-6 space-y-4 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-dark-text-primary">Add Application</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-dark-bg-secondary rounded-lg transition-colors"><X size={16} className="text-dark-text-secondary" /></button>
        </div>
        {[
          { key: 'company', label: 'Company *', placeholder: 'e.g. Google' },
          { key: 'position', label: 'Role *', placeholder: 'e.g. Senior Engineer' },
          { key: 'location', label: 'Location', placeholder: 'e.g. Remote' },
          { key: 'salary_range', label: 'Salary Range', placeholder: 'e.g. $120k–$150k' },
          { key: 'job_url', label: 'Job URL', placeholder: 'https://...' },
          { key: 'notes', label: 'Notes', placeholder: 'Any notes...' },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-bold text-dark-text-secondary uppercase tracking-widest mb-1">{f.label}</label>
            <input value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
              className="w-full px-3 py-2.5 bg-dark-bg-secondary border border-dark-border/50 rounded-xl text-sm text-dark-text-primary placeholder-dark-text-secondary/30 focus:outline-none focus:border-dark-accent/50" />
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 bg-dark-bg-secondary border border-dark-border/50 text-dark-text-secondary rounded-xl text-sm font-semibold hover:border-dark-accent/30 transition-colors">Cancel</button>
          <button onClick={() => { if (!form.company || !form.position) { toast.error('Company and role are required'); return } onAdd(form) }}
            className="flex-1 py-2.5 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-xl text-sm font-semibold transition-colors">Add</button>
        </div>
      </motion.div>
    </div>
  )
}

const Applications = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [viewMode, setViewMode]         = useState<'columns' | 'list'>('columns')
  const [searchTerm, setSearchTerm]     = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const { user } = useAuthStore()
  const { applications, addApplication, updateApplication, deleteApplication, fetchApplications } = useDataStore()

  useEffect(() => {
    if (user?.id) fetchApplications(user.id)
  }, [user?.id])

  const handleAdd = async (form: any) => {
    if (!user?.id) return
    await addApplication(user.id, { ...form, applied_date: new Date().toISOString() })
    setShowAddModal(false)
  }

  const handleMove = async (id: string, status: AppStatus) => {
    await updateApplication(id, { status })
  }

  const filtered = applications.filter(a => {
    const matchSearch = !searchTerm ||
      a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchFilter = activeFilter === 'All' || a.status === activeFilter.toLowerCase()
    return matchSearch && matchFilter
  })

  const stats = {
    total: applications.length,
    active: applications.filter(a => ['applied', 'viewed', 'shortlisted'].includes(a.status)).length,
    interviews: applications.filter(a => a.status === 'interview').length,
    offers: applications.filter(a => a.status === 'offer').length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-text-primary mb-1">Applications Tracker</h1>
            <p className="text-sm text-dark-text-secondary">Manage and monitor your active job search</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 h-9 rounded-xl flex items-center gap-1.5 bg-dark-card border border-dark-border/50 text-dark-text-secondary hover:border-dark-accent/30 text-xs font-semibold transition-colors">
              <Download size={13} /> Export
            </button>
            <button onClick={() => setShowAddModal(true)}
              className="px-4 h-9 rounded-xl flex items-center gap-1.5 bg-dark-accent hover:bg-dark-accent-hover text-white text-xs font-semibold transition-colors">
              <Plus size={13} /> Add Application
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', value: stats.total, subtitle: 'applications', color: '#4a9ef5', icon: Briefcase },
            { label: 'Active', value: stats.active, subtitle: 'in progress', color: '#f5703a', icon: TrendingUp },
            { label: 'Interviews', value: stats.interviews, subtitle: 'scheduled', color: '#ffc107', icon: Calendar },
            { label: 'Offers', value: stats.offers, subtitle: 'received', color: '#1ab87a', icon: Award },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-xl relative overflow-hidden bg-dark-card border border-dark-border/50">
              <div className="absolute rounded-full" style={{ width: 60, height: 60, bottom: -10, right: 10, background: s.color, filter: 'blur(20px)', opacity: 0.1 }} />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[10px] uppercase font-bold mb-0.5" style={{ color: s.color }}>{s.label}</p>
                  <p className="text-3xl font-bold text-dark-text-primary">{s.value}</p>
                  <p className="text-[10px] text-dark-text-secondary mt-0.5">{s.subtitle}</p>
                </div>
                <div className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: `${s.color}15` }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-secondary/50" />
            <input type="text" placeholder="Search applications…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-8 pr-3 bg-dark-card border border-dark-border/50 rounded-xl text-xs text-dark-text-primary placeholder-dark-text-secondary/30 focus:outline-none focus:border-dark-accent/50" />
          </div>
          <div className="flex gap-1">
            {['All', 'Applied', 'Viewed', 'Shortlisted', 'Interview', 'Offer', 'Rejected'].map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`h-9 px-3 rounded-xl text-xs font-bold transition-all ${activeFilter === f ? 'bg-dark-accent text-white' : 'bg-dark-card border border-dark-border/50 text-dark-text-secondary hover:border-dark-accent/30'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex rounded-xl overflow-hidden border border-dark-border/50">
            {(['columns', 'list'] as const).map(m => (
              <button key={m} onClick={() => setViewMode(m)}
                className={`w-9 h-9 flex items-center justify-center transition-colors ${viewMode === m ? 'bg-dark-accent text-white' : 'bg-dark-card text-dark-text-secondary'}`}>
                {m === 'columns' ? <LayoutGrid size={14} /> : <List size={14} />}
              </button>
            ))}
          </div>
        </div>

        {/* ── KANBAN VIEW ── */}
        {viewMode === 'columns' && (
          <div className="grid grid-cols-4 gap-3">
            {STATUS_COLUMNS.map(col => {
              const colApps = filtered.filter(a => a.status === col.id)
              return (
                <div key={col.id} className="bg-dark-card border border-dark-border/50 rounded-xl overflow-hidden">
                  {/* Column header */}
                  <div className="px-3 pt-3 pb-2 border-b border-dark-border/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 flex items-center justify-center rounded-md" style={{ background: `${col.color}15` }}>
                          {statusIcon(col.id, col.color)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-dark-text-primary">{col.title}</p>
                          <p className="text-[10px] text-dark-text-secondary">{col.subtitle}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: col.color, background: `${col.color}15` }}>
                        {colApps.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="p-2 space-y-2 min-h-[120px]">
                    {colApps.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg mb-2" style={{ background: `${col.color}08` }}>
                          {statusIcon(col.id, '#2e2e2e', 16)}
                        </div>
                        <p className="text-[10px] text-dark-text-secondary/30">No applications</p>
                      </div>
                    ) : (
                      colApps.map(app => (
                        <motion.div key={app.id} layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg border border-dark-border/50 bg-dark-bg-secondary hover:border-dark-accent/20 transition-all group relative overflow-hidden">
                          <div className="absolute left-0 top-0 h-full w-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: col.color }} />
                          <div className="flex items-start gap-2 mb-2">
                            <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold" style={{ background: `${col.color}20`, color: col.color }}>
                              {app.company.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-dark-text-primary truncate">{app.position}</p>
                              <p className="text-[10px] text-dark-text-secondary truncate">{app.company}{app.location ? ` · ${app.location}` : ''}</p>
                            </div>
                          </div>
                          {app.salary_range && (
                            <div className="flex items-center gap-1 mb-2">
                              <DollarSign size={10} className="text-green-400" />
                              <span className="text-[10px] text-green-400">{app.salary_range}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Clock size={10} className="text-dark-text-secondary/40" />
                              <span className="text-[10px] text-dark-text-secondary/40">
                                {new Date(app.applied_date || app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {app.job_url && (
                                <a href={app.job_url} target="_blank" rel="noopener noreferrer"
                                  className="w-6 h-6 flex items-center justify-center rounded bg-dark-card hover:bg-dark-accent/20 transition-colors">
                                  <ExternalLink size={10} className="text-dark-text-secondary" />
                                </a>
                              )}
                              <button onClick={() => deleteApplication(app.id)}
                                className="w-6 h-6 flex items-center justify-center rounded bg-dark-card hover:bg-red-500/20 transition-colors">
                                <X size={10} className="text-dark-text-secondary hover:text-red-400" />
                              </button>
                            </div>
                          </div>
                          {/* Move to next stage */}
                          <div className="mt-2 pt-2 border-t border-dark-border/30">
                            <select value={app.status} onChange={e => handleMove(app.id, e.target.value as AppStatus)}
                              className="w-full text-[10px] bg-dark-card border border-dark-border/50 rounded-lg px-2 py-1 text-dark-text-secondary focus:outline-none focus:border-dark-accent/50">
                              {['applied', 'viewed', 'shortlisted', 'interview', 'offer', 'rejected'].map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {viewMode === 'list' && (
          <div className="bg-dark-card border border-dark-border/50 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_120px_100px_80px_100px] gap-4 px-5 py-3 border-b border-dark-border/30">
              {['Role', 'Company', 'Location', 'Salary', 'Date', 'Status'].map(h => (
                <p key={h} className="text-[10px] font-black text-dark-text-secondary uppercase tracking-widest">{h}</p>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Briefcase size={40} className="text-dark-text-secondary/20 mx-auto mb-3" />
                <p className="text-dark-text-secondary text-sm">No applications yet</p>
                <button onClick={() => setShowAddModal(true)} className="mt-3 text-sm text-dark-accent hover:underline">Add your first application</button>
              </div>
            ) : filtered.map(app => (
              <div key={app.id} className="grid grid-cols-[1fr_1fr_120px_100px_80px_100px] gap-4 px-5 py-3.5 border-b border-dark-border/20 hover:bg-dark-bg-secondary/50 transition-colors group items-center">
                <p className="text-sm font-semibold text-dark-text-primary truncate">{app.position}</p>
                <p className="text-sm text-dark-text-secondary truncate">{app.company}</p>
                <p className="text-xs text-dark-text-secondary truncate">{app.location || '—'}</p>
                <p className="text-xs text-green-400">{app.salary_range || '—'}</p>
                <p className="text-xs text-dark-text-secondary">{new Date(app.applied_date || app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    app.status === 'offer' ? 'bg-green-500/10 text-green-400' :
                    app.status === 'interview' ? 'bg-blue-500/10 text-blue-400' :
                    app.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                    'bg-dark-accent/10 text-dark-accent'
                  }`}>{app.status}</span>
                  <button onClick={() => deleteApplication(app.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} className="text-dark-text-secondary hover:text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {showAddModal && <AddModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
    </DashboardLayout>
  )
}

export default Applications
