# CH05 Workset

5장 `여정과 궤적`만 수정할 때 읽을 최소 기준 문서.

## Working branch

- `codex/ch05-followup-lab`

## Read only these files first

- `C:\■ 개인\■ 최영렬 페이지\index.html`
- `C:\■ 개인\■ 최영렬 페이지\styles.css`
- `C:\■ 개인\■ 최영렬 페이지\src\scenes\05-history-areas\history-areas.css`
- `C:\■ 개인\■ 최영렬 페이지\src\shared\base.css`

## Read only if interaction is involved

- `C:\■ 개인\■ 최영렬 페이지\src\app.js`
- `C:\■ 개인\■ 최영렬 페이지\src\shared\scene-controller.js`
- `C:\■ 개인\■ 최영렬 페이지\src\shared\chapter-nav.js`

## Avoid touching unless absolutely necessary

- `src/scenes/01-hero/*`
- `src/scenes/02-about/*`
- `src/scenes/03-values/*`
- `src/scenes/04-method/*`
- `src/shared/audio.js`

## Current site rules to preserve

- 현재 사이트는 정적 `HTML + CSS + vanilla JS` 구조다.
- 상단 목차는 고정 헤더다.
- 히어로 이후는 공통 바다 배경 + 검은 오버레이 + BGM 구조를 유지한다.
- 5장은 전체 홈페이지 안에서 자연스럽게 보여야 하며 별도 페이지처럼 보이면 안 된다.
- 4장과 다른 장은 건드리지 않고, 5장 범위 안에서만 수정한다.

## Current chapter 5 baseline

- 목차명: `여정과 궤적`
- 리드 문구 기준: `걸어온 여정, 삶의 궤적`
- 하단 고정 문구 기준:
  - `직함보다 오래 남는 것은, 어떤 자리에서든 문제를 끝까지 책임지는 방식입니다.`

## Token-saving workflow

1. 먼저 `index.html`에서 `scene-history-areas` 블록만 읽는다.
2. 다음으로 `src/scenes/05-history-areas/history-areas.css`만 읽는다.
3. 공통 간격이나 폰트 확인이 필요할 때만 `src/shared/base.css`를 읽는다.
4. `styles.css`는 import 확인이 필요할 때만 읽는다.
5. 다른 장 파일은 읽지 않는다.
6. 인터랙션이 필요할 때만 JS 파일을 추가로 읽는다.
7. 수정 후에는 로컬 프리뷰에서 웹/모바일만 먼저 확인한다.

## Verification

- local web: `http://127.0.0.1:8130/`
- local mobile: `http://127.0.0.1:8130/mobile/`
- public web: `https://imcdirector.github.io/imcpage/`
- public mobile: `https://imcdirector.github.io/imcpage/mobile/`

## Recommended next prompt

`작업 루트는 C:\■ 개인\■ 최영렬 페이지 이다. docs/CH05-WORKSET.md를 먼저 읽고, 5장 여정과 궤적만 수정하라. 다른 장과 공통 구조는 건드리지 말고, 필요한 경우에만 관련 파일을 추가로 읽어라.`
