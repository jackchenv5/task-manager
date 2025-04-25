#/bin/bash

#enter web workspace
cd ../web 

#build web dist
docker run -v "$(pwd)":/WebServer/cc/task-admin/web  -w /WebServer/cc/task-admin/web -it node:20-bullseye  pnpm build

#deploy web in production envirment
rm -rf /var/www/html/task/dist && cp dist /var/www/html/task/ -rf 
