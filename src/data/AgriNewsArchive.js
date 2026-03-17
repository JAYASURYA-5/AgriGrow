const UNSPLASH_IMAGES = {
  'market': [
    'https://images.unsplash.com/photo-1488459716781-6c3571bf3acf?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1493976040900-3a5ae00980a0?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500&h=300&fit=crop'
  ],
  'technology': [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178f50902556?w=500&h=300&fit=crop'
  ],
  'weather': [
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1513002749550-c59a0db27338?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500&h=300&fit=crop'
  ],
  'crop-health': [
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop'
  ]
};

export const agriNewsArchive = Array.from({length: 100}, (_, i) => {
  const category = ['market', 'technology', 'weather', 'crop-health'][i%4];
  const imageList = UNSPLASH_IMAGES[category];
  const imageIndex = Math.floor(i / 25) % imageList.length;
  
  return {
    id: `news-${String(i+1).padStart(3, '0')}`,
    title: `Agri News #${i+1} - Agriculture Development ${2000 + Math.floor(i/10)}`,
    summary: `Latest updates on ${category === 'market' ? 'agricultural markets and commodity prices' : category === 'technology' ? 'farming technology and innovation' : category === 'weather' ? 'weather patterns and forecasting' : 'crop health and disease management'}. Key insights for farmers and agricultural professionals.`,
link: category === 'technology' ? 'https://agrinews.in/technology/' :
          category === 'market' ? 'https://www.business-standard.com/markets/capital-market-news/digital-platforms-helping-boost-agriculture-income-125072300292_1.html' :
          category === 'weather' ? 'https://weatheragro.com/' :
          'https://www.indiafarm.org/news/india-agri-news/',
    date: `20${Math.floor(i/5)}-${String(1 + (i%12)).padStart(2,'0')}-${String(1 + (i%28)).padStart(2,'0')}`,
    source: `Agricultural Ministry News ${i+1}`,
    image: imageList[imageIndex],
    category: category
  };
});
