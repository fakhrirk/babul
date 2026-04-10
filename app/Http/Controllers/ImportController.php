<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ShopeeImport;

class ImportController extends Controller
{
    public function index()
    {
        $data = Transaction::orderBy('id', 'asc')->get();
        return view('transactions', compact('data'));
    }

    public function import(Request $request)
    {
        $platform = $request->platform;

        if ($platform == 'shopee') {
            Excel::import(new ShopeeImport, $request->file('file'));
        }

        // nanti tinggal tambahin:
        // else if ($platform == 'tokopedia') { ... }
        // else if ($platform == 'accurate') { ... }

        return redirect('/transactions')->with('success', 'Import berhasil');
    }

    public function deleteAll()
    {
        Transaction::truncate();
        return redirect('/')->with('success', 'Semua data dihapus');
    }
}