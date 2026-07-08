import csv, pymysql
from pathlib import Path

DATA = Path(r'D:\about_computer\something_else\summer_intern\project\homeworks\D3')
conn = pymysql.connect(host='127.0.0.1', port=3307, user='root', password='123456', database='datascreen')

# Drop and recreate
with conn.cursor() as c:
    c.execute('DROP TABLE IF EXISTS hourly_summary')
    c.execute("""CREATE TABLE hourly_summary (
        id INT AUTO_INCREMENT PRIMARY KEY, hour_start DATETIME NOT NULL,
        hostid VARCHAR(16), hostname VARCHAR(64), `mod` VARCHAR(32),
        `type` VARCHAR(8), unit VARCHAR(16), sample_count INT,
        avg_value DECIMAL(18,4), max_value DECIMAL(18,4), min_value DECIMAL(18,4),
        INDEX idx_hour(hour_start)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""")
conn.commit()
print("Table created")

# Import data
filepath = DATA / "3_hourly" / "3_hourly_summary.csv"
cols = ["hour_start","hostid","hostname","mod","type","unit","sample_count","avg_value","max_value","min_value"]
ph = ",".join(["%s"] * len(cols))
cl = ",".join(f"`{c}`" for c in cols)
sql = f"INSERT INTO hourly_summary ({cl}) VALUES ({ph})"

count = 0
with conn.cursor() as c:
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            vals = []
            for col in cols:
                v = row[col]
                if col == "hour_start" and "+" in v:
                    v = v.split("+")[0].strip()
                vals.append(v)
            c.execute(sql, vals)
            count += 1
            if count % 5000 == 0:
                conn.commit()
                print(f"  {count} rows")
conn.commit()
print(f"Done: {count} rows imported into hourly_summary")

# Verify
with conn.cursor() as c:
    c.execute("SELECT COUNT(*) cnt, COUNT(DISTINCT hostid) hosts, MIN(hour_start) from_dt, MAX(hour_start) to_dt FROM hourly_summary")
    r = c.fetchone()
    print(f"Total: {r[0]} rows, {r[1]} hosts, {r[2]} ~ {r[3]}")

conn.close()
