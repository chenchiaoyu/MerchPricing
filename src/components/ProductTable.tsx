import React from 'react';
import { Trash2, Copy, AlertCircle, Sparkles, Info, Eye, EyeOff } from 'lucide-react';
import { ProductCalculation, ProductItem, GlobalSettings } from '../types';
import { NumericInput } from './NumericInput';
import { CARD_COLOR_THEMES } from './ProductCard';

interface ProductTableProps {
  calculations: ProductCalculation[];
  globalSettings: GlobalSettings;
  onUpdate: (id: string, updates: Partial<ProductItem>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (product: ProductItem) => void;
  onOpenGlossary?: (termId?: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  calculations,
  onUpdate,
  onDelete,
  onDuplicate,
  onOpenGlossary,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
              <th className="py-3 px-4 min-w-[170px]">商品名稱</th>
              <th className="py-3 px-3 text-right">產量</th>
              <th className="py-3 px-3 text-right">單件製作費</th>
              <th className="py-3 px-3 text-right">開版打樣/包材</th>
              <th className="py-3 px-3 text-right">直接製造費</th>
              <th className="py-3 px-3 min-w-[120px]">定價驅動</th>
              <th className="py-3 px-3 text-right">設定參數</th>
              <th className="py-3 px-3 text-right">建議定價</th>
              <th className="py-3 px-3 text-right">
                <span className="inline-flex items-center gap-1 justify-end">
                  單件實賺
                  {onOpenGlossary && (
                    <button
                      type="button"
                      onClick={() => onOpenGlossary('net-profit')}
                      className="text-slate-400 hover:text-emerald-700 cursor-pointer"
                      title="名詞說明：什麼是純淨利？"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  )}
                </span>
              </th>
              <th className="py-3 px-3 text-right">
                <span className="inline-flex items-center gap-1 justify-end">
                  毛利率
                  {onOpenGlossary && (
                    <button
                      type="button"
                      onClick={() => onOpenGlossary('gross-margin')}
                      className="text-slate-400 hover:text-purple-600 cursor-pointer"
                      title="名詞說明：什麼是毛利率？"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  )}
                </span>
              </th>
              <th className="py-3 px-3 text-right">
                <span className="inline-flex items-center gap-1 justify-end">
                  保本件數 (BEP)
                  {onOpenGlossary && (
                    <button
                      type="button"
                      onClick={() => onOpenGlossary('bep')}
                      className="text-slate-400 hover:text-amber-600 cursor-pointer"
                      title="名詞說明：什麼是損益平衡點 (BEP)？"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  )}
                </span>
              </th>
              <th className="py-3 px-3 text-right">預期總淨利</th>
              <th className="py-3 px-3 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {calculations.map((c, idx) => {
              const p = c.product;
              const unitOtherCosts =
                c.unitSampleCost + c.unitPackagingCost + c.unitShippingCost + (c.unitLaborCost || 0) + c.unitExtraCost;
              const theme = CARD_COLOR_THEMES[idx % CARD_COLOR_THEMES.length];

              const isExcluded = p.enabled === false;

              return (
                <tr
                  key={p.id}
                  className={`transition-colors ${
                    isExcluded ? 'bg-slate-100/50 opacity-60' : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Name */}
                  <td className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdate(p.id, { enabled: isExcluded ? true : false })}
                        className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                        title={isExcluded ? '點擊納入全場總計' : '點擊排除不計入總計'}
                      >
                        {!isExcluded ? (
                          <Eye className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${theme.borderTop}`} />
                      <div className="w-full">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => onUpdate(p.id, { name: e.target.value })}
                            className="font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 outline-hidden pb-0.5"
                          />
                          {isExcluded && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-200 text-slate-600 rounded">
                              已排除
                            </span>
                          )}
                          {c.bundleUnits > 1 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded">
                              {c.bundleUnits}件組
                            </span>
                          )}
                          {c.discountPercent > 0 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded">
                              {c.discountPercent}% off
                            </span>
                          )}
                          {p.freeShipping && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded">
                              免運(吸收${c.unitShippingSubsidy})
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {p.category || '周邊'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-3 text-right font-mono">
                    <NumericInput
                      min={1}
                      step={10}
                      allowDecimals={false}
                      value={p.quantity}
                      onChange={(val) =>
                        onUpdate(p.id, { quantity: Math.max(1, Math.round(val)) })
                      }
                      className="w-16 px-1.5 py-1 text-right font-mono font-bold bg-transparent border-b border-slate-200 focus:border-indigo-600 outline-hidden"
                    />
                  </td>

                  {/* Base Cost */}
                  <td className="py-3 px-3 text-right font-mono">
                    <div className="relative inline-block w-20">
                      <NumericInput
                        min={0}
                        step={0.5}
                        value={p.baseCost}
                        onChange={(val) => onUpdate(p.id, { baseCost: val })}
                        className="w-full pl-5 pr-1 py-1 text-right font-mono bg-transparent border-b border-slate-200 focus:border-indigo-600 outline-hidden"
                      />
                      <span className="absolute left-0 top-1 text-[10px] text-slate-400 font-mono">
                        $
                      </span>
                    </div>
                  </td>

                  {/* Other Costs */}
                  <td className="py-3 px-3 text-right font-mono text-slate-500">
                    NT$ {unitOtherCosts.toFixed(1)}
                  </td>

                  {/* Direct Cost */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    NT$ {c.unitDirectCost}
                  </td>

                  {/* Pricing Mode */}
                  <td className="py-3 px-3">
                    <select
                      value={p.pricingMode}
                      onChange={(e) => onUpdate(p.id, { pricingMode: e.target.value as any })}
                      className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-hidden focus:border-indigo-600"
                    >
                      <option value="price">市場售價</option>
                      <option value="profit">總獲利目標</option>
                      <option value="margin">目標毛利率</option>
                    </select>
                  </td>

                  {/* Target Settings Value */}
                  <td className="py-3 px-3 text-right font-mono">
                    {p.pricingMode === 'margin' && (
                      <div className="inline-flex items-center gap-1">
                        <NumericInput
                          min={5}
                          max={90}
                          step={1}
                          value={p.targetMargin}
                          onChange={(val) => onUpdate(p.id, { targetMargin: val })}
                          className="w-14 px-1 py-1 text-right font-mono bg-transparent border-b border-slate-200 focus:border-indigo-600 outline-hidden"
                        />
                        <span className="text-[11px] text-slate-400 font-mono">%</span>
                      </div>
                    )}
                    {p.pricingMode === 'price' && (
                      <div className="inline-flex items-center gap-1">
                        <span className="text-[11px] text-slate-400 font-mono">$</span>
                        <NumericInput
                          min={1}
                          step={5}
                          value={p.customPrice ?? c.finalUnitPrice}
                          onChange={(val) => onUpdate(p.id, { customPrice: Math.max(1, val) })}
                          className="w-16 px-1 py-1 text-right font-mono bg-transparent border-b border-slate-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                    )}
                    {p.pricingMode === 'profit' && (
                      <div className="inline-flex items-center gap-1">
                        <span className="text-[11px] text-slate-400 font-mono">$</span>
                        <NumericInput
                          min={0}
                          step={100}
                          value={p.targetTotalProfit}
                          onChange={(val) => onUpdate(p.id, { targetTotalProfit: Math.max(0, val) })}
                          className="w-20 px-1 py-1 text-right font-mono bg-transparent border-b border-slate-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                    )}
                  </td>

                  {/* Final Price */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-sm text-slate-900">
                    NT$ {c.finalUnitPrice}
                  </td>

                  {/* Net Profit per Unit */}
                  <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-600">
                    +NT$ {c.unitNetProfit}
                  </td>

                  {/* Gross Margin */}
                  <td className="py-3 px-3 text-right font-mono">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full font-mono font-bold text-[10px] tracking-wider uppercase ${
                        c.grossMargin >= 50
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : c.grossMargin >= 30
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {c.grossMargin}%
                    </span>
                  </td>

                  {/* Break Even */}
                  <td className="py-3 px-3 text-right font-mono text-slate-600">
                    {c.breakEvenUnits} 件
                    <span className="text-[10px] text-slate-400 ml-1">({c.breakEvenPercentage}%)</span>
                  </td>

                  {/* Total Profit */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    NT$ {c.totalProfit.toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onUpdate(p.id, { enabled: isExcluded ? true : false })}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          !isExcluded
                            ? 'text-indigo-600 hover:bg-indigo-50'
                            : 'text-slate-400 hover:bg-slate-100'
                        }`}
                        title={isExcluded ? '納入全場總計' : '排除不計入總計'}
                      >
                        {!isExcluded ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => onDuplicate(p)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="複製"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="刪除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
