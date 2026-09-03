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
import { ProductItem, GlobalSettings } from './types';
import { calculateProduct, calculateProjectSummary } from './utils/pricing';
import { Header } from './components/Header';
import { ProjectSummary } from './components/ProjectSummary';
import { ProductCard } from './components/ProductCard';
import { ProductTable } from './components/ProductTable';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { FinancialCompositionChart } from './components/FinancialCompositionChart';
import { PresetModal } from './components/PresetModal';
import { SettingsModal } from './components/SettingsModal';
import { MerchandisePreset } from './data/presets';

const STORAGE_KEY_PRODUCTS = 'merch_pricing_products_v2';
const STORAGE_KEY_SETTINGS = 'merch_pricing_settings_v2';

const DEFAULT_SETTINGS: GlobalSettings = {
  paymentFeeRate: 2.5,
  paymentFixedFee: 0,
  defaultTargetMargin: 45,
  currency: 'NT$',
};

const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: '原創角色雙層壓克力立牌 (8cm)',
    category: '壓克力周邊',
    quantity: 60,
    baseCost: 45,
    sampleCost: 300,
    packagingCost: 4,
    shippingCost: 3,
    extraCost: 0,
    customFee: false,
    paymentFeeRate: 2.5,
    paymentFixedFee: 0,
    designerFeeType: 'none',
    designerFeeValue: 0,
    pricingMode: 'margin',
    targetMargin: 50,
    targetTotalProfit: 5000,
    customPrice: 150,
    productionDays: 14,
  },
  {
    id: 'prod-2',
    name: '鐳射雙閃馬口鐵胸章 (58mm)',
    category: '徽章周邊',
    quantity: 120,
    baseCost: 16,
    sampleCost: 150,
    packagingCost: 2,
    shippingCost: 1.5,
    extraCost: 0,
    customFee: false,
    paymentFeeRate: 2.5,
    paymentFixedFee: 0,
    designerFeeType: 'none',
    designerFeeValue: 0,
    pricingMode: 'margin',
    targetMargin: 55,
    targetTotalProfit: 4000,
    customPrice: 60,
    productionDays: 10,
  },
  {
    id: 'prod-3',
    name: '全彩燙金畫冊插畫本 (B5/32P)',
    category: '紙本刊物',
    quantity: 80,
    baseCost: 85,
    sampleCost: 500,
    packagingCost: 6,
    shippingCost: 4,
    extraCost: 0,
    customFee: false,
    paymentFeeRate: 2.5,
    paymentFixedFee: 0,
    designerFeeType: 'percent_price',
    designerFeeValue: 10,
    pricingMode: 'price',
    targetMargin: 50,
    targetTotalProfit: 8000,
    customPrice: 280,
    productionDays: 20,
  },
];

export function App() {
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load products from storage', e);
    }
    return DEFAULT_PRODUCTS;
  });

  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load settings from storage', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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

  // Perform Calculations
  const calculations = useMemo(() => {
    return products.map((product) => calculateProduct(product, globalSettings));
  }, [products, globalSettings]);

  // Project Summary Data
  const summary = useMemo(() => {
    return calculateProjectSummary(calculations);
  }, [calculations]);

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
      productionDays: preset.defaultProductionDays,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    if (products.length <= 1) {
      if (!window.confirm('只剩下一項商品，確定要刪除嗎？')) return;
    }
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
    if (window.confirm('確定要將所有商品重設為預設範例資料嗎？')) {
      setProducts(DEFAULT_PRODUCTS);
      setGlobalSettings(DEFAULT_SETTINGS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header */}
      <Header
        calculations={calculations}
        summary={summary}
        globalSettings={globalSettings}
        onOpenPresetModal={() => setIsPresetModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
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
        />

        {/* 2. Workspace Filter & Controls */}
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
        {filteredCalculations.length === 0 ? (
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
          />
        )}

        {/* 4. Sales Sensitivity Scenario Simulator */}
        <ScenarioSimulator calculations={calculations} summary={summary} />

        {/* 5. Overall Financial Composition Chart (Costs, Profit, Royalties, Platform Fees) */}
        <FinancialCompositionChart calculations={calculations} summary={summary} />
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
      />
    </div>
  );
}

export default App;
