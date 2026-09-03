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
} from 'lucide-react';
import { ProjectSummaryData, ProductCalculation } from '../types';

interface ProjectSummaryProps {
  summary: ProjectSummaryData;
  calculations: ProductCalculation[];
  defaultTargetMargin: number;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({
  summary,
  defaultTargetMargin,
}) => {
  const isMarginHealthy = summary.overallMargin >= defaultTargetMargin;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
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
            含開版打樣、裸品與專屬包材
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
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
              <PiggyBank className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-600 tracking-tight">
            NT$ {summary.totalPotentialProfit.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono mt-1.5 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 font-bold text-[10px]">
              ROI 報酬率 +{summary.overallROI}%
            </span>
          </div>
        </div>

        {/* 4. 綜合毛利率 */}
        <div className="p-5 sm:p-6 bg-white hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              綜合毛利率
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
