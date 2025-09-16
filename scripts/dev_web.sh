#/bin/bash

#build web dist
docker run  -p 5173:5173 -v /WebServer/cc/task-manager/task-manager:/WebServer/cc/task-manager/task-manager  -w /WebServer/cc/task-manager/task-manager -it node:20-bullseye  pnpm dev --host

