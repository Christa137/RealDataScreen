export interface SummaryMetric {
  id: string
  label: string
  value: number
  unit: string
  trend: number
  tone: 'cyan' | 'green' | 'amber' | 'rose'
}

export interface TrendPoint {
  time: string
  value: number
}

export interface CategoryShare {
  name: string
  value: number
}

export interface RankingItem {
  city: string
  value: number
}

export interface RadarItem {
  name: string
  value: number
  max: number
}

export interface ActivityItem {
  id: string
  time: string
  title: string
  level: 'info' | 'warning' | 'success'
}

export interface NodeStatus {
  name: string
  status: 'online' | 'busy' | 'offline'
  load: number
}

export interface HubLink {
  source: string
  target: string
  value: number
}

export interface DashboardData {
  updatedAt: string
  metrics: SummaryMetric[]
  trends: TrendPoint[]
  categories: CategoryShare[]
  rankings: RankingItem[]
  radar: RadarItem[]
  activities: ActivityItem[]
  nodes: NodeStatus[]
  links: HubLink[]
}

// ── Backend API types (server monitoring) ─────────────────────────

export interface ServerHost {
  hostid: string
  hostname: string
  cpu_usage: number | null
  mem_used: number | null
  load1: number | null
  net_in: number | null
}

export interface DashboardSummary {
  total_hosts: number
  avg_cpu: number | null
  avg_mem: number | null
  avg_load: number | null
  alert_hosts: number
}

export interface MetricTrend {
  time: string
  value: number
}

export interface DashboardApiResponse {
  updatedAt: string
  latestHour: string
  summary: DashboardSummary
  hosts: ServerHost[]
  cpuTrend: MetricTrend[]
  memTrend: MetricTrend[]
  topHosts: { hostid: string; hostname: string; value: number }[]
  categories: { name: string; value: number }[]
}
