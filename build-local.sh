#!/bin/bash

# 本地构建前端项目，生成 dist 目录
# 使用方式：
#   1) 先在项目根目录执行：chmod +x build-local.sh
#   2) 之后每次打包：./build-local.sh

set -e

# 切到脚本所在目录（项目根目录）
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

echo "📁 当前目录: $PROJECT_ROOT"

# 如有需要，可以先安装依赖（取消下一行注释）
# echo "🔧 正在安装依赖: npm install ..."
# npm install

echo "📦 开始执行打包: npm run build ..."

npm run build

echo "✅ 打包完成，输出目录: $PROJECT_ROOT/dist"
