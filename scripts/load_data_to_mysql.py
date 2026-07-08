import csv
import os
from pathlib import Path

import pymysql

# ── Configuration ──────────────────────────────────────────
DB_HOST = os.environ.get('DB_HOST', '127.0.0.1')
DB_PORT = int(os.environ.get('DB_PORT', '3306'))
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'root')
DB_NAME = os.environ.get('DB_NAME', 'datascreen')

# Path to the D3 processed data directory
DATA_DIR = Path(__file__).resolve().parent.parent / '..' / 'homeworks' / 'D3'


def create_database(conn: pymysql.Connection):
    with conn.cursor() as cursor:
        cursor.execute(
            f'CREATE DATABASE IF NOT EXISTS {DB_NAME} '
            f'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
        )
    conn.commit()


def create_tables(conn: pymysql.Connection):
    statements = [
        """
        CREATE TABLE IF NOT EXISTS hourly_summary (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hour_start DATETIME NOT NULL,
            hostid VARCHAR(16) NOT NULL,
            hostname VARCHAR(64) NOT NULL,
            mod VARCHAR(32) NOT NULL,
            type VARCHAR(8) NOT NULL,
            unit VARCHAR(8) NOT NULL,
            sample_count INT NOT NULL,
            avg_value DECIMAL(18, 4) NOT NULL,
            max_value DECIMAL(18, 4) NOT NULL,
            min_value DECIMAL(18, 4) NOT NULL,
            INDEX idx_hour (hour_start),
            INDEX idx_host (hostid),
            INDEX idx_mod (mod),
            INDEX idx_host_mod (hostid, mod)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS daily_summary (
            id INT AUTO_INCREMENT PRIMARY KEY,
            date DATE NOT NULL,
            hostid VARCHAR(16) NOT NULL,
            hostname VARCHAR(64) NOT NULL,
            mod VARCHAR(32) NOT NULL,
            type VARCHAR(8) NOT NULL,
            unit VARCHAR(8) NOT NULL,
            hour_count INT NOT NULL,
            daily_avg DECIMAL(18, 4) NOT NULL,
            daily_max DECIMAL(18, 4) NOT NULL,
            daily_min DECIMAL(18, 4) NOT NULL,
            total_samples INT NOT NULL,
            INDEX idx_date (date),
            INDEX idx_host (hostid),
            INDEX idx_mod (mod)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
    ]
    with conn.cursor() as cursor:
        for stmt in statements:
            cursor.execute(stmt)
    conn.commit()


def load_csv(conn: pymysql.Connection, filepath: Path, table: str, columns: list[str]) -> int:
    if not filepath.exists():
        print(f'Warning: {filepath} not found, skipped.')
        return 0

    placeholders = ', '.join(['%s'] * len(columns))
    cols = ', '.join(columns)
    sql = f'INSERT INTO {table} ({cols}) VALUES ({placeholders})'

    count = 0
    with conn.cursor() as cursor:
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                values = [row[col] for col in columns]
                cursor.execute(sql, values)
                count += 1
                if count % 1000 == 0:
                    conn.commit()
                    print(f'  inserted {count} rows into {table}')
    conn.commit()
    print(f'Total inserted {count} rows into {table}')
    return count


def main():
    print(f'Connecting to MySQL {DB_HOST}:{DB_PORT} ...')
    conn = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor,
    )

    create_database(conn)
    conn.select_db(DB_NAME)
    create_tables(conn)

    print(f'Loading data from {DATA_DIR} ...')

    load_csv(
        conn,
        DATA_DIR / '3_hourly' / '3_hourly_summary.csv',
        'hourly_summary',
        ['hour_start', 'hostid', 'hostname', 'mod', 'type', 'unit', 'sample_count', 'avg_value', 'max_value', 'min_value'],
    )

    load_csv(
        conn,
        DATA_DIR / '3_hourly' / '3_daily_summary.csv',
        'daily_summary',
        ['date', 'hostid', 'hostname', 'mod', 'type', 'unit', 'hour_count', 'daily_avg', 'daily_max', 'daily_min', 'total_samples'],
    )

    conn.close()
    print('Done.')


if __name__ == '__main__':
    main()
