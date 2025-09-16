#/bin/bash
#docker run -p 5173:5173  -v "$(pwd)":/WebServer/cc/task-manager/task-manager     -it node:20-bullseye  bash 
# prev
docker run -p 4173:4173  -v "$(pwd)":/WebServer/cc/task-manager/task-manager     -it node:20-bullseye  pnpm prievw

