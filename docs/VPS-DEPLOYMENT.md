# VPS Deployment Guide

This document contains information about the production VPS server for Bilråd.se.

## Server Information

### Connection Details
- **IP Address**: `78.109.17.5`
- **Operating System**: Ubuntu 24.04.3 LTS (Noble Numbat)
- **Hostname**: Bilrad
- **SSH User**: root
- **SSH Key**: `~/.ssh/id_ed25519`

### SSH Connection
```bash
# Connect to VPS server
ssh root@78.109.17.5

# Or with explicit key path
ssh -i ~/.ssh/id_ed25519 root@78.109.17.5
```

### Server Specifications
- **Architecture**: x86_64 (64-bit)
- **Kernel**: Linux 6.8.0-41-generic
- **Location**: TBD

## Prerequisites for Deployment

Before deploying, ensure you have:
1. SSH access configured with the ED25519 key
2. Root access to the server
3. GitHub repository access for cloning the project

## Security Notes

⚠️ **Important Security Information**:
- The SSH private key (`~/.ssh/id_ed25519`) should NEVER be committed to version control
- Keep root access restricted to authorized users only
- This documentation should not contain passwords or private keys
- Consider setting up a non-root user for deployment operations

## Installed Software

**Installation Date**: 2026-01-02

### Production Stack

| Software | Installed Version | Status | Project Requirement |
|----------|------------------|--------|--------------------|
| **Node.js** | 20.19.6 | ✅ Running | >=20.9.0 |
| **pnpm** | 10.27.0 | ✅ Ready | ^9 \|\| ^10 |
| **MongoDB** | 8.0.17 | ✅ Running | 8.x |
| **Nginx** | 1.24.0 (Ubuntu) | ✅ Installed | Latest |
| **PM2** | 6.0.14 | ✅ Ready | Latest |
| **npm** | 10.8.2 | ✅ Ready | (bundled) |

### Build Tools & Dependencies
- **build-essential**: gcc, g++, make
- **Python**: 3.x (for node-gyp)
- **Git**: Latest (for repository cloning)
- **curl & wget**: For downloads

### Service Status
```bash
# Check service status
ssh root@78.109.17.5 "systemctl status mongod nginx"
```

### System Notes
- ⚠️ **Pending Kernel Upgrade**: Kernel 6.8.0-90-generic available (currently running 6.8.0-41-generic)
- Reboot recommended after initial setup complete
- All installed versions match project requirements in `package.json`

### To Be Installed
- **certbot**: For SSL/TLS certificates (Let's Encrypt) - pending domain DNS setup

### Firewall Configuration
- Port 22: SSH (secured)
- Port 80: HTTP (redirect to HTTPS)
- Port 443: HTTPS (main application)
- Port 27017: MongoDB (localhost only)

## Deployment Status

**Current Status**: Base software stack installed and configured

### Completed Steps
- ✅ Ubuntu 24.04.3 LTS installed
- ✅ SSH access configured
- ✅ Server hostname set to "Bilrad"
- ✅ System updates and security patches applied (2026-01-02)
- ✅ Node.js 20.19.6 installed
- ✅ pnpm 10.27.0 installed
- ✅ MongoDB 8.0.17 installed and running
- ✅ Nginx 1.24.0 installed
- ✅ PM2 6.0.14 installed
- ✅ Build tools installed (gcc, g++, python3, git)

### Pending Steps
- ⏳ Application deployment
- ⏳ SSL certificate setup (Let's Encrypt)
- ⏳ Nginx reverse proxy configuration
- ⏳ Firewall configuration (ufw)
- ⏳ Production environment variables
- ⏳ PM2 startup configuration
- ⏳ Automated deployment pipeline

## Useful Commands

### Check Server Status
```bash
# Check OS version
ssh root@78.109.17.5 "cat /etc/os-release"

# Check system resources
ssh root@78.109.17.5 "free -h && df -h"

# Check running services
ssh root@78.109.17.5 "systemctl list-units --type=service --state=running"
```

### Server Maintenance
```bash
# Update system packages
ssh root@78.109.17.5 "apt update && apt upgrade -y"

# Restart server
ssh root@78.109.17.5 "reboot"

# Check server uptime
ssh root@78.109.17.5 "uptime"
```

## Production Environment Variables

The VPS will need these environment variables configured:

```bash
DATABASE_URI=mongodb://localhost:27017/bilrad
PAYLOAD_SECRET=<strong-production-secret>
NEXT_PUBLIC_SERVER_URL=https://bilråd.se
CRON_SECRET=<production-cron-secret>
PREVIEW_SECRET=<production-preview-secret>
API_KEY=<production-api-key>
NODE_ENV=production
```

⚠️ **Never commit actual production secrets to version control!**

## Backup Strategy

**Database Backups**:
```bash
# Create MongoDB backup
mongodump --db=bilrad --out=/backups/$(date +%Y%m%d)

# Restore MongoDB backup
mongorestore --db=bilrad /backups/20260102/bilrad/
```

**Application Backups**:
- Source code: Git repository (GitHub)
- User uploads: `/var/www/bilrad/public/media/`
- Configuration: `/var/www/bilrad/.env`

## Monitoring and Logs

**Application Logs**:
```bash
# PM2 logs
pm2 logs bilrad

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# System logs
journalctl -u bilrad -f
```

## Support and Maintenance

For deployment issues or server maintenance:
1. Check application logs via PM2
2. Verify Nginx configuration
3. Check MongoDB status
4. Review system logs
5. Ensure firewall rules are correct

---

**Last Updated**: 2026-01-02  
**Server Provider**: TBD  
**Managed By**: Project Team
