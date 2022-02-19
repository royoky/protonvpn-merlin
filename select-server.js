const fetch = require("node-fetch");
const { exec } = require("child_process");
const readline = require("readline/promises").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const api = "https://api.protonmail.ch/vpn/logicals";

let serverList;

const getServers = () => {
  return fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      serverList = data.LogicalServers;
      return serverList;
    })
    .catch((err) => console.log(err));
};

const getCountryServers = (country = "FR") => {
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
};

const sortServers = (servers) => {
  return servers.sort((a, b) => a.Load - b.Load);
};

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

const getCountryList = () => {
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
};

const changeServer = async () => {
  // Ask for country
  let country = await readline.question("Country to connect to? ");
  if (!country) {
    country = "FR";
  }
  if (!listCountryCodes.includes(country)) {
    throw new Error("Country not available");
  }
  console.log(`You chose to connect to ${country}`);

  const countryServers = await getCountryServers(country);
  const sortedServers = sortServers(countryServers);
  const reduceServers = sortedServers.reduce(
    (acc, server) =>
      acc.concat({
        name: server.Name,
        domain: server.Domain,
        ip: server.Servers[0].EntryIP,
        load: server.Load,
      }),
    []
  );

  // Display top best servers
  console.log(`Here are the top10 best servers for country ${country} ::`);
  for (let i = 0; i < 10; i++) {
    console.log(
      `Server ${i + 1} :: ${reduceServers[i].name} (${reduceServers[i].ip})`
    );
  }

  const serverNumber = await readline.question(
    "Which server do you want to connect to? (type a number between 1 and 10 :: "
  );
  console.log(
    `VPN will connect to server ${reduceServers[serverNumber - 1].name} (ip: ${
      reduceServers[serverNumber - 1].ip
    })`
  );
  readline.close();

  exec(
    `./create-ssh-script.sh ${reduceServers[serverNumber - 1].ip} ${reduceServers[serverNumber - 1].name.replace("#", "")}`,
    (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    }
  );
};
/* return getCountryList()
  .then(list => {
    list.sort();
    console.log(list);
  }); */

changeServer();
