import { Head, useForm } from '@inertiajs/react';
import React from 'react';

export default function ImportData() {
    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
        platform: 'shopee',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/import');
    };

    return (
        <>
            <Head title="Import Data" />
            
            <div className="max-w-5xl mx-auto space-y-10 pb-10">
                {/* Header section with better clarity */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-4xl font-black text-on-surface tracking-tighter leading-tight">Data Synchronization</h2>
                    <p className="text-on-surface-variant font-medium text-lg max-w-2xl">Upload your marketplace export files to keep your studio analytics up to date with the latest financial performance signals.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Import Form Card */}
                    <div className="lg:col-span-2 bg-surface-container-lowest rounded-[3rem] p-10 shadow-2xl shadow-black/[0.02] border border-surface-container-high">
                        <form onSubmit={submit} className="space-y-12">
                            {/* Step 1: Platform Selection */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">1</div>
                                    <h3 className="text-xl font-bold text-on-surface tracking-tight">Select Marketplace Platform</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setData('platform', 'shopee')}
                                        className={`group relative overflow-hidden py-6 rounded-3xl font-black flex flex-col items-center gap-3 transition-all ${data.platform === 'shopee' ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-100' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high scale-[0.98]'}`}
                                    >
                                        <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                                        <span className="tracking-widest uppercase text-xs">Shopee Marketplace</span>
                                        {data.platform === 'shopee' && <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></div>}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setData('platform', 'tokopedia')}
                                        className={`group relative overflow-hidden py-6 rounded-3xl font-black flex flex-col items-center gap-3 transition-all ${data.platform === 'tokopedia' ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-100' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high scale-[0.98]'}`}
                                    >
                                        <span className="material-symbols-outlined text-3xl">storefront</span>
                                        <span className="tracking-widest uppercase text-xs">Tokopedia Global</span>
                                        {data.platform === 'tokopedia' && <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></div>}
                                    </button>
                                </div>
                            </div>

                            {/* Step 2: File Upload */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">2</div>
                                    <h3 className="text-xl font-bold text-on-surface tracking-tight">Upload Export File</h3>
                                </div>
                                <div className="relative group">
                                    <input 
                                        type="file" 
                                        onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className={`w-full py-16 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all ${data.file ? 'border-primary bg-primary/5' : 'border-surface-container-highest bg-surface-container-low hover:border-primary/50 group-hover:scale-[0.99]'}`}>
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${data.file ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-surface-container-high text-on-surface-variant/40'}`}>
                                            <span className="material-symbols-outlined text-3xl">
                                                {data.file ? 'check_circle' : 'upload_file'}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-black text-on-surface">
                                                {data.file ? data.file.name : 'Drop your export file here'}
                                            </p>
                                            <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">
                                                {data.file ? `${(data.file.size / 1024).toFixed(1)} KB` : 'Supports .xlsx, .xls, and .csv formats'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {errors.file && (
                                    <div className="bg-error/10 text-error p-4 rounded-2xl flex items-center gap-3 border border-error/20">
                                        <span className="material-symbols-outlined">error</span>
                                        <p className="text-xs font-black">{errors.file}</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6">
                                <button 
                                    type="submit" 
                                    disabled={processing || !data.file} 
                                    className="group w-full bg-primary text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:scale-100 flex items-center justify-center gap-4"
                                >
                                    {processing ? (
                                        <span className="animate-spin material-symbols-outlined text-2xl">sync</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">bolt</span>
                                    )}
                                    {processing ? 'Analyzing Dataset...' : 'Generate Studio Analytics'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar Info Cards */}
                    <div className="space-y-6">
                        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-surface-container-high space-y-6">
                            <h4 className="font-black text-on-surface uppercase tracking-widest text-[10px]">Import Guidelines</h4>
                            <div className="space-y-8">
                                {[
                                    { icon: 'description', title: 'Native Files', desc: 'Use original export files from Seller Center without renaming or editing columns.' },
                                    { icon: 'speed', title: 'Turbo Processing', desc: 'Our engine processes up to 10,000 rows in under 3 seconds using optimized parsing.' },
                                    { icon: 'security', title: 'Private & Secure', desc: 'Your financial data is encrypted at rest and never shared with third-party service providers.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5">
                                        <div className="shrink-0 w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h5 className="font-black text-sm text-on-surface">{item.title}</h5>
                                            <p className="text-[11px] font-medium text-on-surface-variant leading-relaxed opacity-70">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* <div className="bg-primary-container text-on-primary-container p-8 rounded-[2.5rem] border border-primary/10 relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <h4 className="relative z-10 font-black text-lg mb-2">Need help?</h4>
                            <p className="relative z-10 text-xs font-bold opacity-70 leading-relaxed mb-6">If you encounter any issues with the file format, please contact our support team.</p>
                            <button className="relative z-10 w-full py-4 bg-on-primary-container text-primary-container rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">
                                Documentation
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}
