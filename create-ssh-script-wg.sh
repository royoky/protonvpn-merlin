#!/bin/sh
echo "updating vpn client ip address ..." >ssh.sh
server="$1"
endPoint="$2"
publicKey="$3"

desc="ProtonVpn "$server
echo "ssh ronan@192.168.50.1 -p 55555 << 'ENDSSH'" >ssh.sh
echo "echo VPN endPoint will be changed to $endPoint" >>ssh.sh
echo "nvram set wgc1_desc='$desc'" >>ssh.sh
echo "nvram set wgc1_ep_addr=$endPoint" >>ssh.sh
echo "nvram set wgc1_ppub=$publicKey" >>ssh.sh
echo "nvram set wgc1_enable=1" >>ssh.sh
echo "nvram commit" >>ssh.sh
echo "service restart_wgc" >>ssh.sh
echo "exit" >>ssh.sh
echo "ENDSSH" >>ssh.sh
chmod +x ssh.sh
sh ssh.sh
