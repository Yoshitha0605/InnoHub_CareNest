import csv
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'sample_hospital_data.csv')


def _parse_row(row):
    # Convert CSV row strings to typed values
    return {
        'timestamp': row.get('timestamp'),
        'patient_count': int(row.get('patient_count', 0)),
        'beds_available': int(row.get('beds_available', 0)),
        'icu_usage': float(row.get('icu_usage', 0)),
        'staff_count': int(row.get('staff_count', 0)),
        'occupancy_rate': float(row.get('occupancy_rate', 0)),
    }


class Database:
    def __init__(self, csv_path: str = DATA_PATH):
        self.csv_path = csv_path
        self._data = []
        self.load()

    def load(self):
        self._data = []
        if not os.path.exists(self.csv_path):
            return
        with open(self.csv_path, newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    self._data.append(_parse_row(row))
                except Exception:
                    continue

    def list_all(self):
        return list(self._data)

    def get_latest(self):
        if not self._data:
            return None
        return self._data[-1]

    def append(self, record: dict):
        # Append in-memory; persist to CSV for demo
        now = datetime.utcnow().isoformat()
        r = {
            'timestamp': now,
            'patient_count': int(record.get('patient_count', 0)),
            'beds_available': int(record.get('beds_available', 0)),
            'icu_usage': float(record.get('icu_usage', 0)),
            'staff_count': int(record.get('staff_count', 0)),
            'occupancy_rate': float(record.get('occupancy_rate', 0)),
        }
        self._data.append(r)
        # Persist to CSV
        headers = ['timestamp', 'patient_count', 'beds_available', 'icu_usage', 'staff_count', 'occupancy_rate']
        write_header = not os.path.exists(self.csv_path) or os.path.getsize(self.csv_path) == 0
        with open(self.csv_path, 'a', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            if write_header:
                writer.writeheader()
            writer.writerow(r)
        return r


# Singleton DB instance for the app
db = Database()
import sqlite3

# Setup basic SQLite connection
def get_db_connection():
    conn = sqlite3.connect('hospital.db')
    conn.row_factory = sqlite3.Row
    return conn

# Create a sample table (optional)
def create_tables():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS hospital_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_count INTEGER,
            icu_usage REAL,
            beds_available INTEGER,
            staff_count INTEGER
        )
    ''')
    conn.commit()
    conn.close()

# Call create_tables to initialize the database
create_tables()