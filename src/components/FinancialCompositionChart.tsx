import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Coins,
  TrendingUp,
  Percent,
  Wallet,
  Receipt,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ProductCalculation, ProjectSummaryData } from '../types';

interface FinancialCompositionChartProps {
  calculations: ProductCalculation[];
  summary: ProjectSummaryData;
}

export const FinancialCompositionChart: React.FC<FinancialCompositionChartProps> = ({
  calculations,
  summary,
}) => {
  // Aggregate breakdown
  let totalBaseCost = 0;
  let totalSampleCost = 0;
  let totalPackagingCost = 0;
  let totalShippingCost = 0;
  let totalPaymentFee = 0;
  let totalDesignerFee = 0;
  let totalNetProfit = 0;
  let totalRevenue = 0;

  for (const c of calculations) {
    const qty = c.product.quantity;
    totalBaseCost += c.unitBaseCost * qty;
    totalSampleCost += c.unitSampleCost * qty;
    totalPackagingCost += c.unitPackagingCost * qty;
    totalShippingCost += c.unitShippingCost * qty;
    totalPaymentFee += c.unitPaymentFee * qty;
    totalDesignerFee += c.unitDesignerFee * qty;
    totalNetProfit += c.unitNetProfit * qty;
    totalRevenue += c.finalUnitPrice * qty;
  }

  const rawProductionCost = totalBaseCost + totalSampleCost;
  const rawPackagingShipping = totalPackagingCost + totalShippingCost;

  // Donut chart data for the overall pie
  const pieData = [
    {
      name: '純淨利潤 (實拿)',
      value: Math.max(0, Math.round(totalNetProfit)),
      color: '#10B981', // Emerald
      icon: TrendingUp,
      desc: '扣除所有成本與抽成後最終入袋獲利',
    },
    {
      name: '裸品與開版製造',
      value: Math.round(rawProductionCost),
      color: '#3B82F6', // Royal Blue
      icon: Layers,
      desc: '包含工廠裸品壓克力/印製與打樣開版費',
    },
    {
      name: '包材與物流運費',
      value: Math.round(rawPackagingShipping),
      color: '#8B5CF6', // Purple
      icon: Wallet,
      desc: '自黏袋、背卡、飛機盒與進出貨運費',
    },
    {
      name: '金流手續費 (通道)',
      value: Math.round(totalPaymentFee),
      color: '#F59E0B', // Amber
      icon: Receipt,
      desc: '刷卡、綠界、蝦皮等支付平台交易抽成',
    },
  ];

  if (totalDesignerFee > 0) {
    pieData.push({
      name: '設計/繪師抽成',
      value: Math.round(totalDesignerFee),
      color: '#EC4899', // Pink
      icon: Sparkles,
      desc: '授權分潤或固定稿件抽成分紅',
    });
  }

  // Filter out 0 items
  const validPieData = pieData.filter((d) => d.value > 0);

  // Bar chart per-product comparison
  const barData = calculations.map((c, idx) => ({
    name: c.product.name.length > 8 ? c.product.name.slice(0, 8) + '...' : c.product.name,
    fullName: c.product.name,
    利潤: Math.max(0, Math.round(c.unitNetProfit * c.product.quantity)),
    製造原料: Math.round((c.unitBaseCost + c.unitSampleCost) * c.product.quantity),
    包裝物流: Math.round((c.unitPackagingCost + c.unitShippingCost) * c.product.quantity),
    金流與抽成: Math.round((c.unitPaymentFee + c.unitDesignerFee) * c.product.quantity),
    單品售價: c.finalUnitPrice,
    毛利率: c.grossMargin,
  }));

  const profitRate = totalRevenue > 0 ? (totalNetProfit / totalRevenue) * 100 : 0;
  const costRate = totalRevenue > 0 ? ((totalRevenue - totalNetProfit) / totalRevenue) * 100 : 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0 mt-0.5">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                FINANCIAL BREAKDOWN
              </span>
              <span className="text-xs text-slate-400 font-mono">
                全場完售營業額 NT$ {Math.round(totalRevenue).toLocaleString()}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              全品項整體金流與成本利潤組成分析
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              一眼洞悉營收流向：清晰對比製造成本、包材物流、金流抽成與實拿純利佔比
            </p>
          </div>
        </div>

        {/* Highlight Stats Pill */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 self-start md:self-auto">
          <div className="px-3 py-1 bg-white rounded-lg border border-slate-200/60 text-center shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">實拿純利潤</div>
            <div className="text-sm font-bold font-mono text-emerald-600">
              NT$ {Math.round(totalNetProfit).toLocaleString()}
            </div>
          </div>
          <div className="px-3 py-1 bg-white rounded-lg border border-slate-200/60 text-center shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">純利佔比</div>
            <div className="text-sm font-bold font-mono text-emerald-600">
              {profitRate.toFixed(1)}%
            </div>
          </div>
          <div className="px-3 py-1 bg-white rounded-lg border border-slate-200/60 text-center shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">綜合成本率</div>
            <div className="text-sm font-bold font-mono text-slate-700">
              {costRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="w-full h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const val = Number(data.value);
                      const pct = totalRevenue > 0 ? ((val / totalRevenue) * 100).toFixed(1) : 0;
                      return (
                        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl space-y-1">
                          <div className="font-bold flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: data.payload.color }}
                            />
                            {data.name}
                          </div>
                          <div className="font-mono text-sm text-emerald-400">
                            NT$ {val.toLocaleString()} ({pct}%)
                          </div>
                          <div className="text-[10px] text-slate-400">{data.payload.desc}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={validPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {validPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Summary */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">
                總預期淨利
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 tracking-tight">
                NT$ {Math.round(totalNetProfit).toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 mt-0.5">
                佔比 {profitRate.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>數值隨所有品項成本、售價與銷售數量即時聯動</span>
          </div>
        </div>

        {/* Right: Legend Breakdown List */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {validPieData.map((item) => {
            const Icon = item.icon;
            const pct = totalRevenue > 0 ? ((item.value / totalRevenue) * 100).toFixed(1) : '0';
            return (
              <div
                key={item.name}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-300/80 transition-all shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: item.color }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-slate-800">{item.name}</span>
                    </div>
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: `${item.color}15`,
                        color: item.color,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-medium">總計金額</span>
                  <span className="font-mono font-bold text-sm text-slate-900 group-hover:scale-105 transition-transform">
                    NT$ {item.value.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: Per-Product Stacked Bar Comparison */}
      {calculations.length > 1 && (
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <h4 className="text-sm font-bold text-slate-900">各品項營收組成堆疊比較 (總額)</h4>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">單位：新台幣 (NT$)</span>
          </div>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `NT$ ${Number(value).toLocaleString()}`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  iconType="circle"
                />
                <Bar dataKey="利潤" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="製造原料" stackId="a" fill="#3B82F6" />
                <Bar dataKey="包裝物流" stackId="a" fill="#8B5CF6" />
                <Bar dataKey="金流與抽成" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
