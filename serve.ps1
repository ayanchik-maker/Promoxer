# Promoxer — minimal dependency-free static file server (no Node/Python needed).
# Usage:  powershell -ExecutionPolicy Bypass -File serve.ps1   then open http://localhost:5173
param([int]$Port = 5173)

if ($env:PORT) { $Port = [int]$env:PORT }

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$types = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8";
  ".js"="application/javascript; charset=utf-8"; ".jsx"="application/javascript; charset=utf-8";
  ".json"="application/json; charset=utf-8"; ".svg"="image/svg+xml"; ".png"="image/png";
  ".ico"="image/x-icon"; ".woff2"="font/woff2"
}

# HttpListener: http.sys manages connections, so idle/speculative browser
# connections can't deadlock the accept loop (unlike a raw TcpListener).
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Promoxer running at http://localhost:$Port  (Ctrl+C to stop)"

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    $path = $req.Url.AbsolutePath
    if ($path -eq '/') { $path = '/index.html' }
    $path = [System.Uri]::UnescapeDataString($path)
    $file = Join-Path $root ($path.TrimStart('/') -replace '/', '\')

    # Keep requests inside the project root.
    $resolved = [System.IO.Path]::GetFullPath($file)
    if (-not $resolved.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
      $res.StatusCode = 403
      $res.Close()
      continue
    }

    if (Test-Path $resolved -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($resolved)
      $ext = [System.IO.Path]::GetExtension($resolved).ToLower()
      $res.StatusCode = 200
      $res.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" }
      $res.Headers.Add("Cache-Control", "no-store")
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
      $res.StatusCode = 404
      $res.ContentType = "text/plain; charset=utf-8"
      $res.ContentLength64 = $body.Length
      $res.OutputStream.Write($body, 0, $body.Length)
    }
    $res.Close()
  } catch { }
}
