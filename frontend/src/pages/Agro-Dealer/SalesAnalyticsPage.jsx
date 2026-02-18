import { useState } from 'react';
import DealerSidebar from '../../components/layout/DealerSidebar';
import DealerHeader from '../../components/layout/DealerHeader';

const SalesAnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [contentTab, setContentTab] = useState('overview');
  const [periodFilter, setPeriodFilter] = useState('month');

  const exportToCSV = () => {
    const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const receiptNumber = `ANL-${Date.now().toString().slice(-8)}`;
    const tabName = contentTab.charAt(0).toUpperCase() + contentTab.slice(1);
    
    let contentHTML = '';
    
    if (contentTab === 'overview') {
      contentHTML = `
        <div class="summary">
          <div class="summary-card">
            <h3>Total Revenue</h3>
            <p>Ksh 2.4M</p>
            <span class="trend-up">+12.5% vs last month</span>
          </div>
          <div class="summary-card">
            <h3>Total Orders</h3>
            <p>856</p>
            <span class="trend-up">+5.2% vs last month</span>
          </div>
          <div class="summary-card">
            <h3>Avg. Order Value</h3>
            <p>Ksh 2,800</p>
            <span class="trend-down">-2.1% vs last month</span>
          </div>
          <div class="summary-card">
            <h3>Customer Retention</h3>
            <p>68%</p>
            <span class="trend-up">+8% vs last month</span>
          </div>
        </div>
        
        <h2 style="margin: 30px 0 15px; font-size: 18px; color: #1f2937;">Top Performing Categories</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Revenue</th>
              <th>Percentage of Total</th>
            </tr>
          </thead>
          <tbody>
            ${topCategories.map(cat => `
              <tr>
                <td><strong>${cat.name}</strong></td>
                <td>Ksh ${cat.revenue.toLocaleString()}</td>
                <td><div class="bar-container"><div class="bar" style="width: ${cat.percentage}%;"></div><span>${cat.percentage}%</span></div></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (contentTab === 'products') {
      contentHTML = `
        <h2 style="margin: 20px 0 15px; font-size: 18px; color: #1f2937;">Product Performance by Category</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Revenue</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            ${topCategories.map(cat => `
              <tr>
                <td><strong>${cat.name}</strong></td>
                <td>Ksh ${cat.revenue.toLocaleString()}</td>
                <td><div class="bar-container"><div class="bar" style="width: ${cat.percentage}%;"></div><span>${cat.percentage}%</span></div></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px;">
          <div>
            <h2 style="margin-bottom: 15px; font-size: 18px; color: #1f2937;">Best Sellers</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Sold</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hybrid Maize Seeds</td>
                  <td><span class="highlight-success">145 units</span></td>
                </tr>
                <tr>
                  <td>NPK Fertilizer</td>
                  <td><span class="highlight-success">132 units</span></td>
                </tr>
                <tr>
                  <td>Insecticide</td>
                  <td><span class="highlight-success">98 units</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <h2 style="margin-bottom: 15px; font-size: 18px; color: #1f2937;">Low Performers</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Sold</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Irrigation Pipes</td>
                  <td><span class="highlight-warning">12 units</span></td>
                </tr>
                <tr>
                  <td>Garden Tools</td>
                  <td><span class="highlight-warning">18 units</span></td>
                </tr>
                <tr>
                  <td>Organic Manure</td>
                  <td><span class="highlight-warning">25 units</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else {
      contentHTML = `
        <div class="summary">
          <div class="summary-card">
            <h3>Conversion Rate</h3>
            <p>12.5%</p>
            <span class="trend-up">+2.4% improvement</span>
          </div>
          <div class="summary-card">
            <h3>Response Time</h3>
            <p>2.3 hrs</p>
            <span style="font-size: 11px; color: #666;">Average response time</span>
          </div>
          <div class="summary-card">
            <h3>Fulfillment Rate</h3>
            <p>98%</p>
            <span style="font-size: 11px; color: #666;">Order completion rate</span>
          </div>
        </div>
        
        <h2 style="margin: 30px 0 15px; font-size: 18px; color: #1f2937;">Fulfillment Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Fulfillment Type</th>
              <th>Percentage</th>
              <th>Distribution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Home Delivery</strong></td>
              <td>65%</td>
              <td><div class="bar-container"><div class="bar" style="width: 65%;"></div></div></td>
            </tr>
            <tr>
              <td><strong>Store Pick-up</strong></td>
              <td>35%</td>
              <td><div class="bar-container"><div class="bar" style="width: 35%; background: #b45309;"></div></div></td>
            </tr>
          </tbody>
        </table>
      `;
    }
    
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sales Analytics Report - ${receiptNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #fff; }
          .receipt { max-width: 900px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 3px solid #047857; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #047857; font-size: 32px; margin-bottom: 5px; }
          .header p { color: #666; font-size: 14px; }
          .receipt-info { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background: #f9fafb; border-radius: 8px; }
          .receipt-info div { font-size: 13px; }
          .receipt-info strong { color: #047857; display: block; margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #047857; color: white; padding: 12px 8px; text-align: left; font-size: 12px; font-weight: 600; }
          td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
          tr:hover { background: #f9fafb; }
          .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
          .summary-card { background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #047857; }
          .summary-card h3 { font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 8px; }
          .summary-card p { font-size: 24px; font-weight: bold; color: #1f2937; }
          .trend-up { font-size: 11px; color: #047857; font-weight: 600; }
          .trend-down { font-size: 11px; color: #b45309; font-weight: 600; }
          .bar-container { display: flex; align-items: center; gap: 10px; }
          .bar { height: 20px; background: #047857; border-radius: 4px; transition: width 0.3s; }
          .bar-container span { font-weight: 600; color: #1f2937; min-width: 40px; }
          .highlight-success { color: #047857; font-weight: 600; }
          .highlight-warning { color: #b45309; font-weight: 600; }
          .footer { text-align: center; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #666; font-size: 12px; margin-top: 30px; }
          @media print {
            body { padding: 20px; }
            button { display: none; }
          }
          .print-btn { background: #047857; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; margin-bottom: 20px; }
          .print-btn:hover { background: #065f46; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <button class="print-btn" onclick="window.print()">🖨️ Print Receipt</button>
          
          <div class="header">
            <h1>FarmLease Agro-Dealer</h1>
            <p>Sales Analytics Report - ${tabName}</p>
          </div>
          
          <div class="receipt-info">
            <div>
              <strong>Receipt No:</strong>
              ${receiptNumber}
            </div>
            <div>
              <strong>Date:</strong>
              ${date} at ${time}
            </div>
            <div>
              <strong>Report Type:</strong>
              ${tabName} Analysis
            </div>
          </div>
          
          ${contentHTML}
          
          <div class="footer">
            <p><strong>FarmLease Platform</strong> | Agro-Dealer Sales Analytics</p>
            <p>This is a computer-generated report and does not require a signature.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: 'Ksh 2.4M',
      change: '+12.5% vs last month',
      trend: 'up',
      icon: '💰',
      color: 'emerald'
    },
    {
      title: 'Total Orders',
      value: '856',
      change: '+5.2% vs last month',
      trend: 'up',
      icon: '🛒',
      color: 'emerald'
    },
    {
      title: 'Avg. Order Value',
      value: 'Ksh 2,800',
      change: '-2.1% vs last month',
      trend: 'down',
      icon: '📊',
      color: 'orange'
    },
    {
      title: 'Customer Retention',
      value: '68%',
      change: '+8% vs last month',
      trend: 'up',
      icon: '🔄',
      color: 'emerald'
    }
  ];

  const topCategories = [
    { name: 'Fertilizers', revenue: 850000, percentage: 75, color: 'bg-emerald-700' },
    { name: 'Seeds', revenue: 620000, percentage: 60, color: 'bg-emerald-600' },
    { name: 'Pesticides', revenue: 480000, percentage: 45, color: 'bg-amber-800' },
    { name: 'Farm Tools', revenue: 310000, percentage: 30, color: 'bg-amber-700' },
    { name: 'Animal Feed', revenue: 140000, percentage: 15, color: 'bg-gray-400' }
  ];

  return (
    <div className="bg-background-light flex">
      <DealerSidebar />
      
      <main className="flex-1 h-screen overflow-hidden">
        <DealerHeader 
          title="Sales Analytics"
          subtitle="Analyze your sales performance"
          rightContent={
            <div className="flex items-center gap-4">
              <button className="flex px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 transition shadow-sm text-sm">
                <span>📅</span>
                <span>This Month</span>
                <span className="ml-1">▼</span>
              </button>
              <button onClick={exportToCSV} className="flex px-5 py-2 bg-emerald-700 text-white rounded-lg items-center gap-2 hover:bg-emerald-800 transition shadow-lg text-sm">
                <span>📥</span>
                <span className="font-medium">Export Report</span>
              </button>
            </div>
          }
        />
        
        <div className="h-[calc(100vh-5rem)] overflow-y-auto p-8 bg-gray-50">
          <div className="space-y-8">
            {/* Content Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setContentTab('overview')}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  contentTab === 'overview'
                    ? 'text-emerald-700 border-emerald-700'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setContentTab('products')}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  contentTab === 'products'
                    ? 'text-emerald-700 border-emerald-700'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📦 Products Analysis
              </button>
              <button
                onClick={() => setContentTab('performance')}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  contentTab === 'performance'
                    ? 'text-emerald-700 border-emerald-700'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📈 Performance
              </button>
            </div>

            {/* Tab Content - Overview */}
            {contentTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{kpiCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-amber-700 text-[10px] font-bold uppercase tracking-widest">
                      {card.title}
                    </h3>
                    <div className={`p-1.5 bg-${card.color}-50 rounded-lg`}>
                      <span className="text-xl">{card.icon}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-gray-800">{card.value}</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-[10px] font-bold w-fit px-2 py-0.5 rounded-full ${
                      card.trend === 'up'
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-orange-700 bg-orange-50'
                    }`}
                  >
                    <span>{card.trend === 'up' ? '↑' : '↓'}</span> {card.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Revenue Trend Chart */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Revenue & Orders Trend</h3>
                    <p className="text-xs text-gray-500">Comparative analysis over the last 30 days</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-700"></span>
                      <span className="text-xs text-gray-500 font-medium">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-700"></span>
                      <span className="text-xs text-gray-500 font-medium">Orders</span>
                    </div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="relative h-80 w-full">
                  <div className="absolute inset-0 flex items-end justify-between px-2 pt-4 pb-8 border-b border-gray-100">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-t border-gray-100 w-full h-0"></div>
                      ))}
                    </div>

                    {/* SVG Chart */}
                    <svg className="absolute inset-0 w-full h-full pb-8 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 800 300">
                      {/* Revenue line */}
                      <path
                        d="M0,250 C100,200 200,280 300,150 C400,20 500,80 600,60 C700,40 750,10 800,50 L800,300 L0,300 Z"
                        fill="url(#gradientRevenue)"
                        opacity="0.1"
                      />
                      <path
                        d="M0,250 C100,200 200,280 300,150 C400,20 500,80 600,60 C700,40 750,10 800,50"
                        fill="none"
                        stroke="#047857"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                      {/* Orders line */}
                      <path
                        d="M0,280 C80,260 160,270 240,220 C320,170 400,200 480,180 C560,160 640,190 720,150 L800,160"
                        fill="none"
                        stroke="#b45309"
                        strokeDasharray="5,5"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                      <defs>
                        <linearGradient id="gradientRevenue" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#047857', stopOpacity: 0.8 }} />
                          <stop offset="100%" style={{ stopColor: '#047857', stopOpacity: 0 }} />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Tooltip */}
                    <div className="absolute top-[20%] left-[37%] bg-gray-800 text-white text-[10px] p-2 rounded shadow-xl transform -translate-x-1/2 z-10">
                      <div className="font-bold mb-1">Aug 15</div>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-300">Rev:</span>
                        <span className="font-mono">Ksh 150k</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-300">Ord:</span>
                        <span className="font-mono">42</span>
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>

                    {/* Data point */}
                    <div className="absolute top-[50%] left-[37%] w-3 h-3 bg-emerald-700 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
                  </div>

                  {/* X-axis labels */}
                  <div className="absolute bottom-0 w-full flex justify-between px-2 text-[10px] text-gray-400">
                    <span>Aug 01</span>
                    <span>Aug 05</span>
                    <span>Aug 10</span>
                    <span>Aug 15</span>
                    <span>Aug 20</span>
                    <span>Aug 25</span>
                    <span>Aug 30</span>
                  </div>
                </div>
              </div>

              {/* Fulfillment Rate Donut */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                <h3 className="font-bold text-lg text-gray-800 mb-1">Fulfillment Rate</h3>
                <p className="text-xs text-gray-500 mb-6">Delivery vs. In-Store Pickup breakdown</p>

                <div className="flex-1 flex items-center justify-center relative">
                  <svg className="transform -rotate-90" width="220" height="220" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="12"
                    />
                    {/* Delivery segment (65%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#047857"
                      strokeWidth="12"
                      strokeDasharray="163 251"
                      strokeLinecap="round"
                    />
                    {/* Pickup segment (35%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#b45309"
                      strokeWidth="12"
                      strokeDasharray="88 251"
                      strokeDashoffset="-170"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-gray-800">98%</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Success</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-700"></span>
                      <span className="text-sm text-gray-600 font-medium">Home Delivery</span>
                    </div>
                    <span className="font-bold text-gray-800">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-700"></span>
                      <span className="text-sm text-gray-600 font-medium">Store Pick-up</span>
                    </div>
                    <span className="font-bold text-gray-800">35%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Regional Distribution */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Regional Distribution</h3>
                    <p className="text-xs text-gray-500">Sales density across service areas</p>
                  </div>
                  <button className="text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition">
                    <span className="text-lg">⚙️</span>
                  </button>
                </div>

                {/* Map Visualization */}
                <div className="relative bg-blue-50/30 rounded-2xl h-64 w-full overflow-hidden border border-gray-100 flex items-center justify-center">
                  <svg
                    className="w-full h-full text-gray-200"
                    preserveAspectRatio="xMidYMid slice"
                    viewBox="0 0 400 300"
                  >
                    <path
                      d="M50,150 Q100,50 200,80 T350,150 T200,250 T50,150"
                      fill="#e2e8f0"
                      opacity="0.4"
                    />
                    <path d="M100,200 Q150,100 250,130 T300,200" fill="#cbd5e1" opacity="0.3" />
                  </svg>

                  {/* Main location (Kiambu HQ) */}
                  <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-emerald-700/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-emerald-700 rounded-full border-2 border-white shadow-lg">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-[10px] font-bold text-gray-800 whitespace-nowrap">
                      Kiambu (HQ)
                    </div>
                  </div>

                  {/* Secondary location */}
                  <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-amber-800/20 rounded-full blur-lg"></div>
                  <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-amber-800 rounded-full border-2 border-white shadow-lg"></div>

                  {/* Tertiary location */}
                  <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-orange-600/20 rounded-full blur-lg"></div>
                  <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-orange-600 rounded-full border-2 border-white shadow-lg"></div>
                </div>

                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">High Density</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-800"></span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">Low/Emerging</span>
                  </div>
                </div>
              </div>

              {/* Top Categories */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Top Categories</h3>
                    <p className="text-xs text-gray-500">Revenue by product category</p>
                  </div>
                  <a
                    href="#"
                    className="text-emerald-700 text-xs font-bold hover:underline flex items-center gap-1"
                  >
                    View All <span>→</span>
                  </a>
                </div>

                <div className="space-y-5">
                  {topCategories.map((category, index) => (
                    <div key={index} className="group">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                        <span className="text-sm font-bold text-gray-800">
                          Ksh {category.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`${category.color} h-2.5 rounded-full transition-all duration-500`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>
            )}

            {/* Tab Content - Products Analysis */}
            {contentTab === 'products' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Product Performance</h3>
                <div className="space-y-4">
                  {topCategories.map((category, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-800">{category.name}</h4>
                          <p className="text-xs text-gray-500">Revenue: Ksh {category.revenue.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-700">{category.percentage}%</span>
                          <p className="text-xs text-gray-500">of total</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Best Sellers</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Hybrid Maize Seeds</span>
                      <span className="text-sm font-bold text-emerald-700">145 units</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">NPK Fertilizer</span>
                      <span className="text-sm font-bold text-gray-700">132 units</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Insecticide</span>
                      <span className="text-sm font-bold text-gray-700">98 units</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Low Performers</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Irrigation Pipes</span>
                      <span className="text-sm font-bold text-orange-700">12 units</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Garden Tools</span>
                      <span className="text-sm font-bold text-gray-700">18 units</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Organic Manure</span>
                      <span className="text-sm font-bold text-gray-700">25 units</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Tab Content - Performance */}
            {contentTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-600 uppercase">Conversion Rate</h3>
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">24.5%</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                    <span>↑</span> +3.2% vs last month
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-600 uppercase">Response Time</h3>
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">2.3 hrs</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                    <span>↓</span> -0.5hrs improvement
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-600 uppercase">Fulfillment Rate</h3>
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">96.8%</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                    <span>↑</span> +1.8% vs last month
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Performance Trend</h3>
                <div className="grid grid-cols-7 gap-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-500 mb-2">{day}</div>
                      <div className="bg-emerald-100 rounded-lg h-32 flex items-end justify-center">
                        <div 
                          className="bg-emerald-700 w-full rounded-t-lg" 
                          style={{ height: `${Math.random() * 80 + 20}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Key Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Repeat Customers</div>
                    <div className="text-xl font-bold text-gray-800">142</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">New Customers</div>
                    <div className="text-xl font-bold text-gray-800">89</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Avg. Rating</div>
                    <div className="text-xl font-bold text-gray-800">4.7 ⭐</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Total Reviews</div>
                    <div className="text-xl font-bold text-gray-800">234</div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesAnalyticsPage;
