import { ProductItem, ProductCalculation, GlobalSettings, ProjectSummaryData } from '../types';

export function calculateProduct(
  product: ProductItem,
  globalSettings: GlobalSettings
): ProductCalculation {
  const quantity = Math.max(1, Math.round(product.quantity || 1));
  const baseCost = Math.max(0, product.baseCost || 0);
  const sampleCost = Math.max(0, product.sampleCost || 0);
  const packagingCost = Math.max(0, product.packagingCost || 0);
  const shippingCost = Math.max(0, product.shippingCost || 0);
  const extraCost = Math.max(0, product.extraCost || 0);

  // 單件攤提
  const unitBaseCost = baseCost;
  const unitSampleCost = sampleCost / quantity;
  const unitPackagingCost = packagingCost;
  const unitShippingCost = shippingCost;
  const unitExtraCost = extraCost;
  const unitDirectCost = unitBaseCost + unitSampleCost + unitPackagingCost + unitShippingCost + unitExtraCost;

  // 費率
  const paymentRate = (product.customFee ? (product.paymentFeeRate || 0) : globalSettings.paymentFeeRate) / 100;
  const paymentFixed = product.customFee ? (product.paymentFixedFee || 0) : globalSettings.paymentFixedFee;

  let fixedDesignerFee = 0;
  let designerRate = 0;

  if (product.designerFeeType === 'percent_cost') {
    fixedDesignerFee = unitDirectCost * ((product.designerFeeValue || 0) / 100);
  } else if (product.designerFeeType === 'fixed_per_unit') {
    fixedDesignerFee = product.designerFeeValue || 0;
  } else if (product.designerFeeType === 'percent_price') {
    designerRate = (product.designerFeeValue || 0) / 100;
  }

  // 非售價相依之固定成本 (包含單筆金流固定費與固定設計師費)
  const nonPriceDependentCost = unitDirectCost + paymentFixed + fixedDesignerFee;
  const variableRate = paymentRate + designerRate;

  const warnings: string[] = [];

  let finalUnitPrice = 0;

  if (product.pricingMode === 'margin') {
    const targetMarginRate = (product.targetMargin || 0) / 100;
    const denominator = 1 - variableRate - targetMarginRate;
    if (denominator <= 0.05) {
      warnings.push('目標毛利率與抽成總和過高（≥95%），已限制分母以防定價過於離譜');
      finalUnitPrice = nonPriceDependentCost / 0.05;
    } else {
      finalUnitPrice = nonPriceDependentCost / denominator;
    }
  } else if (product.pricingMode === 'profit') {
    const targetProfit = Math.max(0, product.targetTotalProfit || 0);
    const unitTargetProfit = targetProfit / quantity;
    const denominator = 1 - variableRate;
    if (denominator <= 0.05) {
      warnings.push('抽成費率過高（≥95%）');
      finalUnitPrice = (nonPriceDependentCost + unitTargetProfit) / 0.05;
    } else {
      finalUnitPrice = (nonPriceDependentCost + unitTargetProfit) / denominator;
    }
  } else {
    // customPrice
    finalUnitPrice = Math.max(0, product.customPrice || 0);
  }

  finalUnitPrice = Math.max(1, finalUnitPrice);

  // 計算抽成與成本
  const unitPaymentFee = finalUnitPrice * paymentRate + paymentFixed;
  const unitDesignerFee = product.designerFeeType === 'percent_price'
    ? finalUnitPrice * designerRate
    : fixedDesignerFee;

  const unitTotalCost = unitDirectCost + unitPaymentFee + unitDesignerFee;
  const unitNetProfit = finalUnitPrice - unitTotalCost;
  const grossMargin = finalUnitPrice > 0 ? (unitNetProfit / finalUnitPrice) * 100 : 0;

  // 總計
  const totalProductionCost = unitDirectCost * quantity;
  const totalRevenue = finalUnitPrice * quantity;
  const totalProfit = unitNetProfit * quantity;
  const totalFees = (unitPaymentFee + unitDesignerFee) * quantity;

  // 損益平衡
  // 每賣出一件實際進帳（扣除當次交易抽成）：
  const netInflowPerUnit = finalUnitPrice - (finalUnitPrice * paymentRate + paymentFixed + (product.designerFeeType === 'percent_price' ? finalUnitPrice * designerRate : 0));
  let breakEvenUnits = quantity;
  let breakEvenPercentage = 100;

  if (netInflowPerUnit > 0) {
    breakEvenUnits = Math.min(quantity, Math.ceil(totalProductionCost / netInflowPerUnit));
    breakEvenPercentage = (breakEvenUnits / quantity) * 100;
  } else {
    warnings.push('每件銷售淨額小於零，永遠無法達成損益平衡！');
  }

  const breakEvenRevenue = breakEvenUnits * finalUnitPrice;

  const isLoss = unitNetProfit < 0;
  const isMarginTargetMet = grossMargin >= (product.targetMargin || 0) - 0.05;

  // 推薦整數定價
  const smartPrices = generateSmartPrices(finalUnitPrice, nonPriceDependentCost, variableRate, quantity);

  return {
    product,
    unitBaseCost: round2(unitBaseCost),
    unitSampleCost: round2(unitSampleCost),
    unitPackagingCost: round2(unitPackagingCost),
    unitShippingCost: round2(unitShippingCost),
    unitExtraCost: round2(unitExtraCost),
    unitDirectCost: round2(unitDirectCost),
    finalUnitPrice: round2(finalUnitPrice),
    unitPaymentFee: round2(unitPaymentFee),
    unitDesignerFee: round2(unitDesignerFee),
    unitTotalCost: round2(unitTotalCost),
    unitNetProfit: round2(unitNetProfit),
    grossMargin: round1(grossMargin),
    totalProductionCost: round0(totalProductionCost),
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
  calculations: ProductCalculation[]
): ProjectSummaryData {
  if (calculations.length === 0) {
    return {
      totalItemsCount: 0,
      totalProductsCount: 0,
      totalUpfrontCost: 0,
      totalPotentialRevenue: 0,
      totalPotentialProfit: 0,
      overallMargin: 0,
      overallROI: 0,
      averageBreakEvenRate: 0,
    };
  }

  let totalItemsCount = 0;
  let totalUpfrontCost = 0;
  let totalPotentialRevenue = 0;
  let totalPotentialProfit = 0;
  let weightedBreakEvenSum = 0;

  for (const calc of calculations) {
    const qty = calc.product.quantity;
    totalItemsCount += qty;
    totalUpfrontCost += calc.totalProductionCost;
    totalPotentialRevenue += calc.totalRevenue;
    totalPotentialProfit += calc.totalProfit;
    weightedBreakEvenSum += calc.breakEvenPercentage * qty;
  }

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
    totalProductsCount: calculations.length,
    totalUpfrontCost: round0(totalUpfrontCost),
    totalPotentialRevenue: round0(totalPotentialRevenue),
    totalPotentialProfit: round0(totalPotentialProfit),
    overallMargin: round1(overallMargin),
    overallROI: round1(overallROI),
    averageBreakEvenRate: round1(averageBreakEvenRate),
  };
}

export function exportToCSV(
  calculations: ProductCalculation[],
  globalSettings: GlobalSettings,
  summary: ProjectSummaryData
) {
  let csv = '\uFEFF'; // UTF-8 BOM for Excel Chinese support
  csv += '周邊商品定價試算報表\n';
  csv += `生成時間,${new Date().toLocaleString('zh-TW')}\n\n`;

  csv += '【全場概況】\n';
  csv += `商品種類,${summary.totalProductsCount} 款\n`;
  csv += `總製作件數,${summary.totalItemsCount} 件\n`;
  csv += `前期總投入成本,NT$ ${summary.totalUpfrontCost.toLocaleString()}\n`;
  csv += `完售預期總營收,NT$ ${summary.totalPotentialRevenue.toLocaleString()}\n`;
  csv += `完售預期總利潤,NT$ ${summary.totalPotentialProfit.toLocaleString()}\n`;
  csv += `全場綜合毛利率,${summary.overallMargin}%\n`;
  csv += `投資報酬率 (ROI),${summary.overallROI}%\n`;
  csv += `平均損益平衡率,${summary.averageBreakEvenRate}% (需賣出件數佔比)\n\n`;

  csv += '【商品定價明細表】\n';
  csv += '商品名稱,分類,製作數量,單件裸品成本,單件包裝,開版攤提,運費攤提,單件直接成本,金流費率,設計師抽成,建議售價,單件淨利,毛利率,目標毛利,目標達成,總前期成本,預期總營收,預期總利潤,保本需賣出(件),保本率(%)\n';

  for (const c of calculations) {
    const p = c.product;
    csv += `"${p.name}","${p.category || '周邊'}",${p.quantity},NT$ ${c.unitBaseCost},NT$ ${c.unitPackagingCost},NT$ ${c.unitSampleCost},NT$ ${c.unitShippingCost},NT$ ${c.unitDirectCost},${p.customFee ? p.paymentFeeRate : globalSettings.paymentFeeRate}%,${p.designerFeeType === 'none' ? '無' : p.designerFeeValue + (p.designerFeeType.includes('percent') ? '%' : '元')},NT$ ${c.finalUnitPrice},NT$ ${c.unitNetProfit},${c.grossMargin}%,${p.targetMargin}%,${c.isMarginTargetMet ? '達成' : '未達'},NT$ ${c.totalProductionCost},NT$ ${c.totalRevenue},NT$ ${c.totalProfit},${c.breakEvenUnits} 件,${c.breakEvenPercentage}%\n`;
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

export function copySummaryText(
  calculations: ProductCalculation[],
  summary: ProjectSummaryData
): string {
  let text = `💼【周邊商品定價企劃摘要】\n`;
  text += `📅 日期：${new Date().toLocaleDateString('zh-TW')}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📊 全場數據總結：\n`;
  text += `• 規劃款數：${summary.totalProductsCount} 款 (${summary.totalItemsCount} 件)\n`;
  text += `• 總投入成本：NT$ ${summary.totalUpfrontCost.toLocaleString()}\n`;
  text += `• 預期總營收：NT$ ${summary.totalPotentialRevenue.toLocaleString()}\n`;
  text += `• 預期總淨利：NT$ ${summary.totalPotentialProfit.toLocaleString()} (ROI: ${summary.overallROI}%)\n`;
  text += `• 全場毛利率：${summary.overallMargin}%\n`;
  text += `• 平均回本門檻：銷售達 ${summary.averageBreakEvenRate}% 即開始獲利\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🏷️ 各品項建議售價與毛利：\n`;

  for (const c of calculations) {
    text += `▶ ${c.product.name} (做 ${c.product.quantity} 件)\n`;
    text += `   成本: $${c.unitDirectCost} ➔ 建議售價: NT$ ${c.finalUnitPrice}\n`;
    text += `   單件賺: NT$ ${c.unitNetProfit} (毛利 ${c.grossMargin}%)\n`;
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
