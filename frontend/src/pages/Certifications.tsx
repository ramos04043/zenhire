import DashboardLayout from '../components/DashboardLayout'
import { Award, Plus, Download, ExternalLink, Calendar } from 'lucide-react'

const Certifications = () => {
  const certs = [
    {
      id: 1,
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issued: '2023-06-15',
      expires: '2026-06-15',
      credentialId: 'AWS-12345',
    },
    {
      id: 2,
      name: 'Google Cloud Professional',
      issuer: 'Google Cloud',
      issued: '2023-03-20',
      expires: '2025-03-20',
      credentialId: 'GCP-67890',
    },
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Certifications</h1>
              <p className="text-gray-400">Manage your professional certifications</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors">
              <Plus size={20} />
              <span>Add Certification</span>
            </button>
          </div>

          <div className="space-y-4">
            {certs.map(cert => (
              <div key={cert.id} className="bg-[#111111] border border-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-[#6366f1]/10 rounded-lg flex items-center justify-center">
                      <Award className="text-[#6366f1]" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{cert.name}</h3>
                      <p className="text-gray-400 mb-3">{cert.issuer}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Issued: {cert.issued}</span>
                        </div>
                        <span>•</span>
                        <span>Expires: {cert.expires}</span>
                        <span>•</span>
                        <span>ID: {cert.credentialId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors">
                      <Download className="text-gray-400" size={18} />
                    </button>
                    <button className="p-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors">
                      <ExternalLink className="text-gray-400" size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Certifications
