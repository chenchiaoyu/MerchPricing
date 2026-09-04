import { ProductItem } from '../types';

export interface MerchandisePreset {
  id: string;
  name: string;
  category: string;
  defaultQuantity: number;
  defaultBaseCost: number;
  defaultPackagingCost: number;
  defaultSampleCost: number;
  defaultShippingCost: number;
  defaultTargetMargin: number;
  defaultProductionDays: number;
  description: string;
  iconName: string;
}

export const MERCHANDISE_PRESETS: MerchandisePreset[] = [
  {
    id: 'acrylic-stand',
    name: '雙層壓克力立牌 (約8-10cm)',
    category: '壓克力周邊',
    defaultQuantity: 50,
    defaultBaseCost: 45,
    defaultPackagingCost: 4,
    defaultSampleCost: 300,
    defaultShippingCost: 3,
    defaultTargetMargin: 50,
    defaultProductionDays: 14,
    description: '雙面夾層高透壓克力，附彩色底座與插槽',
    iconName: 'Sparkles',
  },
  {
    id: 'tin-badge',
    name: '鐳射雙閃胸章 / 馬口鐵徽章 (58mm)',
    category: '徽章周邊',
    defaultQuantity: 100,
    defaultBaseCost: 16,
    defaultPackagingCost: 2,
    defaultSampleCost: 150,
    defaultShippingCost: 1.5,
    defaultTargetMargin: 55,
    defaultProductionDays: 10,
    description: '細閃覆膜、安全別針，展場熱門百元找零小物',
    iconName: 'Award',
  },
  {
    id: 'acrylic-keychain',
    name: '雷射吊飾 / 流沙鑰匙圈 (6cm)',
    category: '壓克力周邊',
    defaultQuantity: 60,
    defaultBaseCost: 32,
    defaultPackagingCost: 3,
    defaultSampleCost: 200,
    defaultShippingCost: 2,
    defaultTargetMargin: 50,
    defaultProductionDays: 12,
    description: '滴膠工藝或星幻膜，附 D 字扣或造型愛心扣',
    iconName: 'Key',
  },
  {
    id: 'canvas-bag',
    name: '純棉厚磅帆布托特包 (單色網印)',
    category: '布藝周邊',
    defaultQuantity: 30,
    defaultBaseCost: 110,
    defaultPackagingCost: 6,
    defaultSampleCost: 500,
    defaultShippingCost: 8,
    defaultTargetMargin: 45,
    defaultProductionDays: 20,
    description: '12安重磅純棉，可放 A4 筆電或手提',
    iconName: 'ShoppingBag',
  },
  {
    id: 'shikishi-card',
    name: '燙金收藏色紙 / 明信片組',
    category: '紙本印刷',
    defaultQuantity: 80,
    defaultBaseCost: 22,
    defaultPackagingCost: 3,
    defaultSampleCost: 300,
    defaultShippingCost: 2,
    defaultTargetMargin: 60,
    defaultProductionDays: 8,
    description: '包邊金箔工藝，高磅數厚板色紙',
    iconName: 'Image',
  },
  {
    id: 'sticker-pack',
    name: '造型刀模貼紙包 (5入組)',
    category: '文具貼紙',
    defaultQuantity: 100,
    defaultBaseCost: 14,
    defaultPackagingCost: 2.5,
    defaultSampleCost: 150,
    defaultShippingCost: 1,
    defaultTargetMargin: 65,
    defaultProductionDays: 7,
    description: '防水抗 UV 霧面磨砂，附自黏袋與裝飾背卡',
    iconName: 'Tag',
  },
];

export const PAYMENT_CHANNELS = [
  { id: 'custom', name: '自訂費率', rate: 2.5, fixed: 0, description: '自訂金流抽成與手續費' },
  { id: 'ecpay', name: '綠界科技 (ECPay)', rate: 2.75, fixed: 0, description: '信用卡通常 2.75%' },
  { id: 'newebpay', name: '藍新金流 (NewebPay)', rate: 2.8, fixed: 0, description: '一般信用卡 2.8%' },
  { id: 'linepay', name: 'LINE Pay 商家', rate: 2.31, fixed: 0, description: 'LINE Pay 官方手續費 2.2% + 營業稅' },
  { id: 'shopee', name: '蝦皮購物平台', rate: 7.5, fixed: 0, description: '成交手續費約 5.5%~8.5% + 金流 2%' },
  { id: 'myship', name: '7-11 賣貨便 (取貨付款)', rate: 0, fixed: 0, description: '免成交抽成，僅買方自付運費' },
  { id: 'event_cash', name: '展場/市集現場現金', rate: 0, fixed: 0, description: '無金流抽成 (0%)' },
];

export interface TaxPreset {
  id: string;
  name: string;
  businessRate: number;
  incomeRate: number;
  taxType: 'inclusive' | 'exclusive';
  description: string;
}

export const TAX_PRESETS: TaxPreset[] = [
  {
    id: 'standard_invoice',
    name: '開立統一發票 (一般營業人 5%)',
    businessRate: 5,
    incomeRate: 0,
    taxType: 'inclusive',
    description: '依法開立二聯/三聯式統一發票，標準營業稅率 5%（商品標價內含）',
  },
  {
    id: 'small_business',
    name: '小規模營業人 (查定課徵 1%)',
    businessRate: 1,
    incomeRate: 0,
    taxType: 'inclusive',
    description: '免開統一發票，由國稅局按季查定課徵 1% 營業稅',
  },
  {
    id: 'exempt',
    name: '個人兼職 / 未達營業稅起徵點 (0%)',
    businessRate: 0,
    incomeRate: 0,
    taxType: 'inclusive',
    description: '個人偶發銷售，或實體貨物月銷售額未達 8 萬元之免稅狀態',
  },
  {
    id: 'company',
    name: '公司行號 (5% 營業稅 + 20% 營所稅)',
    businessRate: 5,
    incomeRate: 20,
    taxType: 'inclusive',
    description: '開立 5% 統一發票，並依年度預估純益提列 20% 營利事業所得稅',
  },
];
