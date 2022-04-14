#!/bin/sh
echo "updating vpn client ip address ..." > ssh.sh
server="$1"
endPoint="$2"
publicKey="$3"

desc="ProtonVpn "$server
echo "ssh ronan@192.168.50.1 -p 55555 << 'ENDSSH'" > ssh.sh
echo 'echo "stopping OpenVpn Client"' >> ssh.sh
echo service stop_vpnclient1 >> ssh.sh
echo "echo VPN endPoint will be changed to $endPoint" >> ssh.sh
echo cd /opt/etc/wireguard.d/ >> ssh.sh
echo "sed -i \"s/Endpoint.*/Endpoint = $endPoint:51820/g\" wg11.conf" >> ssh.sh
echo "sed -i \"s/PublicKey.*/PublicKey = $publicKey/g\" wg11.conf" >> ssh.sh
echo "ENDSSH" >> ssh.sh
chmod +x ssh.sh
# sh ssh.sh
