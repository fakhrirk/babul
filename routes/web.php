<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\ImportController;

Route::middleware(['auth'])->group(function () {
    Route::get('/', [ImportController::class, 'index'])->name('dashboard');
    Route::get('/analytics', [ImportController::class, 'analytics'])->name('analytics');
    Route::get('/import-data', [ImportController::class, 'importPage'])->name('import-data');
    Route::get('/transactions', [ImportController::class, 'transactions'])->name('transactions');
    Route::post('/import', [ImportController::class, 'import'])->name('import.post');
    Route::post('/delete-all', [ImportController::class, 'deleteAll'])->name('delete-all');
    Route::get('/export', [ImportController::class, 'export'])->name('export');
});

require __DIR__.'/settings.php';
