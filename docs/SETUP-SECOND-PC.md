# 서재 PC 세팅 가이드

이 프로젝트는 `웹 버전보다 로컬 Codex 앱`이 훨씬 적합하다.

이유:
- 이 저장소는 로컬 파일 읽기/수정이 많다.
- Git 브랜치 전환, 커밋, 푸시가 자주 필요하다.
- 프리뷰 서버를 직접 띄워서 확인해야 한다.
- 이미지/PDF/PPT 참고자료를 로컬에서 바로 봐야 한다.

즉, 서재 PC에서는 `Codex 데스크톱 앱 + 로컬 저장소 clone` 조합으로 가는 것이 맞다.

## 1. 결론

추천:
- 서재 PC: `Codex 데스크톱 앱 설치`
- 작업 방식: `로컬 저장소 clone 후 작업`
- 웹 버전 사용처: `간단한 확인 / 대화 / 아이디어 정리` 정도

비추천:
- 이 프로젝트를 웹 버전만으로 계속 작업하는 것

## 2. 로컬 앱 vs 웹 버전

### 로컬 Codex 앱

장점:
- 로컬 폴더를 바로 열 수 있다.
- Git 상태, 브랜치, 커밋, 푸시 작업이 자연스럽다.
- 프리뷰 서버를 직접 실행할 수 있다.
- 이미지/PDF/참고파일을 같은 PC에서 바로 참조할 수 있다.
- 지금 노트북에서 하던 방식과 가장 유사하게 이어갈 수 있다.

단점:
- 설치가 필요하다.
- Python, Git 같은 로컬 도구 세팅이 같이 필요하다.

### 웹 버전

장점:
- 설치 없이 바로 쓸 수 있다.
- 간단한 상담, 기획, 문장 다듬기에는 편하다.

단점:
- 로컬 저장소 작업에 불리하다.
- 파일 접근, 실행, 프리뷰 확인 흐름이 약하다.
- 지금 프로젝트처럼 “보고 바로 수정하고 바로 확인”하는 반복 작업에는 비효율적이다.

## 3. 서재 PC에서 해야 할 설치

필수:
1. Git 설치
2. Python 설치
3. Codex 데스크톱 앱 설치
4. 같은 계정으로 로그인

권장:
1. Chrome 또는 Edge 설치
2. GitHub 로그인 상태 확인
3. OneDrive 또는 클라우드 동기화 폴더 준비

## 4. 저장소 받기

PowerShell:

```powershell
cd C:\
git clone https://github.com/imcdirector/imcpage.git "■ 개인\■ 최영렬 페이지"
cd "C:\■ 개인\■ 최영렬 페이지"
git switch main
git pull origin main
```

## 5. 프리뷰 확인

PowerShell:

```powershell
python tools/preview/server.py --port 8130 --root .
```

브라우저:
- 웹: `http://127.0.0.1:8130/index.html`
- 모바일: `http://127.0.0.1:8130/mobile/`

## 6. 작업 시작 규칙

서재 PC에서 시작할 때:

```powershell
cd "C:\■ 개인\■ 최영렬 페이지"
git fetch origin
git switch main
git pull origin main
```

브랜치 작업이 필요하면:

```powershell
git switch -c codex/ch05-followup-lab
```

이미 원격에 있는 브랜치면:

```powershell
git fetch origin
git switch 브랜치이름
git pull origin 브랜치이름
```

## 7. 노트북과 서재 PC를 같이 쓸 때 규칙

한쪽에서 끝낼 때:

```powershell
git status
git add .
git commit -m "작업 내용"
git push origin 브랜치이름
```

다른 PC에서 이어받을 때:

```powershell
git fetch origin
git switch 브랜치이름
git pull origin 브랜치이름
```

중요:
- 두 PC에서 같은 브랜치를 동시에 수정한 뒤 나중에 합치면 충돌 확률이 높다.
- 한 PC 작업을 끝내고 `push`한 뒤, 다른 PC에서 `pull`해서 이어가는 방식이 가장 안전하다.

## 8. 스레드/대화 기억 문제

Codex 대화는 PC를 바꾸면 흐름이 끊길 수 있다.
그래서 아래 문서를 기준으로 작업을 이어가는 것이 좋다.

읽을 문서:
- `docs/FOLDER-RULES.md`
- `docs/PAGE-FLOW.md`
- `docs/ROADMAP.md`
- 장별 작업 문서 (`docs/CH04-WORKSET.md`, `docs/CH05-WORKSET.md`)

즉:
- 기억은 스레드보다 문서에 남긴다.
- 실제 기준선은 GitHub와 docs 폴더다.

## 9. 로컬 참고자료 처리

현재 이 노트북에만 남아 있을 수 있는 것:
- `4장/`
- `5장/`
- `docs/review/*.png`

이 파일들은 Git에 안 올라가 있으면 서재 PC에 자동으로 안 간다.

선택지:
1. 꼭 필요한 파일만 Git에 올린다.
2. PPT, 이미지, 시안은 OneDrive 같은 폴더로 따로 동기화한다.

추천:
- 코드/문서 = Git
- 대용량 참고자료/PPT/이미지 = OneDrive

## 10. 가장 추천하는 실제 순서

1. 서재 PC에 Codex 데스크톱 앱 설치
2. Git / Python 설치
3. 저장소 clone
4. `main` pull
5. 프리뷰 서버 실행
6. 같은 계정으로 Codex 열기
7. 작업 시작할 때 관련 `docs/*.md` 먼저 읽기

## 11. 한 줄 결론

이 프로젝트는 `웹 버전`보다 `서재 PC에 Codex 로컬 앱 설치 + GitHub clone`이 정답이다.
