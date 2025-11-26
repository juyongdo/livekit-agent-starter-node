module.exports = {
  apps: [
    {
      name: "livekit-agent",
      cwd: "/home/ubuntu/livekit/agent",   // ★ ensure correct working dir
      script: "pnpm",
      args: "run start",
      interpreter: "none",                 // ★ run pnpm directly (correct)

      // ---------- Critical fixes ----------
      instances: 1,                        // 1 = cluster mode (eliminates fork_mode IPC zombie bug)
      exec_mode: 'cluster',                // resilient on ARM + Node 22 (vs 'fork' mode)

      // ---------- Memory ----------
      node_args: '--max-old-space-size=256', //Heapsize = 256MB
      max_memory_restart: "500M",          // Optional: protect EC2 instance from runaway memory


      // ---------- Logging ----------
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',         // human-readable timestamps
      error_file: '/home/ubuntu/.pm2/logs/livekit-agent-error.log',
      out_file: '/home/ubuntu/.pm2/logs/livekit-agent-out.log',
      log_type: 'json',                    // optional: easier parsing / CloudWatch
      merge_logs: true,

      // ---------- Reliability ----------
      autorestart: true,
      watch: false,
      max_restarts: 10,                    // avoid infinite crash loops
      min_uptime: '30s',
      restart_delay: 5000,                 // wait 5 sec before restarting

      // ---------- Environment ----------
      env: {
        NODE_ENV: 'production',
      },

      // ---------- Nice to have ----------
      time: true,                         // prefixes logs with timestamp (even without log_date_format)
      kill_timeout: 10000,

      // ---------- Healthcheck ----------
      // healthcheck: {
      //   script: "node check-agent-health.js",
      //   interval: 60000,  // run every 30 sec
      //   timeout: 5000     // fail if hangs >5 sec
      // },
    }
  ]
};

///////////////////////
// NOTE: How to apply the new config
// pm2 delete livekit - agent--silent || true     # remove old version if exists
// pm2 start ecosystem.config.js                 # start with the new config
// pm2 save                                      # persist across reboots
// pm2 startup                                   #(re - run if it asks you to)