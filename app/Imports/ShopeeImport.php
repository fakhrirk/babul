<?php

namespace App\Imports;

// use App\Models\Transaction;
// use Illuminate\Support\Collection;
// use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Imports\ShopeeIncomeSheetImport;


class ShopeeImport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            1 => new ShopeeIncomeSheetImport(), // pakai index (AMAN)
        ];
    }
}


// public function collection(Collection $rows)
// {
//     foreach ($rows->slice(6) as $row) {

//         if (!$row[3]) continue;

//         Transaction::create([
//             'customer' => $row[3],
//             'invoice_made' => $row[4],
//             'payment_method' => $row[5],
//             'invoice_paid' => $row[6],

//             'price_before' => (int) $row[7],
//             'price_after' => (int) $row[32],

//             'admin_fee' => (int) $row[24],
//             'service_fee' => (int) $row[25],
//             'transaction_fee' => (int) $row[27],
//             'campaign_fee' => (int) $row[28],

//             'shipping_provider' => $row[36],
//             'courier' => $row[37],

//             'is_refund' => ($row[9] > 0 || $row[39] > 0) ? 1 : 0,
//         ]);
//     }
// }