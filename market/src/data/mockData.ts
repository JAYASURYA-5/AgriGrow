import { CommodityData } from '../types';

export const mockWheatData: CommodityData = {
  name: 'Wheat',
  currentPrice: 2540.829,
  currentMonth: '10/2025',
  previousMonth: '09/2025',
  priceChange: -36.71,
  priceChangePercent: -0.01,
  priceData: [
    { month: '10/2025', modalPrice: 2540.83, minPrice: 2465.48, maxPrice: 2599.39, change: -36.71, changePercent: -0.01 },
    { month: '09/2025', modalPrice: 2577.54, minPrice: 2496.01, maxPrice: 2641.01, change: -10.38, changePercent: -0.004 },
    { month: '08/2025', modalPrice: 2587.93, minPrice: 2509.14, maxPrice: 2645.56, change: 59.53, changePercent: 0.023 },
    { month: '07/2025', modalPrice: 2528.40, minPrice: 2442.86, maxPrice: 2600.61, change: 21.91, changePercent: 0.009 },
    { month: '06/2025', modalPrice: 2506.49, minPrice: 2419.55, maxPrice: 2575.83, change: -4.68, changePercent: -0.002 },
    { month: '05/2025', modalPrice: 2511.17, minPrice: 2415.94, maxPrice: 2598.93, change: 21.92, changePercent: 0.009 },
    { month: '04/2025', modalPrice: 2489.25, minPrice: 2387.95, maxPrice: 2650.01, change: -131.46, changePercent: -0.050 },
    { month: '03/2025', modalPrice: 2620.71, minPrice: 2492.10, maxPrice: 2730.62, change: -266.45, changePercent: -0.092 },
    { month: '02/2025', modalPrice: 2887.16, minPrice: 2748.67, maxPrice: 2983.99, change: -28.24, changePercent: -0.010 },
    { month: '01/2025', modalPrice: 2915.40, minPrice: 2800.00, maxPrice: 3000.00, change: 15.40, changePercent: 0.005 },
    { month: '12/2024', modalPrice: 2900.00, minPrice: 2780.00, maxPrice: 2990.00, change: 0, changePercent: 0 },
  ],
};

export const mockJasmineData: CommodityData = {
  name: 'Jasmine',
  currentPrice: 56694.676,
  currentMonth: '10/2025',
  previousMonth: '09/2025',
  priceChange: 7842.35,
  priceChangePercent: 0.16,
  priceData: [
    { month: '10/2025', modalPrice: 56694.68, minPrice: 51326.49, maxPrice: 56701.14, change: 7842.35, changePercent: 0.16 },
    { month: '09/2025', modalPrice: 48852.33, minPrice: 44302.07, maxPrice: 48856.42, change: -984.83, changePercent: -0.02 },
    { month: '08/2025', modalPrice: 49837.16, minPrice: 45808.24, maxPrice: 49850.67, change: 16391.57, changePercent: 0.49 },
    { month: '07/2025', modalPrice: 33445.59, minPrice: 30000.00, maxPrice: 35000.00, change: -5000.00, changePercent: -0.13 },
    { month: '06/2025', modalPrice: 38445.59, minPrice: 35000.00, maxPrice: 40000.00, change: 5000.00, changePercent: 0.15 },
    { month: '05/2025', modalPrice: 33445.59, minPrice: 30000.00, maxPrice: 35000.00, change: -10000.00, changePercent: -0.23 },
    { month: '04/2025', modalPrice: 43445.59, minPrice: 40000.00, maxPrice: 45000.00, change: -20000.00, changePercent: -0.32 },
    { month: '03/2025', modalPrice: 63445.59, minPrice: 60000.00, maxPrice: 65000.00, change: -30000.00, changePercent: -0.32 },
    { month: '02/2025', modalPrice: 93445.59, minPrice: 90000.00, maxPrice: 95000.00, change: -5000.00, changePercent: -0.05 },
    { month: '01/2025', modalPrice: 98445.59, minPrice: 95000.00, maxPrice: 100000.00, change: 5000.00, changePercent: 0.05 },
    { month: '12/2024', modalPrice: 93445.59, minPrice: 90000.00, maxPrice: 95000.00, change: 0, changePercent: 0 },
  ],
};

export const mockTomatoData: CommodityData = {
  name: 'Tomato',
  currentPrice: 1200.5,
  currentMonth: '10/2025',
  previousMonth: '09/2025',
  priceChange: 45.2,
  priceChangePercent: 0.038,
  priceData: [
    { month: '10/2025', modalPrice: 1200.5, minPrice: 1000.0, maxPrice: 1400.0, change: 45.2, changePercent: 0.038 },
    { month: '09/2025', modalPrice: 1155.3, minPrice: 980.0, maxPrice: 1300.0, change: -10.0, changePercent: -0.009 },
    { month: '08/2025', modalPrice: 1165.3, minPrice: 950.0, maxPrice: 1350.0, change: 5.0, changePercent: 0.004 },
  ],
};

export const mockPotatoData: CommodityData = {
  name: 'Potato',
  currentPrice: 820.0,
  currentMonth: '10/2025',
  previousMonth: '09/2025',
  priceChange: -12.5,
  priceChangePercent: -0.015,
  priceData: [
    { month: '10/2025', modalPrice: 820.0, minPrice: 700.0, maxPrice: 920.0, change: -12.5, changePercent: -0.015 },
    { month: '09/2025', modalPrice: 832.5, minPrice: 710.0, maxPrice: 940.0, change: 5.5, changePercent: 0.007 },
    { month: '08/2025', modalPrice: 827.0, minPrice: 700.0, maxPrice: 900.0, change: 2.0, changePercent: 0.002 },
  ],
};
export const categories = ['Cereals', 'Flowers and Herbs', 'Vegetables', 'Fruits', 'Pulses'];
export const commodities = ['Wheat', 'Jasmine', 'Tomato', 'Potato'];
export const states = ['All India', 'Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh'];
export const districts = ['All districts', 'Mumbai', 'Pune', 'Delhi', 'Bangalore'];
export const calculationTypes = ['Monthly', 'Weekly', 'Daily'];

