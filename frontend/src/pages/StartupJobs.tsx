import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Users, 
  Briefcase,
  Star,
  Filter,
  Search,
  Heart,
  Zap
} from 'lucide-react';
import api from '../lib/api';

interface StartupJob {
  id: string;
  title: string;
  company: string;
  company_logo: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  employment_type: string;
  work_mode: string;
  startup_stage?: string;
  team_size?: number;
  funding_amount?: number;
  industries: string[];
  tech_stack: string[];
  skills: string[];
  is_yc_company: boolean;
  is_dream_company: boolean;
  equity_offered?: boolean;
  visa_sponsorship?: boolean;
  match_score: number;
  match_reason: string[];
  apply_url: string;
  posted_date: string;
}

const StartupJobs: React.FC = () => {
  const [jobs, setJobs] = useState<StartupJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('Software Engineer');
  const [filters, setFilters] = useState({
    industries: [] as string[],
    stages: [] as string[],
    workMode: 'remote',
    minTeamSize: undefined as number | undefined,
    maxTeamSize: undefined as number | undefined,
    equityImportant: false,
    visaSponsorshipRequired: false,
    ycOnly: false,
    dreamCompaniesOnly: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    startups: 0,
    ycCompanies: 0,
    avgMatchScore: 0
  });

  const industries = [
    'ai-ml', 'saas', 'fintech', 'developer-tools', 
    'healthtech', 'edtech', 'cybersecurity', 'open-source'
  ];

  const stages = [
    'seed', 'series-a', 'series-b', 'series-c', 'series-d+'
  ];

  useEffect(() => {
    searchJobs();
  }, []);

  const searchJobs = async () => {
    setLoading(true);
    try {
      const profile = {
        desired_job_title: searchQuery,
        skills: [],
        experience_level: 'mid',
        preferred_locations: ['Remote'],
        work_mode: filters.workMode,
        preferred_startup_stages: filters.stages,
        preferred_industries: filters.industries,
        equity_important: filters.equityImportant,
        visa_sponsorship_required: filters.visaSponsorshipRequired,
        min_team_size: filters.minTeamSize,
        max_team_size: filters.maxTeamSize
      };

      const response = await api.post('/startup-jobs/search', profile);
      
      let jobsList = response.data.jobs;

      // Apply frontend filters
      if (filters.ycOnly) {
        jobsList = jobsList.filter((job: StartupJob) => job.is_yc_company);
      }
      if (filters.dreamCompaniesOnly) {
        jobsList = jobsList.filter((job: StartupJob) => job.is_dream_company);
      }

      setJobs(jobsList);
      
      // Calculate stats
      const avgScore = jobsList.length > 0 
        ? jobsList.reduce((sum: number, job: StartupJob) => sum + job.match_score, 0) / jobsList.length
        : 0;

      setStats({
        total: jobsList.length,
        startups: response.data.startup_count,
        ycCompanies: response.data.yc_company_count,
        avgMatchScore: Math.round(avgScore)
      });

    } catch (error) {
      console.error('Error searching startup jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleIndustry = (industry: string) => {
    setFilters(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry]
    }));
  };

  const toggleStage = (stage: string) => {
    setFilters(prev => ({
      ...prev,
      stages: prev.stages.includes(stage)
        ? prev.stages.filter(s => s !== stage)
        : [...prev.stages, stage]
    }));
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${(min/1000).toFixed(0)}K - $${(max/1000).toFixed(0)}K`;
    if (min) return `$${(min/1000).toFixed(0)}K+`;
    return `Up to $${(max!/1000).toFixed(0)}K`;
  };

  const formatFunding = (amount?: number) => {
    if (!amount) return 'N/A';
    if (amount >= 1000000000) return `$${(amount/1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount/1000000).toFixed(0)}M`;
    return `$${(amount/1000).toFixed(0)}K`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-[#111111] border-b border-white/5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Rocket className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">
              Startup Jobs
            </h1>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Jobs</div>
            </div>
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{stats.startups}</div>
              <div className="text-sm text-gray-400">Startups</div>
            </div>
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{stats.ycCompanies}</div>
              <div className="text-sm text-gray-400">YC Companies</div>
            </div>
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{stats.avgMatchScore}%</div>
              <div className="text-sm text-gray-400">Avg Match</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchJobs()}
                placeholder="Search job title (e.g., Software Engineer, Product Manager...)"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-[#1a1a1a] text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-gray-300 hover:bg-[#222222] flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            <button
              onClick={searchJobs}
              className="px-8 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-medium"
            >
              Search
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-[#1a1a1a] border border-white/10 rounded-xl">
              <div className="grid grid-cols-2 gap-6">
                {/* Industries */}
                <div>
                  <h3 className="font-semibold mb-3 text-white">Industries</h3>
                  <div className="flex flex-wrap gap-2">
                    {industries.map(industry => (
                      <button
                        key={industry}
                        onClick={() => toggleIndustry(industry)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filters.industries.includes(industry)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-[#222222] text-gray-300 border border-white/10'
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stages */}
                <div>
                  <h3 className="font-semibold mb-3 text-white">Startup Stage</h3>
                  <div className="flex flex-wrap gap-2">
                    {stages.map(stage => (
                      <button
                        key={stage}
                        onClick={() => toggleStage(stage)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filters.stages.includes(stage)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-[#222222] text-gray-300 border border-white/10'
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div>
                  <h3 className="font-semibold mb-3 text-white">Work Mode</h3>
                  <select
                    value={filters.workMode}
                    onChange={(e) => setFilters(prev => ({ ...prev, workMode: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-white/10 bg-[#222222] text-white"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                    <option value="any">Any</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.equityImportant}
                      onChange={(e) => setFilters(prev => ({ ...prev, equityImportant: e.target.checked }))}
                      className="rounded bg-[#222222] border-white/20"
                    />
                    <span className="text-sm text-gray-300">Equity Important</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.visaSponsorshipRequired}
                      onChange={(e) => setFilters(prev => ({ ...prev, visaSponsorshipRequired: e.target.checked }))}
                      className="rounded bg-[#222222] border-white/20"
                    />
                    <span className="text-sm text-gray-300">Visa Sponsorship</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.ycOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, ycOnly: e.target.checked }))}
                      className="rounded bg-[#222222] border-white/20"
                    />
                    <span className="text-sm text-gray-300">YC Companies Only</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.dreamCompaniesOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, dreamCompaniesOnly: e.target.checked }))}
                      className="rounded bg-[#222222] border-white/20"
                    />
                    <span className="text-sm text-gray-300">Dream Companies Only</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-400">Finding the best startup jobs for you...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Rocket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No jobs found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-[#111111] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
              >
                <div className="flex gap-4">
                  {/* Company Logo */}
                  <img
                    src={job.company_logo || `https://via.placeholder.com/64?text=${job.company[0]}`}
                    alt={job.company}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/64?text=${job.company[0]}`;
                    }}
                  />

                  {/* Job Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-300 font-medium">
                            {job.company}
                          </span>
                          {job.is_yc_company && (
                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full border border-orange-500/30">
                              YC
                            </span>
                          )}
                          {job.is_dream_company && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      </div>

                      {/* Match Score */}
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          job.match_score >= 80 ? 'text-green-600' :
                          job.match_score >= 60 ? 'text-yellow-600' :
                          'text-slate-600'
                        }`}>
                          {job.match_score}%
                        </div>
                        <div className="text-xs text-slate-500">Match</div>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    {job.match_reason && job.match_reason.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.match_reason.map((reason, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full flex items-center gap-1"
                          >
                            <Zap className="w-3 h-3" />
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Match Reasons */}
                    {job.match_reason && job.match_reason.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.match_reason.map((reason, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full flex items-center gap-1 border border-indigo-500/30"
                          >
                            <Zap className="w-3 h-3" />
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Job Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location} · {job.work_mode}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatSalary(job.salary_min, job.salary_max)}
                      </div>
                      {job.team_size && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.team_size} people
                        </div>
                      )}
                      {job.startup_stage && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {job.startup_stage}
                        </div>
                      )}
                      {job.funding_amount && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {formatFunding(job.funding_amount)} raised
                        </div>
                      )}
                    </div>

                    {/* Tech Stack */}
                    {job.tech_stack && job.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.tech_stack.slice(0, 6).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-[#222222] text-gray-300 text-xs rounded border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                      >
                        Apply Now
                      </a>
                      <button className="px-4 py-2 border border-white/20 rounded-lg hover:bg-[#1a1a1a] flex items-center gap-2 text-gray-300">
                        <Heart className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupJobs;
