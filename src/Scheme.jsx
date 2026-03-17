import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Agricultural Schemes Data - 24 schemes with 7 benefit categories
const schemesData = [
  {
    id: 1,
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    summary: 'Crop insurance scheme to protect farmers against natural calamities, pests, and diseases.',
    description: 'Comprehensive crop insurance scheme offering financial protection to farmers.',
    type: 'insurance',
    date: '2016-02-01',
    link: 'https://pmfby.gov.in/',
    tags: ['Insurance', 'Central Scheme'],
    image: 'https://images.unsplash.com/photo-1500541961454-2e30c00f3817?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '2-5% premium rate, full crop value coverage for notified crops',
      productivityImprovement: 'Enables farmers to invest in better seeds and fertilizers',
      riskProtection: 'Comprehensive coverage against natural calamities, pests, and diseases',
      trainingAwareness: 'Training centers in each district for farmer awareness',
      infrastructureSupport: 'Claim settlement through bank branches and insurance offices',
      marketSupport: 'Ensures continuity in farming operations for market participation',
      weatherAdvisory: 'Weather-based automatic triggers for claim assessment'
    }
  },
  {
    id: 2,
    title: 'PM-Kisan Samman Nidhi',
    summary: 'Direct income support of ₹6,000 per year to landholding farmer families.',
    description: 'Direct benefit transfer scheme providing ₹6,000 per year in three installments.',
    type: 'subsidy',
    date: '2019-12-24',
    link: 'https://pmkisan.gov.in/',
    tags: ['Subsidy', 'Direct Benefit'],
    image: 'https://images.unsplash.com/photo-1551632786-e91435c562fa?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '₹6,000 per year in 3 installments (₹2,000 each) directly to bank account',
      productivityImprovement: 'Funds for purchasing seeds, fertilizers, and tools',
      riskProtection: 'Ensures minimum income security for small holding farmers',
      trainingAwareness: 'Farmer helpline and mobile app for scheme information',
      infrastructureSupport: 'Transparent mechanism through common service centers',
      marketSupport: 'Financial stability to maintain farming operations',
      weatherAdvisory: 'Linked with crop insurance for comprehensive protection'
    }
  },
  {
    id: 3,
    title: 'Kisan Credit Card (KCC)',
    summary: 'Provides farmers affordable and timely credit for agricultural needs.',
    description: 'Flexible credit scheme providing easy access to credit at reasonable rates.',
    type: 'loan',
    date: '2015-06-01',
    link: 'https://www.nabard.org/',
    tags: ['Loan', 'Credit Support'],
    image: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: 'Credit up to ₹3-4 lakh at 4% interest (after subsidy)',
      productivityImprovement: 'Funds for seeds, fertilizers, pesticides, and farm equipment',
      riskProtection: 'Accidental death coverage up to ₹50,000',
      trainingAwareness: 'Advisory services on improved farming practices',
      infrastructureSupport: 'Available through all cooperative and commercial banks',
      marketSupport: 'Overdraft privilege for post-harvest activities',
      weatherAdvisory: 'Flexible tenure based on crop cycle'
    }
  },
  {
    id: 4,
    title: 'Soil Health Card Scheme',
    summary: 'Soil test-based recommendations to improve productivity and soil health.',
    description: 'Scheme distributing customized soil health cards with nutrient management.',
    type: 'advisory',
    date: '2015-02-19',
    link: 'https://soilhealth.dac.gov.in/',
    tags: ['Soil', 'Advisory'],
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: 'Free soil testing across all villages',
      productivityImprovement: 'Customized fertilizer recommendations increasing yield by 10-25%',
      riskProtection: 'Prevents soil degradation and maintains long-term fertility',
      trainingAwareness: 'Personalized training on nutrient management',
      infrastructureSupport: 'State-level soil testing laboratories',
      marketSupport: 'Organic certification pathway information',
      weatherAdvisory: 'Climate-appropriate soil management recommendations'
    }
  },
  {
    id: 5,
    title: 'Pradhan Mantri Kisan Sampada Yojana (PMKSY)',
    summary: 'Agro-processing clusters and post-harvest management to reduce wastage.',
    description: 'Comprehensive scheme for agricultural value addition and processing.',
    type: 'subsidy,processing',
    date: '2016-03-15',
    link: 'https://mofpi.gov.in/en/',
    tags: ['Processing', 'Value Addition'],
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '35-50% subsidy on processing infrastructure investment',
      productivityImprovement: 'Adds 15-20% value to agricultural products',
      riskProtection: 'Reduces post-harvest losses from 20-30% to 5-10%',
      trainingAwareness: 'Food safety and quality certification training',
      infrastructureSupport: 'Cold storage, processing centers, logistics',
      marketSupport: 'Direct market linkages and export opportunities',
      weatherAdvisory: 'Appropriate technology for seasonal produce'
    }
  },
  {
    id: 6,
    title: 'e-NAM (National Agriculture Market)',
    summary: 'Online trading platform for agricultural commodities with transparent pricing.',
    description: 'Digital marketplace connecting farmers directly to buyers for better prices.',
    type: 'market',
    date: '2016-04-14',
    link: 'https://enam.gov.in/',
    tags: ['Market', 'Digital'],
    image: 'https://images.unsplash.com/photo-1460925895917-adf4e20df84e?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: 'Eliminates middlemen, farmers get 5-10% better prices',
      productivityImprovement: 'Price information helps farmers plan crop production',
      riskProtection: 'Transparent pricing reduces exploitation',
      trainingAwareness: 'Digital literacy and online trading training',
      infrastructureSupport: '1000+ e-NAM markets across India with internet connectivity',
      marketSupport: 'Direct buyer-farmer interface, real-time price discovery',
      weatherAdvisory: 'Demand forecasting based on weather patterns'
    }
  },
  {
    id: 7,
    title: 'Rashtriya Krishi Vikas Yojana (RKVY)',
    summary: 'Incentivizes states to increase public investment in agriculture.',
    description: 'State-level scheme promoting agricultural development and value addition.',
    type: 'investment',
    date: '2007-04-01',
    link: 'https://rkvy.nic.in/',
    tags: ['Investment', 'State Support'],
    image: 'https://images.unsplash.com/photo-1551599810-f91591437281?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: 'State-level grants for agricultural projects',
      productivityImprovement: 'Infrastructure for crop demonstrations and research',
      riskProtection: 'Risk mitigation through diversification projects',
      trainingAwareness: 'State agricultural extension programs',
      infrastructureSupport: 'Irrigation, roads, market yards, horticultural infrastructure',
      marketSupport: 'Agricultural business development support',
      weatherAdvisory: 'Weather-resilient infrastructure development'
    }
  },
  {
    id: 8,
    title: 'Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)',
    summary: 'Pension scheme for small and marginal farmers for income security in old age.',
    description: 'Voluntary pension scheme providing regular income after retirement.',
    type: 'pension',
    date: '2019-09-01',
    link: 'https://pmkmy.gov.in/',
    tags: ['Pension', 'Social Security'],
    image: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '₹3,000 monthly pension from age 60 after 30 years contribution',
      productivityImprovement: 'Financial security enabling long-term farm investments',
      riskProtection: 'Social security safety net for elderly farmers',
      trainingAwareness: 'Awareness programs through agricultural departments',
      infrastructureSupport: 'Direct bank transfer for pension disbursement',
      marketSupport: 'Enables succession planning for farm operations',
      weatherAdvisory: 'Coverage regardless of seasonal income variations'
    }
  },
  {
    id: 9,
    title: 'National Food Security Mission (NFSM)',
    summary: 'Increases production of rice, wheat, pulses and coarse cereals.',
    description: 'Initiative for food grain production enhancement through technology.',
    type: 'mission',
    date: '2007-01-01',
    link: 'https://dah.gov.in/en/schemes-programmes',
    tags: ['Mission', 'Production'],
    image: 'https://images.unsplash.com/photo-1500382017468-f049863256cc?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: 'Free distribution of improved seeds and planting material',
      productivityImprovement: '20-30% yield increase through improved varieties',
      riskProtection: 'Crop insurance linkage for participating farmers',
      trainingAwareness: 'Intensive farmer training and field demonstrations',
      infrastructureSupport: 'Seed production centers and community seed banks',
      marketSupport: 'MSP guarantee and procurement operations',
      weatherAdvisory: 'Seasonal crop production forecasts and advisories'
    }
  },
  {
    id: 10,
    title: 'National Mission for Sustainable Agriculture (NMSA)',
    summary: 'Promotes sustainable farming practices and climate-smart agriculture.',
    description: 'Mission for ensuring long-term agricultural productivity and resilience.',
    type: 'mission',
    date: '2014-01-01',
    link: 'https://dah.gov.in/en/schemes-programmes',
    tags: ['Mission', 'Sustainability'],
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '50% subsidy on organic certification and inputs',
      productivityImprovement: 'Sustainable practices maintain soil health and yield',
      riskProtection: 'Reduces chemical inputs risk to environment and health',
      trainingAwareness: 'Training in natural farming and conservation agriculture',
      infrastructureSupport: 'Rainwater harvesting structures and soil conservation',
      marketSupport: 'Premium prices for certified organic products',
      weatherAdvisory: 'Climate-resilient agriculture recommendations'
    }
  },
  {
    id: 11,
    title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    summary: 'Supports organic farming through cluster-based models.',
    description: 'Organic farming promotion with cluster approach and certification support.',
    type: 'subsidy,organic',
    date: '2015-01-01',
    link: 'https://pkvy.dac.gov.in/',
    tags: ['Organic', 'Cluster'],
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '₹20,000 per hectare over 3 years for organic conversion',
      productivityImprovement: 'Yield increases to normal levels after 2-3 year transition',
      riskProtection: 'Protects health and environment from pesticide exposure',
      trainingAwareness: 'Cluster-based farmer groups for knowledge sharing',
      infrastructureSupport: 'Vermicompost units and natural pest control facilities',
      marketSupport: 'Organic certification and premium market access',
      weatherAdvisory: 'Organic cropping pattern recommendations'
    }
  },
  {
    id: 12,
    title: 'Mission for Integrated Development of Horticulture (MIDH)',
    summary: 'Supports horticulture development through production and value addition.',
    description: 'Comprehensive scheme for horticultural development with infrastructure.',
    type: 'horticulture',
    date: '2014-04-01',
    link: 'https://midh.gov.in/en',
    tags: ['Horticulture', 'Value Addition'],
    image: 'https://images.unsplash.com/photo-1488459716781-6f3ee109e5e4?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '40-50% subsidy on horticultural plantation and infrastructure',
      productivityImprovement: '2-3x higher income compared to field crops',
      riskProtection: 'Pest management and disease control support',
      trainingAwareness: 'Horticultural technology training programs',
      infrastructureSupport: 'Nurseries, greenhouses, post-harvest infrastructure',
      marketSupport: 'Value chain development and export support',
      weatherAdvisory: 'Crop and variety selection based on agro-climatic zones'
    }
  },
  {
    id: 13,
    title: 'Pradhan Mantri Annadata Aay Sanrakshan Abhiyan (PM-AASHA)',
    summary: 'Provides price support and procurement for remunerative prices.',
    description: 'Price support and procurement mechanism for agricultural produce.',
    type: 'subsidy',
    date: '2018-01-01',
    link: 'https://dah.gov.in/en/schemes-programmes',
    tags: ['Price Support', 'Procurement'],
    image: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: 'MSP-based procurement ensures minimum returns',
      productivityImprovement: 'Price certainty enables planned production',
      riskProtection: 'Protects farmers from price crashes below MSP',
      trainingAwareness: 'Market information and crop planning advisories',
      infrastructureSupport: 'Government procurement centers and fair price shops',
      marketSupport: 'Direct government purchase at MSP rates',
      weatherAdvisory: 'Production adjusted based on demand forecasts'
    }
  },
  {
    id: 14,
    title: 'National Mission on Agricultural Extension and Technology (ATMA)',
    summary: 'Strengthens agricultural extension services and technology dissemination.',
    description: 'Extension program improving farmer awareness about modern practices.',
    type: 'extension',
    date: '2005-01-01',
    link: 'https://atma.dac.gov.in/',
    tags: ['Extension', 'Training'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: 'Free extension services and demonstrations',
      productivityImprovement: '15-20% productivity increase through technology adoption',
      riskProtection: 'Disease and pest management guidance reduces losses',
      trainingAwareness: 'Regular farmer training and knowledge dissemination',
      infrastructureSupport: 'District-level agricultural technology management agencies',
      marketSupport: 'Value chain advisory and market linkage support',
      weatherAdvisory: 'Weather-based crop advisories and decision support systems'
    }
  },
  {
    id: 15,
    title: 'Blue Revolution (Fisheries Development)',
    summary: 'Increases fish production and productivity in fisheries and aquaculture.',
    description: 'Fisheries and aquaculture development with value chain support.',
    type: 'fisheries',
    date: '2015-01-01',
    link: 'https://nfdb.gov.in/',
    tags: ['Fisheries', 'Aquaculture'],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '30-40% subsidy on aquaculture pond development',
      productivityImprovement: '5-10x higher income compared to conventional farming',
      riskProtection: 'Disease management and production stabilization support',
      trainingAwareness: 'Aquaculture and fish farming training programs',
      infrastructureSupport: 'Hatcheries, feed mills, storage, transport facilities',
      marketSupport: 'Export quality certification and branded packaging support',
      weatherAdvisory: 'Water quality monitoring and seasonal production guidance'
    }
  },
  {
    id: 16,
    title: 'National Beekeeping & Honey Mission',
    summary: 'Supports beekeeping and honey production value chains.',
    description: 'Beekeeping promotion with apiary development support.',
    type: 'mission',
    date: '2020-01-01',
    link: 'https://nbhm.nbb.gov.in/',
    tags: ['Beekeeping', 'Livelihoods'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '₹25,000-30,000 subsidy for bee colonies and equipment',
      productivityImprovement: '30-50 kg honey per colony annually plus pollination benefits',
      riskProtection: 'Insurance for bee colonies and honey stocks',
      trainingAwareness: 'Beekeeping training and certification programs',
      infrastructureSupport: 'Processing units, storage facilities, quality labs',
      marketSupport: 'Direct marketing support and export partnerships',
      weatherAdvisory: 'Crop blooming calendars and bee-friendly practices'
    }
  },
  {
    id: 17,
    title: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY)',
    summary: 'Fisheries sector development for sustainable fishing.',
    description: 'Comprehensive fisheries development with modern infrastructure.',
    type: 'fisheries',
    date: '2020-05-13',
    link: 'https://pmmsy.dah.gov.in/',
    tags: ['Fisheries', 'Infrastructure'],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '₹20,000 crore outlay with concessional credit',
      productivityImprovement: '25% increase in fish production through new technology',
      riskProtection: 'Fishermen accident and disability coverage',
      trainingAwareness: 'Modern fishing techniques and quality standards training',
      infrastructureSupport: 'Fishing harbors, landing centers, processing facilities',
      marketSupport: 'Value addition and export support',
      weatherAdvisory: 'Oceanographic data for sustainable fishing'
    }
  },
  {
    id: 18,
    title: 'Pradhan Mantri Scheme for 0% Interest Subvention',
    summary: 'Zero percent interest subvention on agricultural loans.',
    description: 'Interest subvention for farmers on loans for agricultural inputs.',
    type: 'loan',
    date: '2018-01-01',
    link: 'https://www.nabard.org/',
    tags: ['Loan', 'Subsidy'],
    image: 'https://images.unsplash.com/photo-1551632786-e91435c562fa?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: 'Interest-free loans up to ₹3 lakh for agricultural inputs',
      productivityImprovement: 'Affordable credit enables input intensification',
      riskProtection: 'Reduced debt burden and financial stress',
      trainingAwareness: 'Financial literacy and credit awareness programs',
      infrastructureSupport: 'Disbursement through all scheduled banks',
      marketSupport: 'Capital for market-oriented production',
      weatherAdvisory: 'Flexible repayment based on crop performance'
    }
  },
  {
    id: 19,
    title: 'Integrated Pest Management (IPM) Program',
    summary: 'Sustainable pest control using biological and cultural methods.',
    description: 'Program for sustainable pest management reducing pesticide use.',
    type: 'advisory',
    date: '2015-01-01',
    link: 'https://dah.gov.in/en/schemes-programmes',
    tags: ['Pest Management', 'Sustainability'],
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '75% subsidy on bio-pesticides and beneficial insects',
      productivityImprovement: 'Maintains yield while reducing input costs by 30-40%',
      riskProtection: 'Eliminates pesticide residues in food and soil',
      trainingAwareness: 'IPM farmer training and field schools',
      infrastructureSupport: 'Bio-pesticide production and distribution centers',
      marketSupport: 'Residue-free produce premium market pricing',
      weatherAdvisory: 'Pest population monitoring and forecast advisories'
    }
  },
  {
    id: 20,
    title: 'Agricultural Infrastructure Development Fund (AIDF)',
    summary: 'Financing for agricultural infrastructure like warehousing.',
    description: 'Long-term financing for agricultural infrastructure projects.',
    type: 'investment',
    date: '2020-07-01',
    link: 'https://www.nabard.org/',
    tags: ['Infrastructure', 'Financing'],
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '₹1 lakh crore with 3% interest subvention',
      productivityImprovement: 'Storage and processing increases farm value by 20-30%',
      riskProtection: 'Reduces post-harvest losses and price crashes',
      trainingAwareness: 'Enterprise development and management training',
      infrastructureSupport: 'Warehouses, silos, cold storage, processing units',
      marketSupport: 'Higher realization prices through better storage',
      weatherAdvisory: 'Weather-controlled storage technology'
    }
  },
  {
    id: 21,
    title: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    summary: 'Watershed management for water conservation and control.',
    description: 'Water conservation scheme for sustainable agriculture.',
    type: 'mission',
    date: '2015-07-01',
    link: 'https://pmksy.gov.in/',
    tags: ['Water Conservation', 'Sustainability'],
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '₹50,000 crore for irrigation and watershed development',
      productivityImprovement: 'Increases irrigated area and reduces water usage by 30-40%',
      riskProtection: 'Drought-proofing through assured water supply',
      trainingAwareness: 'Water management and conservation training',
      infrastructureSupport: 'Check dams, farm ponds, drip/sprinkler irrigation',
      marketSupport: 'Year-round farming through assured irrigation',
      weatherAdvisory: 'Drought-resistant varieties and water-wise cropping'
    }
  },
  {
    id: 22,
    title: 'National Initiative for Micro Irrigation (NIMI)',
    summary: 'Micro irrigation with subsidy for drip and sprinkler systems.',
    description: 'Efficient water use through micro irrigation technology.',
    type: 'subsidy',
    date: '2014-01-01',
    link: 'https://dah.gov.in/en/schemes-programmes',
    tags: ['Micro Irrigation', 'Efficiency'],
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '50-55% subsidy on drip and sprinkler irrigation',
      productivityImprovement: '30-50% water saving with 20-30% yield increase',
      riskProtection: 'Drought resilience and consistent productivity',
      trainingAwareness: 'Micro irrigation design and operation training',
      infrastructureSupport: 'Drip kits, sprinklers, pump sets with subsidies',
      marketSupport: 'Water efficiency supports year-round production',
      weatherAdvisory: 'Precision irrigation scheduling based on weather'
    }
  },
  {
    id: 23,
    title: 'Forest Resource Development Scheme',
    summary: 'Promotes agroforestry and tree-based agricultural systems.',
    description: 'Integration of trees with agricultural activities.',
    type: 'subsidy',
    date: '2016-01-01',
    link: 'https://dah.gov.in/en/schemes-programmes',
    tags: ['Agroforestry', 'Sustainability'],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '₹15,000-20,000 per hectare subsidy for tree plantation',
      productivityImprovement: 'Additional timber and fruit income 3-5 times crop value',
      riskProtection: 'Diversified income reduces climate and market risks',
      trainingAwareness: 'Agroforestry system design and species training',
      infrastructureSupport: 'Seedling distribution and plantation support',
      marketSupport: 'Timber and fruit market linkages',
      weatherAdvisory: 'Climate-appropriate tree species selection'
    }
  },
  {
    id: 24,
    title: 'Pradhan Mantri Gram Sadak Yojana',
    summary: 'Rural road development connecting agricultural villages.',
    description: 'Infrastructure development for better agricultural connectivity.',
    type: 'infrastructure',
    date: '2000-12-25',
    link: 'https://pmgsy.nic.in/',
    tags: ['Infrastructure', 'Rural Development'],
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop',
    benefits: {
      financialSupport: '₹1.5 lakh crore road connectivity program',
      productivityImprovement: '20-30% reduction in marketing costs',
      riskProtection: 'Protects crops from spoilage through faster transport',
      trainingAwareness: 'Road safety and emergency response training',
      infrastructureSupport: 'All-weather rural road networks',
      marketSupport: 'Better market access and reduced post-harvest losses',
      weatherAdvisory: 'Climate-resilient road construction'
    }
  }
];

/**
 * Scheme Component - Government Agricultural Schemes Page
 * 
 * FALLBACK URL LOGIC:
 * When a user clicks "View Details":
 * 1. Check if scheme.link exists and is a valid URL
 * 2. If valid → Open the scheme's dedicated official portal
 * 3. If invalid/missing → Fallback to major schemes page:
 *    https://services.india.gov.in/service/detail/major-schemes-for-farmers-1
 * 
 * This ensures:
 * ✓ No broken links
 * ✓ Users always land on relevant information
 * ✓ Links open in new tab with security settings
 * ✓ Console logs for debugging (dev tools)
 */

const Scheme = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showLatest, setShowLatest] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const schemes = schemesData;

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

  const handleSchemeClick = (schemeId) => {
    navigate(`/scheme/${schemeId}`);
  };

  // Utility function to validate URL with enhanced checks
  const isValidUrl = (urlString) => {
    try {
      if (!urlString || typeof urlString !== 'string') {
        return false;
      }
      // Check if string is empty or just whitespace
      if (urlString.trim() === '') {
        return false;
      }
      // Try to create a URL object
      const urlObj = new URL(urlString);
      // Verify it's an http(s) URL
      if (!urlObj.protocol.startsWith('http')) {
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Invalid URL detected:', urlString, err);
      return false;
    }
  };

  // Fallback URL for schemes without proper URLs - Updated to working DAH portal
  const FALLBACK_SCHEMES_URL = 'https://dah.gov.in/en/schemes-programmes';

  const handleViewDetails = (e, scheme) => {
    e.stopPropagation();
    
    if (!scheme) {
      console.error('No scheme provided');
      return;
    }
    
    // Validate if scheme has a valid link
    let urlToOpen;
    
    if (scheme.link && isValidUrl(scheme.link)) {
      // Scheme has a valid link, use it
      urlToOpen = scheme.link;
      console.log(`✓ Opening scheme: "${scheme.title}" | URL: ${urlToOpen}`);
    } else {
      // Fallback to default government schemes page
      urlToOpen = FALLBACK_SCHEMES_URL;
      console.warn(`⚠ Invalid/missing link for: "${scheme.title}" | Using fallback: ${FALLBACK_SCHEMES_URL}`);
    }
    
    // Open URL in new tab with security settings
    try {
      const newWindow = window.open(urlToOpen, '_blank', 'noopener,noreferrer');
      if (!newWindow) {
        console.error('Pop-up blocked. Trying without security params...');
        window.open(urlToOpen, '_blank');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      // Ultimate fallback: try opening without security params
      try {
        window.open(urlToOpen, '_blank');
      } catch (finalError) {
        console.error('Final attempt failed:', finalError);
      }
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
          <button className="flex h-10 w-10 shrink-0 items-center justify-center text-text-primary-light dark:text-text-primary-dark ag-back hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition" onClick={handleBack} aria-label="Back to home">
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
            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 font-medium transition-all duration-200 ${activeFilter === 'all'
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
            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 font-medium transition-all duration-200 ${activeFilter === 'subsidy'
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
            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 font-medium transition-all duration-200 ${activeFilter === 'loan'
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
            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 font-medium transition-all duration-200 ${activeFilter === 'insurance'
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
            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 font-medium transition-all duration-200 ${showFilterPanel
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
            onClick={() => handleSchemeClick(scheme.id)}
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
                className="view-details text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                onClick={(e) => handleViewDetails(e, scheme)}
                title={isValidUrl(scheme?.link) ? `Visit official portal: ${scheme.title}` : 'View government schemes portal'}
              >
                View Details
                <span className="material-symbols-outlined text-base">open_in_new</span>
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
