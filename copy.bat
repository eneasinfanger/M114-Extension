@echo off
robocopy . dist /E /XF tsconfig.json /XF package.json /XF package-lock.json /XD node_modules /XD content-script /XD dist /XD .idea /XF .gitignore /XD .git /XF build.cjs /XF README.md /XF copy.bat

if errorlevel 8 (
  echo Robocopy failed with exit code %errorlevel%
  exit /b %errorlevel%
) else (
  exit /b 0
)