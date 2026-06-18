import DashboardLayout from '../components/DashboardLayout'
import { Target, Plus, CheckCircle, Clock } from 'lucide-react'

const CareerGoals = () => {
  const goals = [
    {
      id: 1,
      title: 'Master System Design',
      description: 'Complete system design course and practice',
      progress: 65,
      deadline: '2024-06-30',
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'Land Senior Role',
      description: 'Get promoted to Senior Engineer position',
      progress: 40,
      deadline: '2024-12-31',
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Learn AWS',
      description: 'Get AWS Solutions Architect certification',
      progress: 100,
      deadline: '2024-01-15',
      status: 'Completed',
    },
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Career Goals</h1>
              <p className="text-gray-400">Set and track your career objectives</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors">
              <Plus size={20} />
              <span>Add Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Goals</span>
                <Target className="text-blue-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">{goals.length}</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">In Progress</span>
                <Clock className="text-yellow-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">
                {goals.filter(g => g.status === 'In Progress').length}
              </p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Completed</span>
                <CheckCircle className="text-green-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">
                {goals.filter(g => g.status === 'Completed').length}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {goals.map(goal => (
              <div key={goal.id} className="bg-[#111111] border border-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#6366f1]/10 rounded-lg flex items-center justify-center">
                      {goal.status === 'Completed' ? (
                        <CheckCircle className="text-green-400" size={24} />
                      ) : (
                        <Target className="text-[#6366f1]" size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{goal.title}</h3>
                      <p className="text-gray-400 mb-2">{goal.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>Deadline: {goal.deadline}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-[#1a1a1a] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        goal.status === 'Completed' ? 'bg-green-400' : 'bg-[#6366f1]'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 font-medium">{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CareerGoals
