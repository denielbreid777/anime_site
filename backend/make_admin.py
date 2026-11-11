from sqlalchemy import create_engine, text
import os

# Read .env file
env_vars = {}
with open('.env', 'r') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            key, value = line.strip().split('=', 1)
            env_vars[key] = value

DB_USER = env_vars.get('DB_USER', 'root')
DB_PASSWORD = env_vars.get('DB_PASSWORD', '')
DB_HOST = env_vars.get('DB_HOST', 'localhost')
DB_PORT = env_vars.get('DB_PORT', '3306')
DB_NAME = env_vars.get('DB_NAME', 'anime_db')

engine = create_engine(f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}')

with engine.connect() as conn:
    result = conn.execute(text("UPDATE users SET is_admin = 1 WHERE username = 'DANIEL V SHKYNDIA'"))
    conn.commit()
    print(f'Updated {result.rowcount} rows. User "DANIEL V SHKYNDIA" is now admin.')
