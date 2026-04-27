import { Head, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { ChevronDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Transactions({ data = [], filters = {} }: { data: any[], filters?: any }) {
    return (
        <>
            <Head title="Transaction Reports" />
            <div className="flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-on-surface">Transaction Reports</h2>
                    <div className="flex items-center gap-3">
                        <select 
                            className="bg-surface-container-highest px-4 py-2 rounded-full text-sm font-bold text-on-surface hover:bg-surface-dim transition-colors appearance-none outline-none cursor-pointer"
                            onChange={(e) => router.get('/transactions', { ...filters, platform: e.target.value }, { preserveState: true })}
                            defaultValue={filters?.platform || 'all'}
                        >
                            <option value="all">All Platforms</option>
                            <option value="Shopee">Shopee</option>
                            <option value="Tokopedia">Tokopedia</option>
                        </select>
                        <a href={`/export?search=${filters?.search || ''}&platform=${filters?.platform || ''}`} className="flex items-center bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-bold transition-all hover:bg-primary/90 scale-95 active:scale-90">
                            <span className="material-symbols-outlined mr-2 text-sm">download</span>
                            Download
                        </a>
                    </div>
                </div>

                {/* Table Section */}
                <div className="flex flex-col flex-1 rounded-xl bg-surface-container-lowest p-6 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="border-b border-surface-container-high">
                                <tr>
                                    <th className="py-3 px-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">No</th>
                                    <th className="py-3 px-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Tanggal order</th>
                                    <th className="py-3 px-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Tanggal bayar</th>
                                    <th className="py-3 px-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Omzet kotor</th>
                                    <th className="py-3 px-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Admin fee</th>
                                    <th className="py-3 px-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Service fee</th>
                                    <th className="py-3 px-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Campaign fee</th>
                                    <th className="py-3 px-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Net income</th>
                                    <th className="py-3 px-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">Courier</th>
                                    <th className="py-3 px-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px] text-center">Refund</th>
                                    <th className="py-3 px-4 font-bold text-on-surface-variant uppercase tracking-widest text-[10px] text-center">Platform</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium">
                                {data.map((row: any, idx: number) => (
                                    <tr key={idx} className="border-b border-surface-container hover:bg-surface-container-low transition-colors text-on-surface">
                                        <td className="py-3 px-4 font-bold">{idx + 1}</td>
                                        <td className="py-3 px-4">{row.invoice_made}</td>
                                        <td className="py-3 px-4">{row.invoice_paid}</td>
                                        <td className="py-3 px-4">Rp{row.price_before.toLocaleString('id-ID')}</td>
                                        <td className="py-3 px-4">Rp{row.admin_fee.toLocaleString('id-ID')}</td>
                                        <td className="py-3 px-4">Rp{row.service_fee.toLocaleString('id-ID')}</td>
                                        <td className="py-3 px-4">Rp{row.campaign_fee.toLocaleString('id-ID')}</td>
                                        <td className="py-3 px-4">Rp{row.price_after.toLocaleString('id-ID')}</td>
                                        <td className="py-3 px-4">{row.courier}</td>
                                        <td className="py-3 px-4 text-center">
                                            {row.is_refund ? (
                                                <span className="inline-flex items-center py-1 px-2.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">
                                                    Refund
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center py-1 px-3 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold">
                                                    Normal
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {row.platform?.toLowerCase() === 'shopee' ? (
                                                <span className="inline-flex items-center py-1 px-3 rounded-md bg-tertiary/10 text-tertiary text-xs font-bold">
                                                    Shopee
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center py-1 px-2.5 rounded-md bg-primary/10 text-primary text-xs font-bold">
                                                    Tokopedia
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Transactions.layout = undefined;
