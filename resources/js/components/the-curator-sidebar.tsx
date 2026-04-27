import { Link, usePage } from '@inertiajs/react';

export function TheCuratorSidebar() {
    const { url, props } = usePage<any>();
    const user = props.auth?.user;

    const isActive = (path: string) => {
        if (path === '/') return url === '/';
        return url.startsWith(path);
    };

    const activeClass = "bg-primary text-white rounded-full px-4 py-2 flex items-center gap-3 transition-all scale-95 active:scale-90 shadow-lg shadow-primary/20";
    const inactiveClass = "text-secondary hover:bg-surface-container-highest rounded-full px-4 py-2 flex items-center gap-3 transition-all scale-95 active:scale-90 hover:pl-6";

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-surface-container-low z-50 flex flex-col p-6 gap-8 border-r border-surface-container-high">
            <div className="flex items-center gap-3 px-2 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined font-bold text-xl">draw</span>
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-primary">Dashboard</h1>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">Babul Syifa</p>
                </div>
            </div>
            
            <nav className="flex flex-col gap-2">
                <Link href="/" className={isActive('/') ? activeClass : inactiveClass}>
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="font-medium">Dashboard</span>
                </Link>
                <Link href="/transactions" className={isActive('/transactions') ? activeClass : inactiveClass}>
                    <span className="material-symbols-outlined">receipt_long</span>
                    <span className="font-medium">Transactions</span>
                </Link>
                <Link href="/analytics" className={isActive('/analytics') ? activeClass : inactiveClass}>
                    <span className="material-symbols-outlined">analytics</span>
                    <span className="font-medium">Analytics</span>
                </Link>
                <Link href="/import-data" className={isActive('/import-data') ? activeClass : inactiveClass}>
                    <span className="material-symbols-outlined">file_upload</span>
                    <span className="font-medium">Import Data</span>
                </Link>
            </nav>
            
            <div className="mt-auto pt-6">
                <a href="/export" className="block text-center w-full bg-primary-container text-on-primary-container rounded-full py-3 font-bold text-sm tracking-wide transition-transform active:scale-95">
                    Generate Report
                </a>
                
                <div className="mt-8 flex items-center justify-between gap-2 px-1">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-on-surface truncate">{user?.name || 'User'}</span>
                            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter truncate">{user?.email || 'admin@example.com'}</span>
                        </div>
                    </div>
                    <Link href="/logout" method="post" as="button" className="shrink-0 p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
