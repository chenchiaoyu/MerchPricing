/*!
 * 商品定價小幫手 MerchPricing
 * 視覺化圖表 Ｘ 拆解成本結構
 * © 2026 chiaoyu design. All Rights Reserved
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  PackagePlus,
  LayoutGrid,
  Table as TableIcon,
  Search,
  SlidersHorizontal,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Info,
  Layers,
} from 'lucide-react';
import { ProductItem, GlobalSettings, OverheadExpenses, DEFAULT_TAX_SETTINGS } from './types';
import { calculateProduct, calculateProjectSummary } from './utils/pricing';
import { Header } from './components/Header';
import { ProjectSummary } from './components/ProjectSummary';
import { OverheadExpensesCard } from './components/OverheadExpensesCard';
import { ProductCard } from './components/ProductCard';
import { ProductTable } from './components/ProductTable';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { FinancialCompositionChart } from './components/FinancialCompositionChart';
import { PresetModal } from './components/PresetModal';
import { SettingsModal } from './components/SettingsModal';
import { ReadmeModal } from './components/ReadmeModal';
import { GlossaryModal } from './components/GlossaryModal';
import { CsvImportModal } from './components/CsvImportModal';
import { MerchandisePreset } from './data/presets';

const STORAGE_KEY_PRODUCTS = 'merch_pricing_products_v3';
const STORAGE_KEY_SETTINGS = 'merch_pricing_settings_v3';
const STORAGE_KEY_OVERHEAD = 'merch_pricing_overhead_v3';

const DEFAULT_SETTINGS: GlobalSettings = {
  paymentFeeRate: 2.5,
  paymentFixedFee: 0,
  defaultTargetMargin: 45,
  currency: 'NT$',
  taxSettings: DEFAULT_TAX_SETTINGS,
};

const DEFAULT_OVERHEAD: OverheadExpenses = {
  shippingCost: 0,
  laborCost: 0,
  extraCost: 0,
  customItems: [],
  freeShippingEnabled: false,
  freeShippingThreshold: 1000,
  freeShippingPerOrder: 60,
  freeShippingEstimatedOrders: 20,
  freeShippingCost: 1200,
};

const DEFAULT_PRODUCTS: ProductItem[] = [];

export function App() {
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) {
        const parsed: ProductItem[] = JSON.parse(saved);
        // If the saved data only consists of the previous default sample products, clear to empty
        const isLegacySampleOnly =
          parsed.length === 2 &&
          parsed.some((p) => p.id === 'prod-sample-1') &&
          parsed.some((p) => p.id === 'prod-sample-2');
        if (!isLegacySampleOnly) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load products from storage', e);
    }
    return DEFAULT_PRODUCTS;
  });

  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          taxSettings: {
            ...DEFAULT_TAX_SETTINGS,
            ...(parsed.taxSettings || {}),
          },
        };
      }
    } catch (e) {
      console.error('Failed to load settings from storage', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [overheadExpenses, setOverheadExpenses] = useState<OverheadExpenses>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OVERHEAD);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load overhead from storage', e);
    }
    return DEFAULT_OVERHEAD;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsModalTab, setSettingsModalTab] = useState<'general' | 'tax'>('general');
  const [isReadmeModalOpen, setIsReadmeModalOpen] = useState(false);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState(false);
  const [isCsvImportModalOpen, setIsCsvImportModalOpen] = useState(false);
  const [activeGlossaryTermId, setActiveGlossaryTermId] = useState<string | null>(null);

  const handleOpenSettingsModal = (tab: 'general' | 'tax' = 'general') => {
    setSettingsModalTab(tab);
    setIsSettingsModalOpen(true);
  };

  const handleOpenGlossary = (termId?: string) => {
    setActiveGlossaryTermId(termId || null);
    setIsGlossaryModalOpen(true);
  };

  // Console Watermark / Easter Egg for Developers
  useEffect(() => {
    console.log(
      '%c 商品定價小幫手 MerchPricing %c © 2026 chiaoyu design. All Rights Reserved ',
      'background: #4F46E5; color: #FFFFFF; font-size: 12px; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
      'background: #1E1B4B; color: #C7D2FE; font-size: 12px; font-family: monospace; padding: 4px 8px; border-radius: 0 4px 4px 0;'
    );
    console.log(
      '%c✨ 視覺化圖表 Ｘ 拆解成本結構 | 專為創作者與微型電商打造的定價財務工具',
      'color: #6366F1; font-size: 11px; font-style: italic; padding: 2px 0;'
    );
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to storage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(globalSettings));
    } catch (e) {
      console.error('Failed to save settings to storage', e);
    }
  }, [globalSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OVERHEAD, JSON.stringify(overheadExpenses));
    } catch (e) {
      console.error('Failed to save overhead to storage', e);
    }
  }, [overheadExpenses]);

  // Perform Calculations
  const calculations = useMemo(() => {
    return products.map((product) => calculateProduct(product, globalSettings));
  }, [products, globalSettings]);

  // Project Summary Data
  const summary = useMemo(() => {
    return calculateProjectSummary(calculations, overheadExpenses, globalSettings);
  }, [calculations, overheadExpenses, globalSettings]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return Array.from(set);
  }, [products]);

  // Filtered Calculations
  const filteredCalculations = useMemo(() => {
    return calculations.filter((c) => {
      const p = c.product;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [calculations, searchQuery, selectedCategory]);

  // Product Operations
  const handleUpdateProduct = (id: string, updates: Partial<ProductItem>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handleAddNewProduct = () => {
    const newProduct: ProductItem = {
      id: 'prod-' + Date.now(),
      name: `全新周邊企劃 #${products.length + 1}`,
      category: '新品企劃',
      quantity: 50,
      baseCost: 35,
      sampleCost: 200,
      packagingCost: 3,
      shippingCost: 2,
      laborCost: 0,
      extraCost: 0,
      customFee: false,
      paymentFeeRate: globalSettings.paymentFeeRate,
      paymentFixedFee: globalSettings.paymentFixedFee,
      designerFeeType: 'none',
      designerFeeValue: 0,
      pricingMode: 'margin',
      targetMargin: globalSettings.defaultTargetMargin,
      targetTotalProfit: 3000,
      customPrice: 120,
      freeShipping: false,
      shippingSubsidy: globalSettings.defaultShippingSubsidy !== undefined ? globalSettings.defaultShippingSubsidy : 60,
      productionDays: 14,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleSelectPreset = (preset: MerchandisePreset) => {
    const newProduct: ProductItem = {
      id: 'prod-' + Date.now(),
      name: preset.name,
      category: preset.category,
      quantity: preset.defaultQuantity,
      baseCost: preset.defaultBaseCost,
      sampleCost: preset.defaultSampleCost,
      packagingCost: preset.defaultPackagingCost,
      shippingCost: preset.defaultShippingCost,
      laborCost: 0,
      extraCost: 0,
      customFee: false,
      paymentFeeRate: globalSettings.paymentFeeRate,
      paymentFixedFee: globalSettings.paymentFixedFee,
      designerFeeType: 'none',
      designerFeeValue: 0,
      pricingMode: 'margin',
      targetMargin: preset.defaultTargetMargin,
      targetTotalProfit: 4000,
      customPrice: 100,
      freeShipping: false,
      shippingSubsidy: globalSettings.defaultShippingSubsidy !== undefined ? globalSettings.defaultShippingSubsidy : 60,
      productionDays: preset.defaultProductionDays,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDuplicateProduct = (product: ProductItem) => {
    const duplicated: ProductItem = {
      ...product,
      id: 'prod-' + Date.now(),
      name: `${product.name} (複製)`,
    };
    setProducts((prev) => [...prev, duplicated]);
  };

  const handleResetData = () => {
    if (window.confirm('確定要清空所有商品資料，重新開始規劃嗎？')) {
      setProducts([]);
      setGlobalSettings(DEFAULT_SETTINGS);
      setOverheadExpenses(DEFAULT_OVERHEAD);
    }
  };

  const handleImportCsv = (importedProducts: ProductItem[], replace: boolean) => {
    if (replace) {
      setProducts(importedProducts);
    } else {
      setProducts((prev) => [...prev, ...importedProducts]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header */}
      <Header
        calculations={calculations}
        summary={summary}
        globalSettings={globalSettings}
        overheadExpenses={overheadExpenses}
        onOpenPresetModal={() => setIsPresetModalOpen(true)}
        onOpenSettingsModal={handleOpenSettingsModal}
        onOpenReadmeModal={() => setIsReadmeModalOpen(true)}
        onOpenGlossaryModal={() => handleOpenGlossary()}
        onOpenCsvImportModal={() => setIsCsvImportModalOpen(true)}
        onResetData={handleResetData}
        onAddNewProduct={handleAddNewProduct}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* 1. Global Key Metrics Summary Dashboard */}
        <ProjectSummary
          summary={summary}
          calculations={calculations}
          defaultTargetMargin={globalSettings.defaultTargetMargin}
          onOpenGlossary={handleOpenGlossary}
          onOpenSettingsModal={handleOpenSettingsModal}
        />

        {/* 2. Global Shared Overhead Expenses (Shipping, Labor, Extra Supplies) */}
        <OverheadExpensesCard
          expenses={overheadExpenses}
          onChange={setOverheadExpenses}
          onOpenGlossary={handleOpenGlossary}
        />

        {/* 3. Workspace Filter & Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          {/* Search and Category Filter */}
          <div className="flex items-center gap-3 flex-1 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋商品名稱或標籤..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200/80 focus:border-indigo-600 focus:bg-white outline-hidden transition-all shadow-2xs"
              />
            </div>

            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-2 px-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 outline-hidden focus:border-indigo-600 focus:bg-white cursor-pointer transition-all"
              >
                <option value="all">全部分類 ({products.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* View Toggle and Quick Add */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs border border-slate-200/60">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="精美卡片視圖"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
                <span>卡片視圖</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="表格快速對齊"
              >
                <TableIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>表格視圖</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddNewProduct}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <PackagePlus className="w-4 h-4" />
              <span>新增品項</span>
            </button>
          </div>
        </div>

        {/* 3. Products List View (Cards or Table) */}
        {products.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-12 sm:p-16 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 mx-auto rounded-2xl flex items-center justify-center border border-indigo-100 shadow-xs">
              <PackagePlus className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">目前尚無規劃中的周邊品項</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                您可以點擊上方「<strong>常用周邊規格範本</strong>」一鍵帶入壓克力立牌、胸章或畫冊行情，或點擊「<strong>新增品項</strong>」自由建立商品！
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsPresetModalOpen(true)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>瀏覽規格範本庫</span>
              </button>
              <button
                type="button"
                onClick={handleAddNewProduct}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <PackagePlus className="w-4 h-4" />
                <span>新增第一個品項</span>
              </button>
            </div>
          </div>
        ) : filteredCalculations.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 mx-auto rounded-2xl flex items-center justify-center border border-slate-200">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">查無相符的周邊商品</h3>
            <p className="text-xs text-slate-500">
              請嘗試調整搜尋關鍵字或分類篩選，或直接點擊上方新增商品
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all inline-block cursor-pointer shadow-2xs"
            >
              清除所有篩選
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCalculations.map((calc, idx) => (
              <ProductCard
                key={calc.product.id}
                calc={calc}
                colorIndex={idx}
                globalSettings={globalSettings}
                onUpdate={handleUpdateProduct}
                onDelete={handleDeleteProduct}
                onDuplicate={handleDuplicateProduct}
                onOpenGlossary={handleOpenGlossary}
              />
            ))}
          </div>
        ) : (
          <ProductTable
            calculations={filteredCalculations}
            globalSettings={globalSettings}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
            onDuplicate={handleDuplicateProduct}
            onOpenGlossary={handleOpenGlossary}
          />
        )}

        {/* 4. Sales Sensitivity Scenario Simulator */}
        <ScenarioSimulator
          calculations={calculations}
          summary={summary}
          onOpenGlossary={handleOpenGlossary}
        />

        {/* 5. Overall Financial Composition Chart (Costs, Profit, Royalties, Platform Fees) */}
        <FinancialCompositionChart calculations={calculations} summary={summary} />

        {/* 6. Footer Information & Credit */}
        <footer className="pt-8 pb-10 border-t border-slate-200/70 text-center">
          <p className="text-xs text-slate-400 font-normal tracking-wide">
            © 2026 chiaoyu design. All Rights Reserved
          </p>
        </footer>
      </main>

      {/* Modals */}
      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectPreset={handleSelectPreset}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={globalSettings}
        onSaveSettings={setGlobalSettings}
        initialTab={settingsModalTab}
      />
      <ReadmeModal
        isOpen={isReadmeModalOpen}
        onClose={() => setIsReadmeModalOpen(false)}
        onOpenGlossary={() => handleOpenGlossary()}
      />
      <GlossaryModal
        isOpen={isGlossaryModalOpen}
        onClose={() => setIsGlossaryModalOpen(false)}
        initialTermId={activeGlossaryTermId}
      />
      <CsvImportModal
        isOpen={isCsvImportModalOpen}
        onClose={() => setIsCsvImportModalOpen(false)}
        onImportProducts={handleImportCsv}
        currentCount={products.length}
      />
    </div>
  );
}

export default App;
