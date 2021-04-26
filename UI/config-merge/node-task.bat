@ECHO OFF
ECHO TSC started.
CALL "node_modules/.bin/tsc.cmd" "configs/clients/index.ts"
ECHO TSC done.
ECHO Merging configs started.
CALL node "configs/clients/index.js"
ECHO Merging configs done.