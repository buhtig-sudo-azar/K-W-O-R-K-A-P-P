…or create a new repository on the command line

git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/buhtig-sudo-azar/K-W-O-R-K-A-P-P.git
git push -u origin main

…or push an existing repository from the command line
git remote add origin https://github.com/buhtig-sudo-azar/K-W-O-R-K-A-P-P.git
git branch -M main
git push -u origin main



K-W-O-R-K-A-P-P/                       ← Корень Codespace
├── portfolio-demo/                    ← Ваш Next.js проект
│   ├── app/                           ← App Router
│   │   ├── api/
│   │   │   └── demo/
│   │   │       └── route.ts           → /api/demo
│   │   ├── demo/                      ← Демо-страницы
│   │   │   ├── fullstack/
│   │   │   │   └── page.tsx           → /demo/fullstack
│   │   │   ├── osint-parser/
│   │   │   │   └── page.tsx           → /demo/osint-parser
│   │   │   └── telegram-bot/
│   │   │       └── page.tsx           → /demo/telegram-bot
│   │   ├── globals.css                ← Tailwind CSS стили
│   │   ├── layout.tsx                 ← Корневой layout
│   │   └── page.tsx                   ← Главная страница (/)
│   ├── node_modules/                  ← Зависимости npm
│   ├── next-env.d.ts                  ← Next.js типы
│   ├── package.json                   ← Зависимости и скрипты
│   ├── package-lock.json              ← Версии пакетов
│   ├── postcss.config.js              ← PostCSS конфиг
│   ├── tailwind.config.js             ← Tailwind конфиг
│   └── tsconfig.json                  ← TypeScript конфиг
├── gitpush.sh                        ← Скрипт для Git (в родительской папке)
└── README.md                          ← Документация (в родительской папке)