import React from 'react';
import {
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Percent,
  Layers,
  Sparkles,
  AlertCircle,
  Clock,
  ShieldCheck,
  Tag,
  Coins,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { ProductItem, ProductCalculation, GlobalSettings } from '../types';
import { NumericInput } from './NumericInput';

// Distinct color palette for cards: top accent bar, subtle badge, and icon pill
export const CARD_COLOR_THEMES = [
  {
    id: 'indigo',
    borderTop: 'bg-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentText: 'text-indigo-600',
    lightBg: 'bg-indigo-50/40',
    chipHover: 'hover:bg-indigo-600 hover:text-white hover:border-indigo-600',
  },
  {
    id: 'rose',
    borderTop: 'bg-rose-500',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    accentText: 'text-rose-600',
    lightBg: 'bg-rose-50/40',
    chipHover: 'hover:bg-rose-600 hover:text-white hover:border-rose-600',
  },
  {
    id: 'amber',
    borderTop: 'bg-amber-500',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    accentText: 'text-amber-600',
    lightBg: 'bg-amber-50/40',
    chipHover: 'hover:bg-amber-600 hover:text-white hover:border-amber-600',
  },
  {
    id: 'emerald',
    borderTop: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentText: 'text-emerald-600',
    lightBg: 'bg-emerald-50/40',
    chipHover: 'hover:bg-emerald-600 hover:text-white hover:border-emerald-600',
  },
  {
    id: 'violet',
    borderTop: 'bg-violet-600',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    accentText: 'text-violet-600',
    lightBg: 'bg-violet-50/40',
    chipHover: 'hover:bg-violet-600 hover:text-white hover:border-violet-600',
  },
  {
    id: 'cyan',
    borderTop: 'bg-cyan-500',
    badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    accentText: 'text-cyan-600',
    lightBg: 'bg-cyan-50/40',
    chipHover: 'hover:bg-cyan-600 hover:text-white hover:border-cyan-600',
  },
];

interface ProductCardProps {
  calc: ProductCalculation;
  globalSettings: GlobalSettings;
  colorIndex?: number;
  onUpdate: (id: string, updates: Partial<ProductItem>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  calc,
  globalSettings,
  colorIndex = 0,
  onUpdate,
  onDelete,
  onDuplicate,
}) => {
  const [showCostDetails, setShowCostDetails] = React.useState(false);
  const { product } = calc;

  // Pick color theme by index or category hash
  const theme = CARD_COLOR_THEMES[colorIndex % CARD_COLOR_THEMES.length];

  const handleModeChange = (mode: 'margin' | 'price' | 'profit') => {
    onUpdate(product.id, { pricingMode: mode });
  };

  const handleApplySmartPrice = (price: number) => {
    onUpdate(product.id, {
      pricingMode: 'price',
      customPrice: price,
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative group">
      {/* Visual Accent Top Bar for Color Distinction */}
      <div className={`h-1.5 w-full ${theme.borderTop}`} />

      {/* Card Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Product Title Input */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={product.name}
                onChange={(e) => onUpdate(product.id, { name: e.target.value })}
                className="font-bold text-slate-900 text-lg sm:text-xl bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 outline-hidden w-full transition-colors pb-0.5"
                placeholder="輸入商品名稱"
              />
            </div>

            {/* Category tag & Batch info */}
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <div className="relative">
                <input
                  type="text"
                  value={product.category}
                  onChange={(e) => onUpdate(product.id, { category: e.target.value })}
                  className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-medium uppercase tracking-wider w-24 focus:w-32 transition-all outline-hidden ${theme.badgeBg}`}
                  placeholder="分類標籤"
                />
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/60">
                <span className="text-slate-500">預計產量</span>
                <NumericInput
                  min={1}
                  step={10}
                  allowDecimals={false}
                  value={product.quantity}
                  onChange={(val) => onUpdate(product.id, { quantity: Math.max(1, Math.round(val)) })}
                  className="w-14 px-1 py-0.5 font-mono font-bold text-slate-900 text-center outline-hidden bg-transparent"
                />
                <span className="text-slate-600 font-medium">件</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/60">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">工期</span>
                <NumericInput
                  min={1}
                  step={1}
                  allowDecimals={false}
                  value={product.productionDays}
                  onChange={(val) => onUpdate(product.id, { productionDays: Math.max(1, Math.round(val)) })}
                  className="w-10 px-1 py-0.5 font-mono text-center outline-hidden bg-transparent text-slate-900 font-bold"
                />
                <span className="text-slate-600">天</span>
              </div>
            </div>
          </div>

          {/* Card Actions (Duplicate, Delete) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onDuplicate(product)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              title="複製此品項"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              title="刪除此品項"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Visual Pricing Mode Selector (Rounded Tabs) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              定價策略模式
            </span>
            <span className="text-[10px] text-slate-400">依需求自選驅動方式</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 text-xs">
            <button
              type="button"
              onClick={() => handleModeChange('margin')}
              className={`py-2 px-1 font-semibold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                product.pricingMode === 'margin'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-indigo-600" />
              <span>依目標毛利</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('price')}
              className={`py-2 px-1 font-semibold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                product.pricingMode === 'price'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-rose-500" />
              <span>市場售價反推</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('profit')}
              className={`py-2 px-1 font-semibold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                product.pricingMode === 'profit'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>依總獲利目標</span>
            </button>
          </div>
        </div>

        {/* Pricing Strategy Control Inputs */}
        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70">
          {product.pricingMode === 'margin' && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                <span>設定期望毛利率</span>
                <span className="font-mono text-indigo-600 font-bold text-sm">
                  {product.targetMargin}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="10"
                  max="85"
                  step="1"
                  value={product.targetMargin}
                  onChange={(e) =>
                    onUpdate(product.id, { targetMargin: parseFloat(e.target.value) || 40 })
                  }
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="relative">
                  <NumericInput
                    min={5}
                    max={90}
                    step={1}
                    value={product.targetMargin}
                    onChange={(val) => onUpdate(product.id, { targetMargin: val })}
                    className="w-16 px-2 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg text-center font-bold text-slate-900 shadow-2xs"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-mono">%</span>
                </div>
              </div>
            </div>
          )}

          {product.pricingMode === 'price' && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                <span>指定市場目標售價</span>
                <span className="text-[11px] text-slate-400">即時回推毛利率與純利潤</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">NT$</span>
                <NumericInput
                  min={1}
                  step={5}
                  value={product.customPrice ?? calc.finalUnitPrice}
                  onChange={(val) => onUpdate(product.id, { customPrice: Math.max(1, val) })}
                  className="w-full pl-11 pr-3 py-2 text-base font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden shadow-2xs"
                />
              </div>
            </div>
          )}

          {product.pricingMode === 'profit' && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                <span>此品項全批次預期淨利潤</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  單件約實賺 NT$ {Math.round((product.targetTotalProfit || 0) / product.quantity)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">NT$</span>
                <NumericInput
                  min={0}
                  step={100}
                  value={product.targetTotalProfit}
                  onChange={(val) => onUpdate(product.id, { targetTotalProfit: Math.max(0, val) })}
                  className="w-full pl-11 pr-3 py-2 text-base font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden shadow-2xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Hero Price & Margin Results Box */}
        <div className={`p-5 rounded-2xl border border-slate-200/90 ${theme.lightBg} relative overflow-hidden`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {product.pricingMode === 'price' ? '目前指定售價' : '建議最佳售價'}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm text-slate-400 font-mono">NT$</span>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 font-mono">
                  {calc.finalUnitPrice}
                </h2>
              </div>
              <div className="text-xs text-slate-600 mt-2 flex items-center gap-1.5">
                <span>每件實賺</span>
                <span className="text-emerald-700 font-mono font-bold bg-emerald-100/60 px-2 py-0.5 rounded-md">
                  NT$ {calc.unitNetProfit}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-xs ${
                calc.grossMargin >= 50
                  ? 'bg-emerald-600 text-white'
                  : calc.grossMargin >= 30
                  ? 'bg-indigo-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}>
                毛利 {calc.grossMargin}%
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {calc.grossMargin >= 50 ? '★ 高毛利主力款' : calc.grossMargin >= 30 ? '常態健全利潤' : '薄利衝量款'}
              </span>
            </div>
          </div>

          {/* Quick Smart Pricing Chips */}
          {calc.smartPrices && calc.smartPrices.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-slate-200/70">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>推薦心理好定價 (點擊直接套用)：</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {calc.smartPrices.map((sp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplySmartPrice(sp.price)}
                    className={`px-3 py-1.5 bg-white border border-slate-200 text-xs font-mono text-slate-800 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${theme.chipHover} active:scale-95`}
                  >
                    <span className="font-bold">NT$ {sp.price}</span>
                    <span className="text-slate-400 text-[10px]">({sp.label}・{sp.margin}%)</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Break-Even Progress Bar */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 text-xs shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              損益平衡回本點
            </span>
            <span className="font-mono font-bold text-slate-900">
              賣出 {calc.breakEvenUnits} / {product.quantity} 件 ({calc.breakEvenPercentage}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <div
              style={{ width: `${Math.min(100, calc.breakEvenPercentage)}%` }}
              className={`h-full rounded-full transition-all ${
                calc.breakEvenPercentage <= 50
                  ? 'bg-emerald-500'
                  : calc.breakEvenPercentage <= 75
                  ? 'bg-indigo-500'
                  : 'bg-amber-500'
              }`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>前期製造投入 NT$ {calc.totalProductionCost.toLocaleString()}</span>
            <span className={`font-semibold ${
              calc.breakEvenPercentage <= 50 ? 'text-emerald-600' : 'text-slate-700'
            }`}>
              {calc.breakEvenPercentage <= 50 ? '● 回本門檻低・極安全' : calc.breakEvenPercentage <= 75 ? '▲ 中等銷量門檻' : '■ 需高度完售風險'}
            </span>
          </div>
        </div>

        {/* Warning if any */}
        {calc.warnings.length > 0 && (
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span className="font-medium leading-relaxed">{calc.warnings.join('；')}</span>
          </div>
        )}

        {/* Cost Breakdown Details (Collapsible) */}
        <div>
          <button
            type="button"
            onClick={() => setShowCostDetails(!showCostDetails)}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200/90 hover:border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100/80 transition-all flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>單件總成本拆解：</span>
              <strong className="text-slate-900 font-mono font-bold">NT$ {calc.unitTotalCost}</strong>
              <span className="text-[10px] text-slate-400">(含原料/包裝/金流/抽成)</span>
            </span>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-[11px]">{showCostDetails ? '收合' : '展開編輯'}</span>
              {showCostDetails ? (
                <ChevronUp className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </div>
          </button>

          {showCostDetails && (
            <div className="p-4 mt-2 rounded-xl border border-slate-200 bg-white space-y-4 text-xs shadow-xs">
              <div className="grid grid-cols-2 gap-4">
                {/* Base Cost */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    單件裸品製作費 (元)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">NT$</span>
                    <NumericInput
                      min={0}
                      step={0.5}
                      value={product.baseCost}
                      onChange={(val) => onUpdate(product.id, { baseCost: val })}
                      className="w-full pl-9 pr-2 py-1.5 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 font-mono outline-hidden bg-white shadow-2xs"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">工廠報價之裸件費用</span>
                </div>

                {/* Sample / Mold Cost */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    開版 / 打樣費 (整批總額)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">NT$</span>
                    <NumericInput
                      min={0}
                      step={10}
                      value={product.sampleCost}
                      onChange={(val) => onUpdate(product.id, { sampleCost: val })}
                      className="w-full pl-9 pr-2 py-1.5 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 font-mono outline-hidden bg-white shadow-2xs"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    自動每件攤提 NT$ {calc.unitSampleCost}
                  </span>
                </div>

                {/* Packaging Cost */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    包材耗材費 (單件)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">NT$</span>
                    <NumericInput
                      min={0}
                      step={0.5}
                      value={product.packagingCost}
                      onChange={(val) => onUpdate(product.id, { packagingCost: val })}
                      className="w-full pl-9 pr-2 py-1.5 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 font-mono outline-hidden bg-white shadow-2xs"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">背卡、自黏袋、包裝</span>
                </div>

                {/* Shipping Cost */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    進貨分攤運費 (單件)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">NT$</span>
                    <NumericInput
                      min={0}
                      step={0.5}
                      value={product.shippingCost}
                      onChange={(val) => onUpdate(product.id, { shippingCost: val })}
                      className="w-full pl-9 pr-2 py-1.5 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 font-mono outline-hidden bg-white shadow-2xs"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">廠商寄來之物流分攤</span>
                </div>
              </div>

              {/* Designer Royalty Fee */}
              <div className="pt-3 border-t border-slate-100">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  繪師 / 創作者授權抽成
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={product.designerFeeType}
                    onChange={(e) =>
                      onUpdate(product.id, {
                        designerFeeType: e.target.value as any,
                      })
                    }
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-hidden focus:border-indigo-600"
                  >
                    <option value="none">無 (自行創作 / 買斷版權)</option>
                    <option value="percent_price">售價比例分潤 (%)</option>
                    <option value="fixed_per_unit">每件固定抽成 (元/件)</option>
                    <option value="percent_cost">成本加成抽成 (%)</option>
                  </select>

                  {product.designerFeeType !== 'none' && (
                    <NumericInput
                      min={0}
                      step={product.designerFeeType.includes('percent') ? 1 : 5}
                      value={product.designerFeeValue}
                      onChange={(val) => onUpdate(product.id, { designerFeeValue: val })}
                      placeholder={product.designerFeeType.includes('percent') ? '比例 %' : '金額 NT$'}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono outline-hidden focus:border-indigo-600 shadow-2xs"
                    />
                  )}
                </div>
              </div>

              {/* Payment Fee Custom Overwrite */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`custom-fee-${product.id}`}
                      checked={product.customFee}
                      onChange={(e) => onUpdate(product.id, { customFee: e.target.checked })}
                      className="accent-indigo-600 rounded-md"
                    />
                    <label
                      htmlFor={`custom-fee-${product.id}`}
                      className="text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      此品項單獨指定金流費率
                    </label>
                  </div>
                  <span className="text-xs text-slate-900 font-mono font-semibold">
                    預估手續費 NT$ {calc.unitPaymentFee}/件
                  </span>
                </div>

                {product.customFee && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="relative">
                      <NumericInput
                        min={0}
                        step={0.1}
                        value={product.paymentFeeRate}
                        onChange={(val) => onUpdate(product.id, { paymentFeeRate: val })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs outline-hidden focus:border-indigo-600 shadow-2xs"
                        placeholder="抽成 %"
                      />
                      <span className="absolute right-2.5 top-1.5 text-slate-400 text-xs font-mono">%</span>
                    </div>
                    <div className="relative">
                      <NumericInput
                        min={0}
                        step={1}
                        value={product.paymentFixedFee}
                        onChange={(val) => onUpdate(product.id, { paymentFixedFee: val })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs outline-hidden focus:border-indigo-600 shadow-2xs"
                        placeholder="固定手續費"
                      />
                      <span className="absolute right-2.5 top-1.5 text-slate-400 text-xs font-mono">元</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Batch Totals */}
      <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/70 text-xs flex items-center justify-between text-slate-500">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">完售總營收: </span>
          <span className="font-mono font-bold text-slate-900">
            NT$ {calc.totalRevenue.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">完售總純利: </span>
          <span className="font-mono font-bold text-emerald-600">
            NT$ {calc.totalProfit.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
