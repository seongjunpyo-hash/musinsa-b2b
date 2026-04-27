#!/bin/bash
cd "$(dirname "$0")"

echo "🚀 MUSINSA B2B 배포 시작..."
echo ""

# Lock 파일 정리 (혹시 남아있으면)
rm -f .git/HEAD.lock .git/index.lock .git/refs/heads/main.lock 2>/dev/null

# 변경사항 staging
git add -A

# 변경사항 없으면 푸시만 시도
if git diff --cached --quiet; then
    echo "📭 변경사항 없음. 미푸시 커밋 확인 후 push..."
    git push origin main
else
    echo "📝 변경사항 커밋..."
    git commit -m "update: $(date '+%Y-%m-%d %H:%M') 배포"
    echo ""
    echo "📤 GitHub로 푸시 중..."
    git push origin main
fi

PUSH_EXIT=$?

echo ""
if [ $PUSH_EXIT -eq 0 ]; then
    echo "✅ 배포 완료! 1~2분 후 반영됩니다."
    echo "🔗 https://seongjunpyo-hash.github.io/musinsa-b2b/"
else
    echo "❌ 푸시 실패. 위 에러 메시지를 확인해주세요."
    echo "   - GitHub Push Protection (secret 감지) → 에러의 unblock URL 클릭 후 재실행"
    echo "   - Lock 파일 또 생기면 → 이 파일 다시 더블클릭"
fi
echo ""
read -p "아무 키나 누르면 종료됩니다..."
