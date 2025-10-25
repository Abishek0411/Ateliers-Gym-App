# 📱 Mobile Testing Guide - Atelier's Fitness

This guide will help you test the Atelier's Fitness app on your mobile device over the same WiFi network.

## 🚀 Quick Start

### 1. Start Mobile Testing
```bash
./mobile-testing start
```

### 2. Access on Mobile
- **Frontend**: `http://192.168.0.103:3000`
- **Backend**: `http://192.168.0.103:3001`

### 3. Login with Demo Credentials
- **Admin**: `GYM001` / `password123`
- **Trainer**: `GYM002` / `trainer2024`
- **Member**: `GYM003` / `member123`

## 📋 Prerequisites

### Required Environment Files

**`apps/api/.env`:**
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/atelier
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

**`apps/web/.env.local`:**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
```

### Dependencies
- Node.js 18+
- pnpm 8+
- MongoDB Atlas account
- Cloudinary account

## 🛠️ Mobile Testing Commands

### Basic Commands
```bash
# Start servers for mobile testing
./mobile-testing start

# Check server status
./mobile-testing status

# View server logs
./mobile-testing logs

# Stop servers
./mobile-testing stop

# Restart servers
./mobile-testing restart

# Clean up logs and stop servers
./mobile-testing clean

# Update IP if you changed networks
./mobile-testing update-ip
```

### Manual Commands (Alternative)
```bash
# Start API server
cd apps/api && pnpm start:dev

# Start Web server (in another terminal)
cd apps/web && pnpm dev
```

## 📱 Mobile Access Setup

### 1. Network Requirements
- Both your computer and mobile device must be on the same WiFi network
- Your computer's firewall should allow connections on ports 3000 and 3001

### 2. IP Address Configuration
The script automatically detects your local IP address and updates all configurations. Your current IP is: **192.168.0.103**

### 3. Mobile Device Setup
1. Connect your mobile device to the same WiFi network
2. Open your mobile browser
3. Navigate to: `http://192.168.0.103:3000`
4. The app should load and be fully functional

## 🔄 Network Changes & IP Updates

### Automatic IP Detection
The script automatically detects when you change networks and updates all URLs accordingly.

### When You Switch Networks
If you connect to a different WiFi router:

1. **Run the update command:**
   ```bash
   ./mobile-testing update-ip
   ```

2. **The script will:**
   - Detect your new IP address
   - Update all CORS configurations
   - Update all frontend API URLs
   - Restart servers with new configuration
   - Display new mobile access URLs

### Example Network Change
```bash
# Before switching networks
./mobile-testing status
# Shows: Frontend: http://192.168.0.103:3000

# After switching to different WiFi
./mobile-testing update-ip
# Output:
# 🔄 IP address changed from 192.168.0.103 to 192.168.1.150
# 📝 Updating configuration...
# ✅ Configuration updated for new IP: 192.168.1.150
# 🔄 Restarting servers with new IP...
# ✅ Servers restarted with new IP

# New URLs will be:
# Frontend: http://192.168.1.150:3000
# Backend:  http://192.168.1.150:3001
```

### Manual IP Check
```bash
# Check current IP
./get-local-ip.sh

# Force update with current IP
./mobile-testing update-ip
```

## 🔐 Testing Features

### Authentication Testing
1. **Login Flow**: Test with all three user roles
2. **Profile Completion**: Test the onboarding flow
3. **Session Management**: Test login persistence

### Core Features to Test
1. **Community Posts**
   - Create posts with images/videos
   - Like and comment on posts
   - Test media upload functionality

2. **Attendance Tracking**
   - Check in/out functionality
   - View attendance calendar
   - Test streak tracking

3. **Profile Management**
   - Update profile information
   - Upload avatar images
   - Add body measurements

4. **Challenges** (Admin/Trainer)
   - Create new challenges
   - Manage challenge participants
   - View progress tracking

### Mobile-Specific Testing
1. **Responsive Design**
   - Test on different screen sizes
   - Verify touch interactions
   - Check mobile navigation

2. **Performance**
   - Test loading times
   - Verify image optimization
   - Check smooth scrolling

3. **Media Upload**
   - Test camera integration
   - Verify image/video uploads
   - Check Cloudinary integration

## 🐛 Troubleshooting

### Common Issues

#### 1. Cannot Access from Mobile
**Problem**: Mobile device can't reach the server
**Solutions**:
- Verify both devices are on the same WiFi
- Check firewall settings
- Try accessing `http://192.168.0.103:3000` from your computer first
- Restart the servers: `./mobile-testing restart`

#### 2. CORS Errors
**Problem**: API requests fail with CORS errors
**Solutions**:
- Check if your IP address has changed
- Run `./get-local-ip.sh` to get current IP
- Update CORS configuration in `apps/api/src/main.ts`
- Restart the API server

#### 3. Environment Issues
**Problem**: Database or Cloudinary connection fails
**Solutions**:
- Verify environment files exist and are configured
- Check MongoDB Atlas IP whitelist
- Verify Cloudinary credentials
- Check server logs: `./mobile-testing logs`

#### 4. Port Already in Use
**Problem**: Ports 3000 or 3001 are already in use
**Solutions**:
- Stop existing processes: `./mobile-testing stop`
- Kill processes manually: `pkill -f 'nest start' && pkill -f 'next dev'`
- Check what's using the ports: `lsof -i :3000` and `lsof -i :3001`

### Debug Commands
```bash
# Check server status
./mobile-testing status

# View detailed logs
./mobile-testing logs

# Check if ports are in use
lsof -i :3000
lsof -i :3001

# Test network connectivity
ping 192.168.0.103

# Check firewall status
sudo ufw status
```

## 📊 Testing Checklist

### ✅ Basic Functionality
- [ ] App loads on mobile browser
- [ ] Login with all three user types
- [ ] Profile completion flow
- [ ] Navigation between pages

### ✅ Community Features
- [ ] Create posts with text
- [ ] Upload images to posts
- [ ] Upload videos to posts
- [ ] Like posts
- [ ] Comment on posts
- [ ] View community feed

### ✅ Attendance Tracking
- [ ] Check in functionality
- [ ] Check out functionality
- [ ] View attendance calendar
- [ ] View streak information

### ✅ Profile Management
- [ ] Update profile information
- [ ] Upload profile avatar
- [ ] Add body measurements
- [ ] View profile statistics

### ✅ Admin/Trainer Features
- [ ] Create challenges (Admin/Trainer)
- [ ] Manage challenge participants
- [ ] View user progress
- [ ] Access admin dashboard

### ✅ Mobile Experience
- [ ] Responsive design on mobile
- [ ] Touch interactions work properly
- [ ] Images load correctly
- [ ] Smooth scrolling
- [ ] Mobile navigation

## 🔧 Development Tips

### 1. Hot Reloading
- Changes to the code will automatically reload
- API changes require server restart
- Frontend changes reload automatically

### 2. Debugging
- Use browser developer tools on mobile
- Check server logs for API issues
- Use network tab to debug API calls

### 3. Performance
- Monitor loading times
- Check image optimization
- Verify Cloudinary transformations

## 📱 Mobile Browser Compatibility

### Tested Browsers
- ✅ Chrome Mobile
- ✅ Safari Mobile
- ✅ Firefox Mobile
- ✅ Edge Mobile

### Recommended Settings
- Enable JavaScript
- Allow camera/microphone permissions
- Enable location services (if needed)

## 🚀 Production Considerations

### Security
- CORS is configured for development only
- Update CORS origins for production
- Use HTTPS in production
- Implement proper authentication

### Performance
- Optimize images and videos
- Implement caching strategies
- Use CDN for static assets
- Monitor API response times

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review server logs: `./mobile-testing logs`
3. Verify environment configuration
4. Test network connectivity
5. Restart servers: `./mobile-testing restart`

---

**Happy Testing! 🏋️‍♂️📱**

Remember to test all features thoroughly on your mobile device to ensure the best user experience.
