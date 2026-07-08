import csv, pymysql
from pathlib import Path

DATA = Path(r'D:\about_computer\something_else\summer_intern\project\homeworks\D3')
conn = pymysql.connect(host='127.0.0.1', port=3307, user='root', password='123456', charset='utf8mb4')
conn.select_db('datascreen')

with conn.cursor() as c:
    c.execute("""CREATE TABLE IF NOT EXISTS hourly_summary (
        id INT AUTO_INCREMENT PRIMARY KEY, hour_start DATETIME NOT NULL,
        hostid VARCHAR(16), hostname VARCHAR(64), `mod` VARCHAR(32),
        `type` VARCHAR(8), unit VARCHAR(16), sample_count INT,
        avg_value DECIMAL(18,4), max_value DECIMAL(18,4), min_value DECIMAL(18,4),
        INDEX idx_hour(hour_start), INDEX idx_host(hostid), INDEX idx_mod(`mod`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""")
    c.execute("""CREATE TABLE IF NOT EXISTS daily_summary (
        id INT AUTO_INCREMENT PRIMARY KEY, `date` DATE NOT NULL,
        hostid VARCHAR(16), hostname VARCHAR(64), `mod` VARCHAR(32),
        `type` VARCHAR(8), unit VARCHAR(8), hour_count INT,
        daily_avg DECIMAL(18,4), daily_max DECIMAL(18,4), daily_min DECIMAL(18,4),
        total_samples INT,
        INDEX idx_date(`date`), INDEX idx_host(hostid)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""")
conn.commit()

def load_table(filepath, table, cols):
    count = 0
    ph = ",".join(["%s"] * len(cols))
    cl = ",".join(f"`{c}`" for c in cols)
    sql = f"INSERT INTO {table} ({cl}) VALUES ({ph})"
    with conn.cursor() as c:
        with open(filepath, 'r', encoding='utf-8') as f:
            for row in csv.DictReader(f):
                vals = []
                for col in cols:
                    v = row[col]
                    # strip timezone from datetime strings (MySQL doesn't accept +0800)
                    if col in ("hour_start", "date") and "+" in v:
                        v = v.split("+")[0].strip()
                    vals.append(v)
                c.execute(sql, vals)
                count += 1
                if count % 2000 == 0:
                    conn.commit()
                    print(f"  {table}: {count} rows")
    conn.commit()
    print(f"{table}: {count} rows done")

hr_cols = ["hour_start","hostid","hostname","mod","type","unit","sample_count","avg_value","max_value","min_value"]
load_table(DATA / "3_hourly" / "3_hourly_summary.csv", "hourly_summary", hr_cols)

dy_cols = ["date","hostid","hostname","mod","type","unit","hour_count","daily_avg","daily_max","daily_min","total_samples"]
load_table(DATA / "3_hourly" / "3_daily_summary.csv", "daily_summary", dy_cols)

with conn.cursor() as c:
    c.execute("SELECT COUNT(*) cnt, COUNT(DISTINCT hostid) hosts FROM hourly_summary")
    r = c.fetchone()
    print(f"Total: {r[0]} rows, {r[1]} hosts")
conn.close()
print("Done.")
