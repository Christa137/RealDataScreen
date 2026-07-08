const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000
const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'datascreen',
}

app.use(cors())
app.use(express.json())

let pool

async function getPool() {
  if (!pool) {
    pool = mysql.createPool(DB_CONFIG)
  }
  return pool
}

/**
 * GET /api/dashboard
 * Returns the aggregated dashboard metrics based on the latest hour.
 */
app.get('/api/dashboard', async (req, res) => {
  try {
    const db = await getPool()

    // latest hour available in the data
    const [[{ latest }]] = await db.execute('SELECT MAX(hour_start) AS latest FROM hourly_summary')

    // overall metrics
    const [[summary]] = await db.execute(
      `
      SELECT
        COUNT(DISTINCT hostid) AS total_hosts,
        AVG(CASE WHEN mod = 'cpu_usage' THEN avg_value END) AS avg_cpu,
        AVG(CASE WHEN mod = 'mem_used' THEN avg_value END) AS avg_mem,
        AVG(CASE WHEN mod = 'load1' THEN avg_value END) AS avg_load,
        SUM(CASE WHEN mod = 'cpu_usage' AND avg_value >= 80 THEN 1 ELSE 0 END) AS alert_hosts
      FROM hourly_summary
      WHERE hour_start = ?
      `,
      [latest]
    )

    // latest host list with main metrics
    const [hosts] = await db.execute(
      `
      SELECT
        hostid,
        hostname,
        MAX(CASE WHEN mod = 'cpu_usage' THEN avg_value END) AS cpu_usage,
        MAX(CASE WHEN mod = 'mem_used' THEN avg_value END) AS mem_used,
        MAX(CASE WHEN mod = 'load1' THEN avg_value END) AS load1,
        MAX(CASE WHEN mod = 'net_in' THEN avg_value END) AS net_in
      FROM hourly_summary
      WHERE hour_start = ?
      GROUP BY hostid, hostname
      ORDER BY hostid
      `,
      [latest]
    )

    // CPU trend over the last 24 hours (cluster average)
    const [cpuTrend] = await db.execute(
      `
      SELECT
        DATE_FORMAT(hour_start, '%H:%i') AS time,
        AVG(avg_value) AS value
      FROM hourly_summary
      WHERE mod = 'cpu_usage'
      GROUP BY hour_start
      ORDER BY hour_start
      LIMIT 24
      `
    )

    // memory trend
    const [memTrend] = await db.execute(
      `
      SELECT
        DATE_FORMAT(hour_start, '%H:%i') AS time,
        AVG(avg_value) AS value
      FROM hourly_summary
      WHERE mod = 'mem_used'
      GROUP BY hour_start
      ORDER BY hour_start
      LIMIT 24
      `
    )

    // top 6 hosts by CPU usage
    const [topHosts] = await db.execute(
      `
      SELECT
        hostid,
        hostname,
        MAX(CASE WHEN mod = 'cpu_usage' THEN avg_value END) AS value
      FROM hourly_summary
      WHERE hour_start = ?
      GROUP BY hostid, hostname
      ORDER BY value DESC
      LIMIT 6
      `,
      [latest]
    )

    // metric distribution: disk vs pref categories (count of records)
    const [categories] = await db.execute(
      `
      SELECT type AS name, COUNT(*) AS value
      FROM hourly_summary
      WHERE hour_start = ?
      GROUP BY type
      `,
      [latest]
    )

    res.json({
      updatedAt: new Date().toISOString(),
      latestHour: latest,
      summary,
      hosts,
      cpuTrend,
      memTrend,
      topHosts,
      categories,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * GET /api/trends?metric=cpu_usage
 * Returns time series for a specific metric (cluster average).
 */
app.get('/api/trends', async (req, res) => {
  const metric = req.query.metric || 'cpu_usage'
  try {
    const db = await getPool()
    const [rows] = await db.execute(
      `
      SELECT
        DATE_FORMAT(hour_start, '%H:%i') AS time,
        AVG(avg_value) AS value,
        MAX(max_value) AS max_value,
        MIN(min_value) AS min_value
      FROM hourly_summary
      WHERE mod = ?
      GROUP BY hour_start
      ORDER BY hour_start
      LIMIT 24
      `,
      [metric]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * GET /api/hosts/:hostid
 * Returns detailed metrics for a single host.
 */
app.get('/api/hosts/:hostid', async (req, res) => {
  const { hostid } = req.params
  try {
    const db = await getPool()
    const [rows] = await db.execute(
      `
      SELECT
        hour_start,
        mod,
        type,
        unit,
        avg_value,
        max_value,
        min_value
      FROM hourly_summary
      WHERE hostid = ?
      ORDER BY hour_start, mod
      LIMIT 200
      `,
      [hostid]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`DataScreen API server running at http://127.0.0.1:${PORT}`)
})
