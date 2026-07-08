import type { DashboardData } from '@/types/dashboard'

export const dashboardMock: DashboardData = {
  updatedAt: new Date().toISOString(),
  metrics: [
    { id: 'hosts', label: '在线主机数', value: 20, unit: '台', trend: 0, tone: 'cyan' },
    { id: 'cpu', label: '平均 CPU 使用率', value: 45.2, unit: '%', trend: 3.5, tone: 'green' },
    { id: 'mem', label: '平均内存使用', value: 68329, unit: 'MB', trend: -1.2, tone: 'amber' },
    { id: 'alerts', label: '告警主机数', value: 2, unit: '台', trend: 0, tone: 'rose' },
  ],
  trends: [
    { time: '00:00', value: 42.1 },
    { time: '01:00', value: 45.3 },
    { time: '02:00', value: 43.8 },
    { time: '03:00', value: 47.2 },
    { time: '04:00', value: 46.5 },
    { time: '05:00', value: 49.1 },
    { time: '06:00', value: 51.3 },
    { time: '07:00', value: 48.7 },
  ],
  categories: [
    { name: 'PREF', value: 960 },
    { name: 'DISK', value: 240 },
  ],
  rankings: [
    { city: 'host003', value: 78.5 },
    { city: 'host012', value: 72.3 },
    { city: 'host007', value: 68.9 },
    { city: 'host015', value: 64.2 },
    { city: 'host001', value: 59.7 },
    { city: 'host009', value: 55.4 },
  ],
  radar: [
    { name: 'CPU', value: 45.2, max: 100 },
    { name: '内存', value: 52.1, max: 100 },
    { name: '负载', value: 38.7, max: 100 },
    { name: '网络', value: 61.3, max: 100 },
    { name: '稳定性', value: 92, max: 100 },
  ],
  activities: [
    { id: 'a1', time: '14:16:20', title: 'host003 CPU 使用率达到 78.5%', level: 'warning' },
    { id: 'a2', time: '14:12:08', title: 'host007 内存使用率短时升高', level: 'warning' },
    { id: 'a3', time: '14:08:51', title: '新增 3 个监控指标采集任务', level: 'info' },
    { id: 'a4', time: '14:02:37', title: '实时告警模型刷新完成', level: 'success' },
    { id: 'a5', time: '13:58:44', title: 'host012 进入高负载模式', level: 'warning' },
  ],
  nodes: [
    { name: 'host001', status: 'online', load: 45 },
    { name: 'host002', status: 'online', load: 52 },
    { name: 'host003', status: 'busy', load: 79 },
    { name: 'host004', status: 'online', load: 38 },
    { name: 'host005', status: 'online', load: 61 },
  ],
  links: [
    { source: 'host001', target: 'host002', value: 48 },
    { source: 'host002', target: 'host003', value: 65 },
    { source: 'host003', target: 'host004', value: 58 },
    { source: 'host004', target: 'host005', value: 49 },
  ],
}
