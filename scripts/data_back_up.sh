#!/bin/bash

date_str=`date +"%Y-%m-%d" `

[ -d /WebServer/cc/task-manager/scripts/backup ] || mkdir -p /WebServer/cc/task-manager/scripts/backup
mysqldump -h 128.255.124.231 -uroot -p"root123.com" task_manager > /WebServer/cc/task-manager/scripts/backup/task_"$date_str".sql

find  /WebServer/cc/task-manager/scripts/backup/  -mtime +7  -type f -name "*.sql" |xargs -i rm -rf {}
