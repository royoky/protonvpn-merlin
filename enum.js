const APIEndpointEnum = Object.freeze({
  LOGICALS: "/vpn/logicals",
  LOADS: "/vpn/loads",
  CLIENT_CONFIG: "/vpn/clientconfig",
  STREAMING_SERVICES: "/vpn/streamingservices",
  NOTIFICATIONS: "/core/v4/notifications",
  LOCATION: "/vpn/location",
  SESSIONS: "/vpn/sessions",
  COUNTRIES: "/vpn/countries",
});

const ProtocolEnum = Object.freeze({
  TCP: "tcp",
  UDP: "udp",
  IKEV2: "ikev2",
  WIREGUARD: "wireguard",
});

const ProtocolPortEnum = Object.freeze({
  TCP: 443,
  UDP: 1194,
});

const FeatureEnum = Object.freeze({
  NORMAL: 0, // 0
  SECURE_CORE: 1 << 0, // 1
  TOR: 1 << 1, // 2
  P2P: 1 << 2, // 4
  STREAMING: 1 << 3, // 8
  IPv6: 1 << 4, // 16
});

// @constmethod
// def list(cls):
//     return list(map(lambda feature: feature, cls))

const ServerTierEnum = Object.freeze({
  FREE: 0,
  BASIC: 1,
  // # PLUS : 2,
  // # VISIONARY : 2,
  PLUS_VISIONARY: 2,
  PM: 3,
});

const UserTierEnum = Object.freeze({
  FREE: 0,
  BASIC: 1,
  PLUS_VISIONARY: 2,
  PM: 3,
});

/* const LastConnectionMetadataEnum = {
  SERVER: ConnectionMetadataEnum.SERVER.value,
  PROTOCOL: ConnectionMetadataEnum.PROTOCOL.value,
  SERVER_IP: "last_connect_ip",
  DISPLAY_SERVER_IP: ConnectionMetadataEnum.DISPLAY_SERVER_IP.value,
}; */

const ClientSuffixEnum = Object.freeze({
  PLATFORM: "pl",
  NETSHIELD: "f1",
  NETSHIELD_ADS_TRACKING: "f2",
  NETSHIELD_NA: "f3",
  RANDOMAZIED_NAT: "nr",
});

const NetshieldStatusEnum = Object.freeze({
  DISABLED: "f0",
  MALWARE: ClientSuffixEnum.NETSHIELD.value,
  ADS_MALWARE: ClientSuffixEnum.NETSHIELD_ADS_TRACKING.value,
});

const SecureCoreStatusEnum = Object.freeze({
  OFF: 0,
  ON: 1,
});

const NetshieldTranslationEnum = Object.freeze({
  DISABLED: 0,
  MALWARE: 1,
  ADS_MALWARE: 2,
});

const UserSettingConnectionEnum = Object.freeze({
  DEFAULT_PROTOCOL: "default_protocol",
  KILLSWITCH: "killswitch",
  DNS: "dns",
  DNS_STATUS: "dns_status",
  CUSTOM_DNS: "custom_dns",
  SPLIT_TUNNELING: "split_tunneling",
  SPLIT_TUNNELING_STATUS: "split_tunneling_status",
  IP_LIST: "ip_list",
  NETSHIELD: "netshield",
  SECURE_CORE: "secure_core",
  VPN_ACCELERATOR: "vpn_accelerator",
  ALTERNATIVE_ROUTING: "alternative_routing",
  EVENT_NOTIFICATION: "event_notification",
  MODERATE_NAT: "moderate_nat",
  NON_STANDARD_PORTS: "non_standard_ports",
});

const ProtonSessionAPIMethodEnum = Object.freeze({
  API_REQUEST: "api_request",
  AUTHENTICATE: "authenticate",
  LOGOUT: "logout",
  FULL_CACHE: "logicals",
  LOADS_CACHE: "loads",
});

const ConnectionTypeEnum = Object.freeze({
  FREE: 0,
  SERVERNAME: 1,
  FASTEST: 2,
  RANDOM: 3,
  COUNTRY: 4,
  SECURE_CORE: 5,
  PEER2PEER: 6,
  TOR: 7,
});

const ConnectionStatusEnum = Object.freeze({});
SERVER_INFORMATION: "server_information";
PROTOCOL: "protocol";
TIME: "time";
KILLSWITCH: "killswitch";
NETSHIELD: "netshield";
SERVER_IP: "server_ip";

const DisplayUserSettingsEnum = Object.freeze({});
PROTOCOL: 0;
KILLSWITCH: 1;
DNS: 2;
CUSTOM_DNS: 3;
NETSHIELD: 4;
VPN_ACCELERATOR: 5;
ALT_ROUTING: 6;
MODERATE_NAT: 7;
NON_STANDARD_PORTS: 8;

const KillSwitchInterfaceTrackerEnum = Object.freeze({});
EXISTS: 0;
IS_RUNNING: 1;

const KillSwitchActionEnum = Object.freeze({
  PRE_CONNECTION: "pre_connection",
  POST_CONNECTION: "post_connection",
  SOFT: "soft_connection",
  ENABLE: "enable",
  DISABLE: "disable",
});

const DaemonReconnectorEnum = Object.freeze({});
STOP: "stop";
START: "start";
DAEMON_RELOAD: "daemon-reload";

const ConnectionStartStatusEnum = Object.freeze({});
STATE: "state";
REASON: "reason";
MESSAGE: "message";

const VPNConnectionStateEnum = Object.freeze({
  /* NMVpnConnectionState(int)
    
    0 (UNKNOWN): The state of the VPN connection is unknown.
    1 (PREPARING_TO_CONNECT): The VPN connection is preparing to connect.
    2 (NEEDS_CREDENTIALS): The VPN connection needs authorization credentials.
    3 (BEING_ESTABLISHED): The VPN connection is being established.
    4 (GETTING_IP_ADDRESS): The VPN connection is getting an IP address.
    5 (IS_ACTIVE): The VPN connection is active.
    6 (FAILED): The VPN connection failed.
    7 (DISCONNECTED): The VPN connection is disconnected.
    999 (UNKNOWN_ERROR): Custom error */

  UNKNOWN: 0,
  PREPARING_TO_CONNECT: 1,
  NEEDS_CREDENTIALS: 2,
  BEING_ESTABLISHED: 3,
  GETTING_IP_ADDRESS: 4,
  IS_ACTIVE: 5,
  FAILED: 6,
  DISCONNECTED: 7,
  UNKNOWN_ERROR: 999,
});

const VPNConnectionReasonEnum = Object.freeze({
  /* NMActiveConnectionStateReason(int)

    0 (UNKNOWN):  The reason for the active connection state change
            is unknown.
    1 (NOT_PROVIDED):  No reason was given for the
        active connection state change.
    2 (USER_HAS_DISCONNECTED):  The active connection changed state because
        the user disconnected it.
    3 (DEVICE_WAS_DISCONNECTED):  The active connection changed state because
        the device it was using was disconnected.
    4 (SERVICE_PROVIDER_WAS_STOPPED):  The service providing the
        VPN connection was stopped.
    5 (IP_CONFIG_WAS_INVALID):  The IP config of the active
        connection was invalid.
    6 (CONN_ATTEMPT_TO_SERVICE_TIMED_OUT):  The connection attempt
        to the VPN service timed out.
    7 (TIMEOUT_WHILE_STARTING_VPN_SERVICE_PROVIDER):  A timeout occurred while
        starting the service providing the VPN connection.
    8 (START_SERVICE_VPN_CONN_SERVICE_FAILED):  Starting the service
        providing the VPN connection failed.
    9 (SECRETS_WERE_NOT_PROVIDED):  Necessary secrets for the connection
        were not provided.
    10 (SERVER_AUTH_FAILED): Authentication to the server failed.
    11 (DELETED_FROM_SETTINGS): The connection was deleted from settings.
    12 (MASTER_CONN_FAILED_TO_ACTIVATE): Master connection of this
        connection failed to activate.
    13 (CREATE_SOFTWARE_DEVICE_LINK_FAILED): Could not create
        the software device link.
    14 (VPN_DEVICE_DISAPPEARED): The device this connection
        depended on disappeared.
    999 (UNKNOWN_ERROR): Custom error */
  UNKNOWN: 0,
  NOT_PROVIDED: 1,
  USER_HAS_DISCONNECTED: 2,
  DEVICE_WAS_DISCONNECTED: 3,
  SERVICE_PROVIDER_WAS_STOPPED: 4,
  IP_CONFIG_WAS_INVALID: 5,
  CONN_ATTEMPT_TO_SERVICE_TIMED_OUT: 6,
  TIMEOUT_WHILE_STARTING_VPN_SERVICE_PROVIDER: 7,
  START_SERVICE_VPN_CONN_SERVICE_FAILED: 8,
  SECRETS_WERE_NOT_PROVIDED: 9,
  SERVER_AUTH_FAILED: 10,
  DELETED_FROM_SETTINGS: 11,
  MASTER_CONN_FAILED_TO_ACTIVATE: 12,
  CREATE_SOFTWARE_DEVICE_LINK_FAILED: 13,
  VPN_DEVICE_DISAPPEARED: 14,
  UNKNOWN_ERROR: 999,
});

export { APIEndpointEnum };
