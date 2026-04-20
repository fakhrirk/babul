<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            $table->string('customer')->nullable();
            $table->string('invoice_made')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('invoice_paid')->nullable();
            
            $table->bigInteger('price_before')->default(0);
            $table->bigInteger('price_after')->default(0);

            $table->integer('admin_fee')->default(0);
            $table->integer('service_fee')->default(0);
            $table->integer('transaction_fee')->default(0);
            $table->integer('campaign_fee')->default(0);

            $table->string('shipping_provider')->nullable();
            $table->string('courier')->nullable();
            $table->boolean('is_refund')->default(false);
            $table->string('platform')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
