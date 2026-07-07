export type DataSource = 'mock' | 'api'

export function getDataSource(): DataSource {
  return import.meta.env.VITE_DATA_SOURCE === 'api' ? 'api' : 'mock'
}
