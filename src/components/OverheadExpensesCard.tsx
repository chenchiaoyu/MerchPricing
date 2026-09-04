import React, { useState } from 'react';
import {
  Truck,
  Users,
  PackageOpen,
  HelpCircle,
  Layers,
  Plus,
  Trash2,
  Tag,
  Info,
  ChevronDown,
  ChevronUp,
  Calculator,
  Store,
  Sparkles,
  Train,
  Building,
  Box,
} from 'lucide-react';
import { OverheadExpenses, CustomOverheadItem } from '../types';
import { NumericInput } from './NumericInput';

interface OverheadExpensesCardProps {
  expenses: OverheadExpenses;
  onChange: (updated: OverheadExpenses) => void;
  onOpenGlossary?: (termId?: string) => void;
}

// 快速加入的常用獨立支出範本 (已合併進貨分攤運費、人力成本、其他雜支耗材至前面項目)
const PRESET_CUSTOM_TEMPLATES = [
  { name: '進貨分攤運費', amount: 500, note: '廠商大貨/宅配/展場貨運' },
  { name: '人力成本', amount: 1200, note: '工讀顧攤/小精靈薪資津貼' },
  { name: '其他雜支耗材', amount: 300, note: '膠帶/文具/防撞泡泡袋' },
  { name: '攤位報名/租金', amount: 1200, note: '同人展攤位費用' },
  { name: '展場交通車資', amount: 1500, note: '高鐵/台鐵/計程車' },
  { name: '展期住宿費用', amount: 2000, note: '飯店/民宿兩晚' },
  { name: '陳列架與展示道具', amount: 450, note: '桌布、鐵架、立牌' },
  { name: '寄件外包裝/飛機盒', amount: 350, note: '通販專用紙箱耗材' },
  { name: '宣傳名片與酷卡', amount: 250, note: '免費發送之推廣物' },
];

export const OverheadExpensesCard: React.FC<OverheadExpensesCardProps> = ({
  expenses,
  onChange,
  onOpenGlossary,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const isCustomItemsEnabled = Boolean(expenses.customItemsEnabled);
  const customItems: CustomOverheadItem[] = expenses.customItems || [];
  const customItemsTotal = isCustomItemsEnabled
    ? customItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
    : 0;

  const freeShippingSubsidizedTotal = expenses.freeShippingEnabled
    ? (expenses.freeShippingCost || 0)
    : 0;

  const total =
    (expenses.shippingCost || 0) +
    (expenses.laborCost || 0) +
    (expenses.extraCost || 0) +
    customItemsTotal +
    freeShippingSubsidizedTotal;

  const handleUpdate = (field: keyof OverheadExpenses, val: any) => {
    onChange({
      ...expenses,
      [field]: val,
    });
  };

  // 新增自訂項目
  const handleAddCustomItem = (name = '新增獨立支出', amount = 0, note = '') => {
    const newItem: CustomOverheadItem = {
      id: `custom-overhead-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      amount,
      note,
    };
    onChange({
      ...expenses,
      customItems: [...customItems, newItem],
    });
  };

  // 修改自訂項目
  const handleUpdateCustomItem = (
    id: string,
    field: keyof CustomOverheadItem,
    val: any
  ) => {
    const updated = customItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: field === 'amount' ? Math.max(0, Number(val) || 0) : val,
        };
      }
      return item;
    });
    onChange({
      ...expenses,
      customItems: updated,
    });
  };

  // 刪除自訂項目
  const handleDeleteCustomItem = (id: string) => {
    onChange({
      ...expenses,
      customItems: customItems.filter((item) => item.id !== id),
    });
  };

  // 免運按筆數自動換算總額
  const perOrderSubsidy = expenses.freeShippingPerOrder || 60;
  const estimatedOrders =
    expenses.freeShippingEstimatedOrders !== undefined
      ? expenses.freeShippingEstimatedOrders
      : expenses.freeShippingCost && perOrderSubsidy > 0
      ? Math.round(expenses.freeShippingCost / perOrderSubsidy)
      : 20;

  const handleOrdersChange = (orders: number) => {
    const validOrders = Math.max(0, orders);
    const calculatedCost = validOrders * perOrderSubsidy;
    onChange({
      ...expenses,
      freeShippingEstimatedOrders: validOrders,
      freeShippingCost: calculatedCost,
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                其他支出
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                統籌固定成本
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              獨立於各商品之外，不強行攤提至單一品項；可自由啟用各類支出項目，直接納入前期總投入並於利潤結算中扣除
            </p>
          </div>
        </div>

        {/* Total Badge */}
        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">其他支出合計：</span>
          <span className="text-base font-bold font-mono text-amber-600">
            NT$ {total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 自訂獨立支出項目列表 (需勾選才會打開功能) */}
      <div className="p-4.5 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-900">
              自訂獨立支出項目
            </span>
            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
              {isCustomItemsEnabled && customItems.length > 0
                ? `已啟用 ${customItems.length} 項 (合計 NT$ ${customItemsTotal.toLocaleString()})`
                : '彈性支出'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isCustomItemsEnabled && (
              <button
                type="button"
                onClick={() => handleAddCustomItem('自訂支出', 500, '')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增支出項目</span>
              </button>
            )}

            {/* 勾選開關 */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isCustomItemsEnabled}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  onChange({
                    ...expenses,
                    customItemsEnabled: enabled,
                  });
                }}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
              />
              <span>啟用自訂獨立支出</span>
            </label>
          </div>
        </div>

        {isCustomItemsEnabled ? (
          <>
            {/* 快捷範本推薦標籤 */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                常見範本：
              </span>
              {PRESET_CUSTOM_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.name}
                  type="button"
                  onClick={() => handleAddCustomItem(tmpl.name, tmpl.amount, tmpl.note)}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-white hover:bg-indigo-50 hover:text-indigo-700 px-2 py-0.5 rounded-md border border-slate-200/80 transition-colors shadow-2xs cursor-pointer"
                >
                  <span>+ {tmpl.name}</span>
                  <span className="font-mono text-[10px] text-slate-400">(${tmpl.amount})</span>
                </button>
              ))}
            </div>

            {/* 列表內容 */}
            {customItems.length > 0 ? (
              <div className="space-y-2 pt-1">
                {customItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs hover:border-indigo-300 transition-colors"
                  >
                    {/* 項目名稱 */}
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateCustomItem(item.id, 'name', e.target.value)}
                        placeholder="項目名稱 (如: 攤位租金)"
                        className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 rounded-md focus:border-indigo-500 outline-hidden bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    {/* 備註說明 (選填) */}
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={item.note || ''}
                        onChange={(e) => handleUpdateCustomItem(item.id, 'note', e.target.value)}
                        placeholder="備註說明 (如: 兩日單攤 / 高鐵來回)"
                        className="w-full px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-md focus:border-indigo-500 outline-hidden bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    {/* 金額 */}
                    <div className="sm:col-span-3 relative">
                      <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-mono">NT$</span>
                      <NumericInput
                        min={0}
                        step={50}
                        value={item.amount}
                        onChange={(val) => handleUpdateCustomItem(item.id, 'amount', val)}
                        className="w-full pl-9 pr-2 py-1.5 text-xs font-mono font-bold text-slate-900 border border-slate-200 rounded-md focus:border-indigo-500 outline-hidden text-right"
                        placeholder="0"
                      />
                    </div>

                    {/* 刪除按鈕 */}
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomItem(item.id)}
                        title="刪除此項目"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-2.5 text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg bg-white/60">
                已啟用自訂獨立支出。您可點選上方「新增支出項目」或推薦範本，自訂攤位租金、車資、住宿等費用。
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-slate-500">
            未啟用自訂獨立支出。若勾選開啟，可自訂攤位租金、車資、住宿等費用，費用將如實列入全場總成本。
          </p>
        )}
      </div>

      {/* 4. 滿額免運費設定 (由商家全額吸收) */}
      <div className="p-4.5 rounded-xl border border-teal-200/90 bg-teal-50/40 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-bold text-slate-900">
              滿額免運費設定
            </span>
            <span className="text-[10px] font-semibold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">
              促銷補貼
            </span>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={Boolean(expenses.freeShippingEnabled)}
              onChange={(e) => {
                const enabled = e.target.checked;
                const defaultPerOrder = expenses.freeShippingPerOrder || 60;
                const defaultOrders = 20;
                onChange({
                  ...expenses,
                  freeShippingEnabled: enabled,
                  freeShippingThreshold: enabled ? (expenses.freeShippingThreshold || 1000) : 0,
                  freeShippingPerOrder: enabled ? defaultPerOrder : 0,
                  freeShippingEstimatedOrders: enabled ? defaultOrders : 0,
                  freeShippingCost: enabled ? defaultOrders * defaultPerOrder : 0,
                });
              }}
              className="w-4 h-4 rounded text-teal-600 accent-teal-600 cursor-pointer"
            />
            <span>提供滿額免運活動</span>
          </label>
        </div>

        {expenses.freeShippingEnabled ? (
          <div className="space-y-3.5 pt-1">
            {/* 💡 詳細填寫指南卡片 (解決使用者的填寫疑問) */}
            <div className="bg-white p-3.5 rounded-xl border border-teal-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>「全場預估商家吸收運費 (總額)」怎麼填寫？</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-[11px] text-teal-700 hover:text-teal-800 font-medium flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{showExplanation ? '收合詳解' : '查看完整公式與範例'}</span>
                  {showExplanation ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* 核心一句話說明 */}
              <p className="text-xs text-slate-600 leading-relaxed">
                買家訂單金額達標（如滿 1,000 元）享免運時，這筆運費（如超商 60 元）是由<strong>您直接替買家付給超商或郵局</strong>。
                <br className="hidden sm:inline" />
                計算公式非常簡單：
                <span className="font-bold text-teal-800 font-mono bg-teal-50 px-1.5 py-0.5 rounded ml-1">
                  【預估免運訂單數】×【每筆吸收運費】＝【全場吸收總額】
                </span>
              </p>

              {/* 展開之詳盡情境範例 */}
              {showExplanation && (
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-2 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80">
                      <span className="font-bold text-slate-800 block mb-0.5">🛒 情境 A：場後通販 / 蝦皮賣貨便</span>
                      <span>預估通販會有 <strong>20 位</strong> 買家湊滿千元免運，每單吸收 60 元 ➜ 總額填 <strong>NT$ 1,200</strong> (20 × 60)。</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80">
                      <span className="font-bold text-slate-800 block mb-0.5">🎪 情境 B：現場實體擺攤</span>
                      <span>現場買家皆當場手提拿走，無運費問題 ➜ 若完全不做通販，可直接關閉免運開關。</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-teal-700">
                    ★ 小撇步：您也可以直接在下方填入「預估免運訂單筆數」，系統將為您自動秒算總額！
                  </p>
                </div>
              )}
            </div>

            {/* 參數設定輸入區 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. 滿額門檻 */}
              <div className="bg-white p-3 rounded-lg border border-teal-100 shadow-2xs space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 block">
                  滿額免運門檻 (元)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">滿 NT$</span>
                  <NumericInput
                    min={0}
                    step={100}
                    value={expenses.freeShippingThreshold || 1000}
                    onChange={(val) => handleUpdate('freeShippingThreshold', Math.max(0, val))}
                    className="w-full pl-14 pr-2 py-1.5 text-xs font-mono font-bold text-slate-900 border border-slate-200 rounded-md focus:border-teal-600 outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-slate-400">如買家單筆消費滿 1,000 元享免運</span>
              </div>

              {/* 2. 每單商家吸收金額 */}
              <div className="bg-white p-3 rounded-lg border border-teal-100 shadow-2xs space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 block">
                  每筆訂單商家吸收運費
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">NT$</span>
                  <NumericInput
                    min={0}
                    step={5}
                    value={perOrderSubsidy}
                    onChange={(val) => {
                      const perOrder = Math.max(0, val);
                      const calculatedCost = estimatedOrders * perOrder;
                      onChange({
                        ...expenses,
                        freeShippingPerOrder: perOrder,
                        freeShippingCost: calculatedCost,
                      });
                    }}
                    className="w-full pl-9 pr-2 py-1.5 text-xs font-mono font-bold text-slate-900 border border-slate-200 rounded-md focus:border-teal-600 outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-slate-400">超商多為 60 元、郵局約 40~80 元</span>
              </div>

              {/* 3. 預估享免運的訂單筆數 (智能連動計算) */}
              <div className="bg-white p-3 rounded-lg border border-teal-100 shadow-2xs space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                  <span>預估免運訂單筆數</span>
                  <span className="text-[10px] text-teal-600 font-mono">自動換算總額</span>
                </label>
                <div className="relative">
                  <NumericInput
                    min={0}
                    step={5}
                    value={estimatedOrders}
                    onChange={(val) => handleOrdersChange(val)}
                    className="w-full px-2 py-1.5 text-xs font-mono font-bold text-teal-900 border border-slate-200 rounded-md focus:border-teal-600 outline-hidden"
                    placeholder="20"
                  />
                  <span className="absolute right-2.5 top-2 text-xs text-slate-400 font-mono">筆單</span>
                </div>
                {/* 快捷訂單筆數選擇 */}
                <div className="flex items-center gap-1 pt-0.5">
                  <span className="text-[10px] text-slate-400">常用:</span>
                  {[10, 20, 30, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleOrdersChange(num)}
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border transition-colors cursor-pointer ${
                        estimatedOrders === num
                          ? 'bg-teal-600 text-white border-teal-600 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-teal-50'
                      }`}
                    >
                      {num}筆
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 換算結果總額展示 (可直接手動覆寫總額，亦可自動聯動) */}
            <div className="p-3 bg-white rounded-xl border border-teal-300/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    全場預估商家吸收運費 (總額)
                  </span>
                  <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                    {estimatedOrders} 筆 × NT$ {perOrderSubsidy}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  此金額將如實計入營業總成本，直接於全場總獲利中扣除
                </p>
              </div>

              <div className="relative w-full sm:w-44 shrink-0">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">NT$</span>
                <NumericInput
                  min={0}
                  step={100}
                  value={expenses.freeShippingCost || 0}
                  onChange={(val) => {
                    const cost = Math.max(0, val);
                    const orders = perOrderSubsidy > 0 ? Math.round(cost / perOrderSubsidy) : 0;
                    onChange({
                      ...expenses,
                      freeShippingCost: cost,
                      freeShippingEstimatedOrders: orders,
                    });
                  }}
                  className="w-full pl-10 pr-3 py-2 text-sm font-mono font-black text-teal-800 bg-teal-50/50 border border-teal-300 rounded-lg focus:border-teal-600 outline-hidden"
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            未開啟全館滿額免運。若勾選開啟，可設定滿額門檻並由商家吸收運費，費用將如實列入全場總成本。
          </p>
        )}
      </div>
    </div>
  );
};
