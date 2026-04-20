#!/bin/bash
cd "$(dirname "$0")"

echo "🚀 MUSINSA B2B 배포 시작..."
echo ""

git add -A
git commit -m "update: $(date '+%Y-%m-%d %H:%M') 배포"
git push

echo ""
echo "✅ 배포 완료! 1~2분 후 반영됩니다."
echo "🔗 https://seongjunpyo-hash.github.io/musinsa-b2b/"
echo ""
read -p "아무 키나 누르면 종료됩니다..."
