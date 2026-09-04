import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Check,
  CreditCard,
  Percent,
  Truck,
  Receipt,
  Landmark,
  HelpCircle,
  Sparkles,
  Info,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { GlobalSettings, TaxSettings, DEFAULT_TAX_SETTINGS } from '../types';
import { PAYMENT_CHANNELS, TAX_PRESETS, TaxPreset } from '../data/presets';
import { NumericInput } from './NumericInput';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GlobalSettings;
  onSaveSettings: (settings: GlobalSettings) => void;
  initialTab?: 'general' | 'tax';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  initialTab = 'general',
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'tax'>(initialTab);
  const [localSettings, setLocalSettings] = useState<GlobalSettings>(() => ({
    ...settings,
    taxSettings: settings.taxSettings || { ...DEFAULT_TAX_SETTINGS },
  }));

  useEffect(() => {
    setLocalSettings({
      ...settings,
      taxSettings: settings.taxSettings || { ...DEFAULT_TAX_SETTINGS },
    });
  }, [settings]);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const currentTax: TaxSettings = localSettings.taxSettings || { ...DEFAULT_TAX_SETTINGS };

  const updateTax = (patch: Partial<TaxSettings>) => {
    setLocalSettings({
      ...localSettings,
      taxSettings: {
        ...currentTax,
        ...patch,
      },
    });
  };

  const handleSelectPresetChannel = (channel: (typeof PAYMENT_CHANNELS)[0]) => {
    setLocalSettings({
      ...localSettings,
      paymentFeeRate: channel.rate,
      paymentFixedFee: channel.fixed,
    });
  };

  const handleSelectTaxPreset = (preset: TaxPreset) => {
    updateTax({
      enabled: true,
      businessTaxRate: preset.businessRate,
      incomeTaxRate: preset.incomeRate,
      taxType: preset.taxType,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">全域費率與稅務設定</h3>
              <p className="text-xs text-slate-500">
                統一管理全場金流抽成、預設毛利目標與發票營業稅試算
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/40 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'general'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>金流費率與毛利</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tax')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tax'
                ? 'border-amber-600 text-amber-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>稅務與發票試算</span>
            {currentTax.enabled && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* ========================================================= */}
          {/* TAB 1: 金流費率與預設毛利                                 */}
          {/* ========================================================= */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Quick Presets for Channel */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  快速套用常見金流通路
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PAYMENT_CHANNELS.map((ch) => {
                    const isSelected =
                      localSettings.paymentFeeRate === ch.rate &&
                      localSettings.paymentFixedFee === ch.fixed;

                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => handleSelectPresetChannel(ch)}
                        className={`p-2.5 sm:p-3 text-left rounded-xl border transition-all cursor-pointer shadow-2xs ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-medium'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{ch.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-1">
                          {ch.rate}% {ch.fixed > 0 ? `+ NT$${ch.fixed}` : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Settings Inputs */}
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                      全域交易手續費率 (%)
                    </label>
                    <div className="relative">
                      <NumericInput
                        step={0.1}
                        min={0}
                        value={localSettings.paymentFeeRate}
                        onChange={(val) =>
                          setLocalSettings({
                            ...localSettings,
                            paymentFeeRate: val,
                          })
                        }
                        className="w-full pl-3 pr-8 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-indigo-600 outline-hidden font-mono shadow-2xs"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                      每筆固定手續費 (元)
                    </label>
                    <div className="relative">
                      <NumericInput
                        step={1}
                        min={0}
                        value={localSettings.paymentFixedFee}
                        onChange={(val) =>
                          setLocalSettings({
                            ...localSettings,
                            paymentFixedFee: val,
                          })
                        }
                        className="w-full pl-3 pr-8 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-indigo-600 outline-hidden font-mono shadow-2xs"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">元</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-purple-600" />
                      新商品預設目標毛利率 (%)
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">建議 40% ~ 60%</span>
                  </div>
                  <div className="relative">
                    <NumericInput
                      step={1}
                      min={5}
                      max={90}
                      value={localSettings.defaultTargetMargin}
                      onChange={(val) =>
                        setLocalSettings({
                          ...localSettings,
                          defaultTargetMargin: val,
                        })
                      }
                      className="w-full pl-3 pr-10 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-indigo-600 outline-hidden font-mono shadow-2xs"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">
                    文創同人周邊通常建議維持在 45%~60%，以抵禦展場攤位費、庫存滯銷與運費成本。
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-teal-600" />
                      免運方案每筆商家吸收運費預設值 (元)
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">超商常態約 60 元</span>
                  </div>
                  <div className="relative">
                    <NumericInput
                      step={5}
                      min={0}
                      max={500}
                      value={
                        localSettings.defaultShippingSubsidy !== undefined
                          ? localSettings.defaultShippingSubsidy
                          : 60
                      }
                      onChange={(val) =>
                        setLocalSettings({
                          ...localSettings,
                          defaultShippingSubsidy: val,
                        })
                      }
                      className="w-full pl-3 pr-10 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-indigo-600 outline-hidden font-mono shadow-2xs"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">元</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">
                    當商品勾選「提供免運」時，系統預設填入的商家吸收補貼金額。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: 稅務與發票試算                                     */}
          {/* ========================================================= */}
          {activeTab === 'tax' && (
            <div className="space-y-6">
              {/* Master Switch */}
              <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-amber-700" />
                    <h4 className="text-sm font-bold text-slate-900">啟用稅務與發票試算</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    開啟後，系統將在商品定價與全場損益即時扣除預估營業稅（銷項稅額）與營所稅，並精準呈現「稅後實收淨利」。
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={currentTax.enabled}
                    onChange={(e) => updateTax({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {/* Presets for Tax */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  快速套用常見稅務方案
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TAX_PRESETS.map((preset) => {
                    const isSelected =
                      currentTax.enabled &&
                      currentTax.businessTaxRate === preset.businessRate &&
                      currentTax.incomeTaxRate === preset.incomeRate &&
                      currentTax.taxType === preset.taxType;

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectTaxPreset(preset)}
                        className={`p-3 text-left rounded-xl border transition-all cursor-pointer shadow-2xs ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-medium ring-1 ring-amber-400'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{preset.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {preset.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Mode: Tax Inclusive vs Exclusive */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  標價模式 (營業稅內含或外加)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      currentTax.taxType === 'inclusive'
                        ? 'bg-white border-indigo-600 ring-1 ring-indigo-500 shadow-2xs'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="taxPricingType"
                      checked={currentTax.taxType === 'inclusive'}
                      onChange={() => updateTax({ taxType: 'inclusive' })}
                      className="mt-0.5 text-indigo-600 accent-indigo-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        含稅價（售價已內含營業稅）
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        台灣消保法規標準定價方式，商品標價即為買家實付金額，自營業額扣減 5% 銷項稅額。
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      currentTax.taxType === 'exclusive'
                        ? 'bg-white border-indigo-600 ring-1 ring-indigo-500 shadow-2xs'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="taxPricingType"
                      checked={currentTax.taxType === 'exclusive'}
                      onChange={() => updateTax({ taxType: 'exclusive' })}
                      className="mt-0.5 text-indigo-600 accent-indigo-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        未稅價（結帳額外加收稅）
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        多用於 B2B 企業報價，標示為未稅金額，向客戶加徵 5% 營業稅額。
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tax Rates Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      營業稅率 (加值型營業稅 %)
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">發票標準為 5%</span>
                  </div>
                  <div className="relative">
                    <NumericInput
                      step={0.5}
                      min={0}
                      max={30}
                      value={currentTax.businessTaxRate}
                      onChange={(val) => updateTax({ businessTaxRate: val })}
                      className="w-full pl-3 pr-8 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-amber-500 outline-hidden font-mono shadow-2xs"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    如開立統一發票填 5%，小規模查定課徵填 1%，個人免稅填 0%。
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Landmark className="w-3.5 h-3.5 text-indigo-600" />
                      預估所得稅 / 營所稅率 (%)
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">公司標準 20%</span>
                  </div>
                  <div className="relative">
                    <NumericInput
                      step={1}
                      min={0}
                      max={50}
                      value={currentTax.incomeTaxRate}
                      onChange={(val) => updateTax({ incomeTaxRate: val })}
                      className="w-full pl-3 pr-8 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-amber-500 outline-hidden font-mono shadow-2xs"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    以扣除營業稅後的正純淨利提列；若個人所得可填個人適用稅率或填 0%。
                  </p>
                </div>
              </div>

              {/* Deduct Input Tax Checkbox */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                <input
                  type="checkbox"
                  id="deductInputTax"
                  checked={Boolean(currentTax.deductInputTax)}
                  onChange={(e) => updateTax({ deductInputTax: e.target.checked })}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="deductInputTax" className="text-xs cursor-pointer select-none">
                  <span className="font-bold text-slate-800 block">
                    啟用進項發票稅額扣抵 (採購原物料與工廠印製發票)
                  </span>
                  <span className="text-slate-500 block mt-0.5">
                    若工廠與包材供應商開立統一發票給你，進項稅額可抵扣銷項稅額，僅需繳納淨差額稅。
                  </span>
                </label>
              </div>

              {/* Tax Tips Accordion / Information Box */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 text-xs text-slate-700 space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-600" />
                  台灣周邊與電商文創稅務常見門檻參考：
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>
                    <strong>未達起徵點（免辦登記/0%）：</strong>實體貨物月營業額未達 8 萬元、勞務未達 4 萬元。
                  </li>
                  <li>
                    <strong>小規模營業人（1%）：</strong>月營業額 8 萬 ~ 20 萬元，免開統一發票，國稅局季查定課徵 1%。
                  </li>
                  <li>
                    <strong>使用統一發票（5%）：</strong>月營業額達 20 萬元以上，依法開立統一發票，按期申報營業稅。
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {activeTab === 'tax' && (
              <span>
                {currentTax.enabled
                  ? `已啟用稅務：${currentTax.businessTaxRate}% 營業稅 (${currentTax.taxType === 'inclusive' ? '含稅' : '外加'})`
                  : '目前未啟用稅務試算'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => {
                onSaveSettings(localSettings);
                onClose();
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs shadow-indigo-600/20 transition-all cursor-pointer"
            >
              儲存設定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
