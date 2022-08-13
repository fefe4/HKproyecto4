const ssc = new SSC("https://api.hive-engine.com/rpc");
// ssc.getContractInfo((err, result) => {
// 		console.log(err, result);
// 	});

function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

function sortAvatarsByXP(data) {
  accounts = [];
  for (i in data) {
    if (data[i].properties.XP > 50000) {
      accounts.push(data[i].account);
    }
  }
  accounts = removeDuplicates(accounts);
  return accounts;
}

function sortAvatarsBy100XP(data) {
  accounts = [];
  for (i in data) {
    if (data[i].properties.XP > 100000) {
      accounts.push(data[i].account);
    }
  }
  accounts = removeDuplicates(accounts);
  return accounts;
}

function sortAvatarsByOwners(data) {
  accounts = [];
  for (i in data) {
    accounts.push(data[i].account);
  }
  accounts = removeDuplicates(accounts);
  return accounts;
}

function getOccurrence(array, value) {
  return array.filter((v) => v.account === value).length;
}

function userWithMoreAvatars(data, owners) {
  let avatarsPerUser = [];
  console.log(owners);
  for (i in owners) {
    let occurrences = getOccurrence(data, owners[i]);
    console.log(occurrences);
    avatarsPerUser.push({ Name: `${owners[i]}`, avatars: `${occurrences}` });
  }
  console.log(avatarsPerUser);
  const avatarsPerUserSorted = avatarsPerUser.sort(function (a, b) {
    return b.avatars - a.avatars;
  });
  return avatarsPerUserSorted[0];
}

function avatarWithMostXpa(data) {
  const dataSorted = data.sort(function (a, b) {
    return b.properties.XP - a.properties.XP;
  });
  return dataSorted[0];
}

async function populateAvatarsInfo(avatar) {
  let avatarData = [];
  let i = 0;
  while (avatarData.length % 1000 === 0) {
    const data = await ssc.find(
      "nft",
      "HKFARMinstances",
      { "properties.TYPE": "avatar" },
      1000,
      i,
      [],
      (err, result) => {
        console.log(err, result);
      }
    );
    avatarData = avatarData.concat(data);
    console.log(avatarData.length);
    i = 1000 + i;
    if (data.length<1000) {
    // if (0 === 0) {
      break;
    }
  }

  const owners = sortAvatarsByOwners(avatarData);
  const ownersWith50XP = sortAvatarsByXP(avatarData);
  const ownersWith100XP = sortAvatarsBy100XP(avatarData);
  const ownerWithMostAvatars = userWithMoreAvatars(avatarData, owners);
  const avatarWithMostXP = avatarWithMostXpa(avatarData);

  const tableBody = document.getElementById("tableBody");
  const row = document.createElement("tr");
  const ownersCell = document.createElement("td");
  const ownersWith50XPcell = document.createElement("td");
  const ownersWith100XPcell = document.createElement("td");
  const ownerWithMostAvatarsCell = document.createElement("td");
  const ownerWithMostXPCell = document.createElement("td");

  ownersCell.textContent = owners.length;
  ownersWith50XPcell.textContent = ownersWith50XP.length;
  ownersWith100XPcell.textContent = ownersWith100XP.length;
  ownerWithMostAvatarsCell.textContent = ownerWithMostAvatars.Name;
  ownerWithMostXPCell.textContent = avatarWithMostXP.account;

  row.append(ownersCell);
  row.append(ownersWith50XPcell);
  row.append(ownersWith100XPcell);
  row.append(ownerWithMostAvatarsCell); 
  row.append(ownerWithMostXPCell);
  tableBody.append(row);

}



populateAvatarsInfo();
