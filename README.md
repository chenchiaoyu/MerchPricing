# 周邊定價計算器 MerchPricing 🚀

專為同人社團、插畫創作者、文創獨立品牌與個人賣家打造的**專業周邊定價與獲利試算神器**。

[![Deploy to GitHub Pages](https://github.com/chenchiaoyu/MerchPricing/actions/workflows/main.yml/badge.svg)](https://github.com/chenchiaoyu/MerchPricing/actions/workflows/main.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 🌐 線上直接使用網址 (Live Demo)

點擊以下連結即可免安裝直接在瀏覽器中使用本計算器：

- **🔗 GitHub Pages 官方正式站點：**  
  👉 [https://chenchiaoyu.github.io/MerchPricing/](https://chenchiaoyu.github.io/MerchPricing/)

- **⚡ 備用即時預覽站點：**  
  👉 [https://ais-pre-qwpdawfi6oj7s6nw2qbg7r-578487684233.asia-northeast1.run.app](https://ais-pre-qwpdawfi6oj7s6nw2qbg7r-578487684233.asia-northeast1.run.app)

---

## ✨ 核心特色與亮點

1. **多維度真實成本拆解**
   - 告別只算單件工廠報價的隱形虧損！完整計入 **打樣開版費攤提**、**單品獨立包材與背卡**、**單件平均批次運費** 與 **額外耗材**。

2. **主流金流管道與平台扣趴支援**
   - 內建台灣常見金流管道預設：綠界科技 (ECPay 2.75%)、藍新金流 (NewebPay 2.8%)、7-11 賣貨便 / 全家好賣+、蝦皮購物、Stripe 等，精確扣除手續費。

3. **三種彈性定價驅動模式**
   - **依目標毛利率**：輸入心儀毛利率（如 50%），自動推導合理市售價。
   - **市場售價反推**：直接鍵入市場行情售價，反推淨利潤、實質毛利率與回本門檻。
   - **總淨利目標**：設定期望為專案賺取多少總盈餘，反向計算單位售價。

4. **展場損益平衡點 (BEP) 計算**
   - 精確標示每項周邊「需要賣出幾件才能回本」。

5. **展場與促銷情境模擬器 (Scenario Simulator)**
   - 透過互動滑桿動態調整**預估銷售率**（10% ~ 100%）與**全場促銷折扣**（原價、95折、9折、85折等），即時預覽實收淨利與庫存安全感。

6. **全域資金與金流組成圖表 (Financial Composition)**
   - 視覺化環形甜甜圈圖與堆疊柱狀圖，清晰呈現裸品工廠費、包材耗材、平台金流抽成、繪師版稅與實收淨利的佔比結構。

7. **一鍵常用規格範本庫**
   - 快速載入壓克力立牌、馬口鐵雙閃徽章、B5全彩燙金畫冊、帆布托特包、PVC造型悠遊卡貼等業界常見產量與打樣成本。

8. **報表匯出與文字摘要分享**
   - 一鍵匯出繁體中文 UTF-8 BOM CSV 報表（支援 Excel 正常開啟不亂碼）。
   - 一鍵複製文字企劃摘要，方便透過 LINE、Discord、Notion 或社群與共同創作者對帳溝通。

---

## 📐 核心定價演算法

```math
\text{單件直接成本} = \text{裸品成本} + \frac{\text{總打樣費}}{\text{生產數量}} + \text{單件包材} + \text{單件運費} + \text{其他耗材}
```

```math
\text{建議售價} = \frac{\text{單件直接成本} + \text{固定訂單手續費}}{1 - \text{目標毛利率} - \text{金流費率} - \text{設計師抽成率}}
```

```math
\text{單件純淨利} = \text{定價} - \text{單件直接成本} - (\text{定價} \times \text{金流費率} + \text{固定金流費}) - \text{設計師抽成}
```

```math
\text{損益平衡件數 (BEP)} = \left\lceil \frac{\text{該商品總前期投入成本}}{\text{單件淨收益}} \right\rceil
```

---

## 🛠️ 本地開發與建置指南

本專案使用現代前端技術棧打造：
- **React 18** + **TypeScript**
- **Vite** (打包工具，已配置相對路徑適配 GitHub Pages)
- **Tailwind CSS** (無生硬感的現代圓角與高對比排版)
- **Lucide React** (語意化圖示庫)

### 啟動步驟

```bash
# 1. 複製專案
git clone https://github.com/chenchiaoyu/MerchPricing.git
cd MerchPricing

# 2. 安裝依賴套件
npm install

# 3. 啟動本機開發伺服器
npm run dev

# 4. 打包生產版本
npm run build
```

---

## 🚀 部署至 GitHub Pages

專案內建 `.github/workflows/main.yml` 自動化工作流程：
1. 將專案 Push 至 GitHub `main` 分支。
2. 進入專案的 **Settings** > **Pages**。
3. 在 **Build and deployment** 下方的 **Source** 選擇 **GitHub Actions**。
4. 每次 push 後將自動完成打包與部署！

---

## 📄 開源授權

本專案採用 [MIT License](LICENSE) 開源授權，歡迎自由使用、修改與分享！
