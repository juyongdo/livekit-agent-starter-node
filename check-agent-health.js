const fs = require('fs');

const LOG = '/home/ubuntu/.pm2/logs/livekit-agent-error.log';

try {
  const content = fs.readFileSync(LOG, 'utf8');
  if (content.includes('ERR_IPC_CHANNEL_CLOSED') ||
    content.includes('job process exited unexpectedly')) {

    console.error("[HEALTHCHECK] LiveKit Agent unhealthy. Requesting PM2 restart.");
    process.exit(1);   // PM2 treats exit code 1 as "unhealthy"
  }

  process.exit(0);
} catch (e) {
  console.error("[HEALTHCHECK] Failed to read logs");
  process.exit(1);
}