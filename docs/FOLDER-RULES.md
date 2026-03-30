# FOLDER RULES

## 장면 폴더 규칙

| 구분 | 폴더 | 역할 | 파일 규칙 | 상태 |
|---|---|---|---|---|
| 1장 | `src/scenes/01-hero` | 히어로 진입 화면 | `hero.css`, `hero.js`, `README.md` | 완료 |
| 2장 | `src/scenes/02-about` | 최영렬 소개 | `about.css`, `README.md` | 완료 |
| 3장 | `src/scenes/03-values` | 기준과 가치 | `values.css`, `README.md` | 완료 |
| 4장 | `src/scenes/04-method` | 해결 방식 | `method.css`, `README.md` | 완료 |
| 5장 | `src/scenes/05-history-areas` | 이력과 영역 | `history-areas.css`, `history-areas.js`, `README.md` | 완료 |
| 6장 | `src/scenes/06-work` | 하는 일 | `work.css`, `work.js`, `README.md` | 예정 |
| 7장 | `src/scenes/07-contact` | 의뢰하기 | `contact.css`, `contact.js`, `README.md` | 예정 |

## 공통 규칙

1. 장 번호와 폴더 번호를 맞춘다.
2. 히어로 이후 장표는 공통 배경 레이어 위에서 내용만 바뀌는 구조로 유지한다.
3. 모든 공통 기능은 `src/shared`에 둔다.
4. 장면 고유 스타일과 로직은 해당 장면 폴더 안에 둔다.
5. 상단 목차는 공통 고정 헤더로 유지하고, 장면 안으로 넣지 않는다.
6. 번호가 바뀌면 문서, import, 폴더 번호를 함께 맞춘다.
