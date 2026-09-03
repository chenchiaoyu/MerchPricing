import { ProductItem, ProductCalculation, GlobalSettings, ProjectSummaryData, OverheadExpenses } from '../types';

export function calculateProduct(
  product: ProductItem,
  globalSettings: GlobalSettings
): ProductCalculation {
  const quantity = Math.max(1, Math.round(product.quantity || 1));
  const bundleUnits = Math.max(1, Math.round(product.bundleUnits || 1));
  const totalBundles = Math.max(1, Math.floor(quantity / bundleUnits));

  const baseCost = Math.max(0, product.baseCost || 0);
  const sampleCost = Math.max(0, product.sampleCost || 0);
  const packagingCost = Math.max(0, product.packagingCost || 0);
  const shippingCost = Math.max(0, product.shippingCost || 0);
  const laborCost = Math.max(0, product.laborCost || 0);
  const extraCost = Math.max(0, product.extraCost || 0);

  // 單件攤提 (以每件單品為基準)
  const unitBaseCost = baseCost;
  const unitSampleCost = sampleCost / quantity;
  const unitPackagingCost = packagingCost;
  const unitShippingCost = shippingCost;
  const unitLaborCost = laborCost;
  const unitExtraCost = extraCost;
  const unitDirectCost = unitBaseCost + unitSampleCost + unitPackagingCost + unitShippingCost + unitLaborCost + unitExtraCost;

  // 整份方案/組合直接成本 (bundleDirectCost)
  const bundleDirectCost = unitDirectCost * bundleUnits;

  // 費率
  const paymentRate = (product.customFee ? (product.paymentFeeRate || 0) : globalSettings.paymentFeeRate) / 100;
  const paymentFixed = product.customFee ? (product.paymentFixedFee || 0) : globalSettings.paymentFixedFee;

  let fixedDesignerFee = 0;
  let designerRate = 0;
  const isProfitSplit = product.designerFeeType === 'percent_profit';
  const profitSplitRate = isProfitSplit ? Math.min(0.95, Math.max(0, (product.designerFeeValue || 0) / 100)) : 0;

  if (product.designerFeeType === 'percent_cost') {
    fixedDesignerFee = unitDirectCost * ((product.designerFeeValue || 0) / 100);
  } else if (product.designerFeeType === 'fixed_per_unit') {
    fixedDesignerFee = product.designerFeeValue || 0;
  } else if (product.designerFeeType === 'percent_price') {
    designerRate = (product.designerFeeValue || 0) / 100;
  }

  // 免運費設定：若提供免運，出貨運費由商家全額吸收 (預設每組/每件吸收 60 元)
  const isFreeShipping = Boolean(product.freeShipping);
  const unitShippingSubsidy = isFreeShipping
    ? Math.max(0, product.shippingSubsidy !== undefined ? product.shippingSubsidy : 60)
    : 0;

  // 整份方案非售價相依之固定成本 (包含單筆固定手續費 + 每件設計師固定費 * 組合件數 + 商家吸收之免運運費)
  const nonPriceDependentBundleCost = bundleDirectCost + paymentFixed + (fixedDesignerFee * bundleUnits) + unitShippingSubsidy;
  const variableRate = paymentRate + designerRate;

  const warnings: string[] = [];

  // 計算基準原價 (Original Price)
  let originalBundlePrice = 0;

  if (product.pricingMode === 'margin') {
    const targetMarginRate = (product.targetMargin || 0) / 100;
    if (isProfitSplit) {
      // 淨利拆成模式：淨利 = (P * (1 - paymentRate) - nonPriceDependentBundleCost) * (1 - profitSplitRate)
      // 要求 淨利 / P = targetMarginRate
      const denom = (1 - paymentRate) - (targetMarginRate / (1 - profitSplitRate));
      if (denom <= 0.05) {
        warnings.push('目標毛利率與創作者淨利拆成比例過高，已調整分母以避免定價過高');
        originalBundlePrice = nonPriceDependentBundleCost / 0.05;
      } else {
        originalBundlePrice = nonPriceDependentBundleCost / denom;
      }
    } else {
      const denominator = 1 - variableRate - targetMarginRate;
      if (denominator <= 0.05) {
        warnings.push('目標毛利率與手續費總和過高（≥95%），已調整分母以防定價過高');
        originalBundlePrice = nonPriceDependentBundleCost / 0.05;
      } else {
        originalBundlePrice = nonPriceDependentBundleCost / denominator;
      }
    }
  } else if (product.pricingMode === 'profit') {
    const targetProfit = Math.max(0, product.targetTotalProfit || 0);
    const bundleTargetProfit = targetProfit / totalBundles;
    if (isProfitSplit) {
      const neededPreProfit = bundleTargetProfit / (1 - profitSplitRate);
      const denominator = 1 - paymentRate;
      if (denominator <= 0.05) {
        warnings.push('金流手續費過高（≥95%）');
        originalBundlePrice = (nonPriceDependentBundleCost + neededPreProfit) / 0.05;
      } else {
        originalBundlePrice = (nonPriceDependentBundleCost + neededPreProfit) / denominator;
      }
    } else {
      const denominator = 1 - variableRate;
      if (denominator <= 0.05) {
        warnings.push('手續費率過高（≥95%）');
        originalBundlePrice = (nonPriceDependentBundleCost + bundleTargetProfit) / 0.05;
      } else {
        originalBundlePrice = (nonPriceDependentBundleCost + bundleTargetProfit) / denominator;
      }
    }
  } else {
    // customPrice：使用者輸入的單件定價 (如單件 990，數量 4 則原價為 3960)
    const customPerUnit = Math.max(1, product.customPrice || 100);
    originalBundlePrice = customPerUnit * bundleUnits;
  }

  originalBundlePrice = Math.max(1, originalBundlePrice);
  const originalUnitPrice = originalBundlePrice / bundleUnits;

  // 方案專屬單獨折價計算 (與全場促銷分開)
  const isDiscountActive = Boolean(product.discountEnabled && (product.discountPercent ?? 0) > 0);
  const discountPercent = isDiscountActive ? Math.min(100, Math.max(0, product.discountPercent || 0)) : 0;
  const discountSavings = originalBundlePrice * (discountPercent / 100);
  
  // 最終實際成交售價 (折後特惠價，顧客付的實付售價)
  const finalUnitPrice = Math.max(1, originalBundlePrice - discountSavings);

  // 以實際成交售價計算抽成與成本
  const unitPaymentFee = finalUnitPrice * paymentRate + paymentFixed;
  let unitDesignerFee = 0;

  if (isProfitSplit) {
    const preProfit = finalUnitPrice - bundleDirectCost - unitPaymentFee;
    if (preProfit > 0) {
      unitDesignerFee = preProfit * profitSplitRate;
    }
  } else if (product.designerFeeType === 'percent_price') {
    unitDesignerFee = finalUnitPrice * designerRate;
  } else {
    unitDesignerFee = fixedDesignerFee * bundleUnits;
  }

  const unitTotalCost = bundleDirectCost + unitPaymentFee + unitDesignerFee + unitShippingSubsidy;
  const unitNetProfit = finalUnitPrice - unitTotalCost;
  const grossMargin = finalUnitPrice > 0 ? (unitNetProfit / finalUnitPrice) * 100 : 0;

  // 批次總計 (以總製作件數或總組合套數計算)
  const totalProductionCost = unitDirectCost * quantity;
  const totalShippingSubsidy = unitShippingSubsidy * totalBundles;
  const totalRevenue = finalUnitPrice * totalBundles;
  const totalProfit = unitNetProfit * totalBundles;
  const totalFees = (unitPaymentFee + unitDesignerFee) * totalBundles;

  // 損益平衡
  // 每賣出一套方案實際進帳（扣除當次交易抽成與商家吸收之免運運費）：
  let netInflowPerBundle = finalUnitPrice - unitPaymentFee - unitShippingSubsidy;
  if (isProfitSplit) {
    const preProfit = finalUnitPrice - bundleDirectCost - unitPaymentFee;
    if (preProfit > 0) {
      netInflowPerBundle -= preProfit * profitSplitRate;
    }
  } else if (product.designerFeeType === 'percent_price') {
    netInflowPerBundle -= finalUnitPrice * designerRate;
  }
  let breakEvenBundles = totalBundles;
  let breakEvenPercentage = 100;

  if (netInflowPerBundle > 0) {
    breakEvenBundles = Math.min(totalBundles, Math.ceil(totalProductionCost / netInflowPerBundle));
    breakEvenPercentage = (breakEvenBundles / totalBundles) * 100;
  } else {
    warnings.push('每套銷售淨額扣除免運與抽成後小於等於零，無法達成損益平衡！');
  }

  const breakEvenUnits = breakEvenBundles * bundleUnits;
  const breakEvenRevenue = breakEvenBundles * finalUnitPrice;

  const isLoss = unitNetProfit < 0;
  const isMarginTargetMet = grossMargin >= (product.targetMargin || 0) - 0.05;

  // 推薦整數定價 (以單件或每套為參考)
  const smartPrices = generateSmartPrices(
    finalUnitPrice,
    nonPriceDependentBundleCost,
    variableRate,
    totalBundles
  );

  return {
    product,
    bundleUnits,
    totalBundles,
    originalUnitPrice: round2(originalUnitPrice),
    originalBundlePrice: round2(originalBundlePrice),
    discountPercent: round1(discountPercent),
    discountSavings: round2(discountSavings),
    unitBaseCost: round2(unitBaseCost),
    unitSampleCost: round2(unitSampleCost),
    unitPackagingCost: round2(unitPackagingCost),
    unitShippingCost: round2(unitShippingCost),
    unitLaborCost: round2(unitLaborCost),
    unitExtraCost: round2(unitExtraCost),
    unitDirectCost: round2(unitDirectCost),
    bundleDirectCost: round2(bundleDirectCost),
    finalUnitPrice: round2(finalUnitPrice),
    unitPaymentFee: round2(unitPaymentFee),
    unitDesignerFee: round2(unitDesignerFee),
    isFreeShipping,
    unitShippingSubsidy: round2(unitShippingSubsidy),
    unitTotalCost: round2(unitTotalCost),
    unitNetProfit: round2(unitNetProfit),
    grossMargin: round1(grossMargin),
    totalProductionCost: round0(totalProductionCost),
    totalShippingSubsidy: round0(totalShippingSubsidy),
    totalRevenue: round0(totalRevenue),
    totalProfit: round0(totalProfit),
    totalFees: round0(totalFees),
    breakEvenUnits: Math.max(1, breakEvenUnits),
    breakEvenPercentage: round1(breakEvenPercentage),
    breakEvenRevenue: round0(breakEvenRevenue),
    isMarginTargetMet,
    isLoss,
    warnings,
    smartPrices,
  };
}

function generateSmartPrices(
  price: number,
  nonPriceCost: number,
  variableRate: number,
  quantity: number
) {
  const candidates: { label: string; price: number }[] = [];
  const rounded = Math.round(price);

  // 整十元
  const tenRound = Math.ceil(price / 10) * 10;
  if (tenRound !== rounded) {
    candidates.push({ label: '整十元好找零', price: tenRound });
  }

  // 展場友善（50 或 100 倍數，無銅板零錢）
  const fiftyRound = Math.ceil(price / 50) * 50;
  if (fiftyRound > 0 && !candidates.some(c => c.price === fiftyRound)) {
    candidates.push({ label: '展場免找零 ($50倍數)', price: fiftyRound });
  }

  // 吸引力定價 (尾數 9 或 99)
  let charm = rounded;
  if (price > 100) {
    charm = Math.floor(price / 100) * 100 + 90;
    if (charm <= price) charm += 100;
  } else {
    charm = Math.floor(price / 10) * 10 + 9;
    if (charm < price) charm += 10;
  }
  if (!candidates.some(c => c.price === charm)) {
    candidates.push({ label: '心理定價 ($X9)', price: charm });
  }

  return candidates.slice(0, 3).map(c => {
    const unitFee = c.price * variableRate;
    const unitProfit = c.price - nonPriceCost - unitFee;
    const margin = c.price > 0 ? (unitProfit / c.price) * 100 : 0;
    return {
      label: c.label,
      price: c.price,
      margin: round1(margin),
      profit: round0(unitProfit * quantity),
    };
  });
}

export function calculateProjectSummary(
  calculations: ProductCalculation[],
  overheadExpenses?: OverheadExpenses
): ProjectSummaryData {
  const totalProductsCount = calculations.length;
  // 只計算未被隱藏排除的商品 (enabled !== false)
  const activeCalculations = calculations.filter((c) => c.product.enabled !== false);
  const activeProductsCount = activeCalculations.length;
  const excludedProductsCount = totalProductsCount - activeProductsCount;

  const customItemsTotal = overheadExpenses?.customItemsEnabled
    ? (overheadExpenses?.customItems || []).reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
      )
    : 0;
  const overheadFreeShipping = (overheadExpenses?.freeShippingEnabled ? overheadExpenses.freeShippingCost : 0) || 0;
  const totalOverheadCost = round0(
    (overheadExpenses?.shippingCost || 0) +
    (overheadExpenses?.laborCost || 0) +
    (overheadExpenses?.extraCost || 0) +
    customItemsTotal +
    overheadFreeShipping
  );

  if (activeCalculations.length === 0) {
    return {
      totalItemsCount: 0,
      totalProductsCount,
      activeProductsCount: 0,
      excludedProductsCount,
      totalProductionCost: 0,
      totalOverheadCost,
      totalShippingSubsidy: overheadFreeShipping,
      totalUpfrontCost: totalOverheadCost,
      totalPotentialRevenue: 0,
      totalPotentialProfit: -totalOverheadCost,
      overallMargin: 0,
      overallROI: 0,
      averageBreakEvenRate: 0,
    };
  }

  let totalItemsCount = 0;
  let totalProductionCost = 0;
  let totalPotentialRevenue = 0;
  let totalProductProfit = 0;
  let totalProductShippingSubsidy = 0;
  let weightedBreakEvenSum = 0;

  for (const calc of activeCalculations) {
    const qty = calc.product.quantity;
    totalItemsCount += qty;
    totalProductionCost += calc.totalProductionCost;
    totalPotentialRevenue += calc.totalRevenue;
    totalProductProfit += calc.totalProfit;
    totalProductShippingSubsidy += calc.totalShippingSubsidy || 0;
    weightedBreakEvenSum += calc.breakEvenPercentage * qty;
  }

  // 全場商家吸收運費總額 = 各商品免運吸收 + 全場滿額免運吸收
  const totalShippingSubsidy = round0(totalProductShippingSubsidy + overheadFreeShipping);

  // 總前期投入 = 商品本體製作費用 + 全場獨立其他支出（總額）
  const totalUpfrontCost = totalProductionCost + totalOverheadCost;
  // 總預期純淨利 = 商品總淨利 - 全場獨立其他支出（總額）
  const totalPotentialProfit = totalProductProfit - totalOverheadCost;

  const overallMargin = totalPotentialRevenue > 0
    ? (totalPotentialProfit / totalPotentialRevenue) * 100
    : 0;

  const overallROI = totalUpfrontCost > 0
    ? (totalPotentialProfit / totalUpfrontCost) * 100
    : 0;

  const averageBreakEvenRate = totalItemsCount > 0
    ? weightedBreakEvenSum / totalItemsCount
    : 0;

  return {
    totalItemsCount,
    totalProductsCount,
    activeProductsCount,
    excludedProductsCount,
    totalProductionCost: round0(totalProductionCost),
    totalOverheadCost,
    totalUpfrontCost: round0(totalUpfrontCost),
    totalPotentialRevenue: round0(totalPotentialRevenue),
    totalPotentialProfit: round0(totalPotentialProfit),
    overallMargin: round1(overallMargin),
    overallROI: round1(overallROI),
    averageBreakEvenRate: round1(averageBreakEvenRate),
    totalShippingSubsidy,
  };
}

export function exportToCSV(
  calculations: ProductCalculation[],
  globalSettings: GlobalSettings,
  summary: ProjectSummaryData,
  overheadExpenses?: OverheadExpenses
) {
  let csv = '\uFEFF'; // UTF-8 BOM for Excel Chinese support
  csv += '周邊商品定價與組合方案試算報表\n';
  csv += `生成時間,${new Date().toLocaleString('zh-TW')}\n\n`;

  csv += '【全場概況】\n';
  csv += `商品總數,${summary.totalProductsCount} 款 (已計入: ${summary.activeProductsCount} 款，排除: ${summary.excludedProductsCount} 款)\n`;
  csv += `總製作件數,${summary.totalItemsCount} 件\n`;
  csv += `商品本體製作費用,NT$ ${summary.totalProductionCost.toLocaleString()}\n`;
  if (summary.totalOverheadCost > 0) {
    const freeShipText = overheadExpenses?.freeShippingEnabled
      ? ` / 滿額免運吸收: $${overheadExpenses?.freeShippingCost || 0}`
      : '';
    const customItemsText = (overheadExpenses?.customItems || [])
      .filter((it) => it.name && it.amount > 0)
      .map((it) => ` / ${it.name}: $${it.amount}`)
      .join('');
    csv += `全場其他獨立支出,NT$ ${summary.totalOverheadCost.toLocaleString()} (運費: $${overheadExpenses?.shippingCost || 0} / 人力: $${overheadExpenses?.laborCost || 0} / 雜支: $${overheadExpenses?.extraCost || 0}${customItemsText}${freeShipText})\n`;
  }
  if ((summary.totalShippingSubsidy || 0) > 0) {
    csv += `全場商家吸收運費總額,NT$ ${summary.totalShippingSubsidy?.toLocaleString()}\n`;
  }
  csv += `前期總投入成本,NT$ ${summary.totalUpfrontCost.toLocaleString()}\n`;
  csv += `完售預期總營收,NT$ ${summary.totalPotentialRevenue.toLocaleString()}\n`;
  csv += `完售預期總淨利,NT$ ${summary.totalPotentialProfit.toLocaleString()}\n`;
  csv += `全場綜合毛利率,${summary.overallMargin}%\n`;
  csv += `投資報酬率 (ROI),${summary.overallROI}%\n`;
  csv += `平均損益平衡率,${summary.averageBreakEvenRate}% (需賣出佔比)\n\n`;

  csv += '【商品與方案定價明細表】\n';
  csv += '狀態,商品/方案名稱,分類,每份內含件數,總製作數量,方案套數,單件直接成本,方案直接成本,方案基準原價,方案獨立折價,實收特惠售價,是否免運(商家吸收),每份商家吸收運費,每份淨利,毛利率,總投入成本,預期總營收,預期總淨利,保本件數,保本率\n';

  for (const c of calculations) {
    const p = c.product;
    const status = p.enabled === false ? '已排除' : '計入中';
    const discountStr = c.discountPercent > 0 ? `${c.discountPercent}% off (省$${c.discountSavings})` : '原價(無折價)';
    const freeShipStatus = c.isFreeShipping ? `免運(吸收$${c.unitShippingSubsidy})` : '買家自付/無免運';
    csv += `"${status}","${p.name}","${p.category || '周邊'}",${c.bundleUnits}件/份,${p.quantity}件,${c.totalBundles}份,NT$ ${c.unitDirectCost},NT$ ${c.bundleDirectCost},NT$ ${c.originalBundlePrice},"${discountStr}",NT$ ${c.finalUnitPrice},"${freeShipStatus}",NT$ ${c.unitShippingSubsidy},NT$ ${c.unitNetProfit},${c.grossMargin}%,NT$ ${c.totalProductionCost},NT$ ${c.totalRevenue},NT$ ${c.totalProfit},${c.breakEvenUnits}件,${c.breakEvenPercentage}%\n`;
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `周邊定價試算報表_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 產生乾淨純粹的 CSV 匯入範本 (可用於下載或複製)
export function generateCSVTemplate(): string {
  let csv = '\uFEFF';
  csv += '品名,分類,製作數量,單件製作費,開版打樣費,包材耗材費,定價模式,市場售價,目標獲利,目標毛利率,每組件數,折價趴數,是否免運,商家吸收運費,備註\n';
  csv += '壓克力流沙吊飾,壓克力周邊,100,38,300,5,市場售價,150,0,50,1,0,否,0,精緻雙層壓克力流沙\n';
  csv += '雙面燙金明信片組,紙本印刷,200,6,0,3,目標毛利率,0,0,60,1,0,否,0,珠光特級紙全彩印刷\n';
  csv += '紀念純棉短T,服飾周邊,50,180,500,10,總獲利目標,0,10000,0,1,0,是,60,精梳棉印花兩色(含免運商家吸收60元)\n';
  csv += '同人文創插畫設定集,紙本印刷,150,95,800,8,市場售價,250,0,50,1,0,否,0,膠裝B5全彩畫冊\n';
  csv += '四入全套收藏大禮包,超值套組,50,319,1600,26,市場售價,600,0,45,4,15,是,60,超值全套免運由賣場吸收運費\n';
  return csv;
}

// 解析使用者貼上或上傳的 CSV / TSV 內容
export function parseCSVToProducts(rawText: string, defaultSettings: GlobalSettings): {
  products: ProductItem[];
  warnings: string[];
} {
  const warnings: string[] = [];
  if (!rawText || !rawText.trim()) {
    return { products: [], warnings: ['CSV 內容為空'] };
  }

  // 去除 UTF-8 BOM
  const cleanText = rawText.replace(/^\uFEFF/, '').trim();
  const rawLines = cleanText.split(/\r\n|\n|\r/).filter((line) => line.trim().length > 0);

  if (rawLines.length === 0) {
    return { products: [], warnings: ['未找到任何資料行'] };
  }

  // 輔助函式：切分一行 CSV（同時相容逗號 `,` 與 Excel 直接複製產生的 Tab `\t`，並處理雙引號）
  const parseLine = (line: string): string[] => {
    // 偵測分隔符號
    const delimiter = line.includes('\t') && !line.includes(',') ? '\t' : ',';
    
    if (delimiter === '\t') {
      return line.split('\t').map(s => s.trim().replace(/^"(.*)"$/, '$1'));
    }

    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result.map(s => s.replace(/^"(.*)"$/, '$1').trim());
  };

  const headerLine = parseLine(rawLines[0]);
  
  // 欄位名稱對照對齊
  const getColIndex = (keywords: string[]): number => {
    return headerLine.findIndex((h) =>
      keywords.some((kw) => h.toLowerCase().includes(kw.toLowerCase()))
    );
  };

  const nameIdx = getColIndex(['品名', '商品名稱', '名稱', 'name']);
  const catIdx = getColIndex(['分類', '類別', 'category']);
  const qtyIdx = getColIndex(['製作數量', '數量', '件數', 'quantity', 'qty']);
  const baseCostIdx = getColIndex(['單件製作費', '製作費', '裸品製作費', '製作成本', '成本', 'basecost']);
  const sampleCostIdx = getColIndex(['開版打樣費', '打樣費', '開版費', '樣品費', 'samplecost']);
  const packCostIdx = getColIndex(['包材耗材費', '包材費', '包裝費', '包材', 'packagingcost']);
  const modeIdx = getColIndex(['定價模式', '模式', 'pricingmode']);
  const priceIdx = getColIndex(['市場售價', '自訂售價', '售價', '建議售價', 'price', 'customprice']);
  const profitIdx = getColIndex(['目標獲利', '總獲利目標', '目標利潤', 'profit', 'targettotalprofit']);
  const marginIdx = getColIndex(['目標毛利率', '毛利率', '毛利', 'margin', 'targetmargin']);
  const bundleIdx = getColIndex(['每組件數', '每份件數', '方案件數', '組合件數', 'bundleunits']);
  const discountIdx = getColIndex(['折價趴數', '折扣趴數', '折價', '折扣', 'discountpercent']);
  const freeShipIdx = getColIndex(['是否免運', '免運', 'freeshipping', '免運費']);
  const shipSubsidyIdx = getColIndex(['商家吸收運費', '吸收運費', '運費補貼', 'shippingsubsidy']);
  const notesIdx = getColIndex(['備註', '說明', 'notes']);

  const cleanNum = (val: string | undefined, defaultVal: number = 0): number => {
    if (!val) return defaultVal;
    const n = parseFloat(val.replace(/[^\d.-]/g, ''));
    return isNaN(n) ? defaultVal : n;
  };

  const startRow = (nameIdx !== -1 || qtyIdx !== -1 || baseCostIdx !== -1) ? 1 : 0;
  const products: ProductItem[] = [];

  for (let i = startRow; i < rawLines.length; i++) {
    const row = parseLine(rawLines[i]);
    if (row.length === 0 || (row.length === 1 && !row[0])) continue;

    // 取得各欄位值 (若為無標頭則照位置預設)
    const rawName = nameIdx !== -1 ? row[nameIdx] : row[0];
    const rawCat = catIdx !== -1 ? row[catIdx] : (row[1] || '周邊');
    const rawQty = qtyIdx !== -1 ? row[qtyIdx] : row[2];
    const rawBaseCost = baseCostIdx !== -1 ? row[baseCostIdx] : row[3];
    const rawSampleCost = sampleCostIdx !== -1 ? row[sampleCostIdx] : row[4];
    const rawPackCost = packCostIdx !== -1 ? row[packCostIdx] : row[5];
    const rawMode = modeIdx !== -1 ? row[modeIdx] : row[6];
    const rawPrice = priceIdx !== -1 ? row[priceIdx] : row[7];
    const rawProfit = profitIdx !== -1 ? row[profitIdx] : row[8];
    const rawMargin = marginIdx !== -1 ? row[marginIdx] : row[9];
    const rawBundle = bundleIdx !== -1 ? row[bundleIdx] : row[10];
    const rawDiscount = discountIdx !== -1 ? row[discountIdx] : row[11];
    const rawFreeShip = freeShipIdx !== -1 ? row[freeShipIdx] : '';
    const rawShipSubsidy = shipSubsidyIdx !== -1 ? row[shipSubsidyIdx] : '';
    const rawNotes = notesIdx !== -1 ? row[notesIdx] : row[12];

    const isFreeShipping = ['是', 'yes', 'true', '1', '免運'].includes((rawFreeShip || '').toLowerCase().trim());
    const shippingSubsidy = isFreeShipping ? Math.max(0, cleanNum(rawShipSubsidy, 60)) : 0;

    const name = (rawName || `匯入商品 ${i + 1 - startRow}`).trim();
    const quantity = Math.max(1, cleanNum(rawQty, 100));
    const baseCost = Math.max(0, cleanNum(rawBaseCost, 50));
    const sampleCost = Math.max(0, cleanNum(rawSampleCost, 0));
    const packagingCost = Math.max(0, cleanNum(rawPackCost, 5));

    // 定價模式解析
    let pricingMode: ProductItem['pricingMode'] = 'price';
    const modeStr = (rawMode || '').toLowerCase();
    if (modeStr.includes('獲利') || modeStr.includes('利潤') || modeStr.includes('profit')) {
      pricingMode = 'profit';
    } else if (modeStr.includes('毛利') || modeStr.includes('margin')) {
      pricingMode = 'margin';
    } else if (modeStr.includes('售價') || modeStr.includes('price')) {
      pricingMode = 'price';
    } else {
      // 依是否有填入售價決定
      const p = cleanNum(rawPrice, 0);
      pricingMode = p > 0 ? 'price' : 'margin';
    }

    const customPrice = Math.max(0, cleanNum(rawPrice, 150));
    const targetTotalProfit = Math.max(0, cleanNum(rawProfit, 5000));
    const targetMargin = Math.max(1, Math.min(99, cleanNum(rawMargin, defaultSettings.defaultTargetMargin || 50)));

    const bundleUnits = Math.max(1, cleanNum(rawBundle, 1));
    const discountPercent = Math.max(0, Math.min(100, cleanNum(rawDiscount, 0)));

    const item: ProductItem = {
      id: 'prod-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      name,
      category: rawCat?.trim() || '周邊',
      quantity,
      enabled: true,
      bundleUnits,
      discountEnabled: discountPercent > 0,
      discountPercent,
      freeShipping: isFreeShipping,
      shippingSubsidy,
      baseCost,
      sampleCost,
      packagingCost,
      shippingCost: 0,
      laborCost: 0,
      extraCost: 0,
      customFee: false,
      paymentFeeRate: defaultSettings.paymentFeeRate,
      paymentFixedFee: defaultSettings.paymentFixedFee,
      designerFeeType: 'none',
      designerFeeValue: 0,
      pricingMode,
      targetMargin,
      targetTotalProfit,
      customPrice: customPrice > 0 ? customPrice : 150,
      productionDays: 14,
      notes: rawNotes?.trim() || '',
    };

    products.push(item);
  }

  if (products.length === 0) {
    warnings.push('無法成功解析出任何有效商品列，請檢查格式是否符合規範。');
  }

  return { products, warnings };
}

export function copySummaryText(
  calculations: ProductCalculation[],
  summary: ProjectSummaryData
): string {
  let text = `💼【周邊商品定價企劃摘要】\n`;
  text += `📅 日期：${new Date().toLocaleDateString('zh-TW')}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📊 全場數據總結：\n`;
  text += `• 規劃方案：${summary.totalProductsCount} 款 (已計入 ${summary.activeProductsCount} 款，總計 ${summary.totalItemsCount} 件)\n`;
  if (summary.excludedProductsCount > 0) {
    text += `• 暫時排除：${summary.excludedProductsCount} 款方案未計入總計\n`;
  }
  text += `• 總投入成本：NT$ ${summary.totalUpfrontCost.toLocaleString()}\n`;
  text += `• 預期總營收：NT$ ${summary.totalPotentialRevenue.toLocaleString()}\n`;
  text += `• 預期總淨利：NT$ ${summary.totalPotentialProfit.toLocaleString()} (ROI: ${summary.overallROI}%)\n`;
  text += `• 全場毛利率：${summary.overallMargin}%\n`;
  text += `• 平均回本門檻：銷售達 ${summary.averageBreakEvenRate}% 即開始獲利\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🏷️ 各方案售價、獨立折扣與毛利：\n`;

  for (const c of calculations) {
    const isExcluded = c.product.enabled === false;
    const bundleText = c.bundleUnits > 1 ? ` [${c.bundleUnits}件組合方案]` : '';
    const discountText = c.discountPercent > 0 ? ` (原價$${c.originalBundlePrice} ➔ 折扣${c.discountPercent}% off)` : '';
    text += `▶ ${isExcluded ? '【已排除】' : ''}${c.product.name}${bundleText} (做 ${c.product.quantity} 件 / ${c.totalBundles} 份)\n`;
    text += `   成本: $${c.bundleDirectCost} ➔ 實收特惠價: NT$ ${c.finalUnitPrice}${discountText}\n`;
    text += `   實賺: NT$ ${c.unitNetProfit} (毛利 ${c.grossMargin}%)\n`;
    text += `   保本門檻: 賣出 ${c.breakEvenUnits} 件回本 (${c.breakEvenPercentage}%)\n`;
  }
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `Generated by 周邊商品定價計算器`;

  return text;
}

function round0(num: number): number {
  return Math.round(num);
}

function round1(num: number): number {
  return Math.round(num * 10) / 10;
}

function round2(num: number): number {
  return Math.round(num * 100) / 100;
}
