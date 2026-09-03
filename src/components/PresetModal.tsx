import React from 'react';
import { X, Sparkles, Award, Key, ShoppingBag, Image, Tag, Plus } from 'lucide-react';
import { MERCHANDISE_PRESETS, MerchandisePreset } from '../data/presets';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: MerchandisePreset) => void;
}

export const PresetModal: React.FC<PresetModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  const renderIcon = (iconName: string) => {
    const props = { className: 'w-4 h-4 text-white' };
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Award':
        return <Award {...props} />;
      case 'Key':
        return <Key {...props} />;
      case 'ShoppingBag':
        return <ShoppingBag {...props} />;
      case 'Image':
        return <Image {...props} />;
      case 'Tag':
        return <Tag {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">周邊商品常用規格範本庫</h3>
              <p className="text-xs text-slate-500">
                一鍵套用市場常見行情數量、製作成本與毛利率
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

        {/* List */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {MERCHANDISE_PRESETS.map((preset) => {
            const unitSample = preset.defaultQuantity > 0 ? preset.defaultSampleCost / preset.defaultQuantity : 0;
            const unitDirect = preset.defaultBaseCost + unitSample + preset.defaultPackagingCost + preset.defaultShippingCost;
            const estPrice = Math.round(unitDirect / (1 - (preset.defaultTargetMargin / 100) - 0.025));

            return (
              <div
                key={preset.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-600/20">
                        {renderIcon(preset.iconName)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                          {preset.name}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-400">
                          {preset.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {preset.defaultQuantity} 件
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    {preset.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl text-center text-xs font-mono border border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">裸品成本</div>
                      <div className="font-bold text-slate-900 mt-0.5">NT${preset.defaultBaseCost}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">打樣版費</div>
                      <div className="font-bold text-slate-900 mt-0.5">NT${preset.defaultSampleCost}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">估算售價</div>
                      <div className="font-bold text-indigo-600 mt-0.5">NT${estPrice}</div>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                    <Plus className="w-4 h-4" />
                    <span>套用此範本加入計算</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
