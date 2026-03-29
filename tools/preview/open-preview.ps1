param(
  [ValidateSet("web", "mobile", "both")]
  [string]$Mode = "both",
  [int]$Port = 8130
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = (Resolve-Path (Join-Path $scriptDir "..\\..")).Path
$baseUrl = "http://127.0.0.1:$Port"

function Test-PreviewUrl {
  param([string]$Url)

  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

function Get-BrowserPath {
  $candidates = @(
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
  )

  foreach ($candidate in $candidates) {
    if (Test-Path $candidate) {
      return $candidate
    }
  }

  return $null
}

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
  Write-Host "Python is required to run the preview server." -ForegroundColor Red
  Write-Host "Install Python and run this preview again." -ForegroundColor Yellow
  exit 1
}

if (-not (Test-PreviewUrl "$baseUrl/index.html")) {
  $serverCommand = "Set-Location '$root'; python -m http.server $Port --bind 127.0.0.1"
  Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $serverCommand | Out-Null

  $serverReady = $false
  for ($i = 0; $i -lt 20; $i += 1) {
    Start-Sleep -Milliseconds 500
    if (Test-PreviewUrl "$baseUrl/index.html") {
      $serverReady = $true
      break
    }
  }

  if (-not $serverReady) {
    throw "Preview server failed to start on $baseUrl."
  }
}

$browser = Get-BrowserPath

function Open-PreviewPage {
  param(
    [string]$Page,
    [int]$Width,
    [int]$Height,
    [int]$X,
    [int]$Y
  )

  $url = "$baseUrl/$Page"

  if ($browser) {
    Start-Process -FilePath $browser -ArgumentList "--new-window", "--window-position=$X,$Y", "--window-size=$Width,$Height", $url | Out-Null
    return
  }

  Start-Process $url | Out-Null
}

switch ($Mode) {
  "web" {
    Open-PreviewPage -Page "preview-web.html" -Width 1460 -Height 940 -X 60 -Y 60
  }
  "mobile" {
    Open-PreviewPage -Page "preview-mobile.html" -Width 470 -Height 940 -X 1540 -Y 60
  }
  "both" {
    Open-PreviewPage -Page "preview-web.html" -Width 1460 -Height 940 -X 60 -Y 60
    Open-PreviewPage -Page "preview-mobile.html" -Width 470 -Height 940 -X 1540 -Y 60
  }
}

Write-Host "Preview server: $baseUrl"
Write-Host "Web preview: $baseUrl/preview-web.html"
Write-Host "Mobile preview: $baseUrl/preview-mobile.html"
