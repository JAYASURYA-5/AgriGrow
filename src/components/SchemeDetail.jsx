import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Sample Schemes Data with IDs
const schemesData = [
  {
    id: 1,
    name: 'PM Fasal Bima Yojana',
    category: 'Insurance',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    description: 'Pradhan Mantri Fasal Bima Yojana provides comprehensive crop insurance coverage to farmers.',
    fullDetails: `The PM Fasal Bima Yojana is a comprehensive crop insurance scheme aimed at providing financial support to farmers in case of failure of crops due to natural calamities, pests, and diseases.

Key Features:
• Premium: 2% for Kharif, 1.5% for Rabi, 5% for horticulture crops
• Coverage: Prevents crop loss from natural hazards, pests, and diseases
• Claim Settlement: Fast claim settlement process
• Enrollment: Available during the applicable season

Eligibility:
• All cultivators (landowners and tenant farmers)
• Grows notified crops in insured villages
• Has insurable interest in the crop

Benefits:
• Protects against crop loss due to natural calamities
• Ensures continuity in farm operations
• Supports farmer financial stability
• Helps access credit at favorable rates

How to Enroll:
1. Contact your nearest bank or agricultural department
2. Submit required documents and land records
3. Pay the applicable premium
4. Receive insurance certificate within 7-10 days`,
    eligibility: 'All farmers (landowners & tenant farmers)',
    benefits: 'Comprehensive crop insurance coverage',
    link: 'https://pmfby.gov.in'
  },
  {
    id: 2,
    name: 'Soil Health Card Scheme',
    category: 'Soil Management',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    description: 'Provides soil testing facilities to improve soil quality and enhance crop productivity.',
    fullDetails: `Soil Health Card Scheme is designed to promote soil testing and enable farmers to make informed decisions about soil nutrient management.

Objectives:
• Promote soil testing and nutrient management awareness
• Improve soil fertility and productivity
• Enhance crop yield through balanced fertilizer use
• Reduce fertilizer costs through scientific approach

Key Features:
• Free soil testing to farmers
• Personalized recommendations for each field
• Digital Soil Health Cards for record keeping
• Training on soil management practices

Coverage:
• All agricultural soils
• Multiple crops and farming systems
• Nutrient status assessment
• Customized recommendations per farm

Implementation:
1. Visit nearest soil testing laboratory
2. Provide soil samples from your field
3. Receive comprehensive soil health report
4. Get fertilizer recommendations specific to your soil
5. Implement recommendations for better yields

Expected Benefits:
• Increased crop productivity (10-25% improvement)
• Reduced fertilizer costs
• Improved soil fertility over time
• Sustainable farming practices
• Better crop quality and market value`,
    eligibility: 'All farmers',
    benefits: 'Free soil testing & personalized recommendations',
    link: 'https://soilhealth.dac.gov.in'
  },
  {
    id: 3,
    name: 'Pradhan Mantri Krishi Sinchayee Yojana',
    category: 'Irrigation',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=800&q=80',
    description: 'Provides financial assistance for irrigation infrastructure development.',
    fullDetails: `Pradhan Mantri Krishi Sinchayee Yojana aims to improve water use efficiency and agricultural productivity through better irrigation infrastructure.

Mission: "Per Drop More Crop"

Components:
1. Command Area Development (CAD)
   • On-farm water management systems
   • Efficient irrigation distribution networks

2. Accelerated Irrigation Benefits Program (AIBP)
   • Completion of abandoned irrigation projects
   • Provides financial assistance to states

3. Watershed Development
   • Water harvesting structures
   • Soil conservation measures

Financial Assistance:
• 100% central funding for command area development
• State contribution for project completion
• Farmer participation in water management

Expected Outcomes:
• Increase irrigated area coverage
• Improve water use efficiency
• Reduce agricultural input costs
• Enhance crop productivity
• Sustainable water resource management

Application Process:
1. Check project availability in your area
2. Contact district agriculture office
3. Submit necessary documents
4. Get approval and financial assistance
5. Monitor project implementation`,
    eligibility: 'Farmers in command areas',
    benefits: 'Improved irrigation infrastructure',
    link: 'https://pmksy.gov.in'
  },
  {
    id: 4,
    name: 'Sub Mission on Agricultural Mechanization',
    category: 'Mechanization',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3649cda?w=800&q=80',
    description: 'Provides subsidies for farm machinery and equipment to increase agricultural productivity.',
    fullDetails: `Sub Mission on Agricultural Mechanization provides financial assistance for farm equipment, machinery, and hiring services.

Objective: Promote mechanization to increase agricultural productivity and reduce labor costs.

Coverage:
• Manual tools and implements
• Tractor and tractor-mounted implements
• Combine harvesters
• Spray equipment
• Seed drills
• Threshers and other machinery

Subsidy Structure:
• 40-50% subsidy on agricultural machinery
• Additional 10% for SC/ST/women farmers in some states
• Custom hiring services support

Categories:
1. Individual Farmers
   • Direct purchase of machinery
   • 40-50% subsidy on approved equipment

2. Farmer Groups & Cooperatives
   • Higher subsidy rates
   • Equipment for custom hiring
   • Common machinery centers

3. Custom Hiring Service Centers
   • Machinery hire services for smallholders
   • Regular income generation
   • Promote mechanization in small farms

Benefits:
• Reduced farm operation costs
• Increased productivity per hectare
• Reduced drudgery, especially for women
• Faster planting and harvesting
• Better quality of produce

How to Apply:
1. Identify required machinery
2. Get quotation from registered machinery dealer
3. Submit application to district agriculture office
4. Get verification and approval
5. Purchase machinery from authorized dealer
6. Receive subsidy disbursement`,
    eligibility: 'Individual farmers, groups, cooperatives',
    benefits: '40-50% subsidy on farm machinery',
    link: 'https://agricoop.nic.in'
  }
];

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const scheme = schemesData.find(s => s.id === parseInt(id));

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
          <div className="w-full h-96 overflow-hidden">
            <img
              src={scheme.image}
              alt={scheme.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Category & Meta */}
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
                {scheme.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              {scheme.name}
            </h1>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-2">Eligibility</h3>
                <p className="text-blue-700">{scheme.eligibility}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg">
                <h3 className="font-bold text-indigo-900 mb-2">Key Benefits</h3>
                <p className="text-indigo-700">{scheme.benefits}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {scheme.description}
            </p>

            {/* Full Details */}
            <div className="bg-gray-50 p-8 rounded-lg mb-8 whitespace-pre-wrap text-gray-700 leading-relaxed">
              {scheme.fullDetails}
            </div>

            {/* Apply Button */}
            <div className="border-t border-gray-200 pt-8">
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                <span>Visit Official Portal</span>
                <span className="material-symbols-outlined">open_in_new</span>
              </a>
            </div>

            {/* Related Schemes */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Schemes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schemesData
                  .filter(s => s.category === scheme.category && s.id !== scheme.id)
                  .slice(0, 2)
                  .map(relScheme => (
                    <div
                      key={relScheme.id}
                      onClick={() => window.location.href = `/scheme/${relScheme.id}`}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 cursor-pointer hover:shadow-md transition"
                    >
                      <h4 className="font-bold text-gray-900 line-clamp-2 hover:text-blue-600">
                        {relScheme.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-2">
                        {relScheme.category}
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
