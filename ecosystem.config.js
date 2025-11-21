module.exports = {
  apps: [
    {
      name: "livekit-agent",
      script: "pnpm",
      args: "run start",
      interpreter: "none",
      autorestart: true,
      restart_delay: 5000,
      // Healthcheck runs every 30 seconds
      healthcheck: {
        script: "node check-agent-health.js",
        interval: 30000,
        timeout: 5000
      }
    }
  ]
}