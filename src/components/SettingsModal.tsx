import React from 'react';
import { X, Settings, Check, HelpCircle, CreditCard, Percent, Truck } from 'lucide-react';
import { GlobalSettings } from '../types';
import { PAYMENT_CHANNELS } from '../data/presets';
import { NumericInput } from './NumericInput';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GlobalSettings;
  onSaveSettings: (settings: GlobalSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = React.useState<GlobalSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!isOpen) return null;

  const handleSelectPresetChannel = (channel: typeof PAYMENT_CHANNELS[0]) => {
    setLocalSettings({
      ...localSettings,
      paymentFeeRate: channel.rate,
      paymentFixedFee: channel.fixed,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">全域費率與預設設定</h3>
              <p className="text-xs text-slate-500">
                設定所有未單獨指定費率之周邊商品的金流扣趴與目標毛利
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

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Quick Presets for Channel */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              快速套用台灣常見金流通路
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
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer shadow-2xs ${
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
          <div className="space-y-4 pt-2">
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
                  每筆固定訂單處理費 (元)
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
                  value={localSettings.defaultShippingSubsidy !== undefined ? localSettings.defaultShippingSubsidy : 60}
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3">
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
            儲存全域設定
          </button>
        </div>
      </div>
    </div>
  );
};
