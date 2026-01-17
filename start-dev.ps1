# Start Frontend Development Server (Windows PowerShell)
# Forces port 5173, killing any process using it

$PORT = 5173

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Starting Frontend Server" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if port is in use and kill the process
$portCheck = Get-NetTCPConnection -LocalPort $PORT -ErrorAction SilentlyContinue
if ($portCheck) {
    Write-Host "Port $PORT is in use. Killing process..." -ForegroundColor Yellow
    $pids = $portCheck | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($procId in $pids) {
        $process = Get-Process -Id $procId -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "  Killing process: $($process.ProcessName) (PID: $procId)" -ForegroundColor Yellow
            Stop-Process -Id $procId -Force
        }
    }
    Start-Sleep -Seconds 1
}

Write-Host "Starting Vite dev server on port $PORT..." -ForegroundColor Green
Write-Host ""

# Start the dev server
npm run dev -- --port $PORT --strictPort
