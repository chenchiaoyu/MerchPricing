export type PricingMode = 'margin' | 'price' | 'profit';

export type DesignerFeeType = 'none' | 'percent_price' | 'percent_cost' | 'fixed_per_unit';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  quantity: number; // 預計製作數量
  
  // 成本構成
  baseCost: number; // 單件裸品製作成本 (元)
  sampleCost: number; // 打樣 / 開版費 (批次固定，元)
  packagingCost: number; // 單件包裝/背卡/袋子 (元)
  shippingCost: number; // 單件進貨或寄出分攤運費 (元)
  extraCost: number; // 其他雜支/耗材 (單件，元)
  
  // 抽成設定 (可跟隨全域或獨立設定)
  customFee: boolean; // 是否覆蓋全域費率
  paymentFeeRate: number; // 金流抽成 % (如 2.5%)
  paymentFixedFee: number; // 金流每筆固定手續費 (如 0 或 10 元)
  
  designerFeeType: DesignerFeeType;
  designerFeeValue: number; // % 或 元
  
  // 定價控制
  pricingMode: PricingMode;
  targetMargin: number; // 目標毛利率 % (例如 45%)
  targetTotalProfit: number; // 目標總利潤 (元)
  customPrice: number; // 自訂售價 (元)
  
  // 製作備註
  productionDays: number;
  notes?: string;
}

export interface ProductCalculation {
  product: ProductItem;
  
  // 單件成本拆解
  unitBaseCost: number; // 裸品
  unitSampleCost: number; // 打樣開版攤提
  unitPackagingCost: number; // 包裝
  unitShippingCost: number; // 運費
  unitExtraCost: number; // 雜支
  unitDirectCost: number; // 尚未含抽成的單件基礎成本
  
  // 終端售價與抽成
  finalUnitPrice: number; // 建議 / 最終售價
  unitPaymentFee: number; // 金流/通路扣款
  unitDesignerFee: number; // 設計師抽成扣款
  unitTotalCost: number; // 含所有抽成後的總單件成本
  unitNetProfit: number; // 單件淨利
  grossMargin: number; // 實際毛利率 %
  
  // 批次總計
  totalProductionCost: number; // 總投入製造成本 (前期資金)
  totalRevenue: number; // 完售總營業額
  totalProfit: number; // 完售總淨利
  totalFees: number; // 總手續與抽成
  
  // 損益平衡
  breakEvenUnits: number; // 損益平衡需售出件數
  breakEvenPercentage: number; // 損益平衡銷售率 %
  breakEvenRevenue: number; // 保本營業額
  
  // 狀態與警示
  isMarginTargetMet: boolean;
  isLoss: boolean;
  warnings: string[];
  
  // 心理定價推薦
  smartPrices: {
    label: string;
    price: number;
    margin: number;
    profit: number;
  }[];
}

export interface GlobalSettings {
  paymentFeeRate: number; // 預設金流/通路抽成 %
  paymentFixedFee: number; // 預設單筆固定費用
  defaultTargetMargin: number; // 預設目標毛利率 %
  currency: string; // 預設 'NT$'
}

export interface ProjectSummaryData {
  totalItemsCount: number; // 總件數
  totalProductsCount: number; // 幾款商品
  totalUpfrontCost: number; // 總前期投入成本
  totalPotentialRevenue: number; // 總預期營業額
  totalPotentialProfit: number; // 總預期淨利
  overallMargin: number; // 綜合毛利率 %
  overallROI: number; // 投資回報率 ROI %
  averageBreakEvenRate: number; // 平均保本率 %
}
