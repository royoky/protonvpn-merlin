#!/bin/sh
echo "updating vpn client ip address ..." >ssh.sh
newIp="$1"
server="$2"
netShield="$3"
label="$4"
desc="ProtonVpn "$server
user=""
labelSuffix="+b"$label
netShieldSuffix="+f"$netShield

case "$netShield" in
0)
   echo "NetShield will not be activated"
   ;;
1)
   echo "Anti-malware filtering will be enabled"
   ;;
2)
   echo "Enable ad-blocking filtering"
   ;;
esac

echo "ssh ronan@192.168.50.1 -p 55555 << 'ENDSSH'" >ssh.sh
echo "echo current EntryIP:" >>ssh.sh
echo "nvram get vpn_client1_addr" >>ssh.sh
echo "echo Current VPN EntryIP will be changed to $newIp" >>ssh.sh
echo "nvram set vpn_client1_desc='$desc'" >>ssh.sh
echo "nvram set vpn_client1_addr=$newIp" >>ssh.sh
echo 'export userInit=$(nvram get vpn_client1_username)' >>ssh.sh
echo 'export baseUser=$(echo $userInit | sed 's/+.*//')' >>ssh.sh
echo 'export newUser=$baseUser'$labelSuffix$netShieldSuffix >>ssh.sh
echo 'nvram set vpn_client1_username=$newUser' >>ssh.sh
echo "nvram commit" >>ssh.sh
echo "service restart_vpnclient1" >>ssh.sh
echo "exit" >>ssh.sh
echo "ENDSSH" >>ssh.sh
chmod +x ssh.sh
sh ssh.sh
