Set oShell = WScript.CreateObject ("WScript.Shell")

oShell.CurrentDirectory = "C:\vsts\elbottine01\api"
oShell.run "cmd.exe /C code ."
oShell.run "cmd.exe /C npm run build"

oShell.CurrentDirectory = "C:\vsts\elbottine01"
oShell.run "cmd.exe /C code ."
oShell.run "cmd.exe /C npm run build"

'MsgBox "Hello, World!", 1+16, "MsgBox Example"

WScript.Sleep 15000

oShell.CurrentDirectory = "C:\vsts\elbottine01\api"
oShell.run "cmd.exe /K func start"

oShell.CurrentDirectory = "C:\vsts\elbottine01"
oShell.run "cmd.exe /K npm run start2"

WScript.Quit 0

'REM pause
'REM start "api" swa start http://localhost:4200 --api-location api
'   swa start http://localhost:4200 --run "npm run start2"  --api-location ./api
'   swa start http://localhost:4200 --run "npm start"       --api-location ./api