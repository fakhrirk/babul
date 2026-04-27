import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ data = [] }: { data: any[] }) {
    const [chartFilter, setChartFilter] = useState<'revenue' | 'orders' | 'cancellations'>('revenue');

    // Computations
    const omzetKotor = data.reduce((sum, item) => sum + (Number(item.price_before) || 0), 0);
    const totalCost = data.reduce((sum, item) => sum + (Number(item.admin_fee) || 0) + (Number(item.service_fee) || 0) + (Number(item.transaction_fee) || 0) + (Number(item.campaign_fee) || 0), 0);
    const profitKotor = data.reduce((sum, item) => sum + (Number(item.price_after) || 0), 0);
    const totalOrders = data.length;

    // Derived Statistics
    const avgTransactionValue = totalOrders > 0 ? omzetKotor / totalOrders : 0;
    const costPercentage = omzetKotor > 0 ? (totalCost / omzetKotor) * 100 : 0;
    const profitMargin = omzetKotor > 0 ? (profitKotor / omzetKotor) * 100 : 0;
    const uniqueDays = new Set(data.map(item => (item.invoice_made ? String(item.invoice_made).substring(0, 10) : (item.created_at ? String(item.created_at).substring(0, 10) : ''))).filter(Boolean)).size || 1;
    const avgOrdersPerDay = totalOrders / uniqueDays;

    // Platform analysis
    const platforms: Record<string, { omzet: number, profit: number, cost: number, transactions: number, refunds: number }> = {};
    data.forEach(item => {
        const plat = item.platform || 'Unknown';
        if (!platforms[plat]) platforms[plat] = { omzet: 0, profit: 0, cost: 0, transactions: 0, refunds: 0 };
        
        platforms[plat].omzet += (Number(item.price_before) || 0);
        platforms[plat].profit += (Number(item.price_after) || 0);
        platforms[plat].cost += (Number(item.admin_fee) || 0) + (Number(item.service_fee) || 0) + (Number(item.transaction_fee) || 0) + (Number(item.campaign_fee) || 0);
        platforms[plat].transactions += 1;
        if (item.is_refund) platforms[plat].refunds += 1;
    });
    
    // Sort platforms by profit DESC
    const platformData = Object.entries(platforms)
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.profit - a.profit);

    // Courier analysis
    const couriers: Record<string, number> = {};
    data.forEach(item => {
        const c = item.courier || 'Unknown';
        couriers[c] = (couriers[c] || 0) + 1;
    });
    const courierData = Object.entries(couriers).map(([name, orders]) => ({ name, orders })).sort((a, b) => b.orders - a.orders);
    const topCourier = courierData[0];
    const topCourierPercentage = totalOrders > 0 && topCourier ? Math.round((topCourier.orders / totalOrders) * 100) : 0;
    const topCourierName = topCourier ? topCourier.name : 'Unknown';

    // Refund analysis
    const refunds = data.filter(item => Boolean(item.is_refund)).length;
    const normals = data.filter(item => !Boolean(item.is_refund)).length;
    const normalRate = totalOrders > 0 ? Math.round((normals / totalOrders) * 100) : 0;

    // Time-series Chart Data Processing
    const chartDataMap: Record<string, Record<string, { revenue: number, orders: number, cancellations: number }>> = {};
    data.forEach(item => {
        // Use invoice_made as the date, or created_at if null/empty
        const dateRaw = (item.invoice_made ? String(item.invoice_made).substring(0, 10) : null) || (item.created_at ? String(item.created_at).substring(0, 10) : 'Unknown Date');
        const plat = item.platform || 'Unknown';
        
        if (!chartDataMap[dateRaw]) chartDataMap[dateRaw] = {};
        if (!chartDataMap[dateRaw][plat]) chartDataMap[dateRaw][plat] = { revenue: 0, orders: 0, cancellations: 0 };
        
        chartDataMap[dateRaw][plat].revenue += (Number(item.price_after) || 0);
        
        if (item.is_refund) {
            chartDataMap[dateRaw][plat].cancellations += 1;
        } else {
            chartDataMap[dateRaw][plat].orders += 1;
        }
    });

    const getPlatformColor = (name: string, idx: number) => {
        const n = name.toLowerCase();
        if (n === 'shopee') return 'bg-orange-500';
        if (n === 'tokopedia') return 'bg-primary';
        return idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-secondary' : 'bg-tertiary';
    };

    const getPlatformIconColor = (name: string, idx: number) => {
        const n = name.toLowerCase();
        if (n === 'shopee') return 'bg-orange-500 text-white shadow-orange-500/20';
        if (n === 'tokopedia') return 'bg-primary text-white shadow-primary/20';
        return idx === 0 ? 'bg-primary text-white shadow-primary/20' : idx === 1 ? 'bg-secondary text-white shadow-secondary/20' : 'bg-surface-container-high text-on-surface';
    };

    const sortedDates = Object.keys(chartDataMap).sort();
    const recentDates = sortedDates.slice(-30); // Last 30 periods to fit the layout
    
    let maxChartValue = 0;
    const finalChartData = recentDates.map(date => {
        const dayData = chartDataMap[date];
        let dayTotal = 0;
        const platformValues: Record<string, number> = {};
        
        Object.entries(dayData).forEach(([plat, metrics]) => {
            const val = chartFilter === 'revenue' ? metrics.revenue :
                        chartFilter === 'orders' ? metrics.orders :
                        metrics.cancellations;
            platformValues[plat] = val;
            dayTotal += val;
        });
        
        if (dayTotal > maxChartValue) maxChartValue = dayTotal;
        
        return {
            date,
            total: dayTotal,
            platforms: platformValues
        };
    });
    
    if (maxChartValue === 0) maxChartValue = 1; // Prevent division by zero

    return (
        <>
            <Head title="Dashboard" />
            
            {/* Metric Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Omzet Kotor */}
                <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-on-surface-variant">Omzet Kotor</span>
                        <span className="material-symbols-outlined text-primary">payments</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Rp {omzetKotor.toLocaleString('id-ID')}</h2>
                        <div className="mt-2 flex items-center gap-1">
                            <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold px-1.5 py-0.5 rounded-full">Rp {Math.round(avgTransactionValue).toLocaleString('id-ID')}</span>
                            <span className="text-[10px] text-on-surface-variant">avg per order</span>
                        </div>
                    </div>
                </div>

                {/* Total Cost */}
                <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-on-surface-variant">Total Cost</span>
                        <span className="material-symbols-outlined text-tertiary">shopping_bag</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Rp {totalCost.toLocaleString('id-ID')}</h2>
                        <div className="mt-2 flex items-center gap-1">
                            <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold px-1.5 py-0.5 rounded-full">{costPercentage.toFixed(1)}%</span>
                            <span className="text-[10px] text-on-surface-variant">of gross revenue</span>
                        </div>
                    </div>
                </div>

                {/* Profit Kotor */}
                <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-on-surface-variant">Profit Kotor</span>
                        <span className="material-symbols-outlined text-primary">trending_up</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Rp {profitKotor.toLocaleString('id-ID')}</h2>
                        <div className="mt-2 flex items-center gap-1">
                            <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold px-1.5 py-0.5 rounded-full">{profitMargin.toFixed(1)}%</span>
                            <span className="text-[10px] text-on-surface-variant">profit margin</span>
                        </div>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-on-surface-variant">Total Orders</span>
                        <span className="material-symbols-outlined text-secondary">package_2</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">{totalOrders}</h2>
                        <div className="mt-2 flex items-center gap-1">
                            <span className="bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold px-1.5 py-0.5 rounded-full">{Math.round(avgOrdersPerDay)}</span>
                            <span className="text-[10px] text-on-surface-variant">orders / day</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Performance Row */}
            <section className="mb-8">
                <div className="bg-surface-container-lowest rounded-xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-on-surface">Platform's Performance</h3>
                        <Link href="/analytics" className="text-xs font-bold text-primary uppercase tracking-widest hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors">View All</Link>
                    </div>
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        {platformData.length > 0 ? platformData.map((plat, idx) => (
                            <div key={idx} className="group relative bg-surface-container-low rounded-2xl p-5 transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 overflow-hidden cursor-default border border-transparent hover:border-surface-container-high">
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm ${getPlatformIconColor(plat.name, idx)}`}>
                                            {plat.name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-on-surface capitalize text-base">{plat.name}</h4>
                                            <p className="text-xs text-on-surface-variant font-semibold mt-0.5">{plat.transactions} Transactions</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-extrabold text-primary text-lg">Rp {plat.profit.toLocaleString('id-ID')}</p>
                                        <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mt-0.5">Profit</p>
                                    </div>
                                </div>
                                
                                {/* Hover Details Panel */}
                                <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-surface-container-high/50 opacity-0 max-h-0 translate-y-4 group-hover:opacity-100 group-hover:max-h-40 group-hover:translate-y-0 transition-all duration-500 ease-in-out pointer-events-none group-hover:pointer-events-auto">
                                    <div className="bg-surface-container-lowest p-3 rounded-lg">
                                        <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">payments</span> Omzet
                                        </p>
                                        <p className="font-bold text-sm text-on-surface">Rp {plat.omzet.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="bg-surface-container-lowest p-3 rounded-lg">
                                        <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">shopping_bag</span> Cost
                                        </p>
                                        <p className="font-bold text-sm text-tertiary">Rp {Math.abs(plat.cost).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="bg-surface-container-lowest p-3 rounded-lg">
                                        <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">assignment_return</span> Refunds
                                        </p>
                                        <p className="font-bold text-sm text-on-surface">{plat.refunds} Orders</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant bg-surface-container-lowest rounded-2xl border border-dashed border-surface-container-high">
                                <span className="material-symbols-outlined text-4xl mb-3 opacity-50">data_alert</span>
                                <span className="font-medium text-sm">No platform data available</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Courier & Refund Row */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Courier Analysis Placeholder */}
                <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col">
                    <h3 className="text-lg font-bold text-on-surface mb-6">Courier Analysis</h3>
                    <div className="flex-1 flex items-center justify-center relative">
                        {/* Dynamic Circular Chart */}
                        <div 
                            className="relative w-32 h-32 shrink-0 rounded-full flex items-center justify-center"
                            style={{ background: `conic-gradient(var(--color-secondary) ${topCourierPercentage}%, var(--color-primary-container) 0)` }}
                        >
                            <div className="absolute inset-3 bg-surface-container-lowest rounded-full flex flex-col items-center justify-center">
                                <p className="text-xl font-extrabold text-on-surface leading-tight">{topCourierPercentage}%</p>
                                <p className="text-[8px] text-on-surface-variant font-bold uppercase tracking-tighter max-w-[60px] truncate text-center">{topCourierName}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col gap-2">
                        {courierData.slice(0, 2).map((c, i) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                                <span className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary-container' : 'bg-secondary'}`}></span> 
                                    {c.name}
                                </span>
                                <span className="font-bold">{c.orders} orders</span>
                            </div>
                        ))}
                        {courierData.length === 0 && (
                            <div className="text-center text-xs text-on-surface-variant italic">No data available</div>
                        )}
                    </div>
                </div>

                {/* Refunds Total Split Card */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-surface-container-high flex flex-col justify-between">
                    <h3 className="text-xl font-bold text-on-surface mb-10">Refunds Total</h3>
                    <div className="space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-tertiary text-2xl">assignment_return</span>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] leading-none">Refund</p>
                                    <h4 className="text-3xl font-black text-tertiary leading-none">{refunds}</h4>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-tertiary/60 uppercase tracking-widest">+0 today</span>
                            </div>
                        </div>
                        
                        <div className="h-px bg-surface-container-high/50 w-full"></div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] leading-none">Normal</p>
                                    <h4 className="text-3xl font-black text-primary leading-none">{normals}</h4>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">{normalRate}% rate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Row: Data Analytics Chart */}
            <section className="bg-surface-container-lowest rounded-xl p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h3 className="text-xl font-bold text-on-surface">Data Analytics Trends</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Platform performance comparison over the last 30 days</p>
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full">
                        <button 
                            onClick={() => setChartFilter('revenue')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${chartFilter === 'revenue' ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >Revenue</button>
                        <button 
                            onClick={() => setChartFilter('orders')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${chartFilter === 'orders' ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >Orders</button>
                        <button 
                            onClick={() => setChartFilter('cancellations')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${chartFilter === 'cancellations' ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >Cancellations</button>
                    </div>
                </div>

                {/* Chart Visualization Component (Stylized Bento/Grid) */}
                <div className="h-80 w-full relative flex items-end gap-1 group pb-2">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                        <div className="border-b border-on-surface-variant"></div>
                        <div className="border-b border-on-surface-variant"></div>
                        <div className="border-b border-on-surface-variant"></div>
                        <div className="border-b border-on-surface-variant"></div>
                        <div className="border-b border-on-surface-variant"></div>
                    </div>

                    {/* Dynamic Abstract Bars */}
                    {finalChartData.map((day, idx) => {
                        const heightPercent = Math.max((day.total / maxChartValue) * 100, 2); // min 2% height for visibility
                        
                        return (
                            <div key={idx} className="flex-1 flex flex-col justify-end group/bar relative h-full rounded-t-lg transition-all duration-300 hover:bg-surface-container-high/30 px-0.5">
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-surface-container-lowest text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover/bar:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity shadow-lg">
                                    <p className="font-bold text-center mb-0.5">{day.date}</p>
                                    <p className="opacity-90">{chartFilter === 'revenue' ? `Rp ${day.total.toLocaleString('id-ID')}` : `${day.total} ${chartFilter}`}</p>
                                </div>
                                
                                {/* Stacked bar segments */}
                                <div className="w-full flex flex-col justify-end rounded-t-lg overflow-hidden group-hover/bar:ring-2 ring-primary/20 transition-all duration-500 ease-out" style={{ height: `${heightPercent}%` }}>
                                    {platformData.map((p, pIdx) => {
                                        const platVal = day.platforms[p.name] || 0;
                                        if (platVal === 0) return null;
                                        const segmentHeight = (platVal / day.total) * 100;
                                        const colorClass = getPlatformColor(p.name, pIdx);
                                        return (
                                            <div key={p.name} className={`w-full transition-all duration-500 ${colorClass}`} style={{ height: `${segmentHeight}%` }} title={`${p.name}: ${chartFilter === 'revenue' ? 'Rp '+platVal.toLocaleString() : platVal}`}></div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Fill empty bars if less than 30 dates */}
                    {Array.from({ length: Math.max(0, 30 - finalChartData.length) }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="flex-1 h-full"></div>
                    ))}
                </div>

                {/* Chart Legend */}
                <div className="mt-8 flex items-center justify-center gap-10">
                    {platformData.length > 0 ? platformData.map((plat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getPlatformColor(plat.name, idx)}`}></div>
                            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{plat.name}</span>
                        </div>
                    )) : (
                        <div className="text-xs font-bold text-on-surface-variant italic">No data available</div>
                    )}
                </div>
            </section>
        </>
    );
}
