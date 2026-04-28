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