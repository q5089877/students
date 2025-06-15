@echo off
setlocal enabledelayedexpansion

:: 初始化編號從 1 開始
set /a counter=0

:: 遍歷資料夾內所有 JPG 檔案（可調整副檔名條件）
for %%f in (*.JPG) do (
    set "num=000!counter!"
    set "newname=photo_!num:~-3!.JPG"
    ren "%%f" "!newname!"
    set /a counter+=1
)

pause