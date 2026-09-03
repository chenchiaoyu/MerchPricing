import React from 'react';
import {
  Sparkles,
  Download,
  Settings,
  RotateCcw,
  PackagePlus,
  Coins,
  BookOpen,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { GlobalSettings, ProductCalculation, ProjectSummaryData, OverheadExpenses } from '../types';
import { exportToCSV } from '../utils/pricing';

interface HeaderProps {
  calculations: ProductCalculation[];
  summary: ProjectSummaryData;
  globalSettings: GlobalSettings;
  overheadExpenses?: OverheadExpenses;
  onOpenPresetModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenReadmeModal: () => void;
  onOpenGlossaryModal: () => void;
  onOpenCsvImportModal: () => void;
  onResetData: () => void;
  onAddNewProduct: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  calculations,
  summary,
  globalSettings,
  overheadExpenses,
  onOpenPresetModal,
  onOpenSettingsModal,
  onOpenReadmeModal,
  onOpenGlossaryModal,
  onOpenCsvImportModal,
  onResetData,
  onAddNewProduct,
}) => {
  const handleExport = () => {
    exportToCSV(calculations, globalSettings, summary, overheadExpenses);
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
          {/* Guide Button */}
          <button
            onClick={onOpenReadmeModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/90 border border-indigo-200/80 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
            title="查看完整操作流程、新手指南與注意事項"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>使用說明</span>
          </button>

          {/* Glossary Terms Button */}
          <button
            onClick={onOpenGlossaryModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50/80 hover:bg-purple-100/90 border border-purple-200/80 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
            title="查看毛利率、純淨利、BEP 損益平衡等名詞解析"
          >
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <span>專有名詞</span>
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

          {/* Import CSV Button */}
          <button
            onClick={onOpenCsvImportModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/90 border border-indigo-200/80 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
            title="貼上或上傳 CSV 範本快速匯入商品並開始編輯"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
            <span>匯入 CSV</span>
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
