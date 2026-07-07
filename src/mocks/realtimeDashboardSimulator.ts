import type {
  ActivityItem,
  CategoryShare,
  DashboardData,
  HubLink,
  NodeStatus,
  RadarItem,
  RankingItem,
  SummaryMetric,
  TrendPoint,
} from '@/types/dashboard'

import { dashboardMock } from './dashboardMock'

// ── Internal state ────────────────────────────────────────────────
let state: DashboardData
let frameIndex = 0
let initialized = false
let activityIdCounter = 6

// ── Activity templates (data-center / teaching themed) ────────────
const activityTemplates: { title: string; level: ActivityItem['level'] }[] = [
  { title: '华东节点完成新一轮访问数据同步', level: 'success' },
  { title: '可视化案例库同步 12 条练习记录', level: 'info' },
  { title: '北京学习中心完成数据质量巡检', level: 'success' },
  { title: '数据链路延迟轻微升高，已切换备用通道', level: 'warning' },
  { title: '新增 3 个数据采集任务进入调度队列', level: 'info' },
  { title: '实时计算模型刷新完成，准确率 99.4%', level: 'success' },
  { title: '告警中心发现轻微指标波动，正在持续观察', level: 'warning' },
  { title: '南方节点完成流量自动扩容', level: 'success' },
  { title: '指标仓库写入延迟短时升高，已自动恢复', level: 'warning' },
  { title: 'API 边缘网关完成热升级，零中断', level: 'success' },
  { title: '课程资源缓存命中率提升至 94.2%', level: 'info' },
  { title: '学员端新增一批项目实战提交记录', level: 'info' },
  { title: '数据库连接池自动扩容完成', level: 'info' },
  { title: '异常数据点已自动标记，等待人工复核', level: 'warning' },
]

// ── Helpers ───────────────────────────────────────────────────────
function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

function nowTime(): string {
  const d = new Date()
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((x) => String(x).padStart(2, '0'))
    .join(':')
}

function init(): void {
  if (initialized) return
  state = JSON.parse(JSON.stringify(dashboardMock)) as DashboardData
  initialized = true
}

// ── Individual updaters ───────────────────────────────────────────

function updateMetrics(metrics: SummaryMetric[]): SummaryMetric[] {
  return metrics.map((m) => {
    const prev = m.value
    let next: number

    switch (m.id) {
      case 'visits':
        next = prev + 20 + Math.floor(Math.random() * 280)
        break
      case 'orders':
        next = prev + Math.floor(Math.random() * 80)
        break
      case 'users':
        next = prev + Math.floor((Math.random() - 0.5) * prev * 0.06)
        next = Math.max(1000, next)
        break
      case 'health':
        next = 95 + Math.random() * 4.9
        break
      default:
        next = prev
    }

    const trend = prev > 0 ? ((next - prev) / prev) * 100 : 0
    return {
      ...m,
      value: Math.round(next * 10) / 10,
      trend: Math.round(trend * 10) / 10,
    }
  })
}

function updateTrends(trends: TrendPoint[], metrics: SummaryMetric[]): TrendPoint[] {
  const visitsMetric = metrics.find((m) => m.id === 'visits')
  const ordersMetric = metrics.find((m) => m.id === 'orders')

  // Append a new point every frame
  const last = trends[trends.length - 1]
  const nextVisits = last
    ? last.visits + Math.floor((Math.random() - 0.3) * 500)
    : (visitsMetric?.value ?? 128000)
  const nextOrders = last
    ? last.orders + Math.floor((Math.random() - 0.3) * 40)
    : (ordersMetric?.value ?? 8400)

  const slice = [
    ...trends,
    {
      time: nowTime(),
      visits: Math.max(0, nextVisits),
      orders: Math.max(0, nextOrders),
    },
  ]

  // Keep last 10 points
  return slice.slice(-10)
}

function updateActivities(activities: ActivityItem[]): ActivityItem[] {
  const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)]
  const newActivity: ActivityItem = {
    id: `a${activityIdCounter++}`,
    time: nowTime(),
    title: template.title,
    level: template.level,
  }

  return [newActivity, ...activities].slice(0, 8)
}

function updateNodes(nodes: NodeStatus[]): NodeStatus[] {
  return nodes.map((n) => {
    const delta = Math.floor((Math.random() - 0.5) * 10)
    const nextLoad = clamp(n.load + delta, 10, 100)

    let status: NodeStatus['status'] = n.status
    if (nextLoad > 92) {
      status = Math.random() < 0.15 ? 'offline' : 'busy'
    } else if (nextLoad > 72) {
      status = 'busy'
    } else if (nextLoad < 30) {
      status = 'online'
    }

    return { ...n, load: nextLoad, status }
  })
}

function updateLinks(links: HubLink[], nodes: NodeStatus[]): HubLink[] {
  return links.map((l) => {
    const delta = Math.floor((Math.random() - 0.5) * 8)
    return { ...l, value: clamp(l.value + delta, 10, 100) }
  })
}

function updateRankings(rankings: RankingItem[]): RankingItem[] {
  const updated = rankings.map((r) => ({
    ...r,
    value: r.value + Math.floor(Math.random() * 120),
  }))
  // Some cities may swap order
  if (Math.random() < 0.25) {
    const i = Math.floor(Math.random() * updated.length)
    const j = Math.floor(Math.random() * updated.length)
    if (i !== j) {
      const extra = Math.floor(Math.random() * 200)
      updated[i].value += extra
    }
  }
  return updated.sort((a, b) => b.value - a.value)
}

function updateCategories(cats: CategoryShare[]): CategoryShare[] {
  const perturbed = cats.map((c) => ({
    ...c,
    value: Math.max(1, c.value + (Math.random() - 0.5) * 4),
  }))
  const sum = perturbed.reduce((s, c) => s + c.value, 0)
  const scaled = perturbed.map((c) => ({
    ...c,
    value: Math.round((c.value / sum) * 100),
  }))
  // Fix rounding to make sum exactly 100
  const currentSum = scaled.reduce((s, c) => s + c.value, 0)
  scaled[scaled.length - 1].value += 100 - currentSum
  return scaled
}

function updateRadar(radar: RadarItem[]): RadarItem[] {
  return radar.map((r) => ({
    ...r,
    value: clamp(r.value + Math.floor((Math.random() - 0.5) * 6), 60, 100),
  }))
}

// ── Public API ────────────────────────────────────────────────────

/**
 * Returns the next frame of realtime dashboard data.
 * Call this repeatedly to get fresh, evolving data.
 */
export function nextDashboardFrame(): DashboardData {
  init()
  frameIndex++

  state.metrics = updateMetrics(state.metrics)
  state.trends = updateTrends(state.trends, state.metrics)

  // Low-frequency updates
  if (frameIndex % 3 === 0) {
    state.activities = updateActivities(state.activities)
  }
  if (frameIndex % 5 === 0) {
    state.rankings = updateRankings(state.rankings)
  }
  if (frameIndex % 6 === 0) {
    state.categories = updateCategories(state.categories)
  }
  if (frameIndex % 15 === 0) {
    state.radar = updateRadar(state.radar)
  }

  state.nodes = updateNodes(state.nodes)
  state.links = updateLinks(state.links, state.nodes)

  state.updatedAt = new Date().toISOString()

  // Return a deep clone to avoid reference mutation
  return JSON.parse(JSON.stringify(state)) as DashboardData
}
