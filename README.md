# DataScreen 数据大屏

基于 Vue 3 + TypeScript + ECharts 构建的数据可视化大屏（Big Screen Dashboard）项目。采用深色科技风设计，支持模拟实时数据变化，适合学习数据大屏的前端工程结构和 ECharts 图表封装。

## 项目预览

![DataScreen 数据大屏](docs/screenshots/dashboard-1920x1080.png)



## 项目简介

DataScreen 是一个纯前端的数据大屏教学项目，页面以 1920x1080 比例呈现完整的数据监控仪表盘。默认使用 Mock 数据驱动，同时内置了模拟实时数据变化的能力——打开页面后，各项指标、趋势图、动态列表会自动刷新，模拟真实业务系统的运行状态。

适合以下学习者：
- 想了解 Vue 3 项目工程结构的前端初学者
- 学习 ECharts 多图表组合与封装的开发者
- 需要数据大屏参考案例的课程项目
- 想了解 Pinia 状态管理、服务层分层的同学

## 核心特性

- **1920x1080 大屏布局** — CSS Grid 3 列 4 行自适应布局，小屏自动降级为单列堆叠
- **5 种 ECharts 图表** — 折线趋势图、横向柱状排名图、环形饼图、雷达图、关系拓扑图
- **模拟实时数据刷新** — 指标卡递增、趋势图滑动窗口、动态消息滚动、节点状态波动，每 2 秒自动更新
- **Mock / API 双模式** — 环境变量一键切换，从本地 Mock 平滑过渡到真实后端
- **深色科技风 UI** — 暗蓝背景 + 青蓝/玉青/鎏金配色，面板扫光动画，发光边框
- **模块化架构** — 组件、Store、Services、Mocks、Types 各层职责清晰
- **TypeScript 全覆盖** — 所有接口精确定义，全链路类型安全
- **完整测试体系** — Vitest 单元测试 + Playwright E2E 测试
- **自动化截图** — 通过 npm script 一键生成项目展示截图
- **代码规范** — ESLint + Prettier + Stylelint 统一代码风格

## 技术栈

| 分类 | 技术 | 说明 |
|------|------|------|
| 框架 | Vue 3 (Composition API) | `<script setup lang="ts">` |
| 构建 | Vite | 开发与生产构建 |
| 语言 | TypeScript | Strict 模式 |
| 可视化 | ECharts 6 | 所有图表 |
| 状态管理 | Pinia | Store + Actions |
| HTTP | Axios | API 模式数据请求 |
| 单元测试 | Vitest | jsdom 环境 |
| E2E 测试 | Playwright | Chromium |
| 代码质量 | ESLint + Prettier + Stylelint | 统一规范 |

## 页面内容

大屏包含以下模块：

| 模块 | 组件 | 说明 |
|------|------|------|
| 顶部标题 | ScreenHeader | 项目名称 + 运行状态指示灯 + 实时时钟 |
| 核心指标 | MetricCard x4 | 访问量、订单数、活跃用户、系统健康度，含较昨日趋势 |
| 访问趋势 | LineTrendChart | 双折线面积图，访问量 + 订单数随时间变化 |
| 业务占比 | PieStatusChart | 环形饼图，展示各业务分类占比 |
| 数据中枢 | DataHubChart | 关系拓扑图，展示服务节点和链路状态 |
| 区域排名 | BarRankingChart | 横向柱状图，城市访问排名 |
| 能力雷达 | RadarAbilityChart | 五维雷达图，平台能力评估 |
| 实时动态 | ActivityList | 按时间排序的系统动态消息列表 |
| 节点状态 | NodeStatusGrid | 5 列网格，展示服务节点的在线状态和负载 |

## 实时数据模拟

项目内置了实时数据模拟器（`src/mocks/realtimeDashboardSimulator.ts`），打开页面后数据会持续自动刷新：

- **顶部指标卡** — 访问量递增（+20~300/次），订单数递增（+0~80/次），活跃用户±3%浮动，健康度 95%~99.9%
- **访问趋势** — 每 2 秒追加新时间点，保留最近 10 个点，形成滑动窗口效果
- **实时动态** — 每约 6 秒新增一条消息，最多保留 8 条，按 success/warning/info 着色
- **数据中枢节点** — 负载值小幅波动（±5），超过阈值自动切换 status
- **区域排名** — 每约 10 秒各城市数值递增后重新排序
- **业务占比** — 每约 12 秒微调占比，始终合计 100%
- **能力雷达** — 每约 30 秒小幅波动，避免频繁跳动

所有变化均在合理范围内，不会出现负数或溢出。仍然是纯前端 Mock，不依赖任何后端服务。

## 项目结构

```text
src/
  app/              应用入口（App.vue, main.ts, styles.css）
  charts/           ECharts 图表组件（折线/柱状/饼/雷达/拓扑 + useChart composable）
  components/       业务组件
    base/           BasePanel 通用面板
    dashboard/      ScreenHeader, MetricCard, ActivityList, NodeStatusGrid
  config/           主题色彩与调色板
  layouts/          大屏外层容器（背景渐变 + 缩放）
  logs/             统一日志系统（命名空间隔离，dev 环境输出 debug）
  mocks/            Mock 数据 + 实时模拟器
  services/         数据访问层（Mock/API 判断 + HTTP Client）
  stores/           Pinia Store（数据 + loading + error + 实时刷新控制）
  types/            TypeScript 接口定义
  utils/            格式化工具（千分位、百分比、时钟）+ 窗口 resize
  views/            页面视图（DashboardView）
  tests/
    unit/           Vitest 单元测试
    e2e/            Playwright E2E 测试
scripts/            辅助脚本（截图等）
```

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与启动

```bash
# 安装依赖
npm install

# 启动开发服务
npm run dev
```

浏览器访问 `http://127.0.0.1:10001`，打开后即可看到实时刷新的数据大屏。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run preview` | 预览构建产物 |
| `npm run lint` | ESLint + Stylelint 代码检查 |
| `npm run format` | Prettier 格式化 |
| `npm test` | 运行 Vitest 单元测试 |
| `npm run test:e2e` | 运行 Playwright E2E 测试 |
| `npm run screenshot` | 生成大屏截图（需先启动 dev server） |

### 截图命令

```bash
# 终端 1：启动开发服务
npm run dev

# 终端 2：生成截图
npm run screenshot
```

截图输出：`docs/screenshots/dashboard-1920x1080.png`（1920x1080 视口，PNG 格式）。

## 数据源说明

项目支持两种数据源模式，通过环境变量 `VITE_DATA_SOURCE` 控制：

### Mock 模式（默认）

```bash
# .env 或不设置
VITE_DATA_SOURCE=mock
```

使用内置的实时模拟器生成数据，无需后端服务。

### API 模式

```bash
# .env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=https://your-api-server.com
```

通过 Axios 请求 `{VITE_API_BASE_URL}/dashboard`，后端需返回与 `DashboardData` 类型匹配的 JSON。超时 8 秒。

切换模式后重启开发服务即可生效。

## 可扩展方向

项目在设计时已预留了平滑接入真实 API 的路径：
- `services/dashboardService.ts` 的 `getDashboardData()` 已封装 mock/api 分支逻辑
- `stores/dashboardStore.ts` 的 `load()` 可通过 `startRealtime()` / `stopRealtime()` 控制刷新
- 所有组件通过 props 接收数据，与数据源解耦
- 日志系统在 dev 环境自动输出调试信息，prod 环境静默
- 环境变量 `VITE_DATA_SOURCE` 切换到 `api` 后直接走真实接口

## 测试与质量保障

项目包含完整的质量保障体系：

| 层级 | 工具 | 覆盖范围 |
|------|------|----------|
| 类型检查 | `vue-tsc` | 全项目 TS 类型正确性 |
| 代码规范 | ESLint + Stylelint | JS/TS/CSS/Vue 代码风格 |
| 格式化 | Prettier | 统一代码格式 |
| 单元测试 | Vitest | Service 层、工具函数、模拟器 |
| E2E 测试 | Playwright | 页面渲染、实时刷新验证 |
| 构建验证 | `npm run build` | 确保可构建 |

## 适合学习的内容

- Vue 3 Composition API 项目结构组织
- 1920x1080 数据大屏 CSS Grid 布局
- ECharts 图表组件封装（useChart Composable）
- Mock 数据与 Service 层分层设计
- Pinia 状态管理与异步数据流
- 实时数据模拟器的设计思路
- Playwright 端到端测试与自动化截图
- ESLint + Prettier + Stylelint 工程化规范

## License

MIT

---

> DataScreen — 从零搭建一个完整的数据可视化大屏
