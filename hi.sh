#!/bin/sh
echo "updating vpn client ip address ..." > ssh.sh
newIp="$1"
server="$2"
desc="ProtonVpn "$server
echo "ssh ronan@192.168.50.1 -p 55555 << EOF" > ssh.sh
echo "echo current IP:" >> ssh.sh
echo nvram get vpn_client1_addr >> ssh.sh
echo "echo Current VPN IP will be changed to $newIp" >> ssh.sh
echo "nvram set vpn_client1_desc='$desc'" >> ssh.sh
echo "nvram set vpn_client1_addr=$newIp" >> ssh.sh
echo "nvram commit" >> ssh.sh
echo "service restart_vpnclient1" >> ssh.sh
echo "exit" >> ssh.sh
echo "EOF" >> ssh.sh
chmod +x ssh.sh
sh ssh.sh
