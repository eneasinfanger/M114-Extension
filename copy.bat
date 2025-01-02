@echo off
setlocal enabledelayedexpansion

set command=robocopy . dist /E

for /f "usebackq delims=" %%i in ("exclude-files.txt") do (
    if "%%~xi"=="" (
        set command=!command! /XD "%%i"
    ) else (
        set command=!command! /XF "%%i"
    )
)

rem echo !command!
!command!

if errorlevel 8 (
  echo Robocopy failed with exit code %errorlevel%
  exit /b %errorlevel%
) else (
  exit /b 0
)