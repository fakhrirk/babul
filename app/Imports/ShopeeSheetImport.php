<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class ShopeeSheetImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Transaction([
            'customer' => $row['username_(pembeli)'],
        ]);
    }
}