import { exec } from "child_process";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { APIEndpointEnum } from "./enum.js";

const baseUrl = "https://api.protonvpn.ch";

const rl = readline.createInterface({ input, output });

async function getCountryList() {
  return fetch(baseUrl + APIEndpointEnum.COUNTRIES)
    .then((response) => response.json())
    .then((json) => {
      return json.Countries.find(
        (obj) => obj.MaxTier === 2
      ).CountryCodes.sort();
    });
}

async function getServers(inCountry, outCountry) {
  const params = new URLSearchParams({
    ...(inCountry && { EntryCountry: inCountry }),
    ...(outCountry && { ExitCountry: outCountry }),
  });

  const urlParams = params.toString() ? "?" + params.toString() : "";

  const url = `${baseUrl}${APIEndpointEnum.LOGICALS}${urlParams}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("problem when fetching servers");
  }
  const data = await res.json();
  return data.LogicalServers;
}

async function getCountryServers(inCountry = "FR", outCountry = "FR") {
  return getServers(inCountry, outCountry).then((servers) => {
    return servers.filter(
      (server) =>
        !server.Domain.includes("tor") &&
        server.Tier === 2 &&
        server.Features >= 8
    );
  });
}

function sortServers(servers) {
  return servers.sort((a, b) => a.Load - b.Load);
}

async function changeServer() {
  // Ask for country
  const listCountryCodes = await getCountryList();
  console.log("list of country codes:", listCountryCodes);
  let country = await rl.question("Country to connect to? ");
  if (!country) {
    country = "FR";
  }
  country = country.toUpperCase();
  if (!listCountryCodes.includes(country)) {
    throw new Error("Country not available");
  }
  console.log(`You chose to connect to ${country}`);

  let protocol = await rl.question(
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
    netShield = await rl.question(
      "Do you want to enable ProtonVpn ad blocker (NetShield) (default No) ? \nNo (0)\nAnti-malware filtering (1)\nAd-blocking filtering (2)\n:: "
    );
    if (!netShield) {
      netShield = "0";
    }
    if (!["0", "1", "2"].includes(netShield)) {
      throw new Error("Enter 0, 1 or 2");
    }
  }

  const countryServers = await getCountryServers(country, country);
  const sortedServers = sortServers(countryServers);
  const reduceServers = sortedServers.reduce(
    (acc, server) =>
      acc.concat({
        name: server?.Name,
        domain: server?.Domain,
        entryIp: server?.Servers[0].EntryIP,
        exitIp: server?.Servers[0].ExitIP,
        label: server?.Servers[0].Label,
        load: server?.Load,
        key: server?.Servers[0].X25519PublicKey.replace("/", "\\/"),
        score: server?.Score,
      }),
    []
  );

  // Display best servers
  const noOfServers = 100;
  console.log(
    `Here are the top${noOfServers} servers for country ${country} ::`
  );
  for (let i = 0; i < Math.min(noOfServers, reduceServers.length); i++) {
    console.log(
      `Server ${i + 1} :: ${reduceServers[i].name} | Entry IP: (${
        reduceServers[i].entryIp
      }) | Exit IP: (${reduceServers[i].exitIp})
      } | ${reduceServers[i].load}% loaded | label: ${reduceServers[i].label}\n`
    );
  }

  const serverNumber = await rl.question(
    `Which server do you want to connect to? (type a number between 1 and ${noOfServers} :: `
  );
  console.log(
    `VPN will connect to server ${reduceServers[serverNumber - 1].name} (ip: ${
      reduceServers[serverNumber - 1].entryIp
    })`
  );
  rl.close();

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
