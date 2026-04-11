# CH04 Workset

4장 `해결 방식`만 수정할 때 읽을 최소 기준 문서.

## Working branch

- `codex/ch04-method-lab`

## Read only these files first

- `C:\■ 개인\■ 최영렬 페이지\index.html`
- `C:\■ 개인\■ 최영렬 페이지\styles.css`
- `C:\■ 개인\■ 최영렬 페이지\src\scenes\04-method\method.css`
- `C:\■ 개인\■ 최영렬 페이지\src\shared\base.css`

## Avoid touching unless absolutely necessary

- `src/scenes/01-hero/*`
- `src/scenes/02-about/*`
- `src/scenes/03-values/*`
- `src/scenes/05-history-areas/*`
- `src/shared/chapter-nav.*`
- `src/shared/scene-controller.js`

## Current site rules to preserve

- 현재 사이트는 정적 `HTML + CSS + vanilla JS` 구조다.
- 4장 수정만 할 때는 새 프레임워크를 도입하지 않는다.
- 상단 목차 구조와 장면 전환 방식은 유지한다.
- 히어로 이후의 공통 바다 배경, 검은 오버레이, BGM 구조는 유지한다.
- 4장은 전체 홈페이지 톤 안에서 보여야 하며 별도 마이크로사이트처럼 보이면 안 된다.

## Current 4th chapter copy baseline

- Hover copy: `전략은 문제 해결을 위해 존재합니다.`
- Click title:
  - `전략은 문제 해결을 위해 존재합니다.`
  - `세상의 모든 문제를 해결합니다.`

## Token-saving workflow

1. 먼저 `index.html`의 `scene-method` 블록만 읽는다.
2. 다음으로 `src/scenes/04-method/method.css`만 읽는다.
3. 공통 폰트/간격 확인이 필요할 때만 `src/shared/base.css`를 읽는다.
4. `styles.css`는 import 버전 확인이 필요할 때만 읽는다.
5. 다른 장 파일은 읽지 않는다.
6. 수정 후에는 로컬 프리뷰만 먼저 확인한다.

## Verification

- local web: `http://127.0.0.1:8130/`
- local mobile: `http://127.0.0.1:8130/mobile/`
- public web: `https://imcdirector.github.io/imcpage/`
- public mobile: `https://imcdirector.github.io/imcpage/mobile/`

## Recommended next-thread starter

`작업 루트는 C:\■ 개인\■ 최영렬 페이지 이다. docs/CH04-WORKSET.md를 먼저 읽고, 4장 해결 방식만 수정하라. 다른 장과 공통 구조는 건드리지 말고, 필요한 경우에만 관련 파일을 추가로 읽어라.`
