<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ShopeeImport;
use App\Imports\TokopediaImport;

class ImportController extends Controller
{
    public function index()
    {
        return inertia('dashboard', [
            'data' => Transaction::all()
        ]);
    }

    public function analytics(Request $request)
    {
        $query = Transaction::latest();
        $period = $request->period ?: 30;
        
        if ($period !== 'all') {
            $query->where('created_at', '>=', now()->subDays((int)$period));
        }

        return inertia('analytics', [
            'data' => $query->get(),
            'period' => $period
        ]);
    }

    public function importPage()
    {
        return inertia('import-data');
    }

    public function import(Request $request)
    {
        try {
            ini_set('memory_limit', '512M');

            $platform = $request->platform;

            if ($platform == 'shopee') {
                Excel::import(new ShopeeImport, $request->file('file'));
            }

            if ($platform == 'tokopedia') {
                Excel::import(new TokopediaImport, $request->file('file'));
            }

            return redirect('/transactions')->with('success', 'Import berhasil');

        } catch (\Exception $e) {

            return redirect('/transactions')->with('error', 'waduh, filenya ga cocok. Coba lagi');
        }
    }

    public function transactions(Request $request)
    {
        $query = Transaction::latest();
        
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('invoice_made', 'like', "%{$search}%")
                  ->orWhere('platform', 'like', "%{$search}%")
                  ->orWhere('courier', 'like', "%{$search}%");
            });
        }

        if ($request->filled('platform') && $request->platform !== 'all') {
            $query->where('platform', $request->platform);
        }

        return inertia('transactions', [
            'data' => $query->get(),
            'filters' => $request->only('search', 'platform')
        ]);
    }

    public function export(Request $request)
    {
        $query = Transaction::latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('invoice_made', 'like', "%{$search}%")
                  ->orWhere('platform', 'like', "%{$search}%")
                  ->orWhere('courier', 'like', "%{$search}%");
            });
        }

        if ($request->filled('platform') && $request->platform !== 'all') {
            $query->where('platform', $request->platform);
        }
        
        if ($request->filled('period') && $request->period !== 'all') {
            $query->where('created_at', '>=', now()->subDays((int)$request->period));
        }

        $transactions = $query->get();
        $filename = "transactions_export_" . date('Ymd_His') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use($transactions) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Platform', 'Invoice Made', 'Invoice Paid', 'Price Before', 'Price After', 'Admin Fee', 'Courier', 'Is Refund']);

            foreach ($transactions as $task) {
                fputcsv($file, [
                    $task->id,
                    $task->platform,
                    $task->invoice_made,
                    $task->invoice_paid,
                    $task->price_before,
                    $task->price_after,
                    $task->admin_fee,
                    $task->courier,
                    $task->is_refund ? 'Yes' : 'No'
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function deleteAll()
    {
        Transaction::truncate();
        return redirect('/')->with('success', 'Semua data dihapus');
    }
}