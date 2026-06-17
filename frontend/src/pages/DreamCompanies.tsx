import React, { useState, useEffect } from 'react';
import { Heart, Star, TrendingUp, Users, DollarSign, MapPin, Briefcase, Bell, BellOff } from 'lucide-react';
import api from '../lib/api';

interface Company {
  name: string;
  logo_url: string;
  website: string;
  careers_url: string;
  stage: string;
  funding_amount?: number;
  team_size?: number;
  remote_policy?: string;
  industries: string[];
  tech_stack: string[];
  founded_year?: number;
  description?: string;
  is_yc_company: boolean;
  locations: string[];
}

const DreamCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [followedCompanies, setFollowedCompanies] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    industry: 'all',
    stage: 'all',
    ycOnly: false
  });

  useEffect(() => {
    loadCompanies();
    loadFollowedCompanies();
  }, [filter]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter.industry !== 'all') params.industry = filter.industry;
      if (filter.stage !== 'all') params.stage = filter.stage;
      if (filter.ycOnly) params.yc_only = true;

      const response = await api.get('/startup-jobs/dream-companies', { params });
      setCompanies(response.data);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFollowedCompanies = async () => {
    try {
      const response = await api.get('/startup-jobs/dream-companies/following');
      const followed = new Set(response.data.map((fc: any) => fc.company_name));
      setFollowedCompanies(followed);
    } catch (error) {
      console.error('Error loading followed companies:', error);
    }
  };

  const toggleFollow = async (companyName: string) => {
    try {
      if (followedCompanies.has(companyName)) {
        await api.delete(`/startup-jobs/dream-companies/${companyName}/unfollow`);
        setFollowedCompanies(prev => {
          const next = new Set(prev);
          next.delete(companyName);
          return next;
        });
      } else {
        await api.post(`/startup-jobs/dream-companies/${companyName}/follow`);
        setFollowedCompanies(prev => new Set([...prev, companyName]));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
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
      <div className="bg-[#111111] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-8 h-8 text-purple-400 fill-purple-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Dream Companies
              </h1>
              <p className="text-gray-400 mt-1">
                Follow top startups and get alerts when they're hiring
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={filter.industry}
              onChange={(e) => setFilter(prev => ({ ...prev, industry: e.target.value }))}
              className="px-4 py-2 rounded-lg border border-white/10 bg-[#1a1a1a] text-white"
            >
              <option value="all">All Industries</option>
              <option value="ai-ml">AI & ML</option>
              <option value="saas">SaaS</option>
              <option value="fintech">FinTech</option>
              <option value="developer-tools">Developer Tools</option>
              <option value="healthtech">HealthTech</option>
              <option value="edtech">EdTech</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="open-source">Open Source</option>
            </select>

            <select
              value={filter.stage}
              onChange={(e) => setFilter(prev => ({ ...prev, stage: e.target.value }))}
              className="px-4 py-2 rounded-lg border border-white/10 bg-[#1a1a1a] text-white"
            >
              <option value="all">All Stages</option>
              <option value="seed">Seed</option>
              <option value="series-a">Series A</option>
              <option value="series-b">Series B</option>
              <option value="series-c">Series C</option>
              <option value="series-d+">Series D+</option>
              <option value="public">Public</option>
            </select>

            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-[#1a1a1a] text-white cursor-pointer">
              <input
                type="checkbox"
                checked={filter.ycOnly}
                onChange={(e) => setFilter(prev => ({ ...prev, ycOnly: e.target.checked }))}
                className="rounded bg-[#222222] border-white/20"
              />
              <span>YC Companies Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company.name}
                className="bg-[#111111] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
              >
                {/* Company Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={company.logo_url || `https://via.placeholder.com/48?text=${company.name[0]}`}
                      alt={company.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/48?text=${company.name[0]}`;
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-white">
                        {company.name}
                      </h3>
                      {company.is_yc_company && (
                        <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30">
                          YC
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollow(company.name)}
                    className={`p-2 rounded-lg transition-colors ${
                      followedCompanies.has(company.name)
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-[#1a1a1a] text-gray-400 border border-white/10'
                    }`}
                  >
                    {followedCompanies.has(company.name) ? (
                      <Bell className="w-5 h-5" />
                    ) : (
                      <BellOff className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Company Info */}
                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{company.stage}</span>
                  </div>
                  
                  {company.funding_amount && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatFunding(company.funding_amount)} raised</span>
                    </div>
                  )}

                  {company.team_size && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{company.team_size} employees</span>
                    </div>
                  )}

                  {company.remote_policy && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{company.remote_policy}</span>
                    </div>
                  )}

                  {company.locations && company.locations.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{company.locations.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Industries */}
                {company.industries && company.industries.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {company.industries.slice(0, 3).map((industry, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-[#1a1a1a] text-gray-300 text-xs rounded border border-white/10"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                )}

                {/* Tech Stack */}
                {company.tech_stack && company.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {company.tech_stack.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded border border-indigo-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 text-center border border-white/20 rounded-lg hover:bg-[#1a1a1a] text-sm text-gray-300"
                  >
                    Website
                  </a>
                  <a
                    href={company.careers_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                  >
                    View Jobs
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamCompanies;
