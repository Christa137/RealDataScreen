import type { DashboardData } from '@/types/dashboard'

export const dashboardMock: DashboardData = {
  updatedAt: new Date().toISOString(),
  metrics: [
    { id: 'visits', label: '今日访问量', value: 128936, unit: '次', trend: 18.6, tone: 'cyan' },
    { id: 'orders', label: '实时订单数', value: 8462, unit: '单', trend: 9.4, tone: 'green' },
    { id: 'users', label: '活跃用户数', value: 36580, unit: '人', trend: 12.1, tone: 'amber' },
    { id: 'health', label: '系统健康度', value: 98.7, unit: '%', trend: 2.8, tone: 'rose' },
  ],
  trends: [
    { time: '00:00', visits: 8200, orders: 520 },
    { time: '03:00', visits: 7600, orders: 460 },
    { time: '06:00', visits: 11200, orders: 710 },
    { time: '09:00', visits: 21500, orders: 1380 },
    { time: '12:00', visits: 28600, orders: 1860 },
    { time: '15:00', visits: 33100, orders: 2310 },
    { time: '18:00', visits: 30200, orders: 2090 },
    { time: '21:00', visits: 24800, orders: 1640 },
  ],
  categories: [
    { name: '运营分析', value: 34 },
    { name: '交易监控', value: 26 },
    { name: '用户增长', value: 21 },
    { name: '服务治理', value: 19 },
  ],
  rankings: [
    { city: '上海', value: 9860 },
    { city: '深圳', value: 9120 },
    { city: '杭州', value: 8760 },
    { city: '北京', value: 8240 },
    { city: '成都', value: 7580 },
    { city: '南京', value: 6840 },
  ],
  radar: [
    { name: '吞吐', value: 92, max: 100 },
    { name: '稳定', value: 96, max: 100 },
    { name: '延迟', value: 84, max: 100 },
    { name: '安全', value: 90, max: 100 },
    { name: '弹性', value: 88, max: 100 },
  ],
  activities: [
    { id: 'a1', time: '14:16:20', title: '华东节点完成流量扩容', level: 'success' },
    { id: 'a2', time: '14:12:08', title: '支付链路延迟短时升高', level: 'warning' },
    { id: 'a3', time: '14:08:51', title: '新增 3 个数据采集任务', level: 'info' },
    { id: 'a4', time: '14:02:37', title: '实时订单模型刷新完成', level: 'success' },
    { id: 'a5', time: '13:58:44', title: '北方节点进入高负载模式', level: 'warning' },
  ],
  nodes: [
    { name: '采集网关', status: 'online', load: 68 },
    { name: '实时计算', status: 'busy', load: 83 },
    { name: '指标仓库', status: 'online', load: 59 },
    { name: '告警中心', status: 'online', load: 41 },
    { name: 'API 边缘', status: 'busy', load: 76 },
  ],
  links: [
    { source: '采集网关', target: '实时计算', value: 72 },
    { source: '实时计算', target: '指标仓库', value: 64 },
    { source: '指标仓库', target: '告警中心', value: 36 },
    { source: '指标仓库', target: 'API 边缘', value: 58 },
  ],
}
