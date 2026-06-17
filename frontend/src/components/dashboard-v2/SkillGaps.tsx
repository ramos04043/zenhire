import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '../../store/onboardingStore'

const SkillGaps = () => {
  const navigate = useNavigate()
  const { profile } = useOnboardingStore()

  const yourSkills = profile.skills.slice(0, 6)
  const gaps = profile.missingKeywords?.slice(0, 4) || []

  const fallbackSkills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL']
  const fallbackGaps = ['Upload resume', 'to detect gaps']

  return (
    <div className="bg-[#161616] border border-[#242424] rounded-[11px] p-[14px]">
      <h3 className="text-[12px] font-medium text-white mb-3">Skill Gaps</h3>

      <div className="mb-3">
        <p className="text-[10px] text-[#555] mb-2">Your skills</p>
        <div className="flex flex-wrap gap-1.5">
          {(yourSkills.length > 0 ? yourSkills : fallbackSkills).map((skill, idx) => (
            <span key={idx} className="text-[9px] px-2 py-1 bg-[#1a1a1a] text-[#ccc] rounded">{skill}</span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-[10px] text-[#555] mb-2">Gaps to address</p>
        <div className="flex flex-wrap gap-1.5">
          {(gaps.length > 0 ? gaps : fallbackGaps).map((skill, idx) => (
            <span key={idx} className="text-[9px] px-2 py-1 bg-[#f5703a]/10 text-[#f5703a] rounded">{skill}</span>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate('/resume')}
        className="w-full h-8 bg-transparent border border-[#242424] hover:border-[#333] text-[#ccc] text-[10px] font-medium rounded transition-colors">
        {profile.resumeAnalyzed ? 'Analyze new resume' : 'Upload resume'}
      </button>
    </div>
  )
}

export default SkillGaps
