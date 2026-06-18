import DashboardLayout from '../components/DashboardLayout'
import { Plus, ExternalLink, Github, Star, Eye } from 'lucide-react'

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React and Node.js',
      image: 'https://via.placeholder.com/400x250',
      tech: ['React', 'Node.js', 'PostgreSQL'],
      stars: 245,
      views: 1200,
      github: '#',
      demo: '#',
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative task manager with real-time updates',
      image: 'https://via.placeholder.com/400x250',
      tech: ['TypeScript', 'Next.js', 'Firebase'],
      stars: 189,
      views: 850,
      github: '#',
      demo: '#',
    },
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
              <p className="text-gray-400">Showcase your best work</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors">
              <Plus size={20} />
              <span>Add Project</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {projects.map(project => (
              <div key={project.id} className="bg-[#111111] border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors">
                <div className="aspect-video bg-[#1a1a1a] flex items-center justify-center">
                  <div className="text-gray-600">Project Preview</div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#6366f1]/10 text-[#6366f1] rounded-full text-sm border border-[#6366f1]/20">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star size={16} />
                        <span>{project.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{project.views}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <a href={project.github} className="p-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors">
                        <Github className="text-gray-400" size={18} />
                      </a>
                      <a href={project.demo} className="p-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors">
                        <ExternalLink className="text-gray-400" size={18} />
                      </a>
                    </div>
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

export default Portfolio
