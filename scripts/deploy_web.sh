#/bin/bash

#build web dist
docker run -v /WebServer/cc/task-manager/task-manager:/WebServer/cc/task-manager/task-manager  -w /WebServer/cc/task-manager/task-manager -it node:20-bullseye  pnpm build

#deploy web in production envirment
rm -rf /var/www/html/test/dist &&   cp /WebServer/cc/task-manager/task-manager/dist /var/www/html/test/dist -rf
