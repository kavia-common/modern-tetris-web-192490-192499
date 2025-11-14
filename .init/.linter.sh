#!/bin/bash
cd /home/kavia/workspace/code-generation/modern-tetris-web-192490-192499/tetris_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

