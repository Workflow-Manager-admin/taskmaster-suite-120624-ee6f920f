#!/bin/bash
cd /home/kavia/workspace/code-generation/taskmaster-suite-120624-ee6f920f/task_frontend_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

