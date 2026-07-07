# DataScreen 前端数据大屏 v1 自动开发提示词

你是一个资深前端工程师、数据可视化工程师和开源项目维护者。请为项目 DataScreen（中文名：数据大屏）开发第一版纯前端可视化数据大屏。

## 项目定位

DataScreen 是一个开源的 Vue 数据可视化大屏项目。第一版目标不是堆砌炫光效果，而是交付一个结构规范、视觉完成度高、可测试、可扩展、后期能平滑接入真实 API 的前端工程。

## 技术架构

以标准工程型架构为主，吸收业务模块型和配置驱动型架构的优点：

- Vue 3 + Vite + TypeScript
- Pinia 状态管理
- ECharts 图表渲染
- Axios 作为真实 API 请求入口
- 本地 mock 数据作为当前默认数据源
- Vitest 单元测试
- Playwright 端到端测试
- ESLint + Prettier + Stylelint 代码质量系统
- 统一 logger，预留上报扩展
- 主题、面板、图表、服务层、数据类型分离

## 必须遵守的工程原则

1. 当前阶段只实现纯前端。
2. 默认使用 mock 数据。
3. 后续通过 `VITE_DATA_SOURCE=api` 切换到真实 API。
4. 组件不能直接读取 mock 文件，必须通过 services 层获取数据。
5. 不允许把页面、样式、数据、图表逻辑堆到一个文件中。
6. 所有图表组件独立维护，页面只负责布局组合。
7. 类型定义集中在 `src/types`。
8. 日志集中在 `src/logs/logger.ts`。
9. 测试覆盖格式化工具、服务层 mock 数据、首页基础展示。
10. README 和 MIT LICENSE 必须完善。

## 第一版页面目标

浏览器打开后应看到一个 1920x1080 风格、自适应缩放的数据大屏：

- 顶部：项目标题、运行状态、当前时间。
- 中央：数据枢纽态势图，展示数据节点、链路、吞吐、延迟等指标。
- 左侧：核心指标卡片、访问趋势折线图、分类占比图。
- 右侧：区域排名柱状图、能力雷达图、系统告警列表。
- 底部：实时动态流和服务节点状态。

视觉要求：

- 深色科技风，但避免单一蓝紫配色。
- 主色为青蓝，辅以琥珀、绿、玫红等状态色。
- 面板克制、清晰、信息密度高。
- 使用流动光效、网格、扫描线等增强大屏氛围，但不牺牲可读性。
- 所有内容在桌面浏览器中不应明显重叠。

## 建议目录

```text
src/
  app/
    App.vue
    main.ts
    styles.css
  components/
    base/
    dashboard/
  charts/
  config/
  layouts/
  logs/
  mocks/
  services/
  stores/
  tests/
  types/
  utils/
  views/
```

## 验证目标

完成后至少运行：

- `npm run build`
- `npm run test`

如果环境允许，再运行：

- `npm run lint`
- `npm run test:e2e`

最后启动开发服务，让用户可以直接打开浏览器查看页面。
