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
  Info,
  Eye,
  EyeOff,
  Package,
  Truck,
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
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    accentText: 'text-amber-600',
    lightBg: 'bg-amber-50/40',
    chipHover: 'hover:bg-amber-600 hover:text-white hover:border-amber-600',
  },
  {
    id: 'emerald',
    borderTop: 'bg-emerald-600',
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
    badgeBg: 'bg-cyan-800 text-cyan-800 border-cyan-200',
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
  onOpenGlossary?: (termId?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  calc,
  globalSettings,
  colorIndex = 0,
  onUpdate,
  onDelete,
  onDuplicate,
  onOpenGlossary,
}) => {
  const [showCostDetails, setShowCostDetails] = React.useState(false);
  const { product } = calc;
  const isExcluded = product.enabled === false;

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
    <div
      className={`bg-white border rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative group ${
        isExcluded
          ? 'border-dashed border-slate-300 opacity-85 bg-slate-50/50'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Visual Accent Top Bar for Color Distinction */}
      <div className={`h-1.5 w-full ${isExcluded ? 'bg-slate-300' : theme.borderTop}`} />

      {/* Excluded Notification Banner */}
      {isExcluded && (
        <div className="bg-amber-50/90 border-b border-amber-200/70 px-4 py-2 text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span>此方案已暫時<strong>排除於全場統計</strong>（方便 AB 比對，不影響個別方案試算）</span>
          </div>
          <button
            type="button"
            onClick={() => onUpdate(product.id, { enabled: true })}
            className="text-amber-800 font-bold underline hover:text-amber-950 cursor-pointer shrink-0 ml-2"
          >
            重新納入
          </button>
        </div>
      )}

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
                placeholder="輸入商品或方案名稱"
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
              
              {/* 預計產量 */}
              <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/60">
                <span className="text-slate-500">預計總做</span>
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

              {/* 方案規格：每份件數 */}
              <div
                className="flex items-center gap-1 bg-indigo-50/50 px-2 py-0.5 rounded-lg border border-indigo-100"
                title="每份方案內含幾件單品？例如 1 代表單件，4 代表 4 件組合套組"
              >
                <Package className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-indigo-900 font-medium">每份</span>
                <NumericInput
                  min={1}
                  step={1}
                  allowDecimals={false}
                  value={product.bundleUnits || 1}
                  onChange={(val) => onUpdate(product.id, { bundleUnits: Math.max(1, Math.round(val)) })}
                  className="w-9 px-0.5 py-0.5 font-mono text-center outline-hidden bg-white rounded border border-indigo-200 text-indigo-900 font-bold"
                />
                <span className="text-indigo-800 font-medium">件</span>
                {(product.bundleUnits || 1) > 1 && (
                  <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-bold ml-0.5">
                    共 {calc.totalBundles} 組
                  </span>
                )}
              </div>
              <span className="text-slate-300">•</span>

              {/* 工期 */}
              <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/60">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">工期</span>
                <NumericInput
                  min={1}
                  step={1}
                  allowDecimals={false}
                  value={product.productionDays}
                  onChange={(val) => onUpdate(product.id, { productionDays: Math.max(1, Math.round(val)) })}
                  className="w-9 px-0.5 py-0.5 font-mono text-center outline-hidden bg-transparent text-slate-900 font-bold"
                />
                <span className="text-slate-600">天</span>
              </div>

              {product.freeShipping && (
                <>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>免運（吸收 NT$ {calc.unitShippingSubsidy}）</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card Actions (Eye Toggle, Duplicate, Delete) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* 眼睛按鈕：納入 / 隱藏計算 */}
            <button
              type="button"
              onClick={() => onUpdate(product.id, { enabled: isExcluded ? true : false })}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                !isExcluded
                  ? 'bg-indigo-50/90 border-indigo-200 text-indigo-700 hover:bg-indigo-100 shadow-2xs'
                  : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'
              }`}
              title={
                !isExcluded
                  ? '點擊隱藏此方案（不計入全場財務總計，可來回比對數據）'
                  : '點擊啟用此方案（重新納入全場總計）'
              }
            >
              {!isExcluded ? (
                <>
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline font-bold">計入總計</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline text-slate-600 font-bold">已排除</span>
                </>
              )}
            </button>

            <button
              onClick={() => onDuplicate(product)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              title="複製此方案"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              title="刪除此方案"
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
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 text-xs">
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
              <span>市場售價</span>
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
              <span>總獲利目標</span>
            </button>
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
              <span>目標毛利率</span>
            </button>
          </div>
        </div>

        {/* Pricing Strategy Control Inputs */}
        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70">
          {product.pricingMode === 'price' && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                <span>指定單件基準原價售價</span>
                <span className="text-[11px] text-slate-400">
                  {calc.bundleUnits > 1
                    ? `方案含 ${calc.bundleUnits} 件，原價合計 NT$ ${calc.originalBundlePrice.toLocaleString()}`
                    : '直接指定單件原價'}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">NT$</span>
                <NumericInput
                  min={1}
                  step={5}
                  value={product.customPrice ?? Math.round(calc.originalUnitPrice)}
                  onChange={(val) => onUpdate(product.id, { customPrice: Math.max(1, val) })}
                  className="w-full pl-11 pr-3 py-2 text-base font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden shadow-2xs"
                />
              </div>
            </div>
          )}

          {product.pricingMode === 'profit' && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                <span>此方案全批次預期淨利潤</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  每組約實賺 NT$ {Math.round((product.targetTotalProfit || 0) / calc.totalBundles).toLocaleString()}
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

          {product.pricingMode === 'margin' && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                <span className="flex items-center gap-1">
                  設定期望目標毛利率
                  {onOpenGlossary && (
                    <button
                      type="button"
                      onClick={() => onOpenGlossary('gross-margin')}
                      className="text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                      title="名詞說明：什麼是毛利率？"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  )}
                </span>
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
        </div>

        {/* 方案專屬獨立折價區 (重新設計為簡潔易讀、寬敞無遮蔽的排版) */}
        <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">
                方案專屬促銷折價
              </span>
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100/80 px-1.5 py-0.5 rounded">
                此品項專屬・不影響全場
              </span>
            </div>
            {/* 開關 */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(product.discountEnabled)}
                onChange={(e) =>
                  onUpdate(product.id, {
                    discountEnabled: e.target.checked,
                    discountPercent: e.target.checked ? (product.discountPercent || 10) : 0,
                  })
                }
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
              />
              <span>啟用專屬折價</span>
            </label>
          </div>

          {product.discountEnabled ? (
            <div className="space-y-3 pt-1">
              {/* 原價 ➔ 特惠價 直覺對照橫條 */}
              <div className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400 line-through font-mono">
                    原價 NT$ {calc.originalBundlePrice.toLocaleString()}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-base font-mono font-bold text-emerald-700">
                    折後特惠價 NT$ {calc.finalUnitPrice.toLocaleString()}
                  </span>
                  {calc.discountPercent > 0 && (
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-mono">
                      {calc.discountPercent === 10
                        ? '9折'
                        : calc.discountPercent === 15
                        ? '85折'
                        : calc.discountPercent === 20
                        ? '8折'
                        : calc.discountPercent === 25
                        ? '75折'
                        : `${100 - calc.discountPercent}折`} ({calc.discountPercent}% off)
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-emerald-600 font-mono shrink-0">
                  現省 NT$ {calc.discountSavings.toLocaleString()}
                </div>
              </div>

              {/* 折扣幅度輸入與快捷按鈕列 (充足寬度，數字完整顯示絕不遮擋) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-0.5">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-slate-600 shrink-0">自訂折扣幅度：</span>
                  <div className="relative flex items-center">
                    <NumericInput
                      min={0}
                      max={95}
                      step={1}
                      value={product.discountPercent ?? 10}
                      onChange={(val) =>
                        onUpdate(product.id, {
                          discountEnabled: true,
                          discountPercent: Math.max(0, Math.min(95, val)),
                        })
                      }
                      className="w-24 px-2.5 py-1.5 text-base font-mono font-bold text-indigo-950 bg-white border border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-lg text-center outline-hidden shadow-2xs"
                    />
                    <span className="ml-1.5 text-xs text-indigo-800 font-bold font-mono shrink-0">% off</span>
                  </div>
                </div>

                {/* 快捷折數標籤 */}
                <div className="flex items-center gap-1.5 flex-wrap text-xs flex-1">
                  {[
                    { label: '95折', pct: 5 },
                    { label: '9折', pct: 10 },
                    { label: '85折', pct: 15 },
                    { label: '8折', pct: 20 },
                    { label: '75折', pct: 25 },
                    { label: '7折', pct: 30 },
                  ].map((badge) => (
                    <button
                      key={badge.pct}
                      type="button"
                      onClick={() =>
                        onUpdate(product.id, {
                          discountEnabled: true,
                          discountPercent: badge.pct,
                        })
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        product.discountPercent === badge.pct
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {badge.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate(product.id, {
                        discountEnabled: false,
                        discountPercent: 0,
                      })
                    }
                    className="px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 cursor-pointer ml-auto"
                  >
                    取消折價
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-600 flex items-center justify-between py-0.5">
              <span>
                目前此方案以<strong>原價 NT$ {calc.originalBundlePrice.toLocaleString()}</strong> 銷售（未套用專屬折價）
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdate(product.id, {
                    discountEnabled: true,
                    discountPercent: 10,
                  })
                }
                className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer underline text-xs ml-2"
              >
                + 開啟專屬折價
              </button>
            </div>
          )}
        </div>

        {/* 免運優惠設定區塊 (運費由商家全額吸收) */}
        <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">
                免運優惠設定
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                買家享免運・由商家吸收
              </span>
            </div>
            {/* 開關 */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(product.freeShipping)}
                onChange={(e) =>
                  onUpdate(product.id, {
                    freeShipping: e.target.checked,
                    shippingSubsidy: e.target.checked
                      ? (product.shippingSubsidy !== undefined ? product.shippingSubsidy : 60)
                      : 0,
                  })
                }
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
              />
              <span>提供免運（商家吸收）</span>
            </label>
          </div>

          {product.freeShipping ? (
            <div className="space-y-3 pt-1">
              {/* 免運商家吸收資訊橫條 */}
              <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <span>✓ 買家結帳享免運</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600">
                    由商家每份吸收運費：
                    <strong className="text-rose-600 font-mono font-bold ml-1">
                      NT$ {calc.unitShippingSubsidy}
                    </strong>
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    (批次完售共吸收 NT$ {calc.totalShippingSubsidy.toLocaleString()})
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-500 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/60">
                  已由純利如實扣除，獲利不灌水
                </div>
              </div>

              {/* 商家吸收運費金額與快捷鈕 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 shrink-0">
                    每份吸收金額：
                  </span>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-mono">NT$</span>
                    <NumericInput
                      min={0}
                      step={5}
                      value={product.shippingSubsidy !== undefined ? product.shippingSubsidy : 60}
                      onChange={(val) => onUpdate(product.id, { shippingSubsidy: Math.max(0, val) })}
                      className="w-24 pl-9 pr-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100 outline-hidden shadow-2xs"
                    />
                  </div>
                </div>

                {/* 快捷按鈕 */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { label: '超商常態 $60', val: 60 },
                    { label: '賣貨便優惠 $35', val: 35 },
                    { label: '郵局小包 $40', val: 40 },
                    { label: '便利箱 $80', val: 80 },
                    { label: '黑貓宅配 $100', val: 100 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => onUpdate(product.id, { shippingSubsidy: preset.val })}
                      className={`px-2 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        (product.shippingSubsidy !== undefined ? product.shippingSubsidy : 60) === preset.val
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate(product.id, {
                        freeShipping: false,
                        shippingSubsidy: 0,
                      })
                    }
                    className="px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 cursor-pointer ml-auto"
                  >
                    取消免運
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-600 flex items-center justify-between py-0.5">
              <span>
                目前為<strong>買家自付運費</strong>（或場次現場販售），商家無額外吸收運費。
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdate(product.id, {
                    freeShipping: true,
                    shippingSubsidy: 60,
                  })
                }
                className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer underline text-xs ml-2"
              >
                + 提供免運（由商家吸收）
              </button>
            </div>
          )}
        </div>

        {/* Hero Price & Margin Results Box */}
        <div className={`p-5 rounded-2xl border border-slate-200/90 ${theme.lightBg} relative overflow-hidden`}>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {calc.discountPercent > 0
                    ? '方案促銷特惠售價'
                    : product.pricingMode === 'price'
                    ? '目前指定售價'
                    : '建議最佳售價'}
                </span>
                {calc.bundleUnits > 1 && (
                  <span className="text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded font-bold text-[10px]">
                    {calc.bundleUnits} 件合購方案
                  </span>
                )}
              </div>

              {/* 原價刪除線 (若有折價) */}
              {calc.discountPercent > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-0.5">
                  <span className="line-through">原價 NT$ {calc.originalBundlePrice.toLocaleString()}</span>
                  <span className="text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-bold text-[10px]">
                    省 NT$ {calc.discountSavings.toLocaleString()} ({calc.discountPercent}% off)
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm text-slate-400 font-mono">NT$</span>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 font-mono">
                  {calc.finalUnitPrice.toLocaleString()}
                </h2>
              </div>

              {/* 單件均價 (若為多件組) */}
              {calc.bundleUnits > 1 && (
                <div className="text-xs text-slate-500 font-mono mt-1">
                  平均每件折後約 NT$ {Math.round(calc.finalUnitPrice / calc.bundleUnits).toLocaleString()}
                </div>
              )}

              <div className="text-xs text-slate-600 mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="flex items-center gap-1">
                  {calc.bundleUnits > 1 ? '每組實賺' : '每件實賺'}
                  {onOpenGlossary && (
                    <button
                      type="button"
                      onClick={() => onOpenGlossary('net-profit')}
                      className="text-slate-400 hover:text-emerald-700 cursor-pointer transition-colors"
                      title="名詞說明：什麼是純淨利？"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  )}
                </span>
                <span className="text-emerald-700 font-mono font-bold bg-emerald-100/60 px-2 py-0.5 rounded-md">
                  NT$ {calc.unitNetProfit.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-xs flex items-center gap-1 ${
                calc.grossMargin >= 50
                  ? 'bg-emerald-600 text-white'
                  : calc.grossMargin >= 30
                  ? 'bg-indigo-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}>
                <span>毛利 {calc.grossMargin}%</span>
                {onOpenGlossary && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenGlossary('gross-margin');
                    }}
                    className="opacity-80 hover:opacity-100 cursor-pointer text-white"
                    title="名詞說明：什麼是毛利率？"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                )}
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
              <span>損益平衡回本點</span>
              {onOpenGlossary && (
                <button
                  type="button"
                  onClick={() => onOpenGlossary('bep')}
                  className="text-slate-400 hover:text-emerald-700 cursor-pointer transition-colors"
                  title="名詞說明：什麼是損益平衡點 (BEP)？"
                >
                  <Info className="w-3 h-3" />
                </button>
              )}
            </span>
            <span className="font-mono font-bold text-slate-900">
              {calc.bundleUnits > 1 ? (
                <>
                  賣出 {Math.round(calc.breakEvenUnits / calc.bundleUnits)} / {calc.totalBundles} 組方案 ({calc.breakEvenPercentage}%)
                </>
              ) : (
                <>
                  賣出 {calc.breakEvenUnits} / {product.quantity} 件 ({calc.breakEvenPercentage}%)
                </>
              )}
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
              <span className="text-[10px] text-slate-400">(含製作/打樣攤提/包材/金流與抽成)</span>
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
              {/* 1. 主要製造成本 */}
              <div>
                <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  主要製造成本
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Base Cost */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      單件製作費 (元)
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
                    <span className="text-[10px] text-slate-400">工廠報價之單件印製裸品費</span>
                  </div>

                  {/* Sample / Mold Cost */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      開版打樣費（總額）
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
                    <span className="text-[10px] text-slate-400">背卡、自黏袋、獨立包裝袋</span>
                  </div>
                </div>
              </div>

              {/* 2. 繪師 / 創作者授權抽成 */}
              <div className="pt-3 border-t border-slate-100">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  繪師 / 創作者授權抽成
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                    <option value="percent_profit">依總淨利比例拆成 (%)</option>
                    <option value="fixed_per_unit">每件固定抽成 (元/件)</option>
                    <option value="percent_cost">成本加成抽成 (%)</option>
                  </select>

                  {product.designerFeeType !== 'none' && (
                    <NumericInput
                      min={0}
                      step={product.designerFeeType.includes('percent') ? 1 : 5}
                      value={product.designerFeeValue}
                      onChange={(val) => onUpdate(product.id, { designerFeeValue: val })}
                      placeholder={
                        product.designerFeeType === 'percent_profit'
                          ? '淨利拆成 % (如 20%)'
                          : product.designerFeeType.includes('percent')
                          ? '比例 %'
                          : '金額 NT$'
                      }
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

              {/* 商家吸收運費支出 (若有開啟免運) */}
              {product.freeShipping && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>商家吸收免運支出 (每份)</span>
                  </span>
                  <span className="font-mono font-bold text-rose-600">
                    - NT$ {calc.unitShippingSubsidy}
                  </span>
                </div>
              )}
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
