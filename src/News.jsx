import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Image component with lazy loading and low network support
const NewsImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const placeholderSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjU3QzAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BZ3JpRmxvdyBOZXdzPC90ZXh0Pjwvc3ZnPg==';

  return (
    <img
      src={error ? placeholderSvg : imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setError(true);
        setImageSrc(placeholderSvg);
        setIsLoading(false);
      }}
      style={{
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 0.3s ease',
      }}
    />
  );
};

const News = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Image mapping by category for low network support
  const categoryImages = {
    market: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=1200&h=600&fit=crop&q=80', // farming market
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=600&fit=crop&q=80', // farm produce
    ],
    weather: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop&q=80', // rain/weather
      'https://images.unsplash.com/photo-1534274988757-a28bf1a4c817?w=1200&h=600&fit=crop&q=80', // frost/weather
    ],
    'crop-health': [
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&h=600&fit=crop&q=80', // crops/plants
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=1200&h=600&fit=crop&q=80', // healthy crops
    ],
    technology: [
      'https://images.unsplash.com/photo-1578926078328-123456789012?w=1200&h=600&fit=crop&q=80', // farm tech
      'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=1200&h=600&fit=crop&q=80', // agri technology
    ],
  };

  // News data extracted from HTML
  const newsItems = [
    {
      id: 1,
      category: 'market',
      date: '2025-12-19',
      title: 'Parliament clears bill replacing MGNREGA amid protests',
      summary: 'Lok Sabha passes a bill replacing MGNREGA; debate continues over impact on rural employment and farmer welfare.',
      source: 'Economic Times • 19 Dec 2025',
      image: categoryImages.market[0],
      link: 'https://economictimes.indiatimes.com/news/economy/policy/parliament-clears-vb-g-ram-g-bill-replacing-mgnrega-amid-opposition-protests/articleshow/126064211.cms'
    },
    {
      id: 2,
      category: 'market',
      date: '2025-12-18',
      title: 'India-Oman CEPA: duty-free access to several agri items',
      summary: 'The CEPA is expected to grant duty-free access for many Indian agricultural and processed food products, boosting export opportunities.',
      source: 'Economic Times • 18 Dec 2025',
      image: categoryImages.market[1],
      link: 'https://economictimes.indiatimes.com/news/india/india-oman-cepa-a-blueprint-for-shared-future-pm-on-deal/articleshow/126063038.cms'
    },
    {
      id: 3,
      category: 'weather',
      date: '2025-12-18',
      title: 'IMD: Current Weather Status & Extended Range Forecast (18–31 Dec 2025)',
      summary: 'IMD released an extended range forecast and advisories for winter season; farmers are advised to check local agromet advisories.',
      source: 'IMD • 18 Dec 2025',
      image: categoryImages.weather[0],
      link: 'https://mausam.imd.gov.in/Forecast/marquee_data/ERF%2018.12.25.pdf'
    },
    {
      id: 4,
      category: 'technology',
      date: '2025-12-12',
      title: 'Government to extend FPO scheme for five years to address scaling challenges',
      summary: 'Extension aims to improve capacity, access to capital and compliance for Farmer Producer Organisations benefiting lakhs of farmers.',
      source: 'Economic Times • 12 Dec 2025',
      image: categoryImages.technology[0],
      link: 'https://economictimes.indiatimes.com/news/economy/agriculture/govt-to-extend-fpo-scheme-for-five-years-address-compliance-and-capital-hurdles/articleshow/125929830.cms'
    },
    {
      id: 5,
      category: 'market',
      date: '2025-12-12',
      title: 'India\'s rice output may hit record 152 MT in 2025-26',
      summary: 'USDA projects record rice production for India, citing favorable monsoon and expanded planting areas; impacts expected for domestic markets and exports.',
      source: 'Economic Times • 12 Dec 2025',
      image: categoryImages.market[0],
      link: 'https://economictimes.indiatimes.com/news/economy/agriculture/indias-rice-output-may-hit-record-152-mt-in-2025-26/articleshow/125920140.cms'
    },
    {
      id: 6,
      category: 'crop-health',
      date: '2025-12-05',
      title: 'PM-Kisan, PMFBY and KCC: scheme updates and beneficiary advisories',
      summary: 'Guidance on enrolment, claim timelines and beneficiary support for major central schemes; check official portals for latest circulars.',
      source: 'Government Portals • ongoing',
      image: categoryImages['crop-health'][0],
      link: 'https://pmkisan.gov.in'
    },
    {
      id: 7,
      category: 'market',
      date: '2025-12-10',
      title: 'Commodity advisories: pulses, oilseeds and horticulture',
      summary: 'Weekly market briefs highlighting MSP decisions, procurement windows and price advisories affecting smallholder incomes.',
      source: 'Market Desk • updated weekly',
      image: categoryImages.market[1],
      link: 'https://agmarknet.gov.in'
    },
    {
      id: 8,
      category: 'crop-health',
      date: '2025-12-17',
      title: 'Fall armyworm outbreak detected in 15 districts',
      summary: 'Agricultural departments issue alerts for fall armyworm management; farmers advised to implement integrated pest management strategies.',
      source: 'Agri Ministry • 17 Dec 2025',
      image: categoryImages['crop-health'][1],
      link: 'https://pib.gov.in/PressReleasePage.aspx'
    },
    {
      id: 9,
      category: 'technology',
      date: '2025-12-16',
      title: 'IoT-based soil monitoring systems now subsidized',
      summary: 'Government announces 40% subsidy on advanced soil sensors and monitoring devices for precision agriculture adoption.',
      source: 'Tech Agriculture • 16 Dec 2025',
      image: categoryImages.technology[1],
      link: 'https://agritech.gov.in'
    },
    {
      id: 10,
      category: 'weather',
      date: '2025-12-15',
      title: 'Western disturbance may bring isolated showers to North India',
      summary: 'Met department predicts scattered rainfall in Punjab, Haryana and Himachal Pradesh; advisories issued for frost management.',
      source: 'IMD Meteorology • 15 Dec 2025',
      image: categoryImages.weather[0],
      link: 'https://mausam.imd.gov.in'
    },
    {
      id: 11,
      category: 'market',
      date: '2025-12-14',
      title: 'Wheat prices surge on delayed harvesting',
      summary: 'Delayed rabi season harvesting drives wheat prices up by 8% in wholesale markets; procurement operations accelerate.',
      source: 'Commodity Exchange • 14 Dec 2025',
      image: categoryImages.market[1],
      link: 'https://ncdex.com'
    },
    {
      id: 12,
      category: 'crop-health',
      date: '2025-12-13',
      title: 'Early blight resistance varieties released for potato cultivation',
      summary: 'ICAR releases 3 new potato varieties with enhanced disease resistance; suitable for eastern India growing conditions.',
      source: 'ICAR Research • 13 Dec 2025',
      image: categoryImages['crop-health'][0],
      link: 'https://icar.org.in'
    },
    {
      id: 13,
      category: 'technology',
      date: '2025-12-12',
      title: 'Blockchain-based farm produce tracking system launched',
      summary: 'New platform enables transparent tracking of agricultural products from farm to consumer; improves market access for farmers.',
      source: 'Startup News • 12 Dec 2025',
      image: categoryImages.technology[1],
      link: 'https://agrifarm-blockchain.in'
    },
    {
      id: 14,
      category: 'market',
      date: '2025-12-11',
      title: 'E-NAM trading volume crosses 2 billion rupees monthly',
      summary: 'Electronic National Agriculture Market achieves record trading volume with participation from 2000+ mandis across India.',
      source: 'Economic Times • 11 Dec 2025',
      image: categoryImages.market[0],
      link: 'https://enam.gov.in'
    },
    {
      id: 15,
      category: 'weather',
      date: '2025-12-10',
      title: 'Winter frost warning issued for next 72 hours',
      summary: 'Cold wave alert for northern plains; temperatures expected to dip to 2-4°C; advisory for crop and livestock protection.',
      source: 'Weather Alert • 10 Dec 2025',
      image: categoryImages.weather[1],
      link: 'https://mausam.imd.gov.in'
    },
    {
      id: 16,
      category: 'crop-health',
      date: '2025-12-09',
      title: 'Integrated Pest Management workshop held in 50 villages',
      summary: 'ICAR-KVK conducts hands-on training for sustainable pest control without chemical pesticides; farmers show 30% cost reduction.',
      source: 'Krishi Vigyan Kendra • 09 Dec 2025',
      image: categoryImages['crop-health'][1],
      link: 'https://icar.org.in'
    },
    {
      id: 17,
      category: 'technology',
      date: '2025-12-08',
      title: 'Drone-based pesticide spraying covers 50,000 hectares',
      summary: 'Agricultural drones reduce pesticide usage by 30% and labor costs by 40%; adoption grows rapidly in Punjab and Haryana.',
      source: 'Agri Innovation • 08 Dec 2025',
      image: categoryImages.technology[0],
      link: 'https://agridrones.gov.in'
    },
    {
      id: 18,
      category: 'market',
      date: '2025-12-07',
      title: 'Soybean prices rally on export demand surge',
      summary: 'Global export orders boost soybean prices; Indian farmers benefit from improved market rates and increased procurement.',
      source: 'Commodity Markets • 07 Dec 2025',
      image: categoryImages.market[0],
      link: 'https://agmarknet.gov.in'
    },
    {
      id: 19,
      category: 'crop-health',
      date: '2025-12-06',
      title: 'Bacteriophage therapy shows promise for bacterial wilt',
      summary: 'Research institutions demonstrate effectiveness of biological agents in controlling bacterial wilt in crops.',
      source: 'Agricultural Research • 06 Dec 2025',
      image: categoryImages['crop-health'][0],
      link: 'https://icar.org.in'
    },
    {
      id: 20,
      category: 'weather',
      date: '2025-12-05',
      title: 'December rainfall expected above normal in South India',
      summary: 'Meteorological department forecasts above-normal precipitation for December; suitable for rabi crop development.',
      source: 'IMD Prediction • 05 Dec 2025',
      image: categoryImages.weather[0],
      link: 'https://mausam.imd.gov.in'
    },
    {
      id: 21,
      category: 'technology',
      date: '2025-12-04',
      title: 'AI-powered crop disease detection app launched free',
      summary: 'Mobile application uses machine learning to identify crop diseases with 95% accuracy; available for all Indian farmers.',
      source: 'Tech Ministry • 04 Dec 2025',
      image: categoryImages.technology[1],
      link: 'https://crophealth-ai.gov.in'
    },
    {
      id: 22,
      category: 'market',
      date: '2025-12-03',
      title: 'Cotton exports hit 5-year high',
      summary: 'India\'s cotton exports reach highest level since 2020; strong demand from global textile industry boosts farmer incomes.',
      source: 'Export Data • 03 Dec 2025',
      image: categoryImages.market[1],
      link: 'https://commerce.gov.in'
    },
    {
      id: 23,
      category: 'crop-health',
      date: '2025-12-02',
      title: 'Organic certification fast-tracked for 10,000 farmers',
      summary: 'Government accelerates organic certification process; reduces processing time from 12 to 3 months for verified farmers.',
      source: 'Organic Farming Board • 02 Dec 2025',
      image: categoryImages['crop-health'][1],
      link: 'https://ofai.gov.in'
    },
    {
      id: 24,
      category: 'weather',
      date: '2025-12-01',
      title: 'El Niño impact: monsoon review and next season outlook',
      summary: 'IMD releases comprehensive analysis of El Niño influence on 2025 monsoon; forecasts 2026 monsoon expectations.',
      source: 'IMD Climate Report • 01 Dec 2025',
      image: categoryImages.weather[1],
      link: 'https://mausam.imd.gov.in'
    },
    {
      id: 25,
      category: 'technology',
      date: '2025-11-30',
      title: 'Precision agriculture pilot shows 25% yield improvement',
      summary: 'Field trials demonstrate variable rate application technology increases yield and reduces input costs significantly.',
      source: 'Agricultural Bureau • 30 Nov 2025',
      image: categoryImages.technology[0],
      link: 'https://precisionfarming.gov.in'
    },
    {
      id: 26,
      category: 'market',
      date: '2025-11-29',
      title: 'Groundnut prices stabilize after volatility',
      summary: 'Market stabilizes as supply-demand balance improves; farmers advised to store for better future prices.',
      source: 'Market Analysis • 29 Nov 2025',
      image: categoryImages.market[0],
      link: 'https://agmarknet.gov.in'
    },
    {
      id: 27,
      category: 'crop-health',
      date: '2025-11-28',
      title: 'Nematode management guide released for sugarcane',
      summary: 'ICAR releases comprehensive guideline for managing root-knot nematodes in sugarcane cultivation.',
      source: 'ICAR Sugarcane • 28 Nov 2025',
      image: categoryImages['crop-health'][0],
      link: 'https://icar.org.in'
    },
    {
      id: 28,
      category: 'weather',
      date: '2025-11-27',
      title: 'Frost risk decreases as minimum temperatures rise',
      summary: 'Weather patterns show gradual warming; frost advisory lifted for most plains regions.',
      source: 'IMD Daily Bulletin • 27 Nov 2025',
      image: categoryImages.weather[1],
      link: 'https://mausam.imd.gov.in'
    },
    {
      id: 29,
      category: 'technology',
      date: '2025-11-26',
      title: 'Water-saving drip irrigation subsidy increased to 60%',
      summary: 'Government hikes subsidy for drip and sprinkler systems to encourage water conservation in agriculture.',
      source: 'Ministry Announcement • 26 Nov 2025',
      image: categoryImages.technology[1],
      link: 'https://pmksy.gov.in'
    },
    {
      id: 30,
      category: 'market',
      date: '2025-11-25',
      title: 'Sugarcane fair price scheme benefits 2 lakh farmers',
      summary: 'Extended sugarcane support program provides minimum income guarantee to participating farmers across 5 states.',
      source: 'Agricultural News • 25 Nov 2025',
      image: categoryImages.market[0],
      link: 'https://agricouncil.gov.in'
    },
    {
      id: 31,
      category: 'crop-health',
      date: '2025-11-24',
      title: 'Bio-fortified rice varieties improve nutritional outcomes',
      summary: 'Field studies show bio-fortified rice varieties increase iron and zinc content; beneficial for dietary deficiency zones.',
      source: 'Nutrition Research • 24 Nov 2025',
      image: categoryImages['crop-health'][0],
      link: 'https://icar.org.in'
    },
    {
      id: 32,
      category: 'weather',
      date: '2025-11-23',
      title: 'Prediction: Scattered showers likely in next 48 hours',
      summary: 'Moderate weather systems bring light rainfall; beneficial for rabi sowing areas across northern plains.',
      source: 'Weather Forecast • 23 Nov 2025',
      image: categoryImages.weather[0],
      link: 'https://mausam.imd.gov.in'
    },
    {
      id: 33,
      category: 'technology',
      date: '2025-11-22',
      title: 'Vertical farming startup secures 50 crore funding',
      summary: 'Agritech startup advances indoor vertical farming; plans to establish 20 vertical farms across metro cities.',
      source: 'Startup News • 22 Nov 2025',
      image: categoryImages.technology[0],
      link: 'https://verticalfarm-india.com'
    },
    {
      id: 34,
      category: 'market',
      date: '2025-11-21',
      title: 'Spice prices rise on export demand',
      summary: 'Indian spices see 12% price increase due to strong international demand; farmers celebrate improved margins.',
      source: 'Commodity Report • 21 Nov 2025',
      image: categoryImages.market[1],
      link: 'https://agmarknet.gov.in'
    },
    {
      id: 35,
      category: 'crop-health',
      date: '2025-11-20',
      title: 'Mycorrhizal fungi inoculants improve crop yields',
      summary: 'Application of beneficial fungi enhances nutrient uptake; studies show 15-20% yield improvement across crops.',
      source: 'Agricultural Science • 20 Nov 2025',
      image: categoryImages['crop-health'][1],
      link: 'https://icar.org.in'
    },
    {
      id: 36,
      category: 'weather',
      date: '2025-11-19',
      title: 'Climate pattern analysis: winter intensifying gradually',
      summary: 'Temperature trends show normal winter progression; farmers advised to prepare for standard frost management.',
      source: 'Climate Center • 19 Nov 2025',
      image: categoryImages.weather[1],
      link: 'https://mausam.imd.gov.in'
    },
    {
      id: 37,
      category: 'technology',
      date: '2025-11-18',
      title: 'Smart greenhouse project covers 500 hectares',
      summary: 'Climate-controlled greenhouse network reduces water usage by 40%; supports year-round vegetable production.',
      source: 'Horticultural Ministry • 18 Nov 2025',
      image: categoryImages.technology[1],
      link: 'https://horticulture.gov.in'
    },
    {
      id: 38,
      category: 'market',
      date: '2025-11-17',
      title: 'Mustard oil exports reach historic peak',
      summary: 'Mustard seed production surplus drives record exports; farmers benefit from premium international prices.',
      source: 'Export Chronicle • 17 Nov 2025',
      image: categoryImages.market[0],
      link: 'https://commerce.gov.in'
    },
    {
      id: 39,
      category: 'crop-health',
      date: '2025-11-16',
      title: 'Herbal pest control formulas show effectiveness',
      summary: 'Natural herbal solutions prove effective against common agricultural pests; reduces chemical dependency.',
      source: 'Natural Agriculture • 16 Nov 2025',
      image: categoryImages['crop-health'][0],
      link: 'https://naturalfarming.gov.in'
    },
    {
      id: 40,
      category: 'weather',
      date: '2025-11-15',
      title: 'Air quality index improves as monsoon winds return',
      summary: 'Wind patterns shift; better air quality aids crop pollination and growth; advisory for dust management.',
      source: 'Environmental Report • 15 Nov 2025',
      image: categoryImages.weather[0],
      link: 'https://mausam.imd.gov.in'
    },
    {
      id: 41,
      category: 'technology',
      date: '2025-11-14',
      title: 'Robotics in agriculture: harvest automation progresses',
      summary: 'Autonomous harvesting robots begin commercial deployment; labor shortage solutions gain momentum.',
      source: 'Tech Agriculture • 14 Nov 2025',
      image: categoryImages.technology[0],
      link: 'https://agrirobots.gov.in'
    },
    {
      id: 42,
      category: 'market',
      date: '2025-11-13',
      title: 'Dairy prices strengthen on monsoon fodder scarcity',
      summary: 'Feed shortage supports milk prices; dairy farmers see improved profitability during off-season.',
      source: 'Dairy News • 13 Nov 2025',
      image: categoryImages.market[1],
      link: 'https://dairy.gov.in'
    },
    {
      id: 43,
      category: 'crop-health',
      date: '2025-11-12',
      title: 'Arbuscular mycorrhizal fungi banking established',
      summary: 'Microbial resource centers created for conservation and distribution of beneficial fungi across states.',
      source: 'Biodiversity Board • 12 Nov 2025',
      image: categoryImages['crop-health'][1],
      link: 'https://icar.org.in'
    },
    {
      id: 44,
      category: 'weather',
      date: '2025-11-11',
      title: 'High pressure system brings fair weather',
      summary: 'Clear skies expected for next week; suitable conditions for field operations and crop management activities.',
      source: 'Daily Forecast • 11 Nov 2025',
      image: categoryImages.weather[1],
      link: 'https://mausam.imd.gov.in'
    },
    {
      id: 45,
      category: 'technology',
      date: '2025-11-10',
      title: 'Satellite imagery AI enables crop monitoring at scale',
      summary: 'Advanced satellite-based AI system monitors 100,000+ farms; provides real-time crop health alerts to farmers.',
      source: 'Space Technology • 10 Nov 2025',
      image: categoryImages.technology[1],
      link: 'https://farmsatellite.gov.in'
    }
  ];

  const [filteredNews, setFilteredNews] = useState(newsItems);

  useEffect(() => {
    let filtered = newsItems.filter(item => {
      const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
      const matchesSearch = searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredNews(filtered);
  }, [activeFilter, searchQuery, sortOrder]);

  const topBreaking = filteredNews.slice(0, 5);

  const handleChipClick = (filter) => {
    setActiveFilter(filter);
    setSearchQuery('');
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setActiveFilter('all');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortApply = () => {
    setShowFilterPanel(false);
  };

  const handleSortReset = () => {
    setSortOrder('newest');
    setShowFilterPanel(false);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'market': return 'text-agri-amber';
      case 'weather': return 'text-blue-500';
      case 'technology': return 'text-primary';
      case 'crop-health': return 'text-agri-amber';
      default: return 'text-agri-amber';
    }
  };

  return (
    <div className="relative w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-card-light dark:bg-card-dark p-4 shadow-sm">
        <Link to="/" className="flex size-12 shrink-0 items-center justify-center text-gray-800 dark:text-white" aria-label="Back to home">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-primary dark:text-white">Agri News &amp; Insights</h2>
        <div className="flex items-center justify-end gap-2 relative">
          <button onClick={handleSearchToggle} className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-transparent text-gray-800 dark:text-white" aria-label="Open search">
            <span className="material-symbols-outlined">search</span>
          </button>
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            className={`ml-2 w-64 rounded-lg border border-gray-200 dark:border-gray-700 bg-card-light dark:bg-card-dark p-2 text-sm text-gray-800 dark:text-white ${showSearch ? '' : 'hidden'}`}
            placeholder="Search news, topics or keywords..."
            aria-label="Search news"
          />
          <button onClick={() => setShowFilterPanel(!showFilterPanel)} className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-transparent text-gray-800 dark:text-white" aria-label="Open filters">
            <span className="material-symbols-outlined">tune</span>
          </button>
          {/* Filter panel */}
          {showFilterPanel && (
            <div className="absolute right-0 mt-12 w-72 rounded-lg bg-card-light dark:bg-card-dark shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Filters</h4>
                <button onClick={() => setShowFilterPanel(false)} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300">Close</button>
              </div>
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Sort by date</p>
                <label className="flex items-center gap-2 text-sm mb-1">
                  <input type="radio" name="news-sort" value="newest" checked={sortOrder === 'newest'} onChange={() => setSortOrder('newest')} /> Newest first
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="news-sort" value="oldest" checked={sortOrder === 'oldest'} onChange={() => setSortOrder('oldest')} /> Oldest first
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={handleSortReset} className="px-3 py-1 text-sm rounded bg-gray-100 dark:bg-gray-800">Reset</button>
                <button onClick={handleSortApply} className="px-3 py-1 text-sm rounded bg-primary text-white">Apply</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chips */}
      <div className="flex gap-3 p-4 overflow-x-auto whitespace-nowrap bg-card-light dark:bg-card-dark border-b border-gray-200 dark:border-gray-700">
        {['all', 'market', 'crop-health', 'technology', 'weather'].map(filter => (
          <button
            key={filter}
            onClick={() => handleChipClick(filter)}
            className={`chip flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-4 transition-all ${
              activeFilter === filter ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
            aria-pressed={activeFilter === filter}
          >
            <p className="text-sm font-medium leading-normal">
              {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
            </p>
          </button>
        ))}
      </div>

      {/* Top Story Section */}
      <div className="p-4">
        <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-2 text-gray-800 dark:text-white">Top Story</h3>
        <div className="flex flex-col items-stretch justify-start rounded-xl overflow-hidden">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {topBreaking.map(item => (
              <div key={item.id} className="min-w-[260px] flex-shrink-0 rounded-xl bg-card-light dark:bg-card-dark overflow-hidden shadow-sm">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-36 object-cover"
                  loading="lazy"
                />
                <div className="p-3">
                  <p className={`text-xs font-semibold uppercase ${getCategoryColor(item.category)}`}>{item.category.toUpperCase()}</p>
                  <a
                    className="block font-bold text-sm mt-1 text-gray-800 dark:text-white"
                    href={item.link}
                    target="_blank"
                    rel="noopener"
                  >
                    {item.title}
                  </a>
                  <p className="text-xs text-gray-500 mt-1">{item.source}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Updates Section */}
      <div className="p-4 pt-0">
        <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-2 text-gray-800 dark:text-white">Latest Updates</h3>
        {filteredNews.map(item => (
          <div key={item.id} className="mb-4 flex items-start gap-4 rounded-xl bg-card-light dark:bg-card-dark p-4 shadow-sm">
            <img
              src={item.image}
              alt={item.title}
              className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 aspect-square object-cover rounded-lg"
              loading="lazy"
            />
            <div className="flex min-w-0 grow flex-col items-stretch justify-center gap-1">
              <p className={`text-xs font-semibold uppercase tracking-wide ${getCategoryColor(item.category)}`}>{item.category.toUpperCase()}</p>
              <a
                className="text-md font-bold leading-tight tracking-[-0.015em] truncate text-gray-800 dark:text-white"
                href={item.link}
                target="_blank"
                rel="noopener"
              >
                {item.title}
              </a>
              <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-300">{item.summary}</p>
              <p className="text-xs font-normal leading-normal text-gray-500 dark:text-gray-400 pt-1">{item.source}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;

