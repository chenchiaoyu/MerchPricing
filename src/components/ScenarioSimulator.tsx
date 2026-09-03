import React, { useState } from 'react';
import {
  Sliders,
  TrendingUp,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  PackageCheck,
  CircleDollarSign,
  Boxes,
} from 'lucide-react';
import { ProductCalculation, ProjectSummaryData } from '../types';

interface ScenarioSimulatorProps {
  calculations: ProductCalculation[];
  summary: ProjectSummaryData;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  calculations,
  summary,
}) => {
  const [salesRate, setSalesRate] = useState<number>(80); // 預設 80% 銷量
  const [discountRate, setDiscountRate] = useState<number>(0); // 預設 0% 折扣

  // 計算特定銷售率與折扣下的數據
  const discountMultiplier = (100 - discountRate) / 100;
  const rateRatio = salesRate / 100;

  let simulatedRevenue = 0;
  let simulatedNetProfit = 0;
  const totalUpfront = summary.totalUpfrontCost;

  for (const c of calculations) {
    const soldQty = Math.round(c.product.quantity * rateRatio);
    const effectivePrice = c.finalUnitPrice * discountMultiplier;
    const paymentRate = (c.product.customFee ? c.product.paymentFeeRate : 2.5) / 100;
    const designerFee =
      c.product.designerFeeType === 'percent_price'
        ? effectivePrice * ((c.product.designerFeeValue || 0) / 100)
        : c.unitDesignerFee;

    const feePerUnit = effectivePrice * paymentRate + designerFee;
    const netPerUnit = effectivePrice - feePerUnit;

    const itemRevenue = effectivePrice * soldQty;
    simulatedRevenue += itemRevenue;
    simulatedNetProfit += netPerUnit * soldQty;
  }

  // 實際扣除前期投入總成本
  const finalBottomLine = simulatedNetProfit - totalUpfront;
  const isProfitable = finalBottomLine >= 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
      {/* Simulator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0 mt-0.5">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                SCENARIO SIMULATOR
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              展場與銷售情境動態模擬器
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              拉動滑桿調節銷量比例與套組折扣，即時預演真實底線獲利與庫存安全感
            </p>
          </div>
        </div>

        {/* Quick presets for sell-through */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {[
            { label: '保本線', rate: Math.min(100, Math.round(summary.averageBreakEvenRate)) },
            { label: '50% 常態', rate: 50 },
            { label: '80% 熱銷', rate: 80 },
            { label: '100% 完售', rate: 100 },
          ].map((sc) => (
            <button
              key={sc.label}
              type="button"
              onClick={() => setSalesRate(sc.rate)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95 ${
                salesRate === sc.rate
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slider 1: 預估銷售比率 */}
        <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-indigo-500" />
              預估展場 / 通路銷售率
            </span>
            <span className="font-mono font-bold text-indigo-600 text-sm bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
              {salesRate}% 銷量
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={salesRate}
            onChange={(e) => setSalesRate(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>10% (滯銷)</span>
            <span>50% (常態)</span>
            <span className="font-bold text-slate-600">保本線 ({summary.averageBreakEvenRate}%)</span>
            <span>100% (完售)</span>
          </div>
        </div>

        {/* Slider 2: 展場折扣 / 套組促銷 */}
        <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 flex items-center gap-1.5">
              <CircleDollarSign className="w-4 h-4 text-rose-500" />
              全場套組折扣 / 促銷幅度
            </span>
            <span className="font-mono font-bold text-slate-900 text-sm bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
              {discountRate === 0 ? '原價 (無打折)' : `${100 - discountRate} 折 (-${discountRate}%)`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="5"
            value={discountRate}
            onChange={(e) => setDiscountRate(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>原價 (0%)</span>
            <span>95 折</span>
            <span>90 折</span>
            <span>85 折</span>
            <span>70 折 (特惠)</span>
          </div>
        </div>
      </div>

      {/* Simulation Results Display Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
            SIMULATED UNITS SOLD
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
            {Math.round(summary.totalItemsCount * rateRatio).toLocaleString()}
            <span className="text-xs font-normal text-slate-400 ml-1.5">
              / {summary.totalItemsCount.toLocaleString()} 件
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <Boxes className="w-3.5 h-3.5 text-slate-400" />
            <span>預估庫存：{Math.round(summary.totalItemsCount * (1 - rateRatio)).toLocaleString()} 件</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
            SIMULATED GROSS REVENUE
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
            NT$ {Math.round(simulatedRevenue).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            完售總營收目標：NT$ {summary.totalPotentialRevenue.toLocaleString()}
          </div>
        </div>

        <div
          className={`p-5 rounded-xl border transition-all ${
            isProfitable
              ? 'bg-emerald-50/40 border-emerald-200'
              : 'bg-rose-50/40 border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
              {isProfitable ? '實收純利潤 (入袋)' : '尚未回本資金缺口'}
            </span>
            {isProfitable ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                PROFITABLE
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold">
                BELOW BEP
              </span>
            )}
          </div>
          <div
            className={`text-2xl sm:text-3xl font-bold tracking-tight font-mono ${
              isProfitable ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isProfitable
              ? `+NT$ ${Math.round(finalBottomLine).toLocaleString()}`
              : `-NT$ ${Math.round(Math.abs(finalBottomLine)).toLocaleString()}`}
          </div>
          <div className="text-xs text-slate-600 mt-2">
            {isProfitable ? (
              <span className="text-emerald-700 font-medium">
                ✓ 已順利回本，此銷量下每多賣出 1 件皆純收淨利。
              </span>
            ) : (
              <span className="text-rose-700">
                ⚠ 尚未越過損益平衡點，建議調高定價或提升銷量促銷。
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
