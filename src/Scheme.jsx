import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Scheme = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showLatest, setShowLatest] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const schemes = [
    {
      id: 1,
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      summary: 'Crop insurance scheme to protect farmers against natural calamities, pests, and diseases.',
      type: 'insurance',
      date: '2016-02-01',
      link: 'https://pmfby.gov.in/',
      tags: ['Insurance', 'Central Scheme']
    },
    {
      id: 2,
      title: 'PM-Kisan Samman Nidhi',
      summary: 'Direct income support of ₹6,000 per year to landholding farmer families.',
      type: 'subsidy',
      date: '2019-12-24',
      link: 'https://pmkisan.gov.in/',
      tags: ['Subsidy', 'Direct Benefit']
    },
    {
      id: 3,
      title: 'Kisan Credit Card (KCC)',
      summary: 'Provides farmers affordable and timely credit for agricultural needs.',
      type: 'loan',
      date: '2015-06-01',
      link: 'https://www.nabard.org/',
      tags: ['Loan', 'Credit Support']
    },
    {
      id: 4,
      title: 'Soil Health Card Scheme',
      summary: 'Provides soil test-based recommendations to farmers to improve productivity and soil health.',
      type: 'advisory',
      date: '2015-02-19',
      link: 'https://soilhealth.dac.gov.in/',
      tags: ['Soil', 'Advisory']
    },
    {
      id: 5,
      title: 'Pradhan Mantri Kisan Sampada Yojana (PMKSY)',
      summary: 'Scheme for agro-processing clusters and post-harvest management to reduce wastage and increase value addition.',
      type: 'subsidy,processing',
      date: '2016-03-15',
      link: 'https://pmksy.gov.in/',
      tags: ['Processing', 'Value Addition']
    },
    {
      id: 6,
      title: 'e-NAM (National Agriculture Market)',
      summary: 'Online trading platform for agricultural commodities to help farmers get better prices.',
      type: 'market',
      date: '2016-04-14',
      link: 'https://enam.gov.in/',
      tags: ['Market', 'Digital']
    },
    {
      id: 7,
      title: 'Rashtriya Krishi Vikas Yojana (RKVY)',
      summary: 'Aims to incentivize states to increase public investment in agriculture and allied sectors.',
      type: 'investment',
      date: '2007-04-01',
      link: 'https://rkvy.nic.in/',
      tags: ['Investment', 'State Support']
    },
    {
      id: 8,
      title: 'Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)',
      summary: 'A pension scheme for small and marginal farmers to provide income security in old age.',
      type: 'pension',
      date: '2019-09-01',
      link: '',
      tags: ['Pension', 'Social Security']
    },
    {
      id: 9,
      title: 'National Food Security Mission (NFSM)',
      summary: 'Mission to increase the production of rice, wheat, pulses and coarse cereals through area expansion and productivity enhancement.',
      type: 'mission',
      date: '2007-01-01',
      link: '',
      tags: ['Mission', 'Production']
    },
    {
      id: 10,
      title: 'National Mission for Sustainable Agriculture (NMSA)',
      summary: 'Promotes sustainable agriculture practices and resilience-building for climate-smart agriculture.',
      type: 'mission',
      date: '2014-01-01',
      link: '',
      tags: ['Mission', 'Sustainability']
    },
    {
      id: 11,
      title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
      summary: 'Supports organic farming through cluster-based models and certification support for farmers.',
      type: 'subsidy,organic',
      date: '2015-01-01',
      link: '',
      tags: ['Organic', 'Cluster']
    },
    {
      id: 12,
      title: 'Mission for Integrated Development of Horticulture (MIDH)',
      summary: 'Supports development of horticulture through improved production, post-harvest management and value addition.',
      type: 'horticulture',
      date: '2014-04-01',
      link: '',
      tags: ['Horticulture', 'Value Addition']
    },
    {
      id: 13,
      title: 'Pradhan Mantri Annadata Aay SanraksHan Abhiyan (PM-AASHA)',
      summary: 'Provides price support and procurement mechanisms to ensure remunerative prices to farmers.',
      type: 'subsidy',
      date: '2018-01-01',
      link: '',
      tags: ['Price Support', 'Procurement']
    },
    {
      id: 14,
      title: 'National Mission on Agricultural Extension and Technology (NMAET/ATMA)',
      summary: 'Strengthens agricultural extension services, farmer training and technology dissemination through ATMA.',
      type: 'extension',
      date: '2005-01-01',
      link: '',
      tags: ['Extension', 'Training']
    },
    {
      id: 15,
      title: 'Blue Revolution (Fisheries Development)',
      summary: 'Programmes to increase fish production, productivity and farmer incomes in fisheries and aquaculture.',
      type: 'fisheries',
      date: '2015-01-01',
      link: '',
      tags: ['Fisheries', 'Aquaculture']
    },
    {
      id: 16,
      title: 'National Beekeeping & Honey Mission',
      summary: 'Supports beekeeping, honey production and value chains to increase farm incomes and biodiversity.',
      type: 'mission',
      date: '2020-01-01',
      link: '',
      tags: ['Beekeeping', 'Livelihoods']
    }
  ];

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = searchQuery === '' ||
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === 'all' ||
      (activeFilter === 'new' && showLatest) ||
      scheme.type.toLowerCase().includes(activeFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  }).slice(0, showLatest && activeFilter === 'new' ? 10 : undefined);

  const handleBack = () => {
    navigate('/');
  };

  const handleFilterClick = (filterType) => {
    setActiveFilter(filterType);
    if (filterType === 'new') {
      setShowLatest(true);
    } else {
      setShowLatest(false);
    }
  };

  const handleSchemeClick = (link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const applyFilters = () => {
    setShowFilterPanel(false);
  };

  const resetFilters = () => {
    setSortOrder('desc');
    setShowLatest(false);
    setActiveFilter('all');
    setShowFilterPanel(false);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 flex flex-col bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center p-4">
          <button className="flex h-10 w-10 shrink-0 items-center justify-center text-text-primary-light dark:text-text-primary-dark ag-back" onClick={handleBack} aria-label="Back to home">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Government Schemes</h1>
          <div className="h-10 w-10 shrink-0"></div>
        </div>
        {/* Search Bar */}
        <div className="px-4 pb-3">
          <label className="flex h-12 w-full flex-col">
            <div className="flex h-full w-full flex-1 items-stretch rounded-lg">
              <div className="flex items-center justify-center rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-card-light dark:bg-card-dark pl-4 text-primary">
                <span className="material-symbols-outlined text-2xl">search</span>
              </div>
              <input
                id="scheme-search"
                aria-label="Search schemes"
                className="form-input h-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 bg-card-light dark:bg-card-dark px-4 text-base font-normal text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Search for schemes (e.g., 'subsidy')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </label>
        </div>
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-4 pt-0 [-ms-overflow-style:none] [scrollbar-width:none] scrollbar-hide">
          <button
            id="filter-all"
            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 font-medium transition-all duration-200 ${
              activeFilter === 'all'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-sm'
            }`}
            onClick={() => handleFilterClick('all')
            }
          >
            <span className="material-symbols-outlined text-lg">apps</span>
            <p className="text-sm">All Schemes</p>
          </button>
          <button
            id="filter-subsidy"
            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 font-medium transition-all duration-200 ${
              activeFilter === 'subsidy'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:shadow-sm'
            }`}
            onClick={() => handleFilterClick('subsidy')}
          >
            <span className="material-symbols-outlined text-lg">card_giftcard</span>
            <p className="text-sm">Subsidies</p>
          </button>
          <button
            id="filter-loan"
            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 font-medium transition-all duration-200 ${
              activeFilter === 'loan'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-sm'
            }`}
            onClick={() => handleFilterClick('loan')}
          >
            <span className="material-symbols-outlined text-lg">account_balance</span>
            <p className="text-sm">Loans</p>
          </button>
          <button
            id="filter-insurance"
            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 font-medium transition-all duration-200 ${
              activeFilter === 'insurance'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:shadow-sm'
            }`}
            onClick={() => handleFilterClick('insurance')}
          >
            <span className="material-symbols-outlined text-lg">shield</span>
            <p className="text-sm">Insurance</p>
          </button>
          <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
          <button
            id="filter-toggle"
            aria-expanded={showFilterPanel}
            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 font-medium transition-all duration-200 ${
              showFilterPanel
                ? 'bg-gray-100 dark:bg-zinc-700 text-primary border border-primary'
                : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:shadow-sm'
            }`}
            onClick={toggleFilterPanel}
          >
            <span className="material-symbols-outlined text-lg">tune</span>
            <p className="text-sm">More Filters</p>
          </button>
        </div>
        
        {/* Filter panel */}
        {showFilterPanel && (
          <div className="absolute left-4 right-4 top-28 z-20 max-w-3xl rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="material-symbols-outlined text-xl text-primary">tune</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Advanced Filters</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Refine your search results</p>
                  </div>
                </div>
                <button
                  id="filter-close"
                  aria-label="Close filters"
                  className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                  onClick={toggleFilterPanel}
                >
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">close</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                {/* Sort Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-primary">sort</span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Sort Options</p>
                  </div>
                  <div className="space-y-2 pl-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="sort-order"
                        value="desc"
                        checked={sortOrder === 'desc'}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-4 h-4 accent-primary"
                      />
                      <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">history</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Newest First</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="sort-order"
                        value="asc"
                        checked={sortOrder === 'asc'}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-4 h-4 accent-primary"
                      />
                      <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">schedule</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Oldest First</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* View Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-primary">visibility</span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">View Options</p>
                  </div>
                  <div className="space-y-2 pl-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        id="filter-latest"
                        checked={showLatest}
                        onChange={(e) => setShowLatest(e.target.checked)}
                        className="w-4 h-4 rounded accent-primary"
                      />
                      <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">new_releases</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Latest Schemes Only</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Actions Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-primary">check_circle</span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Actions</p>
                  </div>
                  <div className="flex flex-col gap-2 pl-6">
                    <button
                      id="filter-apply"
                      className="flex h-9 items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                      onClick={applyFilters}
                    >
                      <span className="material-symbols-outlined text-base">check</span>
                      Apply
                    </button>
                    <button
                      id="filter-reset"
                      className="flex h-9 items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
                      onClick={resetFilters}
                    >
                      <span className="material-symbols-outlined text-base">refresh</span>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Schemes List */}
      <main className="flex flex-1 flex-col gap-4 p-4">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="flex cursor-pointer flex-col overflow-hidden rounded-lg bg-card-light dark:bg-card-dark shadow-sm transition-shadow hover:shadow-md"
            onClick={() => handleSchemeClick(scheme.link)}
          >
            <div className="flex flex-col gap-3 p-4">
              <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">{scheme.title}</h2>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{scheme.summary}</p>
              <div className="flex flex-wrap items-center gap-2">
                {scheme.tags.map((tag, index) => (
                  <span key={index} className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="scheme-date ml-auto text-xs text-text-secondary-light dark:text-text-secondary-dark">
                {formatDate(scheme.date)}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
              <button
                className="view-details text-sm font-medium text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSchemeClick(scheme.link);
                }}
              >
                View Details
              </button>
              <span className="material-symbols-outlined text-primary">arrow_forward</span>
            </div>
          </div>
        ))}

        {/* No results */}
        {filteredSchemes.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-5xl">search_off</span>
            </div>
            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">No Schemes Found</h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Scheme;
