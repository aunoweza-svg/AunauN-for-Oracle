#Requires -RunAsAdministrator

$ErrorActionPreference = 'Stop'
$logPath = Join-Path $env:TEMP 'AunauN-maw-wsl-setup.log'

Start-Transcript -LiteralPath $logPath -Force
try {
    Write-Host 'Enabling Windows Subsystem for Linux...'
    & dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
    if ($LASTEXITCODE -notin @(0, 3010)) {
        throw "DISM failed for Microsoft-Windows-Subsystem-Linux: $LASTEXITCODE"
    }

    Write-Host 'Enabling Virtual Machine Platform...'
    & dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
    if ($LASTEXITCODE -notin @(0, 3010)) {
        throw "DISM failed for VirtualMachinePlatform: $LASTEXITCODE"
    }

    Write-Host 'Attempting WSL update and Ubuntu installation...'
    & wsl.exe --update --web-download
    $updateExit = $LASTEXITCODE

    & wsl.exe --set-default-version 2
    $defaultExit = $LASTEXITCODE

    & wsl.exe --install -d Ubuntu --no-launch --web-download
    $installExit = $LASTEXITCODE

    Write-Host "WSL update exit: $updateExit"
    Write-Host "Set-default exit: $defaultExit"
    Write-Host "Ubuntu install exit: $installExit"
    Write-Host 'The script deliberately does not restart Windows.'
}
finally {
    Stop-Transcript
}
