export type PricingMode = 'price' | 'profit' | 'margin';

export type DesignerFeeType = 'none' | 'percent_profit' | 'percent_price' | 'fixed_per_unit' | 'percent_cost';

export type TaxPricingType = 'inclusive' | 'exclusive'; // 含稅價 (內含) | 外加稅 (未稅)

export interface TaxSettings {
  enabled: boolean; // 是否啟用稅務試算
  taxType: TaxPricingType; // 標價模式：含稅（內含）或未稅（外加）
  businessTaxRate: number; // 營業稅率 % (如 5% 統一發票、1% 小規模營業人、0% 個人免稅)
  incomeTaxRate: number; // 預估所得稅/營所稅率 % (如 0%、10%、20%)
  deductInputTax: boolean; // 是否扣抵進項稅額 (原物料/製造採購發票抵扣)
}

export const DEFAULT_TAX_SETTINGS: TaxSettings = {
  enabled: false,
  taxType: 'inclusive',
  businessTaxRate: 5,
  incomeTaxRate: 0,
  deductInputTax: false,
};

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  quantity: number; // 預計製作數量 (總件數)
  
  // 納入/排除全域計算 (眼睛開關，供來回比較)
  enabled?: boolean; // 預設為 true，若為 false 則暫不計入全場總計

  // 售價方案與組合包設定 (例如：4件T恤合購組合)
  bundleUnits?: number; // 每份方案內含幾件 (預設 1，即單件；若輸入 4 則代表 4 件組)

  // 方案專屬單獨折價 (與全場促銷分開)
  discountEnabled?: boolean; // 是否啟用此方案獨立折價
  discountPercent?: number; // 獨立折扣幅度 % (例如 10 代表 10% off / 九折, 15 代表 85折)
  
  // 免運費設定 (買家免運，由商家全額吸收)
  freeShipping?: boolean; // 是否免運 (若為 true，出貨運費由商家吸收)
  shippingSubsidy?: number; // 商家吸收運費金額 (元/件或組，如超商 60 元)
  
  // 主要製造成本
  baseCost: number; // 單件裸品製作成本 (元)
  sampleCost: number; // 打樣 / 開版費 (批次固定總額，元)
  packagingCost: number; // 單件包裝/背卡/自黏袋 (元)

  // 其他成本（運費、工讀人力、雜支等）
  shippingCost: number; // 進貨分攤運費 (單件，元)
  laborCost?: number; // 人力成本 (聘請工讀生、包裝工資等單件分攤，元)
  extraCost: number; // 其他雜支/耗材 (單件，元)
  
  // 抽成設定 (可跟隨全域或獨立設定)
  customFee: boolean; // 是否覆蓋全域費率
  paymentFeeRate: number; // 金流手續費率 % (如 2.5%)
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
  
  // 方案與包裝
  bundleUnits: number; // 方案內含件數 (例如 1 或 4)
  totalBundles: number; // 總方案套數 (quantity / bundleUnits)
  
  // 方案原價與單獨折價
  originalUnitPrice: number; // 單件基準原價
  originalBundlePrice: number; // 方案組合原價 (單件原價 * bundleUnits)
  discountPercent: number; // 此方案獨立折扣幅度 %
  discountSavings: number; // 此方案折讓金額 (省多少)
  
  // 單件成本拆解 (每件單品)
  unitBaseCost: number; // 裸品
  unitSampleCost: number; // 打樣開版攤提
  unitPackagingCost: number; // 包裝背卡
  unitShippingCost: number; // 進貨分攤運費
  unitLaborCost: number; // 工讀與包裝人力
  unitExtraCost: number; // 其他雜支耗材
  unitDirectCost: number; // 尚未含抽成的單件基礎成本
  bundleDirectCost: number; // 一整個方案組合的直接硬成本 (unitDirectCost * bundleUnits)
  
  // 終端售價與抽成 (以每份方案為單位)
  finalUnitPrice: number; // 建議 / 最終實際成交售價 (含方案折價後)
  unitPaymentFee: number; // 每份金流/通路扣款
  unitDesignerFee: number; // 每份創作者/繪師抽成扣款
  isFreeShipping: boolean; // 是否享免運
  unitShippingSubsidy: number; // 商家每份吸收運費 (若免運)
  unitTotalCost: number; // 含所有抽成與商家吸收運費後的總成本 (每份方案)
  unitNetProfit: number; // 每份方案實收淨利 (稅前)
  grossMargin: number; // 實際毛利率 % (以折後售價計算)
  
  // 稅務拆解 (每份方案)
  unitTax: number; // 每份方案預估應納營業稅 (元)
  unitIncomeTax: number; // 每份方案預估所得稅 (元)
  unitNetProfitAfterTax: number; // 每份方案稅後實得純淨利 (元)
  
  // 批次總計
  totalProductionCost: number; // 總投入製造成本 (前期資金)
  totalShippingSubsidy: number; // 批次商家吸收運費總額
  totalRevenue: number; // 完售總營業額
  totalProfit: number; // 完售總淨利 (稅前)
  totalFees: number; // 總手續與抽成
  totalBusinessTax: number; // 完售預估應納營業稅總額
  totalIncomeTax: number; // 完售預估所得稅總額
  totalTax: number; // 完售預估總稅負 (營業稅 + 所得稅)
  totalProfitAfterTax: number; // 完售稅後總純淨利
  
  // 損益平衡
  breakEvenUnits: number; // 損益平衡需售出件數 (或套數)
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

export interface CustomOverheadItem {
  id: string;
  name: string; // 自訂項目名稱，如「攤位租金」、「交通車資」、「住宿費」等
  amount: number; // 費用金額 (元)
  note?: string; // 備註說明
}

export interface OverheadExpenses {
  shippingCost: number; // 進貨分攤運費 (總額)
  laborCost: number; // 人力成本 (總額，如工讀生一日薪資等)
  extraCost: number; // 其他雜支耗材 (總額，如桌布文宣、包材等)
  
  // 自訂其他獨立支出項目 (如攤位費、車資、住宿費等)
  customItemsEnabled?: boolean; // 是否啟用自訂獨立支出項目 (需勾選才會打開)
  customItems?: CustomOverheadItem[];
  
  // 滿額免運費 (由商家全額吸收)
  freeShippingEnabled?: boolean; // 是否啟用滿額免運活動 (需勾選才會打開)
  freeShippingThreshold?: number; // 滿額免運門檻 (例如 1000 元)
  freeShippingPerOrder?: number; // 商家每筆吸收之運費 (例如 60 元)
  freeShippingEstimatedOrders?: number; // 預估滿額免運訂單筆數 (如 20 筆)
  freeShippingCost?: number; // 滿額免運商家預估吸收總額 (元) = 筆數 * 每筆運費
}

export interface GlobalSettings {
  paymentFeeRate: number; // 預設金流/通路抽成 %
  paymentFixedFee: number; // 預設單筆固定費用
  defaultTargetMargin: number; // 預設目標毛利率 %
  defaultShippingSubsidy?: number; // 預設每筆商家吸收運費金額 (元)
  currency: string; // 預設 'NT$'
  taxSettings?: TaxSettings; // 稅務設定 (營業稅與營所稅)
}

export interface ProjectSummaryData {
  totalItemsCount: number; // 總件數
  totalProductsCount: number; // 總規劃款數 (全部)
  activeProductsCount: number; // 實際計入統計之款數
  excludedProductsCount: number; // 暫時排除未計入之款數
  totalProductionCost: number; // 商品本體前期投入成本
  totalOverheadCost: number; // 全場獨立其他支出總額 (運費 + 人力 + 雜支 + 滿額免運吸收)
  totalShippingSubsidy: number; // 全場商家吸收運費總額 (單品免運 + 滿額免運)
  totalUpfrontCost: number; // 總前期投入成本 (商品製造 + 獨立支出)
  totalPotentialRevenue: number; // 總預期營業額
  totalPotentialProfit: number; // 總預期淨利 (稅前，已扣除商品成本、手續費、創作者抽成、商家吸收運費與全場獨立支出)
  overallMargin: number; // 綜合毛利率 %
  overallROI: number; // 投資回報率 ROI %
  averageBreakEvenRate: number; // 平均保本率 %
  
  // 稅務匯總
  taxEnabled: boolean; // 是否啟用稅務估算
  totalBusinessTax: number; // 全場預估營業稅總額
  totalIncomeTax: number; // 全場預估所得稅總額
  totalTax: number; // 全場預估總稅負 (營業稅 + 所得稅)
  totalProfitAfterTax: number; // 完售稅後總純淨利
  effectiveTaxRate: number; // 實質稅負比率 % (總稅負 / 總營收)
}
