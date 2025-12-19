import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Community = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [showAllSubscriptions, setShowAllSubscriptions] = useState(false);

  const videos = [
    {
      id: 1,
      title: "Optimizing Irrigation with IoT Sensors for Maximum Yield",
      channel: "Arigrow Experts",
      views: "12K views",
      time: "2 weeks ago",
      duration: "12:45",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBp7nnPmLFtPF4HsoiUUAoTEaqRAODlNYj1ObivyIiZW0uSLiWuM2fcQNR3RuS3Fns5jP2dNvBx9ZKRqWVCxULIRJC5SmD88upz0A1nWm5F-hvUOo753vro3NuB70lpnGsxyfJxMRnQ5vow5Hc-WrOCeXG679HnP_niK7-WbIiuEPYPVVsYdbFWr5L2El9zFwFgx97dwQNi4mS9LCN2slTFJWPYPFtSws3az97lQH00IxaC1c9EuwBCoWL_PMVXQCmjEsdrDCKfvbw",
      channelAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzpV_JA-raW3SQ_h3PNOFVOERKdLqu-6GwYXuim7P16rIW9WLwox6zdpRk2aip_csHR0OzpajY6gZbIfCZ9FK8X3ba9Z3TXkNp7F_4KfVsXer5O7ee0wG_kboQG4ahqeKIeJvNYMRqcgv2x05rzaG7riB-vheRV9QqKjtlaTFC_kx8NoO4QEfgvbgIlY8y_6trBK4e0IIA2sec6yEsxF8o_IWxO5NK2jmO7Usbiuf-W4ycsKahq9l_VAYCF2dGhRguzxryw-H9Tyw",
      keywords: "irrigation,iot,sensors,yield"
    },
    {
      id: 2,
      title: "Using Drones for Crop Monitoring: A Step-by-Step Guide",
      channel: "Arigrow Experts",
      views: "9.8K views",
      time: "4 days ago",
      duration: "15:03",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7CESAfUMJhb8dbjGsykq9L59C8KpPZPGkVUKcdaxTcoBgq795UD6e8JJ5hP9LqWelBIzDn3B23h3YdevqqgxO_IyjxcqBObP47nairT9uluHA-j20MwbMfpOYQhuKwYnDjFLC9Ritaj0VtBo5sHrN-PSiXgoF6XILmzY7SR_q9EtBqcxLKE6KxCmPRuEzvbzr8QAMrY_sanMjNuEmIujXIAzXBzbq9OOj5ROx9zqJ_SQI3ndpG9rid2rk6wgNxvEYuxTqoREqNVg",
      channelAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqa8fPPLQALaTOQWeXyWkQniAoSxKuSzeub3oDDJfSVMWmAwSujWeaBrfcIvBYaK--mrvEgnr43uisREm-5nROOQdZ8XOD_SZ_WVHaSzyUK4yzLB7agErDgoyiC31_OdkAoq7m-XRbBgZh5eoNlI_8i8DHBJGxcoD7KMadcyWW44spMoPJWyy9p1iOv2s-Dp7wXPg8GoIAv4ziruaD4GY-qWsYzmQMU0Q0w_DcHxziBC1D2tqHfD3oKfh6QjQBQl31qctzSCuQ80Q",
      keywords: "drone,monitoring,crop,guide"
    }
  ];

  const subscriptions = [
    { name: "Arigrow Experts", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzpV_JA-raW3SQ_h3PNOFVOERKdLqu-6GwYXuim7P16rIW9WLwox6zdpRk2aip_csHR0OzpajY6gZbIfCZ9FK8X3ba9Z3TXkNp7F_4KfVsXer5O7ee0wG_kboQG4ahqeKIeJvNYMRqcgv2x05rzaG7riB-vheRV9QqKjtlaTFC_kx8NoO4QEfgvbgIlY8y_6trBK4e0IIA2sec6yEsxF8o_IWxO5NK2jmO7Usbiuf-W4ycsKahq9l_VAYCF2dGhRguzxryw-H9Tyw", active: true },
    { name: "FarmTech Tomorrow", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1kj8vLCIL0pOyweJK5RcQ65Hzey7Q8xjhQiB5-6dsr6o7AOy_1DS5XMzbL77QEIUcAFkZA-E6odu2qHwZ7VJ0RS0fZGH9v0UNR7LkY5w0-7dMTIczaSmmxopYDD5rrjHxFlArt47ZLR2jY-pdN7beNRhdu1HCoLbMNDUgbi8Vv0BGjBPADIb6v16UfSNfD5F90sdZIF1Mpmkzk3CcnUwtO-SGGM-79_ZhvsaHNX5eZeL-zJbIV7BOXJvCDxDr1yA5JYlL_MRY5B4", active: false },
    { name: "The Digital Farmer", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqa8fPPLQALaTOQWeXyWkQniAoSxKuSzeub3oDDJfSVMWmAwSujWeaBrfcIvBYaK--mrvEgnr43uisREm-5nROOQdZ8XOD_SZ_WVHaSzyUK4yzLB7agErDgoyiC31_OdkAoq7m-XRbBgZh5eoNlI_8i8DHBJGxcoD7KMadcyWW44spMoPJWyy9p1iOv2s-Dp7wXPg8GoIAv4ziruaD4GY-qWsYzmQMU0Q0w_DcHxziBC1D2tqHfD3oKfh6QjQBQl31qctzSCuQ80Q", active: true },
    { name: "AgriInnovate Now", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7Y3eFQnm2K6-oQO91LuBCNvcM9wxNmUXM9ae3wVLw3J978joIRBh_NOyWYhAiiyx-b8af7IjcIYVYhDavuFm-_3DAIJtz4sRAp_wAKYTQpajJ3Dm8gCFly4cCOf4Xqlmk4fUvJfCQQvwrHieYrttIeUBlHMvB9kv-Y-nBYP_y0UjEPiNrRCbNgsPoASsP9uabOn5i6VVAlcoYU8bcgFROnRZnU4pDMW2T97Jih5Tvx4aOBCiuBc4tjvrbQEBV8x_SJrPFW7t85Gw", active: false },
    { name: "Soil Sensei", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlvZQAXKAumwkGXvw1BrB_BoNpAFYBm_bpIs04dXY7JW8ZjbWfmfyBIbQUJ3c6xwi6rDu2YTq_sBQGXxSD3YiPhvRB_4IE-mb8_YXZLxUQj5WC9mu6CilmZYUA_gu3_oULRZNWYSaUZA7BZxUuycX0W0N2XvxTpZtrZ_ECqX9AxX_PgTqw9PrUZ7RZzf_Fw3pt9TBFOw_GLyuGVPGC7VEMnSfsj66xf74KNbO12r8wNwUSqtyjmGVjfZhp1mmrv2fB4-fJh9L28WA", active: false }
  ];

  const shorts = [
    { id: "soil-test-1", title: "Quick Tip: Soil Testing", views: "15K views", thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlvZQAXKAumwkGXvw1BrB_BoNpAFYBm_bpIs04dXY7JW8ZjbWfmfyBIbQUJ3c6xwi6rDu2YTq_sBQGXxSD3YiPhvRB_4IE-mb8_YXZLxUQj5WC9mu6CilmZYUA_gu3_oULRZNWYSaUZA7BZxUuycX0W0N2XvxTpZtrZ_ECqX9AxX_PgTqw9PrUZ7RZzf_Fw3pt9TBFOw_GLyuGVPGC7VEMnSfsj66xf74KNbO12r8wNwUSqtyjmGVjfZhp1mmrv2fB4-fJh9L28WA" },
    { id: "sustainable-farming-1", title: "5 Sustainable Farming Tips", views: "24K views", thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAggXxMV0u477f_vu_rnLJc8YEfhztG_7x9Vd7W3dY3O0_QJgQWEfF1hN5XcXlhM7-ghboNREuLbZkhE37mc1jEZ8uwehbtAd2UkNBbNjyag22o-S4mA01wzwXPABtVwJ3juFkUxHndDbRLj3n3UnB7UqxrbcYphl58LpMJUuiRk1Kv_jbjskk8xXw8i-2HIFaBEu1D5Yo0FMf7483rK727Vaarr1hiviG-Gr4NqoDWL_rlBqC5FVsA6vbDdP5Lt8koyDXYLdJaCcU" },
    { id: "smart-irrigation-1", title: "Smart Irrigation Quick Guide", views: "19K views", thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzpV_JA-raW3SQ_h3PNOFVOERKdLqu-6GwYXuim7P16rIW9WLwox6zdpRk2aip_csHR0OzpajY6gZbIfCZ9FK8X3ba9Z3TXkNp7F_4KfVsXer5O7ee0wG_kboQG4ahqeKIeJvNYMRqcgv2x05rzaG7riB-vheRV9QqKjtlaTFC_kx8NoO4QEfgvbgIlY8y_6trBK4e0IIA2sec6yEsxF8o_IWxO5NK2jmO7Usbiuf-W4ycsKahq9l_VAYCF2dGhRguzxryw-H9Tyw" },
    { id: "plant-health-1", title: "Plant Health Basics #shorts", views: "31K views", thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7Y3eFQnm2K6-oQO91LuBCNvcM9wxNmUXM9ae3wVLw3J978joIRBh_NOyWYhAiiyx-b8af7IjcIYVYhDavuFm-_3DAIJtz4sRAp_wAKYTQpajJ3Dm8gCFly4cCOf4Xqlmk4fUvJfCQQvwrHieYrttIeUBlHMvB9kv-Y-nBYP_y0UjEPiNrRCbNgsPoASsP9uabOn5i6VVAlcoYU8bcgFROnRZnU4pDMW2T97Jih5Tvx4aOBCiuBc4tjvrbQEBV8x_SJrPFW7t85Gw" },
    { id: "crop-rotation-1", title: "Crop Rotation Made Easy", views: "27K views", thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1kj8vLCIL0pOyweJK5RcQ65Hzey7Q8xjhQiB5-6dsr6o7AOy_1DS5XMzbL77QEIUcAFkZA-E6odu2qHwZ7VJ0RS0fZGH9v0UNR7LkY5w0-7dMTIczaSmmxopYDD5rrjHxFlArt47ZLR2jY-pdN7beNRhdu1HCoLbMNDUgbi8Vv0BGjBPADIb6v16UfSNfD5F90sdZIF1Mpmkzk3CcnUwtO-SGGM-79_ZhvsaHNX5eZeL-zJbIV7BOXJvCDxDr1yA5JYlL_MRY5B4" }
  ];

  const extendedVideos = [
    {
      title: "Advanced Soil Testing: A Complete Guide to Organic Farming",
      channel: "Soil Sensei",
      views: "45K views",
      time: "1 week ago",
      duration: "25:18",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBp7nnPmLFtPF4HsoiUUAoTEaqRAODlNYj1ObivyIiZW0uSLiWuM2fcQNR3RuS3Fns5jP2dNvBx9ZKRqWVCxULIRJC5SmD88upz0A1nWm5F-hvUOo753vro3NuB70lpnGsxyfJxMRnQ5vow5Hc-WrOCeXG679HnP_niK7-WbIiuEPYPVVsYdbFWr5L2El9zFwFgx97dwQNi4mS9LCN2slTFJWPYPFtSws3az97lQH00IxaC1c9EuwBCoWL_PMVXQCmjEsdrDCKfvbw",
      channelAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzpV_JA-raW3SQ_h3PNOFVOERKdLqu-6GwYXuim7P16rIW9WLwox6zdpRk2aip_csHR0OzpajY6gZbIfCZ9FK8X3ba9Z3TXkNp7F_4KfVsXer5O7ee0wG_kboQG4ahqeKIeJvNYMRqcgv2x05rzaG7riB-vheRV9QqKjtlaTFC_kx8NoO4QEfgvbgIlY8y_6trBK4e0IIA2sec6yEsxF8o_IWxO5NK2jmO7Usbiuf-W4ycsKahq9l_VAYCF2dGhRguzxryw-H9Tyw",
      keywords: "soil,farming,organic,testing"
    },
    {
      title: "Mastering Agricultural Drone Mapping and Analysis",
      channel: "FarmTech Tomorrow",
      views: "38K views",
      time: "5 days ago",
      duration: "32:45",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7CESAfUMJhb8dbjGsykq9L59C8KpPZPGkVUKcdaxTcoBgq795UD6e8JJ5hP9LqWelBIzDn3B23h3YdevqqgxO_IyjxcqBObP47nairT9uluHA-j20MwbMfpOYQhuKwYnDjFLC9Ritaj0VtBo5sHrN-PSiXgoF6XILmzY7SR_q9EtBqcxLKE6KxCmPRuEzvbzr8QAMrY_sanMjNuEmIujXIAzXBzbq9OOj5ROx9zqJ_SQI3ndpG9rid2rk6wgNxvEYuxTqoREqNVg",
      channelAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqa8fPPLQALaTOQWeXyWkQniAoSxKuSzeub3oDDJfSVMWmAwSujWeaBrfcIvBYaK--mrvEgnr43uisREm-5nROOQdZ8XOD_SZ_WVHaSzyUK4yzLB7agErDgoyiC31_OdkAoq7m-XRbBgZh5eoNlI_8i8DHBJGxcoD7KMadcyWW44spMoPJWyy9p1iOv2s-Dp7wXPg8GoIAv4ziruaD4GY-qWsYzmQMU0Q0w_DcHxziBC1D2tqHfD3oKfh6QjQBQl31qctzSCuQ80Q",
      keywords: "drone,monitoring,tech,agriculture"
    },
    {
      title: "Smart Irrigation Systems: From Setup to Automation",
      channel: "The Digital Farmer",
      views: "29K views",
      time: "3 days ago",
      duration: "41:15",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0udNnBU3irSif6VWTO1SSqjtAzXe_BZ2pv72mT_rRq0-DiZPNo-2IBOIxNG3rPjv6fV0pR3yigCPNAuOvBBfM_U6xVjw-OiUWc4IiJrpymoUZgpS7PWz3ZLiHVIKpZkYMhtct0wxrn2PUz6IWAtV7rVhIdHlW6gp3NfmsoCaIehhJe_XcYYbHuYzeTXED71spvWmuUdtD_sXqkEMSWbV0C_023IE8Fn7DPgB8RE-50vrG74sum7XyAYnqm5cK8oPZEC6yqZ35kO8",
      channelAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1kj8vLCIL0pOyweJK5RcQ65Hzey7Q8xjhQiB5-6dsr6o7AOy_1DS5XMzbL77QEIUcAFkZA-E6odu2qHwZ7VJ0RS0fZGH9v0UNR7LkY5w0-7dMTIczaSmmxopYDD5rrjHxFlArt47ZLR2jY-pdN7beNRhdu1HCoLbMNDUgbi8Vv0BGjBPADIb6v16UfSNfD5F90sdZIF1Mpmkzk3CcnUwtO-SGGM-79_ZhvsaHNX5eZeL-zJbIV7BOXJvCDxDr1yA5JYlL_MRY5B4",
      keywords: "irrigation,water,smart,sensors"
    }
  ];

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVideos(extendedVideos);
    } else {
      const filtered = extendedVideos.filter(video =>
        video.keywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
  }, [searchQuery]);

  const handleBack = () => {
    navigate('/');
  };

  const handleVideoClick = (video) => {
    // In a real app, this would open a video player modal
    console.log('Playing video:', video.title);
  };

  const handleShortClick = (short) => {
    // In a real app, this would open a short video player
    console.log('Playing short:', short.title);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display group/design-root overflow-x-hidden">
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-border-light dark:border-border-dark">
        <div className="flex size-12 shrink-0 items-center text-text-light dark:text-text-dark -ml-2">
          <button className="p-2 ag-back" onClick={handleBack} aria-label="Back to home">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        </div>
        <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Agri-Video Hub</h2>
        <div className="flex size-12 shrink-0 items-center text-text-light dark:text-text-dark -mr-2">
          <a href="upload.html" className="p-2" aria-label="Upload video">
            <span className="material-symbols-outlined text-2xl">add_circle</span>
          </a>
        </div>
      </div>

      <div className="px-4 py-3 bg-background-light dark:bg-background-dark">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-primary flex border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark items-center justify-center pl-4 rounded-l-lg border-r-0">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark focus:border-primary h-full placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 border-l-0 pl-2 text-base font-normal leading-normal"
              placeholder="Search Arigrow videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </label>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col gap-6 pt-4 pb-6">
          {/* Main Videos */}
          {videos.map((video) => (
            <div key={video.id} className="flex flex-col gap-3">
              <div className="relative w-full aspect-video cursor-pointer" onClick={() => handleVideoClick(video)}>
                <img className="w-full h-full object-cover rounded-xl" src={video.thumbnail} alt={video.title} />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">{video.duration}</div>
              </div>
              <div className="flex items-start gap-3 px-4">
                <img className="w-10 h-10 rounded-full object-cover" src={video.channelAvatar} alt={video.channel} />
                <div className="flex-1">
                  <h3 className="font-bold text-base text-text-light dark:text-text-dark line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{video.channel}  {video.views}  {video.time}</p>
                </div>
                <button className="text-gray-500 dark:text-gray-400 -mr-2">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subscriptions */}
        <div className="py-6 border-y border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between px-4 mb-4">
            <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">Subscriptions</h2>
            <button
              className="text-primary dark:text-accent font-semibold text-sm"
              onClick={() => setShowAllSubscriptions(!showAllSubscriptions)}
            >
              {showAllSubscriptions ? 'Hide' : 'See all'}
            </button>
          </div>
          <div className="flex gap-4 px-4 overflow-x-auto pb-2 -mb-2">
            {subscriptions.slice(0, showAllSubscriptions ? subscriptions.length : 5).map((sub, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-shrink-0 w-20">
                <img className={`w-16 h-16 rounded-full object-cover ${sub.active ? 'border-2 border-primary' : 'border-2 border-transparent'}`} src={sub.avatar} alt={sub.name} />
                <p className="text-xs text-text-light dark:text-text-dark text-center font-medium line-clamp-2">{sub.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shorts */}
        <div className="py-6 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center px-4 mb-4">
            <img alt="Shorts Logo" className="h-6 w-auto mr-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAggXxMV0u477f_vu_rnLJc8YEfhztG_7x9Vd7W3dY3O0_QJgQWEfF1hN5XcXlhM7-ghboNREuLbZkhE37mc1jEZ8uwehbtAd2UkNBbNjyag22o-S4mA01wzwXPABtVwJ3juFkUxHndDbRLj3n3UnB7UqxrbcYphl58LpMJUuiRk1Kv_jbjskk8xXw8i-2HIFaBEu1D5Yo0FMf7483rK727Vaarr1hiviG-Gr4NqoDWL_rlBqC5FVsA6vbDdP5Lt8koyDXYLdJaCcU" />
            <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">Shorts</h2>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto pb-2 -mb-2">
            {shorts.map((short) => (
              <div key={short.id} className="flex-shrink-0 w-40 cursor-pointer" onClick={() => handleShortClick(short)}>
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden">
                  <img className="w-full h-full object-cover" src={short.thumbnail} alt={short.title} />
                  <div className="absolute bottom-0 left-0 p-2 text-white bg-gradient-to-t from-black/60 to-transparent w-full">
                    <h3 className="text-sm font-semibold leading-tight line-clamp-2">{short.title}</h3>
                    <p className="text-xs">{short.views}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extended Learning */}
        <div className="py-6 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between px-4 mb-4">
            <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">Extended Learning</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4" id="long-videos">
            {filteredVideos.map((video, index) => (
              <div key={index} className="flex flex-col gap-2 video-container cursor-pointer" onClick={() => handleVideoClick(video)}>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <img className="w-full h-full object-cover" src={video.thumbnail} alt={video.title} />
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs font-medium px-1.5 py-0.5 rounded">{video.duration}</div>
                </div>
                <div className="flex gap-2 flex-1">
                  <img className="w-8 h-8 rounded-full object-cover flex-shrink-0" src={video.channelAvatar} alt={video.channel} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-text-light dark:text-text-dark line-clamp-2">{video.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{video.channel}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{video.views} • {video.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-10"></div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-background-light/80 dark:border-zinc-800 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
          <button className="flex flex-col items-center gap-1 p-2 text-zinc-600 dark:text-zinc-400">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-xs">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-zinc-600 dark:text-zinc-400">
            <span className="material-symbols-outlined">partly_cloudy_day</span>
            <span className="text-xs">Weather</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-zinc-600 dark:text-zinc-400">
            <span className="material-symbols-outlined">grass</span>
            <span className="text-xs">Crops</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-zinc-600 dark:text-zinc-400">
            <span className="material-symbols-outlined">sensors</span>
            <span className="text-xs">News</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-primary">
            <span className="material-symbols-outlined">video_library</span>
            <span className="text-xs">Community</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Community;
