import { FileText, Search, Calendar, Bookmark } from 'lucide-react'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  subtitle: string
  accentColor: string
  bgColor: string
}

const StatCard = ({ icon, label, value, subtitle, accentColor, bgColor }: StatCardProps) => {
  return (
    <div className="bg-[#161616] border border-[#242424] rounded-[11px] p-3.5 relative overflow-hidden">
      {/* 2px left accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[2px]" 
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="flex items-start gap-3">
        {/* Icon box */}
        <div 
          className="w-[26px] h-[26px] rounded flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase text-[#555] mb-1 font-medium tracking-wide">
            {label}
          </div>
          <div className="text-[18px] font-medium text-white mb-0.5">
            {value}
          </div>
          <div className="text-[10px] text-[#555]">
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardsProps {
  applications: number
  activeSearches: number
  interviews: number
  savedJobs: number
}

const StatCards = ({ applications, activeSearches, interviews, savedJobs }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-4 gap-3 mb-3">
      <StatCard
        icon={<FileText size={14} className="text-[#f5703a]" />}
        label="Applications"
        value={applications}
        subtitle="Total submitted"
        accentColor="#f5703a"
        bgColor="rgba(245, 112, 58, 0.1)"
      />
      
      <StatCard
        icon={<Search size={14} className="text-[#1ab87a]" />}
        label="Active Search"
        value={activeSearches}
        subtitle="Job alerts"
        accentColor="#1ab87a"
        bgColor="rgba(26, 184, 122, 0.1)"
      />
      
      <StatCard
        icon={<Calendar size={14} className="text-[#7c6be8]" />}
        label="Interviews"
        value={interviews}
        subtitle="This month"
        accentColor="#7c6be8"
        bgColor="rgba(124, 107, 232, 0.1)"
      />
      
      <StatCard
        icon={<Bookmark size={14} className="text-[#4a9ef5]" />}
        label="Saved Jobs"
        value={savedJobs}
        subtitle="To review"
        accentColor="#4a9ef5"
        bgColor="rgba(74, 158, 245, 0.1)"
      />
    </div>
  )
}

export default StatCards
