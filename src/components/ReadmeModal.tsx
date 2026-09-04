import React from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  BookMarked,
  Sliders,
  PieChart,
  FileSpreadsheet,
  Eye,
  Tag,
} from 'lucide-react';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGlossary?: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({
  isOpen,
  onClose,
  onOpenGlossary,
}) => {
  if (!isOpen) return null;

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
                <h3 className="text-lg font-bold text-slate-900">使用說明</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  操作手冊與功能導覽
                </span>
              </div>
              <p className="text-xs text-slate-500">
                周邊商品定價計算機使用流程、避坑注意事項與功能解析
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
          {/* Section 1: How to Start (Workflow) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                如何開始？標準企劃使用流程
              </h4>
              {onOpenGlossary && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenGlossary();
                  }}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
                >
                  <BookMarked className="w-3.5 h-3.5" />
                  <span>速查專有名詞百科 →</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                    1
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    建立商品品項
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  點擊頂部「<strong>常用周邊規格範本</strong>」一鍵載入壓克力立牌、雙閃徽章、畫冊本或帆布袋等業界行情；或點擊「<strong>新增商品</strong>」從空白自定義各項周邊企劃。
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                    2
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    真實拆解各項成本
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  依序填入裸品單價、總打樣開版費、每件獨立包材背卡、單件平均運費。系統會<strong>自動將固定打樣費均攤至單件</strong>，算出版面最真實的「單件直接硬成本」。
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                    3
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    定價與損益檢視
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  可選「<strong>依目標毛利率推導</strong>」（如 50%），或選「<strong>市場售價反推</strong>」即時檢視實質利潤。並關注各品項的「<strong>損益平衡件數 (BEP)</strong>」，確保回本難度在安全範圍。
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Important Precautions (Avoid Pitfalls) */}
          <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>重要注意事項與避坑指南</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="bg-white/90 p-3 rounded-xl border border-rose-100 space-y-1">
                <div className="font-bold text-rose-800">⚠️ 1. 打樣開版費的攤提效應</div>
                <p className="text-slate-600 leading-relaxed">
                  打樣費是固定成本。若一款新品只印 30 個，300 元打樣費會讓單件硬生生多出 10 元成本！若產量小，務必如實填入打樣費，否則完售也會倒賠。
                </p>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-rose-100 space-y-1">
                <div className="font-bold text-rose-800">⚠️ 2. 金流抽成是算「成交總額」</div>
                <p className="text-slate-600 leading-relaxed">
                  綠界、蝦皮、賣貨便手續費是從客人的付款總額扣趴，不是從利潤扣趴！若毛利抓太薄，平台手續費會直接吃掉你大半的辛苦利潤。
                </p>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-rose-100 space-y-1">
                <div className="font-bold text-rose-800">⚠️ 3. 保留 45%~60% 以上的安全毛利</div>
                <p className="text-slate-600 leading-relaxed">
                  展場通常會有 10%~20% 剩餘庫存、公關贈品或套組折價促銷。毛利率若只有 25%，只要少賣幾件就會直接轉為虧損。
                </p>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-rose-100 space-y-1">
                <div className="font-bold text-rose-800">⚠️ 4. 本機資料保存與備份</div>
                <p className="text-slate-600 leading-relaxed">
                  資料會自動即時存於目前瀏覽器 LocalStorage 中。若使用無痕視窗或更換電腦，建議隨時點擊「<strong>匯出 CSV 報表</strong>」做本地離線備份！
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Feature Highlights */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              計算機實用小功能導覽
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                  卡片 / 試算表表格雙檢視切換
                </div>
                <p className="text-slate-600 leading-relaxed">
                  右上角可自由切換「<strong>卡片詳細模式</strong>」（細調打樣、包材、繪師抽成）或「<strong>試算表清單模式</strong>」（大量品項排序、快速對照各款售價與總毛利）。
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  方案眼睛切換（來回對比試算）
                </div>
                <p className="text-slate-600 leading-relaxed">
                  每張卡片右上角設有<strong>眼睛圖示</strong>，可隨時「隱藏排除」特定商品不計入總額，方便你在不同企劃組合間切換比較總預算與回本難度。
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  多件組合方案與獨立促銷折價
                </div>
                <p className="text-slate-600 leading-relaxed">
                  可將卡片設為「<strong>多件合購方案</strong>」（如 4 件 T 恤一組），並<strong>單獨設定該方案折價趴數</strong>，清楚對照原價、折後價與獨立毛利，與全場折價完全分開。
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-rose-500" />
                  展場與銷售情境動態模擬器
                </div>
                <p className="text-slate-600 leading-relaxed">
                  頁面下方配有情境模擬器，可<strong>自訂手動輸入任意全場促銷幅度（%）</strong>與銷量比例，直接預覽扣除前期投入後，真正落入錢包的最終底線獲利！
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <BookMarked className="w-3.5 h-3.5 text-purple-600" />
                  專有名詞小百科 (小 i 導覽)
                </div>
                <p className="text-slate-600 leading-relaxed">
                  頂部導覽列與各卡片皆設有「<strong>小 i 圖示</strong>」，點開即可詳細查閱毛利率、純淨利、損益平衡點 (BEP)、安全銷售率的定義與同人實戰心法！
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 hidden sm:block">
            支援手機、平板與電腦全響應式操作，資料自動存於本機瀏覽器。
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {onOpenGlossary && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGlossary();
                }}
                className="px-3.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all cursor-pointer"
              >
                查看專有名詞小百科
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              我知道了，開始使用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
