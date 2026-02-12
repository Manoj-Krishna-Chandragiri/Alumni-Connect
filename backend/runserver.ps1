#!/bin/bash
cd "$(dirname "$0")"
.\venv\Scripts\python.exe manage.py runserver 8100
