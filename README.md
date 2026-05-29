# Antigravity GUI Korean Patch (비공식 한글 패치)

Antigravity GUI 애플리케이션을 한국어로 사용할 수 있게 해주는 비공식 크로스 플랫폼 한글 패치입니다.

## 기능
- 300개 이상의 설정, 사이드바, 명령어 팔레트, 권한 설명 텍스트 한국어 번역
- 앱이 업데이트되어 영어로 초기화되었을 때 손쉽게 재적용 가능
- Windows, macOS, Linux 지원

## 요구 사항
- **Node.js** (가능한 최신 버전)가 설치되어 있어야 합니다. [다운로드](https://nodejs.org)

## 설치 및 사용법

1. 이 저장소를 다운로드하거나 클론합니다.
   ```bash
   git clone https://github.com/azestkingscrown/antigravity-korean-patch.git
   cd antigravity-korean-patch
   ```

2. 의존성 패키지를 설치합니다.
   ```bash
   npm install
   ```

3. 패치를 실행합니다.
   ```bash
   npm run patch
   ```
   *참고: 리눅스(Linux) 환경이거나 앱이 기본 경로에 설치되어 있지 않은 경우, 다음과 같이 `app.asar`의 절대 경로를 직접 입력해야 합니다.*
   ```bash
   npm run patch /path/to/your/Antigravity/resources/app.asar
   ```

4. Antigravity 앱을 완전히 종료(Quit)하고 재시작하시면 한글 텍스트가 적용됩니다.

## ⚠️ 주의 사항 / 면책 조항 (Disclaimer)
이 패치는 공식 지원이 아닌 커뮤니티 비공식 패치입니다.
앱 내부의 리소스 파일(`app.asar`)을 임의로 수정하므로 앱 구동에 영향을 미칠 수 있습니다. 
만약 문제가 발생할 경우, 앱을 재설치하거나 설치 폴더 안의 `app.asar.bak` 백업 파일을 원래 이름으로 돌려놓으시기 바랍니다. 본 패치 사용으로 인한 어떠한 책임도 지지 않습니다.
본 패치는 100% 완벽한 게 아닙니다.

