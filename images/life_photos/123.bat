for /R %%F in (*.JPG) do (
  ren "%%~fF" "%%~nF.jpg"
)