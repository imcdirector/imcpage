# PAGE FLOW

## 현재 구성

1. `1장 / 히어로`
   - 역할: 첫 진입 화면이자 입장 게이트
   - 진입 문구: `송곳, 판 그리고 최영렬`
   - 진입 방식: 타이틀 클릭으로 입장
   - 오디오 규칙: 접속 시 BGM 자동재생을 먼저 시도하고, 실패 시 입장 클릭에서 재생을 보장
   - 폴더: `src/scenes/01-hero`

2. `2장 / 최영렬`
   - 역할: 히어로 다음 첫 본문 장표
   - 핵심 내용: 3문장 소개, `숙명 / 자질 / 역량`, 이름과 서명
   - 폴더: `src/scenes/02-about`

3. `3장 / 기준과 가치`
   - 역할: 무엇을 믿고, 무엇으로 판단하고, 무엇을 지키는가를 설명
   - 핵심 내용: `사실 / 명예 / 책임`
   - 폴더: `src/scenes/03-values`

4. `4장 / 작동 방식`
   - 역할: 문제를 어떻게 꿰뚫고, 구조를 어떻게 짜고, 실행을 어떻게 움직이게 하는지 설명
   - 핵심 내용: `꿰뚫다 / 판을 짠다 / 작동시킨다`
   - 폴더: `src/scenes/04-method`

## 다음 일정

5. `5장 / 이력과 영역`
   - 폴더: `src/scenes/05-history-areas`

6. `6장 / 하는 일`
   - 폴더: `src/scenes/06-work`

7. `7장 / 의뢰하기`
   - 폴더: `src/scenes/07-contact`

## 공통 구조

- 공통 엔트리 HTML: `index.html`
- 공통 엔트리 CSS: `styles.css`
- 공통 엔트리 JS: `script.js`
- 앱 조립: `src/app.js`
- 공통 배경, 버튼, 폰트 변수: `src/shared/base.css`
- 공통 오디오 제어: `src/shared/audio.js`
- 공통 장면 전환: `src/shared/scene-controller.js`
- 공통 상단 목차: `src/shared/chapter-nav.css`, `src/shared/chapter-nav.js`
- 히어로 이후 장표는 공통 바다 영상 + 검은 오버레이 레이어 위에서 내용만 교체한다.
