$sessions = @{
    '$axiom' = '01a196d7-e9b6-7c73-96b2-c0671ba8b1a0'
    '$prism' = '01a17ddd-4f5f-7761-918b-c374762f6fbc'
    '$lumina' = '01a196f7-1ddc-7bd0-8b97-b1b0f4a8d3d7'
}

if (-not (Get-Command codex -ErrorAction SilentlyContinue)) {
    Write-Host 'Codex CLI was not found in PATH.'
    exit 1
}

Write-Host 'Oracle terminal: $axiom  $prism  $lumina'
Write-Host 'Type exit to leave. Exit Codex to return to this menu.'
while ($true) {
    $choice = Read-Host 'Oracle'
    if ($null -eq $choice) { break }
    if ($choice -eq 'exit') { break }
    $session = $sessions[$choice.Trim()]
    if (-not $session) {
        Write-Host 'Choose $axiom, $prism, $lumina, or exit.'
        continue
    }
    & codex resume $session
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Could not resume the session (exit code $LASTEXITCODE)."
    }
}
