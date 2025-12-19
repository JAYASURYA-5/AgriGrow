import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Desease = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleBack = () => {
    navigate('/');
  };

  const handleTakePhoto = () => {
    // Placeholder for camera functionality
    console.log('Take photo clicked');
  };

  const handleFromGallery = () => {
    // Placeholder for gallery functionality
    console.log('From gallery clicked');
  };

  const handleSaveToLog = () => {
    // Placeholder for save functionality
    console.log('Save to log clicked');
  };

  const handleViewProducts = () => {
    // Placeholder for view products functionality
    console.log('View products clicked');
  };

  const diagnosisData = {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAE8RwD_lHkmZGDenSpuFi27DbgHTeRZ2xXoqR9dldze3T9LwTAUKHikjuBiRuiddOhD8buaTzUcJDXvSn48f6fvF05H5yCdOvcMTjQZnPgoGI8zASwV7WM6XpKQE0SMImM1T7XVdqucXvNbaQwq4KLsVWqN3FHG2QtiVqlwM_CN5GWTwqr7VxnaCMFFeu0A6yOe3AF3EsrKkHb6XMz_25zwu9huo5QyPnviwtB8gX3rIRB6bdIMu_J6wifazSkZlnmraiH07bNiwU",
    disease: "Tomato Late Blight",
    confidence: 95,
    overview: "A destructive disease of tomatoes and potatoes caused by the oomycete Phytophthora infestans. It can spread rapidly in humid conditions, leading to significant crop loss.",
    symptoms: "Dark, water-soaked lesions on leaves, stems, and fruits. White, fuzzy growth on the underside of leaves in humid conditions. Rapid wilting and browning of plant tissues.",
    treatment: "Remove and destroy infected plant material. Apply copper-based fungicides preventively. Improve air circulation and avoid overhead watering. Use resistant varieties when available."
  };

  const historyItems = [
    {
      id: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFwtZsR-Xh4khTjS4ZMgnJ9Z8IafAdSmpW0wHAep0nx-L5yMSTR0KLGvsIo7tMalwQzl2U3NYI3ya--4uQbCBjFHXEJiM7LOAJf511V5DknCoD0PREbiHROUe9TL2FDTcqVPGbjrX8UIH_agbxYkjuuBmz7xFUa_3G2C0byxvNaHEE86h2H7S0ByVZrGcfI68zkNfjdcKnJhy5v2Z1bFy98kLOjMJnL0K3JMXfQnXPo9Pxs1g7XmVd9auO-vpXEM_Ok4Zx9HsUYdU",
      disease: "Corn Gray Leaf Spot",
      date: "July 18, 2024",
      isHealthy: false
    },
    {
      id: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCI4hxnofKwh2yqz1G37RqS2215mVfMzd2KsUtKHv3T8oaroFtC5j0UqX1Xchtc6zsD9AUm5j-AHnMpBwI7Ni8Mru9lqtUT-lSjjdK18HITiekZfVg7wshP3R1DvW3CbNaYfYsfZRdVyqDsIYu-q5VeRjtB7MEAUdJ5l13fKbzI_SgtpfDQ1lGi3ppY5wx90-831WhWLrAc9P_vNX6z9aDlm9TEwbY4Mvb1jsBUuhcm8G8rOeBHB3jOdSI9of-GyKjHn4QEXT2mSNk",
      disease: "Potato Leaf",
      date: "",
      isHealthy: true
    },
    {
      id: 3,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPH-NUy5dNClKHAnsrniWm-JNgpZ1MNmeiPYXqUl9yw-x-fqYcg7Xfhlr9VaMb_cJwu0O5iatk3T49IBTQsUKTb7E86caPIoDORg_pAJaUHy84XLM2_r_pyOz-2K7TsazRlWXZM8eDa1rYsa0AGLMOe1rFwhnPtZteUWKX0rnS6psosZr0hfzqqQiSHVhmLzXcD7Gzxsnc0MGSLr_JF9XfGbVdB_BI1pCOM0TC1K-EdhYlyZfQ76fmsPaXgTRFMINQlKT2EA0xkOU",
      disease: "Grape Powdery Mildew",
      date: "July 15, 2024",
      isHealthy: false
    }
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return diagnosisData.overview;
      case 'symptoms':
        return diagnosisData.symptoms;
      case 'treatment':
        return diagnosisData.treatment;
      default:
        return diagnosisData.overview;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      {/* Top App Bar */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
        <button
          className="flex size-12 shrink-0 items-center justify-center text-text-light dark:text-text-dark ag-back"
          onClick={handleBack}
          aria-label="Back to home"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Crop Disease Detection
        </h1>
        <div className="flex size-12 shrink-0 items-center justify-center"></div>
      </div>

      {/* Headline Text */}
      <h2 className="text-text-light dark:text-text-dark tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">
        Scan your plant to identify diseases
      </h2>

      {/* Image Upload Card */}
      <div className="p-4 @container">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-black/20 p-6 shadow-sm border border-gray-200 dark:border-gray-800 gap-4">
          <p className="text-text-light dark:text-text-dark text-base font-normal leading-normal text-center">
            Upload a clear image of the affected plant part for an instant diagnosis.
          </p>
          <div className="flex w-full items-center justify-center gap-4 pt-2">
            <button
              className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg h-24 bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium leading-normal cursor-pointer"
              onClick={handleTakePhoto}
            >
              <span className="material-symbols-outlined text-3xl">photo_camera</span>
              <span className="truncate">Take a Photo</span>
            </button>
            <button
              className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg h-24 bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium leading-normal cursor-pointer"
              onClick={handleFromGallery}
            >
              <span className="material-symbols-outlined text-3xl">photo_library</span>
              <span className="truncate">From Gallery</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section Header: Diagnosis */}
      <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Diagnosis Results
      </h3>

      {/* Results Display Card */}
      <div className="p-4 @container">
        <div className="flex flex-col items-stretch justify-start rounded-xl bg-white dark:bg-black/20 shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div
            className="w-full bg-center bg-no-repeat aspect-video bg-cover"
            style={{ backgroundImage: `url("${diagnosisData.image}")` }}
            data-alt="Close-up of a tomato leaf with late blight disease"
          ></div>
          <div className="flex w-full grow flex-col items-stretch justify-center gap-4 p-4">
            <div>
              <p className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">
                {diagnosisData.disease}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${diagnosisData.confidence}%` }}
                  ></div>
                </div>
                <p className="text-accent text-sm font-bold leading-normal whitespace-nowrap">
                  {diagnosisData.confidence}% Confidence
                </p>
              </div>
            </div>

            {/* Tabbed Information */}
            <div className="flex flex-col">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-text-light/70 dark:text-text-dark/70'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'symptoms'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-text-light/70 dark:text-text-dark/70'
                  }`}
                  onClick={() => setActiveTab('symptoms')}
                >
                  Symptoms
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'treatment'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-text-light/70 dark:text-text-dark/70'
                  }`}
                  onClick={() => setActiveTab('treatment')}
                >
                  Treatment
                </button>
              </div>
              <div className="pt-3">
                <p className="text-text-light dark:text-text-dark text-base font-normal leading-normal">
                  {getTabContent()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-between pt-2">
              <button
                className="flex min-w-[84px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 dark:bg-primary/30 text-primary text-sm font-medium leading-normal"
                onClick={handleSaveToLog}
              >
                <span className="truncate">Save to Log</span>
              </button>
              <button
                className="flex min-w-[84px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal"
                onClick={handleViewProducts}
              >
                <span className="truncate">View Products</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header: History */}
      <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Recent Scans
      </h3>

      {/* History List */}
      <div className="flex flex-col gap-3 px-4 pb-6">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl bg-white dark:bg-black/20 p-3 shadow-sm border border-gray-200 dark:border-gray-800"
          >
            <div
              className="w-16 h-16 shrink-0 bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
              style={{ backgroundImage: `url("${item.image}")` }}
              data-alt={`Image of ${item.disease}`}
            ></div>
            <div className="flex flex-col flex-1">
              <p className="text-text-light dark:text-text-dark text-base font-bold leading-tight">
                {item.disease}
              </p>
              <p className={`text-sm leading-normal ${
                item.isHealthy
                  ? 'text-success font-medium'
                  : 'text-text-light/70 dark:text-text-dark/70'
              }`}>
                {item.isHealthy ? 'Healthy' : item.date}
              </p>
            </div>
            <span className="material-symbols-outlined text-text-light/50 dark:text-text-dark/50">
              chevron_right
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Desease;
