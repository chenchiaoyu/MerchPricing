import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  Upload,
  FolderArchive,
  Lightbulb,
} from 'lucide-react';
import { GlobalSettings, ProductCalculation, ProjectSummaryData, OverheadExpenses } from '../types';
import { exportToCSV } from '../utils/pricing';

interface HeaderProps {
  calculations: ProductCalculation[];
  summary: ProjectSummaryData;
  globalSettings: GlobalSettings;
  overheadExpenses?: OverheadExpenses;
  onOpenPresetModal: () => void;
  onOpenSettingsModal: (tab?: 'general' | 'tax') => void;
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
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);

  const helpMenuRef = useRef<HTMLDivElement>(null);
  const fileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        helpMenuRef.current &&
        !helpMenuRef.current.contains(event.target as Node)
      ) {
        setIsHelpMenuOpen(false);
      }
      if (
        fileMenuRef.current &&
        !fileMenuRef.current.contains(event.target as Node)
      ) {
        setIsFileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExport = () => {
    exportToCSV(calculations, globalSettings, summary, overheadExpenses);
    setIsFileMenuOpen(false);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                商品定價小幫手 <span className="text-indigo-600 font-semibold text-xs sm:text-sm">MerchPricing</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              視覺化圖表Ｘ拆解成本結構
            </p>
          </div>
        </div>

        {/* Action Buttons & Grouped Menus */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between md:justify-end">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Primary Action Button: 新增商品 */}
            <button
              onClick={onAddNewProduct}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-xs shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
              title="新增一項商品或組合進行定價試算"
            >
              <PackagePlus className="w-4 h-4" />
              <span>新增商品</span>
            </button>

            {/* Dropdown Menu A: 💡 資源與幫助 ▾ */}
            <div className="relative" ref={helpMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsHelpMenuOpen(!isHelpMenuOpen);
                  setIsFileMenuOpen(false);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all shadow-2xs cursor-pointer active:scale-95 ${
                  isHelpMenuOpen
                    ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                title="查看使用說明、專有名詞解析與常用周邊範本"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>資源與幫助</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    isHelpMenuOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              {isHelpMenuOpen && (
                <div className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setIsHelpMenuOpen(false);
                      onOpenReadmeModal();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-semibold">使用說明</div>
                      <div className="text-[10px] text-slate-400">操作流程、步驟與注意事項</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsHelpMenuOpen(false);
                      onOpenGlossaryModal();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-semibold">專有名詞解析</div>
                      <div className="text-[10px] text-slate-400">毛利率、純利、BEP 等術語</div>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsHelpMenuOpen(false);
                      onOpenPresetModal();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-semibold">常用周邊規格範本</div>
                      <div className="text-[10px] text-slate-400">壓克力、拍立得、提袋快速帶入</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown Menu B: 📁 檔案管理 ▾ */}
            <div className="relative" ref={fileMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsFileMenuOpen(!isFileMenuOpen);
                  setIsHelpMenuOpen(false);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all shadow-2xs cursor-pointer active:scale-95 ${
                  isFileMenuOpen
                    ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                title="匯入與匯出 CSV 試算表檔案"
              >
                <FolderArchive className="w-3.5 h-3.5 text-indigo-600" />
                <span>檔案管理</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    isFileMenuOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              {isFileMenuOpen && (
                <div className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFileMenuOpen(false);
                      onOpenCsvImportModal();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-semibold">匯入 CSV</div>
                      <div className="text-[10px] text-slate-400">貼上或上傳現有商品報表</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleExport}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold">匯出 CSV 報表</div>
                      <div className="text-[10px] text-slate-400">下載 Excel/CSV 財務試算表</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* System Control Area: Right aligned (Settings & Reset) */}
          <div className="flex items-center gap-1.5 ml-auto sm:ml-0 pl-1 border-l border-slate-200">
            <button
              onClick={() => onOpenSettingsModal('general')}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="全域設定：手續費率、預設毛利率與稅務"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onResetData}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="重設所有範例資料"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
