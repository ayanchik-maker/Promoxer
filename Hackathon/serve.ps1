# Promoxer — minimal dependency-free static file server (no Node/Python needed).
# Usage:  powershell -ExecutionPolicy Bypass -File serve.ps1   then open http://localhost:5173
param([int]$Port = 5173)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$types = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8";
  ".js"="application/javascript; charset=utf-8"; ".jsx"="application/javascript; charset=utf-8";
  ".json"="application/json; charset=utf-8"; ".svg"="image/svg+xml"; ".png"="image/png";
  ".ico"="image/x-icon"; ".woff2"="font/woff2"
}

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()
Write-Host "Promoxer running at http://localhost:$Port  (Ctrl+C to stop)"

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $requestLine = $reader.ReadLine()
    if (-not $requestLine) { $client.Close(); continue }
    $parts = $requestLine.Split(' ')
    $url = $parts[1]
    $path = ($url -split '\?')[0]
    if ($path -eq '/' ) { $path = '/index.html' }
    $path = [System.Uri]::UnescapeDataString($path)
    $file = Join-Path $root ($path.TrimStart('/') -replace '/', '\')

    if (Test-Path $file -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      $ctype = if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" }
      $header = "HTTP/1.1 200 OK`r`nContent-Type: $ctype`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
      $hb = [System.Text.Encoding]::ASCII.GetBytes($header)
      $stream.Write($hb, 0, $hb.Length)
      $stream.Write($bytes, 0, $bytes.Length)
    } else {
      $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
      $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
      $hb = [System.Text.Encoding]::ASCII.GetBytes($header)
      $stream.Write($hb, 0, $hb.Length)
      $stream.Write($body, 0, $body.Length)
    }
    $stream.Flush()
  } catch { }
  finally { $client.Close() }
}
