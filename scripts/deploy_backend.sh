#!/bin/bash
cd ../task_api &&  env/bin/uwsgi --ini uwsgi.ini &&  env/bin/uwsgi --reload uwsgi.pid   && nginx -s reload
