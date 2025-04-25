#!/bin/bash
#[ -n "$(pip list  |grep Django)" ] || pip install django
#[ -n "$(pip list  |grep djangorestframework)" ] || pip install djangorestframework
#[ -n "$(pip list  |grep jango-filter )" ] || pip install django_filter
cd ../task_api && python3 manage.py runserver  128.255.125.12:8002
