# DataScreen 数据大屏

DataScreen 是一个基于 Vue 3 的纯前端数据可视化大屏项目。项目第一版使用 mock 数据驱动页面，后续可以通过环境变量平滑切换到真实 API。

## 技术栈

- Vue 3 + Vite + TypeScript
- ECharts
- Pinia
- Axios
- Vitest
- Playwright
- ESLint + Prettier + Stylelint

## 本地运行

```bash
npm install
npm run dev
```

默认使用 mock 数据。接入真实 API 时可设置：

```bash
VITE_DATA_SOURCE=api
```

## 常用命令

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

## 项目结构

```text
src/
  app/          应用入口与全局样式
  charts/       ECharts 图表组件
  components/   基础组件与大屏业务组件
  config/       主题与大屏配置
  layouts/      大屏布局
  logs/         日志系统
  mocks/        mock 数据
  services/     数据访问层
  stores/       Pinia 状态
  tests/        单元测试与 E2E 测试
  types/        TypeScript 类型
  utils/        工具函数
  views/        页面视图
```

## 开源协议

MIT
