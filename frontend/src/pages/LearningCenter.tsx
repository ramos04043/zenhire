import DashboardLayout from '../components/DashboardLayout'
import { BookOpen, Video, FileText, Award, Clock, TrendingUp } from 'lucide-react'

const LearningCenter = () => {
  const courses = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      type: 'Course',
      duration: '4 hours',
      progress: 60,
      category: 'Frontend',
    },
    {
      id: 2,
      title: 'System Design Interview Prep',
      type: 'Video Series',
      duration: '6 hours',
      progress: 30,
      category: 'Interview Prep',
    },
    {
      id: 3,
      title: 'TypeScript Best Practices',
      type: 'Article',
      duration: '15 min',
      progress: 100,
      category: 'Frontend',
    },
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Learning Center</h1>
            <p className="text-gray-400">Upskill with curated learning resources</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Courses Enrolled</span>
                <BookOpen className="text-blue-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">12</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Hours Learned</span>
                <Clock className="text-green-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">48</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Certificates</span>
                <Award className="text-yellow-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">5</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Streak</span>
                <TrendingUp className="text-purple-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">7 days</p>
            </div>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Courses</h2>
            
            <div className="space-y-4">
              {courses.map(course => (
                <div key={course.id} className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-[#6366f1]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {course.type === 'Course' ? (
                          <BookOpen className="text-[#6366f1]" size={20} />
                        ) : course.type === 'Video Series' ? (
                          <Video className="text-[#6366f1]" size={20} />
                        ) : (
                          <FileText className="text-[#6366f1]" size={20} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-bold mb-1">{course.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span>{course.type}</span>
                          <span>•</span>
                          <span>{course.duration}</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 bg-[#6366f1]/10 text-[#6366f1] rounded">
                            {course.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium">
                      {course.progress === 100 ? 'Review' : 'Continue'}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-[#222222] rounded-full h-2">
                      <div
                        className="bg-[#6366f1] h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 font-medium">{course.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default LearningCenter
