export interface Player {
  name: string;
  playerId: string;
  dob: Date | null;
  deck: string;
}

var hasStorage = (function () {
  try {
    localStorage.setItem("test", "true");
    const result = localStorage.getItem("test") === "true";
    localStorage.removeItem("test");
    return result;
  } catch (exception) {
    return false;
  }
})();

interface SerializedPlayer {
  name: string;
  playerId: string;
  dob: string;
  deck: string;
}

export const ageDivision = (player: Player) => {
  if (!player.dob) {
    return "Unknown";
  }

  const year = player.dob.getFullYear();

  if (year <= 2011 && year >= 2008) {
    return "Senior";
  }

  if (year <= 2007) {
    return "Master";
  }

  return "Junior";
};

export const savePlayer = (player: Player) => {
  if (!hasStorage) {
    return;
  }

  const json = JSON.stringify(player);

  localStorage.setItem("player", json);
};

export const loadPlayer = (): Player => {
  const emptyPlayer = {
    name: "",
    playerId: "",
    dob: null,
    deck: "",
  };

  if (!hasStorage) {
    return emptyPlayer;
  }

  const json = localStorage.getItem("player");

  if (!json) {
    return emptyPlayer;
  }

  let data: SerializedPlayer | null;

  try {
    data = JSON.parse(json);
  } catch (e) {
    console.log(e);

    return emptyPlayer;
  }

  if (!data) {
    return emptyPlayer;
  }

  return {
    name: data.name,
    playerId: data.playerId,
    dob: new Date(data.dob),
    deck: data.deck,
  };
};
