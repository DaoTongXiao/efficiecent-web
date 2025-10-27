# 项目目录结构

```
.
├── .gitignore
├── .npmrc
├── .prettierrc.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── README.md
├── rule.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .vscode/
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── vite-env.d.ts
    ├── api/
    │   ├── request.ts
    │   ├── types.ts
    │   ├── auth/
    │   │   └── user.ts
    │   ├── common/
    │   │   └── tools.ts
    │   ├── conversion/
    │   │   ├── conversion.ts
    │   │   └── message.ts
    │   └── knowledges/
    │       └── index.ts
    ├── assets/
    │   ├── ai.png
    │   └── logo.ico
    ├── components/
    │   ├── ZhAvatar/
    │   │   └── Avatar.tsx
    │   ├── ZhChatPrompt/
    │   │   ├── ChatPrompt.tsx
    │   │   └── styles.scss
    │   ├── ZhMessage/
    │   │   ├── BatchResult.tsx
    │   │   ├── MarkdownMessage.tsx
    │   │   ├── Message.tsx
    │   │   └── utils.ts
    │   ├── ZhPrompts/
    │   │   └── ZhPrompts.tsx
    │   └── ZhWelcome/
    │       ├── Welcome.scss
    │       └── Welcome.tsx
    ├── config/
    │   └── constant.ts
    ├── hooks/
    │   ├── useChatSubmission.ts
    │   ├── useMessageActions.ts
    │   └── useUserInfoAction.ts
    ├── layout/
    │   ├── config.tsx
    │   ├── Layout.tsx
    │   ├── style.ts
    │   └── components/
    │       ├── ChatList.tsx
    │       ├── ChatSider.tsx
    │       └── sender/
    │           ├── Sender.tsx
    │           ├── SenderHeader.tsx
    │           └── useAction.ts
    ├── locales/
    │   └── locales.ts
    ├── store/
    │   ├── conversationStore.ts
    │   ├── index.ts
    │   ├── knowledgeStore.ts
    │   └── userStore.ts
    ├── style/
    │   └── app.scss
    ├── types/
    │   └── typing.ts
    └── utils/
        ├── auth.ts
        └── util.ts
## 目录描述

- **src/**: 源代码目录
  - **api/**: API接口相关代码
    - **auth/**: 认证相关API
    - **common/**: 通用API工具
    - **conversion/**: 转换相关API
    - **knowledges/**: 知识库相关API
  - **assets/**: 静态资源文件（图片、图标等）
  - **components/**: React组件
    - **ZhAvatar/**: 头像组件
    - **ZhChatPrompt/**: 聊天提示组件
    - **ZhMessage/**: 消息组件
    - **ZhPrompts/**: 提示组件
    - **ZhWelcome/**: 欢迎页面组件
  - **config/**: 配置文件
  - **hooks/**: 自定义React Hooks
  - **layout/**: 布局相关组件
    - **components/**: 布局子组件
      - **sender/**: 发送器相关组件
  - **locales/**: 国际化语言包
  - **store/**: 状态管理（使用Zustand等）
  - **style/**: 全局样式文件
  - **types/**: TypeScript类型定义
  - **utils/**: 工具函数

- **根目录配置文件**:
  - **.gitignore**: Git忽略文件配置
  - **.npmrc**: npm配置
  - **.prettierrc.json**: Prettier代码格式化配置
  - **eslint.config.js**: ESLint代码检查配置
  - **tsconfig*.json**: TypeScript配置
  - **vite.config.ts**: Vite构建工具配置
  - **package.json**: 项目依赖和脚本配置
  - **index.html**: 应用入口HTML文件
