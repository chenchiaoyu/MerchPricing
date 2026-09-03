import React from 'react';
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  Percent,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { ProjectSummaryData, ProductCalculation } from '../types';

interface ProjectSummaryProps {
  summary: ProjectSummaryData;
  calculations: ProductCalculation[];
  defaultTargetMargin: number;
  onOpenGlossary?: (termId?: string) => void;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({
  summary,
  calculations,
  defaultTargetMargin,
  onOpenGlossary,
}) => {
  const isMarginHealthy = summary.overallMargin >= defaultTargetMargin;
  const totalItems = calculations.length;
  const activeItems = calculations.filter((c) => c.product.enabled !== false).length;
  const excludedCount = totalItems - activeItems;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
      {/* 方案對比提示條 (當有商品被眼睛排除時顯示) */}
      {excludedCount > 0 && (
        <div className="bg-amber-50/80 border-b border-amber-200/70 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">方案對比試算中：</span>
            <span>
              已納入 <strong>{activeItems}</strong> 個方案計入全場總計，已暫時排除 <strong>{excludedCount}</strong> 個方案（不練入計算）。
            </span>
          </div>
          <span className="text-[11px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full font-medium">
            點擊各卡片右上角 👁 眼睛圖示可隨時切換對比
          </span>
        </div>
      )}

      {/* 5 Main Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* 1. 總投入前期成本 */}
        <div className="p-5 sm:p-6 bg-white hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              前期投入資金
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 tracking-tight">
            NT$ {summary.totalUpfrontCost.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5">
            {summary.totalOverheadCost > 0
              ? `製作 $${summary.totalProductionCost.toLocaleString()} + 獨立支出 $${summary.totalOverheadCost.toLocaleString()}`
              : '含單件製作、開版打樣與包材耗材'}
          </div>
        </div>

        {/* 2. 完售總預期營收 */}
        <div className="p-5 sm:p-6 bg-white hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              預期總營業額
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 tracking-tight">
            NT$ {summary.totalPotentialRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
            <Package className="w-3 h-3 text-slate-400" />
            <span>共 {summary.totalProductsCount} 款商品・{summary.totalItemsCount.toLocaleString()} 件產量</span>
          </div>
        </div>

        {/* 3. 完售預期淨利 */}
        <div className="p-5 sm:p-6 bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              完售純淨利潤
              {onOpenGlossary && (
                <button
                  type="button"
                  onClick={() => onOpenGlossary('net-profit')}
                  className="p-0.5 text-emerald-700/60 hover:text-emerald-800 rounded-full hover:bg-emerald-100 transition-colors cursor-pointer"
                  title="名詞說明：什麼是純淨利？"
                >
                  <Info className="w-3 h-3" />
                </button>
              )}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
              <PiggyBank className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-600 tracking-tight">
            NT$ {summary.totalPotentialProfit.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 font-bold text-[10px]">
              ROI 報酬率 {summary.overallROI >= 0 ? `+${summary.overallROI}%` : `${summary.overallROI}%`}
            </span>
            {summary.totalOverheadCost > 0 && (
              <span className="text-[10px] text-slate-400">已扣除獨立支出</span>
            )}
          </div>
        </div>

        {/* 4. 綜合毛利率 */}
        <div className="p-5 sm:p-6 bg-white hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              綜合毛利率
              {onOpenGlossary && (
                <button
                  type="button"
                  onClick={() => onOpenGlossary('gross-margin')}
                  className="p-0.5 text-slate-400 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-colors cursor-pointer"
                  title="名詞說明：什麼是毛利率？"
                >
                  <Info className="w-3 h-3" />
                </button>
              )}
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-mono font-bold tracking-tight ${
                isMarginHealthy ? 'text-slate-900' : 'text-amber-600'
              }`}
            >
              {summary.overallMargin}%
            </span>
            <span className="text-[10px] font-mono text-slate-400">目標 {defaultTargetMargin}%</span>
          </div>
          <div className="text-[11px] mt-1.5 font-medium flex items-center gap-1">
            {isMarginHealthy ? (
              <span className="text-emerald-600 flex items-center gap-1">
                <span>✓</span> 達標毛利率水準
              </span>
            ) : (
              <span className="text-amber-600 flex items-center gap-1">
                <span>⚠</span> 未達預設目標 {defaultTargetMargin}%
              </span>
            )}
          </div>
        </div>

        {/* 5. 平均保本門檻 */}
        <div className="p-5 sm:p-6 col-span-2 md:col-span-1 bg-slate-50/60 hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              平均保本門檻
              {onOpenGlossary && (
                <button
                  type="button"
                  onClick={() => onOpenGlossary('bep')}
                  className="p-0.5 text-slate-400 hover:text-amber-600 rounded-full hover:bg-amber-100/50 transition-colors cursor-pointer"
                  title="名詞說明：什麼是損益平衡點 (BEP) 與保本門檻？"
                >
                  <Info className="w-3 h-3" />
                </button>
              )}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 tracking-tight">
            {summary.averageBreakEvenRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5">
            全場平均售出 <span className="font-mono font-bold text-slate-900">{summary.averageBreakEvenRate}%</span> 即打平總投入
          </div>
        </div>
      </div>
    </div>
  );
};
