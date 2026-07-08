import { nextDashboardFrame } from '@/mocks/realtimeDashboardSimulator'
import { http } from '@/services/http'
import type { DashboardApiResponse, DashboardData, ServerHost } from '@/types/dashboard'

// MySQL returns all numeric values as strings; this helper ensures we get numbers
function n(v: unknown): number {
  return Number(v) || 0
}

function transformApiResponse(api: DashboardApiResponse): DashboardData {
  const summary = api.summary
  const hosts = api.hosts
  const avgCpu = n(summary.avg_cpu)
  const avgMem = n(summary.avg_mem)
  const avgLoad = n(summary.avg_load)
  const alertHosts = n(summary.alert_hosts)

  // Map hosts to node status based on CPU usage
  const nodes: DashboardData['nodes'] = hosts.map((h: ServerHost) => {
    const cpu = n(h.cpu_usage)
    return {
      name: h.hostid,
      status: cpu >= 80 ? 'offline' : cpu >= 60 ? 'busy' : 'online',
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
  const pad = (d: number) => String(d).padStart(2, '0')
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  const activities: DashboardData['activities'] = []
  let idCounter = 1
  hosts
    .filter((h) => n(h.cpu_usage) >= 70)
    .slice(0, 5)
    .forEach((h) => {
      const cpu = n(h.cpu_usage)
      activities.push({
        id: `a${idCounter++}`,
        time,
        title: `${h.hostid} CPU 使用率达到 ${cpu.toFixed(1)}%`,
        level: cpu >= 80 ? 'warning' : 'info',
      })
    })
  if (activities.length === 0) {
    activities.push({ id: 'a1', time, title: '所有主机运行状态正常', level: 'success' })
  }

  return {
    updatedAt: api.updatedAt,
    metrics: [
      { id: 'hosts', label: '在线主机数', value: n(summary.total_hosts), unit: '台', trend: 0, tone: 'cyan' },
      { id: 'cpu', label: '平均 CPU 使用率', value: Math.round(avgCpu * 100) / 100, unit: '%', trend: 0, tone: avgCpu >= 80 ? 'rose' : avgCpu >= 60 ? 'amber' : 'green' },
      { id: 'mem', label: '平均内存使用', value: Math.round(avgMem), unit: 'MB', trend: 0, tone: 'amber' },
      { id: 'alerts', label: '告警主机数', value: alertHosts, unit: '台', trend: 0, tone: alertHosts > 0 ? 'rose' : 'green' },
    ],
    trends: api.cpuTrend.map((t) => ({ time: t.time, value: Math.round(n(t.value) * 100) / 100 })),
    categories: api.categories.map((c) => ({ name: c.name.toUpperCase(), value: n(c.value) })),
    rankings: api.topHosts.map((h) => ({ city: h.hostid, value: Math.round(n(h.value) * 100) / 100 })),
    radar: [
      { name: 'CPU', value: Math.round(avgCpu * 100) / 100, max: 100 },
      { name: '内存', value: Math.min(100, Math.round((avgMem / 131072) * 100 * 100) / 100), max: 100 },
      { name: '负载', value: Math.min(100, Math.round(avgLoad * 100) / 100), max: 100 },
      { name: '网络', value: Math.round((avgMem % 1000) / 10 * 100) / 100, max: 100 },
      { name: '稳定性', value: alertHosts > 0 ? 85 : 98, max: 100 },
    ],
    activities,
    nodes,
    links,
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  if (import.meta.env.VITE_DATA_SOURCE === 'api') {
    const response = await http.get<DashboardApiResponse>('/dashboard')
    return transformApiResponse(response.data)
  }
  return Promise.resolve(nextDashboardFrame())
}
