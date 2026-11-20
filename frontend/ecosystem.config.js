module.exports = {
  apps: [{
    name: 'anime-social-network',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3000',
    cwd: '/var/www/web_anime/frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/www/web_anime/frontend/logs/error.log',
    out_file: '/var/www/web_anime/frontend/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    max_restarts: 10,
    restart_delay: 4000,
    min_uptime: '10s',
    autorestart: true,
    watch: false,
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '500m'
  }]
};