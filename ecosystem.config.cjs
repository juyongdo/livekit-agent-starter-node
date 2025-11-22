module.exports = {
  apps: [
    {
      name: "livekit-agent",
      cwd: "/home/ubuntu/livekit/agent",   // ★ ensure correct working dir
      script: "pnpm",
      args: "run start",
      interpreter: "none",                 // ★ run pnpm directly (correct)
      autorestart: true,
      restart_delay: 5000,                 // wait 5 sec before restarting
      max_restarts: 20,                    // avoid infinite crash loops
      watch: false,

      // Optional: protect EC2 instance from runaway memory
      max_memory_restart: "500M",

      env: {
        NODE_ENV: "production"
      },

      // ★ PM2 healthcheck syntax (official + correct)
      healthcheck: {
        script: "node check-agent-health.js",
        interval: 60000,  // run every 30 sec
        timeout: 5000     // fail if hangs >5 sec
      },

      // ★ Logging
      output: "/home/ubuntu/pm2/logs/livekit-agent-out.log",
      error: "/home/ubuntu/pm2/logs/livekit-agent-error.log"
    }
  ]
};