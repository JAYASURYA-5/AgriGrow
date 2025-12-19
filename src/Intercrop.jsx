import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Intercrop = () => {
  const navigate = useNavigate();
  const [primaryCrop, setPrimaryCrop] = useState('');
  const [landType, setLandType] = useState('');
  const [season, setSeason] = useState('');

  const handleBack = () => {
    navigate('/');
  };

  const suggestions = [
    {
      id: 1,
      title: 'The Three Sisters: Corn, Beans & Squash',
      pattern: 'Planting Pattern: Alternating Rows',
      description: 'A classic combination that improves soil fertility and provides natural pest deterrence.',
      benefits: ['spa', 'bug_report', 'trending_up'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxhQWuVu7qigECaTTsvI2wXRby-E8iETysv55o6BPknPI2sWTlXufygNPYxD5iaggNCcwPjBvpxCvEYmd6wo8Uj8ZR-ldFKS_9y2KND7IT9v_94fZq_x0aQrkk23cds--Yjddn_MUL3zvnj5cA8GhnJp438sRjbeJL4iGSEzUzgsr1YMBT6TlvS_-uCGK2R1a_A6L2xoqvTyjSPzvbD_YYdvLkZ0ivI7bcV_KwQnCm9BsjBVWXHmyDJ0wu_PfTHf6Y8O3GtAn0JGk',
      crops: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC9Asls6UQKoq-c9a-0Xs8xX_HLqwvEg0_MOjMXhI43lGCmLbWs-LWOAjRaEclILvQqme6-4liJNg9TCWmbuLnPJeNfsdhxBQ7GdltCEplq8BuS-VccKojKduqtH5ARuAbyv2Cih1Rjyv2m386U1R1pNDd7IMSVpxgusCQTyQ0mL3aOuTyUkDAIWS9fBqkZ1BKHHM7k0PiZLMxTGqs6y9Z8fstHhSeeuCKYlhpPxihbT9owSLT9AH1sat3v3lYqzmbITKvMfete4OI',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBCv84uC9CS6OwZlBbGGYI__pO4Iap5zqhshp-HRcN5GERDYSKPVpb1U71U_bxwsP4H1RzeayQlpR8cfw8tBdeMUJCfQpIWdM-fdDgiYFUOkTko8Wz1AtGFlplbWr40Nn8BuNFzBwQr0o4dUKq8Asu5tlrCOloBvv2oNv34Sqkn47jQAk8n1oPoNLEU9G_1vRFR08G2pfQHCBlamLS6kKObxnmpRG7RsBXSi7hqEJoljlqVmsUbrObI1YF3qsDEC0huNcvbdVG9brc'
      ]
    },
    {
      id: 2,
      title: 'Tomato & Basil Partnership',
      pattern: 'Planting Pattern: Companion Planting',
      description: 'Basil repels common tomato pests like hornworms and enhances tomato flavor.',
      benefits: ['bug_report', 'restaurant'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFMyJWYcqs-aRmhOZ3JiwjXgNL8TUv8gpQB1aVoMtBvmsD8SycQX1AVUEUJImIGn1Tyi2uZ9FSNriQIOZCvTLz3tJuJUXboy5aHyX33p-rq74yBU8B0L_e5VPIHWFFVbPNP8FFxVgZFHmhcR-R2Chau9owF2V0QQtqSxbjXa31EXEfw9HIixbLazlgt09mGh0R4oLaUK5P1vClBhVmv50VwvnnW9ff4QTWCh12rZsySWRK2zexkvsLQfUD9XHdUYRokhBHAiJVMVw',
      crops: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCN7wqBnEI61aQPpapWevoe1JFjGtY-aFGhVH-_eGOL7UjxsGRtlzwhRDHxNAhNLvWhFz9UCrSBuFC2nklWJUnKov1C2_kOZzMfpY-k4lmL3LzKEkMAd9oq6jXgtzABCwmOysn4VImXlgW9iO1Cmkj8610risPnJJI3uXXCUkwx9rwPoo_hfQ5R76mzeZDCJ80FUnXshr6dnRp7xjnvOBLkhNHEkD_n-Kd1LzXKKRfwxcqEz07lYZc7NDhNiPZjMa-WJDaPsWVLXpc',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDVL-xb6RX1ofqIVu9_XrS7IXzlz7XI4wDReJl0Q0JflZljJuhCBxtkRIAbVar8e0laCFHQ862bGDuRXzdGfIj-Zh9RHRUypfarQfXQ-cYLp9do4XVS3OsyR3AxPII87tPvK0PW6vdlYrxMSzu2xI7ovSMKgfo9P_vZpYXuqXXONMqv2jPN8xg8IC3MkKA_9ANyUczICk3KXOWgotPRJBEgQt4gwkNA7aMaza2OzRqt6H07CbeNsDDAlBxzJY_O04GUdguRCMLtT3U'
      ]
    }
  ];

  const getBenefitTitle = (benefit) => {
    const titles = {
      spa: 'Soil Health',
      bug_report: 'Pest Control',
      trending_up: 'Yield Increase',
      restaurant: 'Flavor Enhancement'
    };
    return titles[benefit] || benefit;
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 p-4 pb-2 backdrop-blur-sm dark:bg-background-dark/80">
        <button
          onClick={handleBack}
          className="flex size-12 shrink-0 items-center justify-center text-text-light-primary dark:text-text-dark-primary"
          aria-label="Back to home"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-light-primary dark:text-text-dark-primary">
          Intercropping Suggestions
        </h1>
        <div className="flex size-12 shrink-0 items-center justify-center"></div>
      </header>

      <main className="flex-grow px-4">
        {/* Headline and Body Text */}
        <div className="pt-5 pb-2">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-text-light-primary dark:text-text-dark-primary">
            AI Intercropping Suggestions
          </h2>
          <p className="pt-1 pb-3 text-base font-normal leading-normal text-text-light-secondary dark:text-dark-secondary">
            Discover optimal crop pairings to boost your farm's health and yield.
          </p>
        </div>

        {/* Chips for Filtering */}
        <div className="flex gap-3 overflow-x-auto py-3">
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 pl-4 pr-3 text-primary dark:bg-card-dark dark:text-text-dark-secondary">
            <p className="text-sm font-medium leading-normal">Primary Crop</p>
            <span className="material-symbols-outlined text-base">expand_more</span>
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 pl-4 pr-3 text-primary dark:bg-card-dark dark:text-text-dark-secondary">
            <p className="text-sm font-medium leading-normal">Land Type</p>
            <span className="material-symbols-outlined text-base">expand_more</span>
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 pl-4 pr-3 text-primary dark:bg-card-dark dark:text-text-dark-secondary">
            <p className="text-sm font-medium leading-normal">Season</p>
            <span className="material-symbols-outlined text-base">expand_more</span>
          </button>
        </div>

        {/* Suggestion Cards */}
        <div className="space-y-4 py-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex flex-col items-stretch justify-start rounded-xl bg-card-light shadow-sm dark:bg-card-dark">
              <div className="relative w-full">
                <div
                  className="aspect-video w-full rounded-t-xl bg-cover bg-center"
                  style={{ backgroundImage: `url('${suggestion.image}')` }}
                ></div>
                <div className="absolute top-3 right-3 flex gap-2">
                  {suggestion.crops.map((crop, index) => (
                    <img
                      key={index}
                      alt={`Crop ${index + 1} icon`}
                      className="h-8 w-8 rounded-full border-2 border-white object-cover"
                      src={crop}
                    />
                  ))}
                </div>
              </div>
              <div className="flex w-full grow flex-col items-stretch justify-center gap-2 p-4">
                <p className="text-sm font-normal leading-normal text-secondary dark:text-text-dark-secondary">
                  {suggestion.pattern}
                </p>
                <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-light-primary dark:text-text-dark-primary">
                  {suggestion.title}
                </h3>
                <p className="text-base font-normal leading-normal text-text-light-secondary dark:text-text-dark-secondary">
                  {suggestion.description}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-primary/20 pt-3 dark:border-text-dark-secondary/20">
                  <div className="flex gap-3">
                    {suggestion.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 text-secondary dark:text-text-dark-secondary"
                        title={getBenefitTitle(benefit)}
                      >
                        <span className="material-symbols-outlined text-lg">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium leading-normal shadow-sm" onClick={() => alert(`${suggestion.title}\n\n${suggestion.description}\n\nBenefits: Better soil fertility, natural pest control, improved yield.`)}>
                    <span className="truncate">View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="sticky bottom-0 flex justify-center p-4">
        <button className="flex h-12 w-full max-w-sm cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-6 text-text-light-primary shadow-lg">
          <span className="material-symbols-outlined">auto_awesome</span>
          <span className="truncate text-base font-bold">Generate New Suggestions</span>
        </button>
      </div>
    </div>
  );
};

export default Intercrop;
