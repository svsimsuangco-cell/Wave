@echo off
echo.
echo ============================================================
echo   MongoDB Setup for Hosting Platform
echo ============================================================
echo.
echo This script will help you start MongoDB locally.
echo.
echo Option 1: Download and Install MongoDB
echo   - Go to: https://www.mongodb.com/try/download/community
echo   - Download the MSI installer
echo   - Run it and click through the steps
echo   - MongoDB will auto-start as a Windows Service
echo.
echo Option 2: Use Portable MongoDB (No installation)
echo   - Download the ZIP version instead
echo   - Extract it (e.g., C:\mongodb)
echo   - Run this command in PowerShell:
echo   - C:\mongodb\bin\mongod.exe
echo.
echo Once MongoDB is running on localhost:27017
echo your app will automatically connect!
echo.
echo ============================================================
echo.
pause
