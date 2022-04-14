const fetch = require("node-fetch");
const { exec } = require("child_process");
const readline = require("readline/promises").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const api = "https://api.protonvpn.ch/vpn/logicals";

let serverList;

function getServers() {
  return fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      serverList = data.LogicalServers;
      return serverList;
    })
    .catch((err) => console.log(err));
}

function getCountryServers(country = "FR") {
  return getServers().then((servers) => {
    return (countryServers = servers.filter(
      (server) =>
        server.EntryCountry === country &&
        server.ExitCountry === country &&
        !server.Domain.includes("tor") &&
        server.Tier === 2 &&
        server.Features === 8
    ));
  });
}

function sortServers(servers) {
  return servers.sort((a, b) => a.Score - b.Score);
}

let countryChosen;
let listCountryCodes = [
  "AE",
  "AR",
  "AT",
  "AU",
  "BE",
  "BG",
  "BR",
  "CA",
  "CH",
  "CL",
  "CO",
  "CR",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "EG",
  "ES",
  "FI",
  "FR",
  "GR",
  "HK",
  "HU",
  "IE",
  "IL",
  "IN",
  "IS",
  "IT",
  "JP",
  "KH",
  "KR",
  "LT",
  "LU",
  "LV",
  "MD",
  "MX",
  "MY",
  "NG",
  "NL",
  "NO",
  "NZ",
  "PE",
  "PH",
  "PL",
  "PT",
  "RO",
  "RS",
  "RU",
  "SE",
  "SG",
  "SI",
  "SK",
  "TR",
  "TW",
  "UA",
  "UK",
  "US",
  "VN",
  "ZA",
];

function getCountryList() {
  return getServers().then((servers) => {
    return servers.reduce((acc, curr, idx) => {
      if (idx === 0) {
        acc.push(curr.EntryCountry);
      } else if (
        curr.EntryCountry === curr.ExitCountry &&
        !acc.includes(curr.EntryCountry)
      ) {
        acc.push(curr.EntryCountry);
      }
      return acc;
    }, []);
  });
}

async function changeServer() {
  // Ask for country
  let country = await readline.question("Country to connect to? ");
  if (!country) {
    country = "FR";
  }
  country = country.toUpperCase();
  if (!listCountryCodes.includes(country)) {
    throw new Error("Country not available");
  }
  console.log(`You chose to connect to ${country}`);

  let protocol = await readline.question(
    "Which protocol: OpenVpn (1) or Wireguard (2) (default (1)) ? :: "
  );
  if (!protocol) {
    protocol = "1";
  }
  if (!["1", "2"].includes(protocol)) {
    throw new Error("Enter 1 or 2");
  }
  console.log(
    `Using ${protocol === "1" ? "OpenVpn" : "Wireguard"} protocol ...`
  );

  let netShield = "0";
  if (protocol === "1") {
    netShield = await readline.question(
      "Do you want to enable ProtonVpn ad blocker (NetShield) (default No) ? \nNo (0)\nAnti-malware filtering (1)\nAd-blocking filtering (2)\n:: "
    );
    if (!netShield) {
      netShield = "0";
    }
    if (!["0", "1", "2"].includes(netShield)) {
      throw new Error("Enter 0, 1 or 2");
    }
  }

  const countryServers = await getCountryServers(country);
  const sortedServers = sortServers(countryServers);
  const reduceServers = sortedServers.reduce(
    (acc, server) =>
      acc.concat({
        name: server.Name,
        domain: server.Domain,
        entryIp: server.Servers[0].EntryIP,
        exitIp: server.Servers[0].ExitIP,
        label: server.Servers[0].Label,
        load: server.Load,
        key: server.Servers[0].X25519PublicKey,
        score: server.Score,
      }),
    []
  );

  // Display best servers
  const noOfServers = 25;
  console.log(
    `Here are the top${noOfServers} servers for country ${country} ::`
  );
  for (let i = 0; i < noOfServers; i++) {
    console.log(
      `Server ${i + 1} :: ${reduceServers[i].name} | Entry IP: (${
        reduceServers[i].entryIp
      }) | Exit IP: (${reduceServers[i].exitIp})| Public Key: ${
        reduceServers[i].key
      } | ${reduceServers[i].load}% loaded | label: ${reduceServers[i].label}`
    );
  }

  const serverNumber = await readline.question(
    `Which server do you want to connect to? (type a number between 1 and ${noOfServers} :: `
  );
  console.log(
    `VPN will connect to server ${reduceServers[serverNumber - 1].name} (ip: ${
      reduceServers[serverNumber - 1].entryIp
    })`
  );
  readline.close();

  let command = "";
  if (protocol === "1") {
    command = `./create-ssh-script-ovpn.sh ${
      reduceServers[serverNumber - 1].entryIp
    } ${reduceServers[serverNumber - 1].name.replace("#", "")} ${netShield} ${
      reduceServers[serverNumber - 1].label
    }`;
  } else {
    if (reduceServers[serverNumber - 1].key.includes("/")) {
      reduceServers[serverNumber - 1].key.replace("/", "/");
    }
    command = `./create-ssh-script-wg.sh ${reduceServers[
      serverNumber - 1
    ].name.replace("#", "")} ${reduceServers[serverNumber - 1].entryIp} ${
      reduceServers[serverNumber - 1].key
    }`;
  }
  exec(command, (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
}
/* return getCountryList()
  .then(list => {
    list.sort();
    console.log(list);
  }); */

changeServer();
