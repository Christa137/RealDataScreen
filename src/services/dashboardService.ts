import { dashboardMock } from '@/mocks/dashboardMock'
import { getDataSource } from '@/services/dataSource'
import { http } from '@/services/http'
import type { DashboardData } from '@/types/dashboard'

export async function getDashboardData(): Promise<DashboardData> {
  if (getDataSource() === 'mock') {
    return Promise.resolve({
      ...dashboardMock,
      updatedAt: new Date().toISOString(),
    })
  }

  const response = await http.get<DashboardData>('/dashboard')
  return response.data
}
