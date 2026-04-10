<!DOCTYPE html>
<html>
<head>
    <title>Transactions</title>
    <style>
        body { font-family: sans-serif; padding: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px;}
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f5f5f5; }
        button { padding: 8px 16px; }
    </style>
</head>
<body>

    <h2>Import Data</h2>

    <form action="/import" method="POST" enctype="multipart/form-data">
        @csrf

        <select name="platform" required>
            <option value="">-- Pilih Platform --</option>
            <option value="shopee">Shopee</option>
            <option value="tokopedia">Tokopedia</option>
            <option value="accurate">Accurate</option>
        </select>

        <input type="file" name="file" required>

        <button type="submit">Import</button>
    </form>

    <form action="/delete-all" method="POST" style="margin-top:10px;">
        @csrf
        <button onclick="return confirm('Yakin hapus semua data?')">Hapus Semua</button>
    </form>

    @if(session('success'))
        <p style="color: green">{{ session('success') }}</p>
    @endif

    <h2>Data Transactions</h2>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Customer</th>
                <th>Invoice Made</th>
                <th>Invoice Paid</th>
                <th>Price Before</th>
                <th>Admin Fee</th>
                <th>Service Fee</th>
                <th>Transaction Fee</th>
                <th>Campaign Fee</th>
                <th>Price After</th>
                <th>Courier</th>
                <th>Refund</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $index => $row)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $row->customer }}</td>
                    <td>{{ $row->invoice_made }}</td>
                    <td>{{ $row->invoice_paid }}</td>

                    <td>Rp {{ number_format($row->price_before, 0, ',', '.') }}</td>

                    <td>Rp {{ number_format($row->admin_fee, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($row->service_fee, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($row->transaction_fee, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($row->campaign_fee, 0, ',', '.') }}</td>

                    <td>Rp {{ number_format($row->price_after, 0, ',', '.') }}</td>

                    <td>{{ $row->courier }}</td>

                    <td>
                        @if($row->is_refund)
                            ❌ Refund
                        @else
                            ✅ Normal
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>