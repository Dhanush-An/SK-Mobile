$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notmatch "C:\\Android\\SDK\\platform-tools") {
    $newPath = $userPath + ";C:\Android\SDK\platform-tools"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
}
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Android\SDK", "User")
