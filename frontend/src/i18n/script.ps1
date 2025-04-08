# Output file
$outFile = "project_dump.txt"

# Step 1: Write folder architecture
"===== FOLDER STRUCTURE =====`r`n" | Set-Content $outFile
tree /F /A | Out-String | Add-Content $outFile
"`r`n===== FILE CONTENTS =====`r`n" | Add-Content $outFile

# Step 2: Append file contents
Get-ChildItem -Recurse -File | ForEach-Object {
    "===== $($_.FullName) =====" + "`r`n" + (Get-Content $_.FullName -Raw) + "`r`n"
} | Add-Content $outFile
