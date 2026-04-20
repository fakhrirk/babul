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
        $data = Transaction::orderBy('id', 'desc')->get();
        return view('dashboard', compact('data'));
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

    public function deleteAll()
    {
        Transaction::truncate();
        return redirect('/')->with('success', 'Semua data dihapus');
    }
}