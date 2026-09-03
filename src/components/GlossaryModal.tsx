import React, { useState } from 'react';
import {
  X,
  BookMarked,
  Search,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Percent,
  PiggyBank,
  DollarSign,
  Package,
  Layers,
  CreditCard,
  UserCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export interface GlossaryTerm {
  id: string;
  name: string;
  english: string;
  category: 'profit' | 'cost' | 'safety' | 'fee';
  categoryLabel: string;
  icon: React.ReactNode;
  formula?: string;
  shortDesc: string;
  detail: string;
  proTip: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'gross-margin',
    name: '毛利率',
    english: 'Gross Margin %',
    category: 'profit',
    categoryLabel: '獲利與定價',
    icon: <Percent className="w-4 h-4 text-purple-600" />,
    formula: '(建議售價 - 單件直接製造成本) ÷ 建議售價 × 100%',
    shortDesc: '商品每賣出 100 元，扣除工廠硬體製造成本後還剩下的利潤比率。',
    detail:
      '毛利率代表周邊商品本身「本質上的溢價能力」。毛利率越高，代表這款商品的容錯率與獲利空間越大。若只抓 20%~30% 的超低毛利，只要遇到少量滯銷庫存或送禮公關品，整批企劃就會瞬間轉為虧損。',
    proTip:
      '💡 同人文創周邊建議目標毛利率設定在 45% ~ 65% 之間。這樣即使後續遇到展場套組促銷折價（如 9 折優惠）或扣除金流運費後，依然能保有健康的最終獲利！',
  },
  {
    id: 'net-profit',
    name: '純淨利',
    english: 'Net Profit',
    category: 'profit',
    categoryLabel: '獲利與定價',
    icon: <PiggyBank className="w-4 h-4 text-emerald-600" />,
    formula: '實收總營業額 - 全部製造成本 - 打樣開版費 - 包材運費 - 金流手續費 - 繪師拆帳',
    shortDesc: '扣除所有原料、打樣、包材、物流、手續費與分潤後，真正落入自己口袋的現金。',
    detail:
      '許多新手創作者常誤把「售價 - 裸品印刷價」當作賺到的錢，結果結算時才發現扣掉攤提的打樣費、獨立背卡、泡泡袋、便利商店運費與金流 2.5% 後，根本所剩無幾甚至倒貼。純淨利才是創作者真正能拿來生活、犒賞自己與投資下一批作品的真正利潤。',
    proTip:
      '💡 本計算機會自動即時扣除平台金流抽成與合作繪師分潤，您看到的純淨利即為「最真實的稅後入袋現金」。',
  },
  {
    id: 'bep',
    name: '損益平衡件數 (BEP)',
    english: 'Break-Even Point (Units)',
    category: 'safety',
    categoryLabel: '安全回本',
    icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
    formula: '總前期投入成本 ÷ 單件實收貢獻毛利 (無條件進位)',
    shortDesc: '這款周邊必須賣出幾件，才能剛好把前期付給廠商的打樣與量產費用全部賺回來。',
    detail:
      '損益平衡點是控制存貨風險最關鍵的指標！只要累積銷量達到 BEP 件數，就代表這款周邊「已經完全回本保本」。從達成 BEP 的下一件開始，後續賣出的每一件所賺的錢，全都是無成本負擔的純利潤！',
    proTip:
      '💡 查看「平均保本率」，若某商品需要賣出 85% 以上才能保本，代表定價過低或成本過高，風險偏高；理想的同人周邊保本率建議控制在 40% ~ 60% 左右。',
  },
  {
    id: 'break-even-rate',
    name: '平均保本率',
    english: 'Break-Even Rate %',
    category: 'safety',
    categoryLabel: '安全回本',
    icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
    formula: '損益平衡件數 ÷ 總生產製作數量 × 100%',
    shortDesc: '至少要賣掉總製作量的百分之幾，才能打平全部的前期投入資金。',
    detail:
      '例如你製作了 100 個壓克力立牌，損益平衡件數算出來是 45 件，保本率就是 45%。代表展場第一天只要賣掉不到一半，你的本金就已經全數回收，剩下的 55 個無論是慢慢賣、開通販或做促銷，都是淨賺。',
    proTip:
      '💡 保本率越低越安全！如果保本率接近 90%，意味著只有近乎「完售」才能不賠錢，一旦人潮不如預期就會產生實質負債。',
  },
  {
    id: 'direct-cost',
    name: '單件直接成本',
    english: 'Unit Direct Cost',
    category: 'cost',
    categoryLabel: '成本結構',
    icon: <Package className="w-4 h-4 text-indigo-600" />,
    formula: '裸品工廠單價 + (總打樣費 ÷ 數量) + 單件包材 + 單件運費 + 額外耗材',
    shortDesc: '做出一個可以完整雙手遞給客人的成品，背後付出的所有平均物理硬成本。',
    detail:
      '除了給工廠的商品本體費用，更包含了專屬自黏袋、包裝背卡、防撞泡泡布、整批寄送的單件平均運費，以及前期打樣分攤。這些每一筆都是真金白銀的支出。',
    proTip:
      '💡 切記將「每件包材」與「運費」算入單件成本中，積少成多，一包 2 元的自黏袋在幾百件產量下也是上千元的差距！',
  },
  {
    id: 'sample-cost',
    name: '打樣與開版費',
    english: 'Sample & Mold Cost',
    category: 'cost',
    categoryLabel: '成本結構',
    icon: <Layers className="w-4 h-4 text-amber-500" />,
    formula: '攤提至單件 = 總打樣開版費 ÷ 總生產件數',
    shortDesc: '量產前為了確認顏色細節所付出的打樣費用，或印刷刀模、開版費等固定支出。',
    detail:
      '打樣費屬於固定成本。如果一款新品只做 20 個，300 元的打樣費會讓每個商品成本直接暴增 15 元；但如果做 300 個，每個商品只分攤 1 元。小量試印時，打樣費往往是決定定價是否合理的關鍵分水嶺。',
    proTip:
      '💡 如果同一個刀模或版型在後續場次會「重複加印」，後續加印批次就可以將打樣費設為 0 元，獲利能力會大幅提升！',
  },
  {
    id: 'payment-fee',
    name: '金流與平台手續費',
    english: 'Payment & Platform Fee',
    category: 'fee',
    categoryLabel: '手續費與分潤',
    icon: <CreditCard className="w-4 h-4 text-rose-500" />,
    formula: '單件售價 × 手續費率 % + 每筆固定訂單處理費',
    shortDesc: '第三方金流（綠界、藍新）或電商平台（賣貨便、蝦皮）每筆交易抽取的趴數。',
    detail:
      '金流費率最容易被忽略的關鍵在於：它是根據「交易總金額（客人刷卡或付款金額）」計算，而不是扣除成本後的純利！例如 500 元的商品若被扣 3% 金流費就是 15 元，如果沒事先算進定價中，就會侵蝕掉辛苦賺來的毛利。',
    proTip:
      '💡 在本計算機中，若個別商品走不同通路（例如有的走場次現場現金 0%、有的走賣貨便或綠界），可個別勾選「自訂獨立金流手續費」精準試算！',
  },
  {
    id: 'designer-fee',
    name: '繪師抽成 / 設計分潤',
    english: 'Designer Royalty',
    category: 'fee',
    categoryLabel: '手續費與分潤',
    icon: <UserCheck className="w-4 h-4 text-cyan-600" />,
    formula: '固定金額（如每本 30 元） 或 依售價比例抽成（如售價 10%）',
    shortDesc: '拆分給客座繪師、合作作者或特邀插畫家的分潤稿費。',
    detail:
      '如果周邊是與其他繪師跨界聯名或合本企劃，通常會有「賣出一件抽多少固定金額」或「按售價百分比抽成」的約定。本系統將這筆支出獨立拆分出來，讓你在對帳時一清二楚。',
    proTip:
      '💡 點選商品卡片中的「繪師/設計抽成」，即可切換無抽成、每件固定金額、或售價百分比抽成，讓合夥記帳不再算到頭痛。',
  },
];

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTermId?: string | null;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  initialTermId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  React.useEffect(() => {
    if (isOpen && initialTermId) {
      // Find term's category if needed
      const targetTerm = GLOSSARY_TERMS.find((t) => t.id === initialTermId);
      if (targetTerm) {
        setSelectedCategory('all');
        setSearchQuery('');
        setTimeout(() => {
          const el = document.getElementById(`glossary-${initialTermId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-2', 'ring-purple-500');
            setTimeout(() => {
              el.classList.remove('ring-2', 'ring-purple-500');
            }, 2500);
          }
        }, 100);
      }
    }
  }, [isOpen, initialTermId]);

  if (!isOpen) return null;

  const filteredTerms = GLOSSARY_TERMS.filter((term) => {
    const matchesSearch =
      term.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.detail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">專有名詞小百科</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  名詞與指標速查
                </span>
              </div>
              <p className="text-xs text-slate-500">
                深入理解毛利率、純淨利、損益平衡點 (BEP) 等財務關鍵字
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

        {/* Search & Filter Bar */}
        <div className="px-6 py-3.5 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋名詞（例如：毛利率、BEP...）"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: '全部名詞' },
              { id: 'profit', label: '獲利與定價' },
              { id: 'safety', label: '安全回本' },
              { id: 'cost', label: '成本結構' },
              { id: 'fee', label: '手續費與分潤' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body: Cards List */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700">
          {filteredTerms.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              找不到符合「{searchQuery}」的專有名詞，請嘗試其他關鍵字。
            </div>
          ) : (
            filteredTerms.map((term) => (
              <div
                key={term.id}
                id={`glossary-${term.id}`}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-purple-200/80 hover:shadow-sm transition-all space-y-3"
              >
                {/* Title line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {term.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {term.name}
                        </h4>
                        <span className="font-mono text-xs text-slate-400">
                          ({term.english})
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 self-start sm:self-auto">
                    {term.categoryLabel}
                  </span>
                </div>

                {/* Short Desc */}
                <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  {term.shortDesc}
                </p>

                {/* Formula (if any) */}
                {term.formula && (
                  <div className="text-xs font-mono bg-purple-50/50 border border-purple-100 text-purple-900 p-2.5 rounded-xl flex items-start gap-2">
                    <span className="font-bold text-purple-700 shrink-0">📐 計算公式：</span>
                    <span className="break-all">{term.formula}</span>
                  </div>
                )}

                {/* Detail */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {term.detail}
                </p>

                {/* Pro tip */}
                <div className="text-xs text-amber-900 bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-xl leading-relaxed">
                  {term.proTip}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 hidden sm:inline">
            掌握關鍵財務思維，讓熱愛創作的同人企劃走得更長久！
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all cursor-pointer ml-auto"
          >
            關閉百科
          </button>
        </div>
      </div>
    </div>
  );
};
