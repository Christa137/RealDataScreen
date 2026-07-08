const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000
const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'datascreen',
}

let pool
async function getPool() {
  if (!pool) pool = mysql.createPool(DB_CONFIG)
  return pool
}

// ---------------------------------------------------------------------------
// GET /api/dashboard — 仪表盘总览
// 按每个 (hostid, mod) 取各自最新 hour_start，避免不同模块更新时间不同导致漏数据
// ---------------------------------------------------------------------------
app.get('/api/dashboard', async (_req, res) => {
  try {
    const db = await getPool()

    // ---- summary ----
    const [[summary]] = await db.execute(
      `SELECT
         COUNT(DISTINCT h.hostid) AS total_hosts,
         AVG(CASE WHEN h.\`mod\` = 'cpu_usage' THEN h.avg_value END) AS avg_cpu,
         AVG(CASE WHEN h.\`mod\` = 'mem_used' THEN h.avg_value END) AS avg_mem,
         AVG(CASE WHEN h.\`mod\` = 'load1' THEN h.avg_value END) AS avg_load,
         SUM(CASE WHEN h.\`mod\` = 'cpu_usage' AND h.avg_value >= 80 THEN 1 ELSE 0 END) AS alert_hosts
       FROM hourly_summary h
       INNER JOIN (
         SELECT hostid, \`mod\`, MAX(hour_start) AS latest
         FROM hourly_summary GROUP BY hostid, \`mod\`
       ) latest
         ON h.hostid = latest.hostid
        AND h.\`mod\` = latest.\`mod\`
        AND h.hour_start = latest.latest`
    )

    // ---- hosts ----
    // 按每个 (hostid, mod) 取各自最新 hour_start，避免不同模块更新时间不同导致某指标为 NULL
    const [hosts] = await db.execute(
      `SELECT h.hostid, h.hostname,
         MAX(CASE WHEN h.\`mod\` = 'cpu_usage' THEN h.avg_value END) AS cpu_usage,
         MAX(CASE WHEN h.\`mod\` = 'mem_used' THEN h.avg_value END) AS mem_used,
         MAX(CASE WHEN h.\`mod\` = 'load1' THEN h.avg_value END) AS load1,
         MAX(CASE WHEN h.\`mod\` = 'net_in' THEN h.avg_value END) AS net_in
       FROM hourly_summary h
       INNER JOIN (
         SELECT hostid, \`mod\`, MAX(hour_start) AS latest
         FROM hourly_summary GROUP BY hostid, \`mod\`
       ) latest
         ON h.hostid = latest.hostid
        AND h.\`mod\` = latest.\`mod\`
        AND h.hour_start = latest.latest
       GROUP BY h.hostid, h.hostname
       ORDER BY h.hostid`
    )

    // ---- cpuTrend ----
    const [cpuTrend] = await db.execute(
      `SELECT DATE_FORMAT(hour_start, '%H:%i') AS time, AVG(avg_value) AS value
       FROM hourly_summary WHERE \`mod\` = 'cpu_usage'
       GROUP BY hour_start ORDER BY hour_start DESC LIMIT 24`
    )
    cpuTrend.reverse()

    // ---- memTrend ----
    const [memTrend] = await db.execute(
      `SELECT DATE_FORMAT(hour_start, '%H:%i') AS time, AVG(avg_value) AS value
       FROM hourly_summary WHERE \`mod\` = 'mem_used'
       GROUP BY hour_start ORDER BY hour_start DESC LIMIT 24`
    )
    memTrend.reverse()

    // ---- topHosts ----
    const [topHosts] = await db.execute(
      `SELECT h.hostid, h.hostname, h.avg_value AS value
       FROM hourly_summary h
       INNER JOIN (
         SELECT hostid, \`mod\`, MAX(hour_start) AS latest
         FROM hourly_summary GROUP BY hostid, \`mod\`
       ) latest
         ON h.hostid = latest.hostid
        AND h.\`mod\` = latest.\`mod\`
        AND h.hour_start = latest.latest
       WHERE h.\`mod\` = 'cpu_usage'
       ORDER BY h.avg_value DESC LIMIT 6`
    )

    // ---- categories ----
    const [categories] = await db.execute(
      `SELECT \`type\` AS name, COUNT(DISTINCT hostid) AS value
       FROM hourly_summary GROUP BY \`type\``
    )

    res.json({
      updatedAt: new Date().toISOString(),
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

// ---------------------------------------------------------------------------
// GET /api/trends?metric=cpu_usage|mem_used|load1|net_in  — 单指标趋势
// ---------------------------------------------------------------------------
app.get('/api/trends', async (req, res) => {
  const metric = req.query.metric || 'cpu_usage'
  try {
    const db = await getPool()
    const [rows] = await db.execute(
      `SELECT DATE_FORMAT(hour_start, '%H:%i') AS time,
         AVG(avg_value) AS value, MAX(max_value) AS max_value, MIN(min_value) AS min_value
       FROM hourly_summary WHERE \`mod\` = ?
       GROUP BY hour_start ORDER BY hour_start LIMIT 24`,
      [metric]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// ---------------------------------------------------------------------------
// GET /api/hosts/:hostid  — 单主机历史明细
// ---------------------------------------------------------------------------
app.get('/api/hosts/:hostid', async (req, res) => {
  const { hostid } = req.params
  try {
    const db = await getPool()
    const [rows] = await db.execute(
      `SELECT hour_start, \`mod\`, \`type\`, unit, avg_value, max_value, min_value
       FROM hourly_summary WHERE hostid = ?
       ORDER BY hour_start DESC, \`mod\` LIMIT 200`,
      [hostid]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// ---------------------------------------------------------------------------
// Production：托管 dist 静态文件
// ---------------------------------------------------------------------------
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  app.get('*', (_req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')))
}

app.listen(PORT, () => console.log(`DataScreen API running at http://127.0.0.1:${PORT}`))
