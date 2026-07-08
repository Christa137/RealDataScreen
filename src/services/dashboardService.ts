import { nextDashboardFrame } from '@/mocks/realtimeDashboardSimulator'
import { http } from '@/services/http'
import type { DashboardApiResponse, DashboardData, ServerHost } from '@/types/dashboard'

function transformApiResponse(api: DashboardApiResponse): DashboardData {
  const summary = api.summary
  const hosts = api.hosts

  // Map hosts to node status based on CPU usage
  const nodes: DashboardData['nodes'] = hosts.map((h: ServerHost) => {
    const cpu = h.cpu_usage ?? 0
    const status: DashboardData['nodes'][number]['status'] =
      cpu >= 80 ? 'offline' : cpu >= 60 ? 'busy' : 'online'
    return {
      name: h.hostid,
      status,
      load: Math.round(cpu),
    }
  })

  // Decorative links between consecutive hosts
  const links: DashboardData['links'] = []
  for (let i = 0; i < nodes.length - 1; i++) {
    links.push({
      source: nodes[i].name,
      target: nodes[i + 1].name,
      value: Math.round((nodes[i].load + (nodes[i + 1]?.load ?? 0)) / 2),
    })
  }

  // Generate activities from hosts with high CPU usage
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  const activities: DashboardData['activities'] = []
  let idCounter = 1
  hosts
    .filter((h) => (h.cpu_usage ?? 0) >= 70)
    .slice(0, 5)
    .forEach((h) => {
      activities.push({
        id: `a${idCounter++}`,
        time,
        title: `${h.hostid} CPU 使用率达到 ${(h.cpu_usage ?? 0).toFixed(1)}%`,
        level: (h.cpu_usage ?? 0) >= 80 ? 'warning' : 'info',
      })
    })
  if (activities.length === 0) {
    activities.push({ id: 'a1', time, title: '所有主机运行状态正常', level: 'success' })
  }

  return {
    updatedAt: api.updatedAt,
    metrics: [
      {
        id: 'hosts',
        label: '在线主机数',
        value: summary.total_hosts,
        unit: '台',
        trend: 0,
        tone: 'cyan',
      },
      {
        id: 'cpu',
        label: '平均 CPU 使用率',
        value: Math.round((summary.avg_cpu ?? 0) * 100) / 100,
        unit: '%',
        trend: 0,
        tone: (summary.avg_cpu ?? 0) >= 80 ? 'rose' : (summary.avg_cpu ?? 0) >= 60 ? 'amber' : 'green',
      },
      {
        id: 'mem',
        label: '平均内存使用',
        value: Math.round((summary.avg_mem ?? 0) * 100) / 100,
        unit: 'MB',
        trend: 0,
        tone: 'amber',
      },
      {
        id: 'alerts',
        label: '告警主机数',
        value: summary.alert_hosts,
        unit: '台',
        trend: 0,
        tone: summary.alert_hosts > 0 ? 'rose' : 'green',
      },
    ],
    trends: api.cpuTrend.map((t) => ({ time: t.time, value: Number(t.value.toFixed(2)) })),
    categories: api.categories.map((c) => ({ name: c.name.toUpperCase(), value: c.value })),
    rankings: api.topHosts.map((h) => ({ city: h.hostid, value: Math.round(h.value * 100) / 100 })),
    radar: [
      { name: 'CPU', value: Math.round((summary.avg_cpu ?? 0) * 100) / 100, max: 100 },
      { name: '内存', value: Math.min(100, Math.round(((summary.avg_mem ?? 0) / 131072) * 100 * 100) / 100), max: 100 },
      { name: '负载', value: Math.min(100, Math.round((summary.avg_load ?? 0) * 100) / 100), max: 100 },
      { name: '网络', value: Math.round(((summary.avg_mem ?? 0) % 1000) / 10 * 100) / 100, max: 100 },
      { name: '稳定性', value: summary.alert_hosts > 0 ? 85 : 98, max: 100 },
    ],
    activities,
    nodes,
    links,
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  // Real data from backend API (requires MySQL + server running)
  if (import.meta.env.VITE_DATA_SOURCE === 'api') {
    const response = await http.get<DashboardApiResponse>('/dashboard')
    return transformApiResponse(response.data)
  }

  // Mock data with realtime simulation (fallback for demo / development)
  return Promise.resolve(nextDashboardFrame())
}
