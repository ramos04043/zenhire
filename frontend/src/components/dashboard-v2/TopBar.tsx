import { Bell } from 'lucide-react'

interface TopBarProps {
  userName: string
}

const TopBar = ({ userName }: TopBarProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getCurrentDate = () => {
    const date = new Date()
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-[20px] font-medium text-white mb-1">
          {getGreeting()}, {userName.split(' ')[0]}
        </h1>
        <p className="text-[10px] text-[#555]">
          {getCurrentDate()}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Bell Icon Button */}
        <button className="w-8 h-8 flex items-center justify-center bg-[#161616] border border-[#242424] rounded-lg hover:bg-[#1a1a1a] transition-colors">
          <Bell size={16} className="text-[#ccc]" />
        </button>
        
        {/* Avatar */}
        <div className="w-8 h-8 flex items-center justify-center bg-[#f5703a] rounded-lg text-white text-[11px] font-medium">
          {initials}
        </div>
      </div>
    </div>
  )
}

export default TopBar
