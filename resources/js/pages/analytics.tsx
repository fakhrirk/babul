import { Head, router, Link } from '@inertiajs/react';
import React from 'react';

export default function Analytics({ data = [], period = 30 }: { data: any[], period?: number | string }) {
    // Basic computations
    const totalTransactions = data.length;
    const totalRevenue = data.reduce((sum, item) => sum + (Number(item.price_before) || 0), 0);
    const netRevenue = data.reduce((sum, item) => sum + (Number(item.price_after) || 0), 0);
    const totalFees = data.reduce((sum, item) => sum + (Number(item.admin_fee) || 0) + (Number(item.service_fee) || 0) + (Number(item.transaction_fee) || 0) + (Number(item.campaign_fee) || 0), 0);
    
    // Progress calculation
    const revenueProgress = 100;
    const feesProgress = totalRevenue > 0 ? Math.round((totalFees / totalRevenue) * 100) : 0;
    const netProgress = totalRevenue > 0 ? Math.round((netRevenue / totalRevenue) * 100) : 0;
    
    // Platform distribution
    const platforms: Record<string, number> = {};
    data.forEach(item => {
        const p = item.platform || 'Unknown';
        platforms[p] = (platforms[p] || 0) + 1;
    });
    const platformStats = Object.entries(platforms).map(([name, count]) => ({
        name,
        count,
        percentage: totalTransactions > 0 ? Math.round((count / totalTransactions) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Trend Data (Actual)
    const chartDataMap: Record<string, number> = {};
    data.forEach(item => {
        const dateRaw = (item.invoice_made ? String(item.invoice_made).substring(0, 10) : null) || (item.created_at ? String(item.created_at).substring(0, 10) : 'Unknown Date');
        chartDataMap[dateRaw] = (chartDataMap[dateRaw] || 0) + (Number(item.price_after) || 0);
    });
    
    const sortedDates = Object.keys(chartDataMap).sort();
    const recentDates = sortedDates.slice(-12); // Show up to last 12 periods
    const trendData = recentDates.map(d => chartDataMap[d]);
    const maxTrend = Math.max(...trendData, 1);
    
    const months = recentDates.map(d => {
        const dObj = new Date(d);
        if (isNaN(dObj.getTime())) return d.substring(5, 10);
        return dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return (
        <>
            <Head title="Analytics" />
            
            <div className="flex flex-col gap-10 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-4xl font-black text-on-surface tracking-tighter leading-none">Advanced Analytics</h2>
                        <p className="text-on-surface-variant font-medium text-lg">Deep dive into your studio's financial performance signals.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select 
                            className="bg-surface-container-high/50 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-surface-container-highest/20 text-sm font-bold text-on-surface outline-none appearance-none cursor-pointer"
                            onChange={(e) => router.get('/analytics', { period: e.target.value }, { preserveState: true })}
                            defaultValue={period}
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="all">All Time</option>
                        </select>
                        <a href={`/export?period=${period}`} className="bg-primary text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                            <span className="material-symbols-outlined">download</span>
                            Export Report
                        </a>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Gross Revenue', value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, color: 'primary', trend: 'Total', progress: revenueProgress, icon: 'payments' },
                        { label: 'Operating Fees', value: `Rp ${totalFees.toLocaleString('id-ID')}`, color: 'error', trend: `${feesProgress}%`, progress: feesProgress, icon: 'receipt_long' },
                        { label: 'Net Income', value: `Rp ${netRevenue.toLocaleString('id-ID')}`, color: 'secondary', trend: `${netProgress}%`, progress: netProgress, icon: 'account_balance_wallet' }
                    ].map((metric, i) => (
                        <div key={i} className="group bg-surface-container-lowest p-8 rounded-[2.5rem] border border-surface-container-high transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`w-12 h-12 rounded-2xl bg-${metric.color}/10 flex items-center justify-center`}>
                                    <span className={`material-symbols-outlined text-${metric.color} text-2xl`}>{metric.icon}</span>
                                </div>
                                <span className={`text-xs font-black px-3 py-1 rounded-full bg-${metric.color}-container text-on-${metric.color}-container`}>{metric.trend}</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em]">{metric.label}</p>
                                <h3 className="text-3xl font-black text-on-surface tracking-tight truncate">{metric.value}</h3>
                            </div>
                            <div className="mt-8 h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden flex items-center">
                                <div 
                                    style={{ width: `${metric.progress}%` }} 
                                    className={`h-full bg-${metric.color} rounded-full transition-all duration-1000 group-hover:opacity-80`}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Visualization Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 outline-none">
                    {/* Revenue Trend Chart */}
                    <div className="xl:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-sm border border-surface-container-high flex flex-col">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
                            <div className="space-y-1.5">
                                <h4 className="font-extrabold text-2xl text-on-surface tracking-tight">Revenue Trajectory</h4>
                                <p className="text-sm font-medium text-on-surface-variant">Financial performance comparison across the fiscal year.</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary/20"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Baseline</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/30"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="flex-1 flex flex-col min-h-[300px]">
                            {/* Bars Row */}
                            <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 px-2">
                                {trendData.length > 0 ? trendData.map((val, i) => (
                                    <div key={i} className="flex-1 group relative flex flex-col justify-end h-full">
                                        <div 
                                            style={{ height: `${(val / maxTrend) * 100}%` }} 
                                            className={`w-full rounded-t-xl transition-all duration-700 ${i === trendData.length - 1 ? 'bg-primary shadow-xl shadow-primary/30' : 'bg-surface-container-highest/50 hover:bg-primary/20'}`}
                                        ></div>
                                        
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-on-surface text-surface text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 font-bold pointer-events-none whitespace-nowrap shadow-xl z-20">
                                            Rp {val.toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="w-full h-full flex items-center justify-center text-sm font-bold opacity-30">No data available</div>
                                )}
                            </div>
                            
                            {/* Labels Row */}
                            <div className="flex justify-between items-center mt-6 px-2 border-t border-surface-container-low pt-4">
                                {months.map((month, i) => (
                                    <span key={i} className="flex-1 text-center text-[10px] font-black text-on-surface-variant/40 uppercase tracking-tighter">
                                        {month}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 border-t border-surface-container-high pt-6 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-xs font-bold text-on-surface-variant">Live updates active</span>
                            </div>
                            <button className="text-[10px] font-black text-primary hover:tracking-widest transition-all uppercase tracking-[0.1em]">Analyze detailed spikes</button>
                        </div>
                    </div>

                    {/* Platform Market Share */}
                    <div className="xl:col-span-4 bg-primary text-white p-10 rounded-[3rem] shadow-2xl shadow-primary/20 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        
                        <div className="relative z-10 mb-12">
                            <h4 className="font-extrabold text-2xl tracking-tight leading-none mb-1">Market Share</h4>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Platform Distribution</p>
                        </div>

                        <div className="relative z-10 flex-1 space-y-10">
                            {platformStats.length > 0 ? platformStats.map((plat, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-0.5">
                                            <span className="text-xl font-black capitalize block leading-none">{plat.name}</span>
                                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{plat.count} Transactions</span>
                                        </div>
                                        <span className="text-3xl font-black">{plat.percentage}<span className="text-sm opacity-50">%</span></span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            style={{ width: `${plat.percentage}%` }} 
                                            className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                        ></div>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10">
                                    <span className="material-symbols-outlined text-6xl opacity-20">cloud_off</span>
                                    <p className="text-sm font-bold opacity-60">No platform data detected in records.</p>
                                </div>
                            )}
                        </div>

                        <Link href="/transactions" className="relative z-10 mt-12 w-full py-5 bg-white text-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-center block">
                            Detailed Breakdown
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
