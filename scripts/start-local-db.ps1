param([string]$MongoPath = "")
$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$mongoRoot = Join-Path $projectRoot ".local\mongodb"
$dataPath = Join-Path $mongoRoot "data"
$logPath = Join-Path $mongoRoot "mongod.log"
New-Item -ItemType Directory -Force -Path $dataPath | Out-Null

$listener = New-Object System.Net.Sockets.TcpClient
$running = $false
try { $listener.Connect("127.0.0.1", 27018); $running = $true } catch { }
finally { $listener.Dispose() }

if (-not $running) {
  if (-not $MongoPath) {
    $installed = Get-ChildItem "C:\Program Files\MongoDB\Server\*\bin\mongod.exe" -ErrorAction SilentlyContinue |
      Sort-Object { [version]$_.Directory.Parent.Name } -Descending | Select-Object -First 1
    if ($installed) { $MongoPath = $installed.FullName }
    else {
      $command = Get-Command mongod -ErrorAction SilentlyContinue
      if ($command) { $MongoPath = $command.Source }
    }
  }
  if (-not $MongoPath -or -not (Test-Path -LiteralPath $MongoPath)) {
    throw "MongoDB Server was not found. Install it or pass -MongoPath."
  }
  $arguments = @(
    "--dbpath", ('"' + $dataPath + '"'),
    "--logpath", ('"' + $logPath + '"'),
    "--logappend", "--bind_ip", "127.0.0.1", "--port", "27018",
    "--replSet", "shopflow-rs", "--wiredTigerCacheSizeGB", "0.25", "--oplogSize", "128"
  )
  $mongoProcess = Start-Process -FilePath $MongoPath -ArgumentList $arguments -WindowStyle Hidden -PassThru
  Write-Output ("Started ShopFlow MongoDB (PID " + $mongoProcess.Id + ").")
} else {
  Write-Output "Port 27018 is listening; checking that it belongs to this project's replica set."
}

Push-Location $projectRoot
try {
  & node (Join-Path $PSScriptRoot "init-local-db.js")
  if ($LASTEXITCODE -ne 0) { throw "Local database initialization failed." }
} finally { Pop-Location }

