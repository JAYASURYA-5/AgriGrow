import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 24 Agricultural Schemes Data - Complete with all 7 benefit categories
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
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
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
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
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
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
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
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
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
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
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
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
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
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
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
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
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
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
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
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
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
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
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
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
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
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
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

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const scheme = schemesData.find(s => s.id === parseInt(id));
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Fallback URL for schemes without proper URLs
  const FALLBACK_SCHEMES_URL = 'https://dah.gov.in/en/schemes-programmes';

  // URL validation function
  const isValidUrl = (urlString) => {
    try {
      if (!urlString || typeof urlString !== 'string') {
        return false;
      }
      if (urlString.trim() === '') {
        return false;
      }
      const urlObj = new URL(urlString);
      if (!urlObj.protocol.startsWith('http')) {
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Invalid URL detected:', urlString, err);
      return false;
    }
  };

  // Handle opening scheme link
  const handleViewOfficialDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!scheme) {
      console.error('No scheme provided');
      return;
    }
    
    let urlToOpen;
    
    if (scheme.link && isValidUrl(scheme.link)) {
      urlToOpen = scheme.link;
      console.log(`✓ Opening scheme: "${scheme.title}" | URL: ${urlToOpen}`);
    } else {
      urlToOpen = FALLBACK_SCHEMES_URL;
      console.warn(`⚠ Invalid/missing link for: "${scheme.title}" | Using fallback: ${FALLBACK_SCHEMES_URL}`);
    }
    
    try {
      const newWindow = window.open(urlToOpen, '_blank', 'noopener,noreferrer');
      if (!newWindow) {
        console.error('Pop-up blocked. Trying without security params...');
        window.open(urlToOpen, '_blank');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      try {
        window.open(urlToOpen, '_blank');
      } catch (finalError) {
        console.error('Final attempt failed:', finalError);
      }
    }
  };

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Scheme Not Found</h1>
          <button
            onClick={() => navigate('/scheme')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Schemes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/scheme')}
          className="inline-flex items-center gap-2 mb-8 p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-semibold text-gray-800">Back to Schemes</span>
        </button>

        {/* Scheme Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Featured Image */}
          <div className="w-full h-96 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 relative">
            {imageLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-gray-500">image</span>
              </div>
            )}
            {!imageError ? (
              <img
                src={scheme.image}
                alt={scheme.title}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="material-symbols-outlined text-6xl mb-4 block">agriculture</span>
                  <p className="text-sm font-semibold">{scheme.title}</p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Category & Meta */}
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
                {scheme.type}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              {scheme.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {scheme.tags && scheme.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Quick Info Cards */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg mb-8">
              <h3 className="font-bold text-blue-900 mb-2">About This Scheme</h3>
              <p className="text-blue-700">{scheme.summary}</p>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 mb-12 leading-relaxed">
              {scheme.description}
            </p>

            {/* 7 Benefit Categories */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">How This Scheme Works For You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Financial Support */}
                <div className="border-l-4 border-blue-600 bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">💰</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Financial Support</h3>
                      <p className="text-gray-700">{scheme.benefits.financialSupport}</p>
                    </div>
                  </div>
                </div>

                {/* Productivity Improvement */}
                <div className="border-l-4 border-green-600 bg-green-50 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">📈</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Productivity Improvement</h3>
                      <p className="text-gray-700">{scheme.benefits.productivityImprovement}</p>
                    </div>
                  </div>
                </div>

                {/* Risk Protection */}
                <div className="border-l-4 border-red-600 bg-red-50 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">🛡️</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Risk Protection</h3>
                      <p className="text-gray-700">{scheme.benefits.riskProtection}</p>
                    </div>
                  </div>
                </div>

                {/* Training & Awareness */}
                <div className="border-l-4 border-purple-600 bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">🎓</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Training & Awareness</h3>
                      <p className="text-gray-700">{scheme.benefits.trainingAwareness}</p>
                    </div>
                  </div>
                </div>

                {/* Infrastructure Support */}
                <div className="border-l-4 border-yellow-600 bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">🏗️</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Infrastructure Support</h3>
                      <p className="text-gray-700">{scheme.benefits.infrastructureSupport}</p>
                    </div>
                  </div>
                </div>

                {/* Market Support */}
                <div className="border-l-4 border-indigo-600 bg-indigo-50 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">🏪</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Market Support</h3>
                      <p className="text-gray-700">{scheme.benefits.marketSupport}</p>
                    </div>
                  </div>
                </div>

                {/* Weather & Advisory */}
                <div className="border-l-4 border-cyan-600 bg-cyan-50 p-6 rounded-lg md:col-span-2">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">🌤️</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Weather & Advisory Services</h3>
                      <p className="text-gray-700">{scheme.benefits.weatherAdvisory}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Apply Button */}
            <div className="border-t border-gray-200 pt-8">
              <button
                onClick={handleViewOfficialDetails}
                title={isValidUrl(scheme?.link) ? `Visit official portal: ${scheme.title}` : 'View government schemes portal'}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <span>View Official Details</span>
                <span className="material-symbols-outlined">open_in_new</span>
              </button>
            </div>

            {/* Related Schemes */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Schemes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schemesData
                  .filter(s => s.type === scheme.type && s.id !== scheme.id)
                  .slice(0, 2)
                  .map(relScheme => (
                    <div
                      key={relScheme.id}
                      onClick={() => window.location.href = `/scheme/${relScheme.id}`}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 cursor-pointer hover:shadow-md transition"
                    >
                      <h4 className="font-bold text-gray-900 line-clamp-2 hover:text-blue-600">
                        {relScheme.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-2">
                        {relScheme.type}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;
