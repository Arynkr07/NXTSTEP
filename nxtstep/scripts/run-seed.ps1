# Run the Kaggle embedding seed script
# Usage: .\scripts\run-seed.ps1
# Usage: .\scripts\run-seed.ps1 -Limit 5000 -Reset

param(
    [int]$Limit = 2000,
    [switch]$Reset
)

Write-Host "NxtStep - Kaggle Seed Script" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Check for .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "ERROR: .env.local not found. Create it with your API keys." -ForegroundColor Red
    exit 1
}

# Check required keys
$envContent = Get-Content ".env.local" -Raw
$required = @("KAGGLE_USERNAME", "KAGGLE_KEY", "GEMINI_API_KEY", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY")

foreach ($key in $required) {
    if ($envContent -notmatch "$key=.+") {
        Write-Host "WARNING: $key may not be set in .env.local" -ForegroundColor Yellow
    }
}

$args_list = @("--limit", $Limit.ToString())
if ($Reset) { $args_list += "--reset" }

Write-Host "`nRunning with limit=$Limit, reset=$Reset" -ForegroundColor Green
npx tsx scripts/embed-kaggle-data.ts @args_list
