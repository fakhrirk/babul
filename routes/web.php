<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\ImportController;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

Route::get('/', [ImportController::class, 'index'])->name('dashboard');

Route::get('/transactions', [ImportController::class, 'index']);
Route::post('/import', [ImportController::class, 'import']);
Route::post('/delete-all', [ImportController::class, 'deleteAll']);

require __DIR__.'/settings.php';
