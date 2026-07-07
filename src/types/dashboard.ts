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
  visits: number
  orders: number
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
