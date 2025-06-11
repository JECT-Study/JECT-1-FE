# Ject 3기 1팀

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm run android // android app
   npm run ios // ios app
   npm run web
   ```

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

## Project Structure

```
📂 JECT-1-FE/  # 프로젝트 루트 디렉토리
├── 📂 app/
│   ├── 📂 (tabs)/         # 애플리케이션 페이지
│   ├── 📜 +not-found.tsx
│   └── 📜 _layout.tsx     # RootLayout
│
├── 📂 assets/
│   ├── 📂 fonts/          # 폰트
│   └── 📂 images/         # FE에서 관리하는 이미지
├── 📂 .rnstorybook/         # 스토리북 관련
├── 📂 components/         # 컴포넌트
├── 📂 constants/          # 상수
├── 📂 hooks/              # 커스텀 훅
├── 📂 scripts/            # 스크립트
├── 📂 stores/             # 상태관리
│
├── 📜 .gitignore          # 🙅‍♂️ Git에서 제외할 파일 설정
├── 📜 package.json        # 📦 프로젝트 설정 및 의존성 관리
├── 📜 tsconfig.json       # 🔧 TypeScript 설정
└── 📜 yarn.lock           # 📌 패키지 버전 고정 파일
```