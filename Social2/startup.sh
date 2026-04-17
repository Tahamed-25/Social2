#!/bin/bash
cd /home/site/wwwroot
export npm_config_cache=/home/site/wwwroot/.npm
npm install --prefer-offline --no-audit --no-fund
node_modules/.bin/next start -p 8080
