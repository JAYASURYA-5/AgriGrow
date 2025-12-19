import React, { useState } from 'react';

const Market = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: false,
    location: false,
    price: false,
    organic: false
  });

  const featuredItems = [
    {
      id: 1,
      title: 'Fresh This Week',
      subtitle: 'Get the best of the season',
      image: 'https://example.com/image1.jpg'
    },
    {
      id: 2,
      title: 'Featured Farms',
      subtitle: 'Meet our top-rated growers',
      image: 'https://example.com/image2.jpg'
    },
    {
      id: 3,
      title: 'Bulk Discounts Available',
      subtitle: 'Save more when you buy more',
      image: 'https://example.com/image3.jpg'
    }
  ];

  const products = [
    {
      id: 1,
      name: 'Heirloom Tomatoes',
      farm: 'Green Valley Farms',
      rating: 4.5,
      price: '$2.50 / lb',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9_Ardki1WOdy_2E2QNUC2rn0FzDdYCCyMqIUSxCA8gGb_s-Hlh8qTTFUEmS5yNOa8uziV0JHqD3LZ77wO8YHccekZSGvsrtpkMJFMIqkl-PJGIJVWKP4QXnD6so8i9TcoXRnmYmR9AEb1ae-MZSU7Ql-3RKBY6AFS1xEcQgneskDQoCPniv7P6ROx2lTBbwz6v6tEuqKk2_fJQE8GfgjAF3iN7Bnh7qKcY5R6gz9_QJu-wawCO4RPktboBbqOz6SomsVNEdAjkBU'
    },
    {
      id: 2,
      name: 'Organic Carrots',
      farm: 'Sunny Orchard',
      rating: 4,
      price: '$1.99 / bunch',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiwhxymWB3KjauIy5Uv899OE3OHJzOKzZnjjAUZsMmfdkNx7F3HWnNJe1y24LCsl7Jx8hk0npz79PIafvBm2RaWrxkGKt1ReOU3T1bPLiVKdZ6y5rLDnZuj1l0y1wL2GcGbCmW0mtJLImGKa_1HdWSKPcMfQVlH3RlBndJf3Ao6o3MBt2xrsJ-e1ildHm4SFJ6Suo7Gr8KYSYQVgRnp7L0hWJtHgI9P1ubJBPftqfbKfVYiwQ3of84tMWMozB_3xviRzEj5ASLA5A'
    },
    {
      id: 3,
      name: 'Sweet Corn',
      farm: 'Riverbend Agriculture',
      rating: 5,
      price: '$0.50 / ear',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv48_Wn6AWla9q_9DviUS37mr1A0dRzrJbsrIiUT3n2cOh68chSYLTxxFiSSs_UrMF7fkl4nMNoSbPrQTc_k4DXKtl2BdDx6jPCY7ZSMDsNmH0_Ls0FRZHyN-sV4HMo1GulU-WRDRTbtYyG-IGHRZMFgm8AbT2rvjBh0Y__yTfk8oUYWcdL9eUSrjdecHZahR2LzwohvfpBwKobyI5mPxiAYhB3UX1fF-hvJoE8cm0R_hXw3HV0Fzd9PgTTJJmYnRyMZKzkeCQwHs'
    },
    {
      id: 4,
      name: 'Red Bell Peppers',
      farm: 'Green Valley Farms',
      rating: 4.5,
      price: '$2.20 / lb',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1OsTlqZ_CsLUGSubqqsH4GptDoWPjBJcTgkbRwNeDgA706FR__M3ANwTUc9DtTHcchRGnywG2pZsyVwR6vumEg2qujZkNke9NtLrVoI_lPWyentZ-4Njs32xNTgpx3bg80O6k50rB1E71iDjMlk1ESsnsCUoB59yqOY7DzERO9MLyK3VVGf80RLDN2WBPvyQ-2NBIMS5f55qEsWa9gCYKuHwc56HSslfcQhiQRyhqIhwIM8PSdb0-KeBb3reNFfCmkybTvSp0KM4'
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="material-symbols-outlined !text-sm">star</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="material-symbols-outlined !text-sm">star_half</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="material-symbols-outlined !text-sm">star_border</span>);
    }

    return stars;
  };

  const handleFilterClick = (filter) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden pb-24 font-display bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-border-light dark:border-border-dark">
        <div className="text-text-light dark:text-text-dark flex size-12 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined">search</span>
        </div>
        <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Marketplace
        </h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-text-light dark:text-text-dark gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-background-light dark:bg-background-dark">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div className="text-primary flex border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark items-center justify-center pl-4 rounded-l-xl border-r-0">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark h-full placeholder:text-subtext-light dark:placeholder:text-subtext-dark px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              placeholder="Search for produce, farms, or buyers"
            />
          </div>
        </label>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 px-4 py-1 overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => handleFilterClick('category')}
          className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-2 ${
            activeFilters.category ? 'bg-primary text-white' : 'bg-primary/20 dark:bg-primary/30 text-primary'
          }`}
        >
          <p className="text-sm font-medium leading-normal">Category</p>
          <div className={activeFilters.category ? 'text-white' : 'text-primary'}>
            <span className="material-symbols-outlined text-base">arrow_drop_down</span>
          </div>
        </button>
        <button
          onClick={() => handleFilterClick('location')}
          className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border pl-4 pr-2 ${
            activeFilters.location ? 'bg-primary text-white border-primary' : 'bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark text-text-light dark:text-text-dark'
          }`}
        >
          <p className="text-sm font-medium leading-normal">Location</p>
          <div className={activeFilters.location ? 'text-white' : 'text-text-light dark:text-text-dark'}>
            <span className="material-symbols-outlined text-base">arrow_drop_down</span>
          </div>
        </button>
        <button
          onClick={() => handleFilterClick('price')}
          className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border pl-4 pr-2 ${
            activeFilters.price ? 'bg-primary text-white border-primary' : 'bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark text-text-light dark:text-text-dark'
          }`}
        >
          <p className="text-sm font-medium leading-normal">Price</p>
          <div className={activeFilters.price ? 'text-white' : 'text-text-light dark:text-text-dark'}>
            <span className="material-symbols-outlined text-base">arrow_drop_down</span>
          </div>
        </button>
        <button
          onClick={() => handleFilterClick('organic')}
          className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border pl-4 pr-2 ${
            activeFilters.organic ? 'bg-primary text-white border-primary' : 'bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark text-text-light dark:text-text-dark'
          }`}
        >
          <p className="text-sm font-medium leading-normal">Organic</p>
          <div className={activeFilters.organic ? 'text-white' : 'text-text-light dark:text-text-dark'}>
            <span className="material-symbols-outlined text-base">arrow_drop_down</span>
          </div>
        </button>
      </div>

      {/* Carousel */}
      <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-4">
        <div className="flex items-stretch px-4 gap-3">
          {featuredItems.map((item) => (
            <div key={item.id} className="flex h-full flex-1 flex-col gap-3 rounded-xl min-w-60 bg-card-light dark:bg-card-dark p-3 border border-border-light dark:border-border-dark">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                style={{ backgroundImage: `url("${item.image}")` }}
              ></div>
              <div>
                <p className="text-secondary text-sm font-bold leading-normal tracking-wide uppercase">{item.title}</p>
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Listing Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col gap-3 pb-3 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark overflow-hidden">
            <div className="relative w-full bg-center bg-no-repeat aspect-square bg-cover" style={{ backgroundImage: `url("${product.image}")` }}>
              <button className="absolute bottom-2 right-2 flex items-center justify-center size-8 rounded-full bg-primary text-white">
                <span className="material-symbols-outlined text-xl">add</span>
              </button>
            </div>
            <div className="px-3">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">{product.name}</p>
              <p className="text-subtext-light dark:text-subtext-dark text-sm font-normal leading-normal">{product.farm}</p>
              <div className="flex items-center gap-1 text-secondary mt-1">
                {renderStars(product.rating)}
              </div>
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal mt-1">{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-text-light shadow-lg">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 flex h-20 items-center justify-around border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark/80 backdrop-blur-sm">
        <a className="flex flex-col items-center gap-1 text-subtext-light dark:text-subtext-dark" href="home.html">
          <span className="material-symbols-outlined">home</span>
          <span className="text-xs">Home</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-primary" href="#">
          <span className="material-symbols-outlined">storefront</span>
          <span className="text-xs font-bold">Market</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-subtext-light dark:text-subtext-dark" href="#">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-xs">Orders</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-subtext-light dark:text-subtext-dark" href="#">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="text-xs">Messages</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-subtext-light dark:text-subtext-dark" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="text-xs">Profile</span>
        </a>
      </div>
    </div>
  );
};

export default Market;
