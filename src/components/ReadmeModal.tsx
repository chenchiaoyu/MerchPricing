import React, { useState } from 'react';
import {
  X,
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Sparkles,
  Layers,
  Calculator,
  Sliders,
  PieChart,
  Github,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  const GITHUB_PAGES_URL = 'https://chenchiaoyu.github.io/MerchPricing/';
  const AI_STUDIO_URL =
    'https://ais-pre-qwpdawfi6oj7s6nw2qbg7r-578487684233.asia-northeast1.run.app';
  const GITHUB_REPO_URL = 'https://github.com/chenchiaoyu/MerchPricing';

  const handleCopy = (url: string, key: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(key);
      setTimeout(() => setCopiedLink(null), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">使用說明書・README</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500">
                周邊商品定價計算機操作手冊與線上即時網址
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* Direct Live Website Links Box */}
          <div className="bg-gradient-to-br from-indigo-50/90 via-blue-50/50 to-purple-50/40 p-5 rounded-2xl border border-indigo-100 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-900 text-sm">
                  線上使用網址 (Live URL)
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                點擊可直接開啟或複製分享
              </span>
            </div>

            {/* Primary GitHub Pages Link */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    GitHub Pages 正式版
                  </span>
                  <span className="text-xs font-semibold text-slate-700">官方線上站點</span>
                </div>
                <div className="font-mono text-xs text-indigo-600 truncate font-medium">
                  {GITHUB_PAGES_URL}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(GITHUB_PAGES_URL, 'pages')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedLink === 'pages' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">已複製</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>複製網址</span>
                    </>
                  )}
                </button>
                <a
                  href={GITHUB_PAGES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>直接開啟</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Preview and Repo Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-violet-500" />
                    AI Studio 備用預覽站
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 truncate">
                    {AI_STUDIO_URL}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(AI_STUDIO_URL, 'aistudio')}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                  title="複製網址"
                >
                  {copiedLink === 'aistudio' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                    <Github className="w-3 h-3 text-slate-700" />
                    GitHub 原始碼倉庫
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 truncate">
                    chenchiaoyu/MerchPricing
                  </div>
                </div>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                  title="前往 GitHub 專案"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Guide Sections */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              網頁功能與使用步驟
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    1
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    一鍵套用常見範本或新增商品
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  點擊頂部「<strong>常用周邊規格範本</strong>」，即可一鍵帶入壓克力立牌、馬口鐵胸章、全彩畫冊、帆布袋等業界行情與開版成本；亦可點擊「新增品項」自定義周邊企劃。
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    2
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    多維度成本真實拆解
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  除了裸品製造費，計算機支援攤提「<strong>打樣開版費</strong>」、獨立「<strong>包材/背卡</strong>」、單件「<strong>運費與耗材</strong>」，杜絕漏算隱形支出而虧本。
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    3
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    三種彈性定價驅動模式
                  </span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li><strong>依目標毛利率</strong>：設定理想毛利（如 50%），自動推導建議定價。</li>
                  <li><strong>市場售價反推</strong>：輸入想要賣的金額，即時檢視單件實賺與毛利率。</li>
                  <li><strong>總淨利目標</strong>：設定想為工作室賺取多少利潤，反推定價。</li>
                </ul>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    4
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    展場損益平衡與動態情境模擬
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  即時試算各品項需要賣出幾件才能「<strong>保本回本 (BEP)</strong>」。頁面下方更配有「<strong>情境模擬器</strong>」，可拉動銷量比率與套組折扣，預演真實入袋利潤。
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Formula Details */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-indigo-600" />
              核心核心計算公式
            </h5>
            <div className="font-mono text-[11px] text-slate-600 space-y-1 bg-white p-3 rounded-lg border border-slate-200/80">
              <div>• 單件直接製造成本 = 裸品成本 + (打樣費 ÷ 數量) + 包材費 + 運費 + 其他</div>
              <div>• 建議售價 = (單件直接成本 + 每筆固定金流費) ÷ (1 - 目標毛利率 - 金流抽成% - 繪師抽成%)</div>
              <div>• 單件純淨利 = 售價 - 單件直接成本 - 金流手續費 - 繪師抽成</div>
              <div>• 損益平衡件數 (BEP) = 總投入固定成本 ÷ (售價 - 單件變動成本與抽成)</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 hidden sm:block">
            支援手機、平板與電腦全響應式操作，資料自動存於本機瀏覽器。
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer ml-auto"
          >
            我知道了，開始使用
          </button>
        </div>
      </div>
    </div>
  );
};
