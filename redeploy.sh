#!/bin/sh

# shell script to pull latest sources, build, and deploy

# ANSI escape sequence for bold cyan
HIGHLIGHT="\e[1;38;2;0;255;255m"

# ANSI escape sequence to return to normal
NORMAL="\e[0m"

printf "${HIGHLIGHT}Stopping automation-backend.service...${NORMAL}\n"
sudo systemctl stop automation-backend.service
sudo systemctl status automation-backend.service

printf "\n${HIGHLIGHT}Pulling latest sources...${NORMAL}\n"
git pull

printf "\n${HIGHLIGHT}Refreshing backend dependencies...${NORMAL}\n"
cd automation-backend
npm i

printf "\n${HIGHLIGHT}Refreshing frontend dependencies...${NORMAL}\n"
cd ../automation-frontend
npm i; npm run cleanl; npm run build

printf "\n${HIGHLIGHT}Starting automation-backend.service...${NORMAL}\n"
cd ..
sudo systemctl start automation-backend.service
sudo systemctl status automation-backend.service

printf "\n${HIGHLIGHT}Done.${NORMAL}\n"
