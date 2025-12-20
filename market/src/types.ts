export interface PriceData {
  month: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  change: number;
  changePercent: number;
}

export interface FilterState {
  category: string;
  commodity: string;
  state: string;
  districts: string;
  startDate: string;
  toDate: string;
  calculationType: string;
}

export interface CommodityData {
  name: string;
  currentPrice: number;
  currentMonth: string;
  previousMonth: string;
  priceChange: number;
  priceChangePercent: number;
  priceData: PriceData[];
}

