import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Lms = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleBack = () => {
    navigate('/');
  };

  const handleChatClick = () => {
    navigate('/chatbot');
  };

  const categories = ['All', 'Crop Guides', 'Scheme', 'Irrigation', 'Tutorials', 'Soil Health'];

  const featuredContent = [
    {
      id: 1,
      title: 'Optimizing Irrigation with IoT',
      description: 'Learn how sensors can save water and boost yields.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWrglrcnGZ2VQhC52aajZ-4hajBsDVcnRJLf4Jp_DCLq2jbxyt6iyHUg-fc6rJN_IhkYE7PjSyx9bgjb4iJ74gtq0s-lK1906X26odeAXWDE8rlYDJJMEtcv-X_8ONBjGQOWKTsLwTljPjcKgCt_dqLq3TWmrgB7vFM73xCCukZMGT34rAupx7m1mP8RCq1K4RlQnU1kaF8Wg15-pPK2BEaskmuqp27yu9w8CG6ZBsfv0p23DQdMbjEwIpY249l5OsCHGSDA5WXzk'
    },
    {
      id: 2,
      title: 'Video: Identifying Common Pests',
      description: 'A visual guide to protecting your crops.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuuJJo61faFBIu9CFPM6a1yJXLYNRKfI-tn9F81GIUXvQc5iohqOAVFcXd-b1lwCxhgCklNX8BN0dwp3547DFdA5s0R0bbBMcu0MF_O3oHJlNwQp4dPjmSxrr8DLEqHJ1FLrHrF6FI2pysNgrpYE5g53sNrNBYIbzvtRWQXFAvZBRW7tnOquItFZYDf3K-Wbon8Kim9loPz4SiC4ytJSyDC06W8GERkWIjb03Py4mu9HYFP4z3bDTroto6dsfiUfOzyNKDj1DEkx0'
    },
    {
      id: 3,
      title: 'Expert Q&A: Soil Health',
      description: 'Read the latest advice from our agronomists.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-IXJnKrg1xgfoH5pgM7mMDS8_g-orr69Sj5jAo4oB9k6jfKAdhEymZpL1yKCkYPWtMnf_UMK5FOscmhHHOIJva91aVkglcUYUesvjT5-7W2Vvy2yLD1w8CtNANFlMaMiDwSCthS39j58xI7_w0fFwKm2WV3-clTQ7fnNh4by2P_p7cpHpD3VuexmONoAtk6CDQVyPcC4tvc7qTj2TYz9FX8D7uCWUDkb2p_DGuy35dOEc2Q2Z7LHmPRlYq-DZH-QsMe5fJZ3Tfdk'
    }
  ];

  const articles = [
    {
      id: 1,
      category: "Beginner's Guide",
      title: 'Getting Started with Arigrow',
      description: 'A step-by-step guide to setting up your smart farm for the first time.',
      readTime: 'Article • 5 min read',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGGcBBVW4t6YHqBGgephzvaGJz1Vwe8FpJpnW0pBJTW4ER6rKfIlk_qv_jV3JMzqoK26-gK1R6IUpmhUua8oi250J56dC24h5rPvkNgiqUV2gsqr83ybhWpXwW8hZWuRTdyJUfRyipUp0PeuKG1Z8HCA-iW-YmRecL59jbYzoPeBBjaXBIcl9nS26vOw5qejFEN2vfMpaDaMZ0qdjWXCy2jvrUmCFT441vgRkbW4nUmFrroQxu-bUEZM_iiHbmjmmdS8r_Szmep64'
    },
    {
      id: 2,
      category: 'Water Management',
      title: 'Advanced Drip Irrigation Techniques',
      description: 'Maximize water efficiency and crop health with these expert tips.',
      readTime: 'Article • 8 min read',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjzz9ol8gnT_0zdO4iUitz6DHvpovZSkxh_aeuRgBdbXkz7VQZEErTQ7XCFifXpsVoIY2brsibA3x8dr-eMFFD9n3m2NeTuQg2CRjxdhXa_lf5NHZADp0EN-mQDLboBDdoRQs7HpxBcus_T26Cj3fLPUdIo6--38B_rzp4Xy1L2yfY-CN8lSi1V5jGd7MXUH9HItvjMwBkO9S-yIkAhC9f_yQMEH7YiOVLYguacSvvkVmaUzyXN_7hH62urRoB2HIA2G85aG7dlZo'
    },
    {
      id: 3,
      category: 'Community Forum',
      title: 'Join the Discussion: Best Corn Varieties for 2024',
      description: 'Share your experience and learn from fellow farmers in our community forum.',
      readTime: 'Trending Topic',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArRQo79jmI59rT590g3ksg5bU4nd81yAAHqy_QL8UMDGw-CCv611u7ESfSvMkarJQxv_vdI4DjWmE23wST49Kfhy2k-sZM0_1g5WY5PaKG7joK2SQ2R--4EQT5pNN4taBzZnXodOijaQcyHSxX0sDTIOneANsd0B6J1eJ2RafatWuh9SXsobKmqnffwoSeVaHqsOq7QXTn_WQ4E_XYhncGy4fEVxOVIL4Wut6j_XlX1aW89CDTAcvF8edq_3WxfbnVmWx7hQByoSE'
    }
  ];

  const filteredArticles = activeCategory === 'All' ? articles : articles.filter(article => article.category === activeCategory);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      {/* Top App Bar */}
      <div className="flex items-center p-4 pb-2 bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <button
          onClick={handleBack}
          className="flex size-12 shrink-0 items-center justify-center text-black dark:text-white"
          aria-label="Back to home"
        >
          <span className="material-symbols-outlined text-3xl">arrow_back</span>
        </button>
        <div className="flex size-12 shrink-0 items-center justify-start"></div>
        <h1 className="text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-black dark:text-white">
          Knowledge Hub
        </h1>
        <div className="flex w-12 items-center justify-end"></div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-[#91ca96] flex border-none bg-[#234826] items-center justify-center pl-4 rounded-l-lg border-r-0">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#234826] focus:border-none h-full placeholder:text-[#91ca96] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal font-display"
              placeholder="Search articles, tutorials..."
            />
          </div>
        </label>
      </div>

      {/* Featured Content Header */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold text-black dark:text-white">Featured For You</h2>
      </div>

      {/* Carousel */}
      <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-stretch p-4 pt-0 gap-4">
          {featuredContent.map((item) => (
            <div key={item.id} className="flex h-full flex-1 flex-col gap-3 rounded-lg min-w-64">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                style={{ backgroundImage: `url("${item.image}")` }}
              ></div>
              <div>
                <p className="text-black dark:text-white text-base font-medium leading-normal">{item.title}</p>
                <p className="text-gray-600 dark:text-[#91ca96] text-sm font-normal leading-normal">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chips */}
      <div className="flex gap-3 px-4 pb-4 overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-4 cursor-pointer ${
              activeCategory === category ? 'bg-primary' : 'bg-[#19341b]'
            }`}
          >
            <p className={`text-sm font-medium leading-normal ${
              activeCategory === category ? 'text-[#112212]' : 'text-white'
            }`}>
              {category}
            </p>
          </div>
        ))}
      </div>

      {/* Content Cards Section */}
      <div className="flex flex-col gap-4 px-4 pb-24">
        {filteredArticles.map((article) => (
          <div key={article.id} className="@container">
            <div className="flex flex-col items-stretch justify-start rounded-xl overflow-hidden bg-white/5 dark:bg-[#19341b]">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                style={{ backgroundImage: `url("${article.image}")` }}
              ></div>
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 p-4">
                <p className="text-gray-600 dark:text-[#91ca96] text-sm font-normal leading-normal">{article.category}</p>
                <p className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">{article.title}</p>
                <p className="text-gray-700 dark:text-[#91ca96] text-base font-normal leading-normal">{article.description}</p>
                <div className="flex items-center gap-3 justify-between mt-2">
                  <p className="text-gray-600 dark:text-[#91ca96] text-sm font-normal leading-normal">{article.readTime}</p>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-primary text-[#112212] text-sm font-medium leading-normal">
                    <span className="truncate">Read More</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Chat FAB */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={handleChatClick}
          aria-label="Open Chat"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-[#112212] shadow-sm z-20"
          title="Chat with AgroAI"
        >
          <span className="material-symbols-outlined text-lg">support_agent</span>
        </button>
      </div>
    </div>
  );
};

export default Lms;
