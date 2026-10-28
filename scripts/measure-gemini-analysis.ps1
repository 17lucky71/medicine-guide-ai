param(
  [int]$Samples = 3,
  [ValidateSet('image', 'text')]
  [string]$Mode = 'image',
  [string]$Url = 'https://medicine-guide-ai.vercel.app/api/analyze',
  [string]$OutputPath = ''
)

$ErrorActionPreference = 'Stop'
if ($Samples -lt 1) { throw 'Samples must be at least 1.' }
Add-Type -AssemblyName System.Drawing

$bitmap = New-Object System.Drawing.Bitmap 1200, 800
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.Clear([System.Drawing.Color]::White)
$titleFont = New-Object System.Drawing.Font('Malgun Gothic', 36, [System.Drawing.FontStyle]::Bold)
$bodyFont = New-Object System.Drawing.Font('Malgun Gothic', 30, [System.Drawing.FontStyle]::Regular)
$brush = [System.Drawing.Brushes]::DarkSlateGray
$graphics.DrawString('테스트용 모형 약봉투', $titleFont, $brush, 60, 80)
$graphics.DrawString('타이레놀정 500 mg', $bodyFont, $brush, 60, 220)
$graphics.DrawString('복용법: 필요 시 1회 1정', $bodyFont, $brush, 60, 320)
$graphics.DrawString('실제 복용 금지 · AI 응답시간 측정용', $bodyFont, $brush, 60, 480)
$stream = New-Object System.IO.MemoryStream
$bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
$imageData = [Convert]::ToBase64String($stream.ToArray())
$graphics.Dispose()
$titleFont.Dispose()
$bodyFont.Dispose()
$bitmap.Dispose()
$stream.Dispose()

$requestBody = if ($Mode -eq 'image') {
  @{ type = 'image'; image = "data:image/png;base64,$imageData"; savedMeds = @() }
} else {
  @{ type = 'text'; query = 'Tylenol'; savedMeds = @() }
}
$payload = $requestBody | ConvertTo-Json -Compress -Depth 4
$utf8 = New-Object System.Text.UTF8Encoding($false)
$token = [Guid]::NewGuid().ToString('N')
$payloadPath = Join-Path $env:TEMP "medicine-guide-ai-$token-request.json"
$responsePath = Join-Path $env:TEMP "medicine-guide-ai-$token-response.json"
[System.IO.File]::WriteAllText($payloadPath, $payload, $utf8)

$results = for ($sample = 1; $sample -le $Samples; $sample++) {
  $requestedAt = (Get-Date).ToUniversalTime().ToString('o')
  $timer = [System.Diagnostics.Stopwatch]::StartNew()
  $metrics = & curl.exe --silent --show-error --output $responsePath --write-out '%{http_code},%{time_total}' --max-time 90 -H 'Content-Type: application/json' --data-binary "@$payloadPath" $Url
  $curlExit = $LASTEXITCODE
  $timer.Stop()

  $status = 0
  $curlSeconds = ''
  if ($metrics -match '^([0-9]{3}),([0-9.]+)$') {
    $status = [int]$Matches[1]
    $curlSeconds = [double]::Parse($Matches[2], [Globalization.CultureInfo]::InvariantCulture)
  }

  $resultKind = if ($curlExit -ne 0) { "transport_error_$curlExit" } elseif ($status -eq 200) { 'analysis_success' } elseif ($status -eq 422) { 'model_returned_no_medicine' } else { 'http_error' }
  $upstreamStatus = ''
  if ($status -eq 502 -and (Test-Path -LiteralPath $responsePath)) {
    try {
      $errorBody = Get-Content -LiteralPath $responsePath -Raw | ConvertFrom-Json
      if ($errorBody.error -match '상태\s+(\d+)') {
        $upstreamStatus = [int]$Matches[1]
        $resultKind = "gemini_http_$upstreamStatus"
      }
    } catch {
      $resultKind = 'unreadable_error_response'
    }
  }
  [pscustomobject]@{
    Mode = $Mode
    Sample = $sample
    RequestedAtUtc = $requestedAt
    HttpStatus = $status
    CurlTotalSeconds = $curlSeconds
    ClientElapsedSeconds = [Math]::Round($timer.Elapsed.TotalSeconds, 6)
    UpstreamStatus = $upstreamStatus
    Result = $resultKind
  }

  if ($sample -lt $Samples) { Start-Sleep -Milliseconds 1000 }
}

$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
if ([string]::IsNullOrWhiteSpace($OutputPath)) {
  $stamp = (Get-Date).ToUniversalTime().ToString('yyyyMMdd-HHmmss')
  $OutputPath = "docs/evidence/gemini-analysis-run-$stamp.csv"
}
$resolvedOutput = if ([System.IO.Path]::IsPathRooted($OutputPath)) { $OutputPath } else { Join-Path $repoRoot $OutputPath }
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $resolvedOutput) | Out-Null
$results | Export-Csv -LiteralPath $resolvedOutput -NoTypeInformation -Encoding UTF8
$results | Select-Object Mode, Sample, RequestedAtUtc, HttpStatus, CurlTotalSeconds, ClientElapsedSeconds, UpstreamStatus, Result | Format-Table -AutoSize
Write-Output "Evidence: $resolvedOutput"

Remove-Item -LiteralPath $payloadPath, $responsePath -ErrorAction SilentlyContinue
