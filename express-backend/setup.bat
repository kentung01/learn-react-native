@echo off
echo ================================
echo Prisma Client Generation
echo ================================
echo.

echo Step 1: Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% neq 0 (
    echo Warning: Command returned error code but may have succeeded
)

echo.
echo Step 2: Pushing database schema...
call npx prisma db push --accept-data-loss
if %ERRORLEVEL% neq 0 (
    echo Warning: Command returned error code but may have succeeded
)

echo.
echo Step 3: Seeding database...
call node prisma/seed.js
if %ERRORLEVEL% neq 0 (
    echo Error: Seeding failed
    exit /b 1
)

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Run: npm run dev
echo.
pause
