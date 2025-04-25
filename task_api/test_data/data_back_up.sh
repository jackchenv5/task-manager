#!/bin/bash

date_str=`date +"%Y-%m-%d" `

[ -d /WebServer/cc/task-admin/scripts/backup ] || mkdir -p /WebServer/cc/task-admin/scripts/backup
mysqldump -h 128.255.124.227 -uroot -p"123.com" task > /WebServer/cc/task-admin/scripts/backup/task_"$date_str".sql

find  /WebServer/cc/task-admin/scripts/backup  -mtime +7  -type f -name "*.sql" |xargs -i rm -rf {}
