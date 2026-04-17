#!/bin/bash
cd /home/site/wwwroot
echo "=== Contents of wwwroot ==="
ls -la
echo "=== Does node_modules exist? ==="
ls node_modules | head -20
