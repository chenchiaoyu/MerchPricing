import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Clipboard,
  Check,
  Download,
  AlertCircle,
  ShieldCheck,
  X,
  Sparkles,
  ArrowRight,
  Layers,
  FileText,
} from 'lucide-react';
import { GlobalSettings, ProductItem } from '../types';
import { generateCSVTemplate, parseCSVToProducts } from '../utils/pricing';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: ProductItem[], replace: boolean) => void;
  defaultSettings: GlobalSettings;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  defaultSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [rawText, setRawText] = useState<string>('');
  const [replaceMode, setReplaceMode] = useState<boolean>(true); // true = 覆蓋, false = 追加
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const { products: parsedProducts, warnings } = parseCSVToProducts(rawText, defaultSettings);

  const handleDownloadTemplate = () => {
    const csvContent = generateCSVTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', '周邊定價計算器_匯入範本.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyTemplate = () => {
    const csvContent = generateCSVTemplate().replace(/^\uFEFF/, '');
    navigator.clipboard.writeText(csvContent).then(() => {
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2000);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleConfirmImport = () => {
    if (parsedProducts.length === 0) return;
    onImport(parsedProducts, replaceMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                匯入 / 貼上 CSV 範本
              </h2>
              <p className="text-xs text-slate-500">
                支援上傳 .csv 檔案或直接貼上 Excel 表格，載入後可隨時自由重新編輯
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Privacy & Cloud Resource Note */}
          <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <span>100% 純前端本地解析・絕不動用任何雲端或網路資源</span>
              </div>
              <p className="text-emerald-700 leading-relaxed text-[11px]">
                所有的 CSV 檔案讀取、字串處理與商品規格轉換，全部在您的瀏覽器記憶體中即時完成。沒有任何資料會被傳送至伺服器或第三方雲端，商業定價與成本絕對隱私安全，且完全支援離線使用！
              </p>
            </div>
          </div>

          {/* Template Actions (Download or Copy) */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>官方標準 CSV 範本</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                欄位含品名、製作量、單件製作費、開版打樣費、包材費、定價模式等
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                {copiedTemplate ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">已複製！</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3.5 h-3.5 text-slate-500" />
                    <span>複製範本文字</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下載範本檔案 (.csv)</span>
              </button>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === 'paste'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Clipboard className="w-4 h-4" />
              <span>直接貼上 CSV / 表格內容</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === 'upload'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>上傳 .csv 檔案</span>
            </button>
          </div>

          {/* Paste Tab */}
          {activeTab === 'paste' ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                請將 CSV 內容或由 Excel / Google Sheets 複製的內容直接貼在下方：
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="品名,分類,製作數量,單件製作費,開版打樣費,包材耗材費,定價模式,市場售價,目標獲利,目標毛利率,每組件數,折價趴數&#10;壓克力流沙吊飾,壓克力周邊,100,38,300,5,市場售價,150,0,50,1,0&#10;雙面燙金明信片組,紙本印刷,200,6,0,3,目標毛利率,0,0,60,1,0"
                rows={6}
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 outline-hidden transition-all shadow-inner leading-relaxed"
              />
            </div>
          ) : (
            /* Upload File Tab */
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-2"
              >
                <div className="w-12 h-12 bg-white rounded-2xl text-indigo-600 flex items-center justify-center mx-auto shadow-2xs border border-slate-200">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-700">
                  {fileName ? `已選擇檔案：${fileName}` : '點擊選擇檔案，或拖曳 .csv 檔案至此'}
                </div>
                <p className="text-[11px] text-slate-400">
                  僅支援 UTF-8 編碼之標準 .csv 或純文字表格檔案
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Real-time Parsed Preview */}
          {rawText.trim().length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>預覽即將匯入的商品（共 {parsedProducts.length} 款）</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  匯入後可在主畫面各卡片進一步詳細編輯
                </span>
              </div>

              {parsedProducts.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-[11px] font-sans divide-y divide-slate-100">
                    <thead className="bg-slate-50 text-slate-500 font-semibold sticky top-0">
                      <tr>
                        <th className="py-2 px-3">品名</th>
                        <th className="py-2 px-2">數量</th>
                        <th className="py-2 px-2">製作費</th>
                        <th className="py-2 px-2">打樣費</th>
                        <th className="py-2 px-2">模式</th>
                        <th className="py-2 px-3 text-right">目標/售價</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white font-mono">
                      {parsedProducts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-2 px-3 font-sans font-medium text-slate-800 truncate max-w-[140px]">
                            {p.name}
                          </td>
                          <td className="py-2 px-2 text-slate-600">{p.quantity} 件</td>
                          <td className="py-2 px-2 text-slate-600">NT$ {p.baseCost}</td>
                          <td className="py-2 px-2 text-slate-600">NT$ {p.sampleCost}</td>
                          <td className="py-2 px-2 font-sans text-[10px] text-slate-500">
                            {p.pricingMode === 'price' ? '市售價' : p.pricingMode === 'profit' ? '總獲利' : '毛利率'}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-indigo-600">
                            {p.pricingMode === 'price' ? `NT$ ${p.customPrice}` : p.pricingMode === 'profit' ? `獲利$${p.targetTotalProfit}` : `${p.targetMargin}%`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>尚未解析出商品資料，請確認是否包含品名或標頭格式。</span>
                </div>
              )}
            </div>
          )}

          {/* Import Strategy Options */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">匯入處理方式：</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center gap-2.5 transition-all ${
                  replaceMode
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={replaceMode}
                  onChange={() => setReplaceMode(true)}
                  className="accent-indigo-600"
                />
                <div>
                  <div className="font-bold">覆蓋現有所有品項</div>
                  <div className="text-[10px] text-slate-500">清空現有商品，載入此份 CSV 清單</div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center gap-2.5 transition-all ${
                  !replaceMode
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={!replaceMode}
                  onChange={() => setReplaceMode(false)}
                  className="accent-indigo-600"
                />
                <div>
                  <div className="font-bold">追加至現有清單下方</div>
                  <div className="text-[10px] text-slate-500">保留原本商品，將新商品合併追加</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            disabled={parsedProducts.length === 0}
            onClick={handleConfirmImport}
            className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>確認匯入並開始編輯 ({parsedProducts.length} 款)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
