import React from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Settings,
  RotateCcw,
  Check,
  PackagePlus,
  Coins,
  BookOpen,
} from 'lucide-react';
import { GlobalSettings, ProductCalculation, ProjectSummaryData } from '../types';
import { exportToCSV, copySummaryText } from '../utils/pricing';

interface HeaderProps {
  calculations: ProductCalculation[];
  summary: ProjectSummaryData;
  globalSettings: GlobalSettings;
  onOpenPresetModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenReadmeModal: () => void;
  onResetData: () => void;
  onAddNewProduct: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  calculations,
  summary,
  globalSettings,
  onOpenPresetModal,
  onOpenSettingsModal,
  onOpenReadmeModal,
  onResetData,
  onAddNewProduct,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = copySummaryText(calculations, summary);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExport = () => {
    exportToCSV(calculations, globalSettings, summary);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                周邊定價計算器 <span className="text-indigo-600 font-semibold text-xs sm:text-sm">MerchPricing</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200/70">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              精準金流反推・多維成本拆解・損益平衡與金流流向圖表
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* README Guide Button */}
          <button
            onClick={onOpenReadmeModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/90 border border-indigo-200/80 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
            title="查看使用說明與直接使用網址"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>README 使用說明</span>
          </button>

          {/* Presets Button */}
          <button
            onClick={onOpenPresetModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>常用周邊規格範本</span>
          </button>

          {/* Add Product Button */}
          <button
            onClick={onAddNewProduct}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/20 transition-all cursor-pointer active:scale-95"
          >
            <PackagePlus className="w-4 h-4" />
            <span>新增商品</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Settings Button */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs"
            title="設定全域金流費率與預設毛利率"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Copy Summary Button */}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
            title="複製文字摘要以傳送至 LINE 或社群"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">已複製！</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>複製企劃摘要</span>
              </>
            )}
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
            title="下載 Excel / CSV 報表"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>匯出 CSV</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs"
            title="重設範例資料"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
