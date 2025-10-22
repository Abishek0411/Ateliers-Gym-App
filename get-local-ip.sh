#!/bin/bash

echo "🔍 Finding your local IP address for mobile access..."
echo ""

# Get the local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')

echo "📱 Your local IP address is: $LOCAL_IP"
echo ""
echo "🌐 To access from mobile:"
echo "   Frontend: http://$LOCAL_IP:3000"
echo "   Backend:  http://$LOCAL_IP:3001"
echo ""
echo "📝 Update the CORS configuration in apps/api/src/main.ts"
echo "   Replace the IP addresses with: $LOCAL_IP"
echo ""
echo "🔧 Or run this command to update automatically:"
echo "   sed -i 's/192.168.1.100/$LOCAL_IP/g' apps/api/src/main.ts"
echo "   sed -i 's/192.168.0.100/$LOCAL_IP/g' apps/api/src/main.ts"
echo "   sed -i 's/10.0.0.100/$LOCAL_IP/g' apps/api/src/main.ts"
