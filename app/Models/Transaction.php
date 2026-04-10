<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'customer',
        'invoice_made',
        'payment_method',
        'invoice_paid',
        'price_before',
        'price_after',
        'admin_fee',
        'service_fee',
        'transaction_fee',
        'campaign_fee',
        'shipping_provider',
        'courier',
        'is_refund',
    ];
}