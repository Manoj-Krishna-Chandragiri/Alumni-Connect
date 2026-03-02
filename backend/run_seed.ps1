# Stop any running Django server
Get-Process -Name python -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*manage.py*runserver*' } | Stop-Process -Force

# Wait a moment
Start-Sleep -Seconds 2

# Run seed command
Write-Host "Running seed command..." -ForegroundColor Green
python manage.py seed_data --clear

# Check users after seeding
Write-Host "`nVerifying users created:" -ForegroundColor Green
python check_users.py

Write-Host "`nDone! Press any key to restart server..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Restart server
python manage.py runserver
