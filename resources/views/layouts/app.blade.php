<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
    <style>
        body {
            margin: 0;
            font-family: sans-serif;
            display: flex;
        }

        .sidebar {
            width: 220px;
            background: #f5f5f5;
            height: 100vh;
            padding: 20px;
        }

        .main {
            flex: 1;
        }

        .navbar {
            height: 60px;
            background: #eee;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
        }

        .content {
            padding: 20px;
        }

        a {
            display: block;
            margin: 10px 0;
            text-decoration: none;
        }

        .btn {
            background: green;
            color: white;
            padding: 8px;
            border-radius: 5px;
        }
    </style>
</head>
<body>

    @include('components.sidebar')

    <div class="main">
        @include('components.navbar')

        <div class="content">
            @yield('content')
        </div>
    </div>

</body>
</html>