import { pl } from "date-fns/locale";

export interface Player {
  name: string;
  playerId: string;
  dob: Date | null;
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
}

export const savePlayer = (player: Player) => {
  if (!hasStorage) {
    return;
  }

  const json = JSON.stringify(player);

  localStorage.setItem("player", json);
};

export const loadPlayer = (): Player | null => {
  if (!hasStorage) {
    return null;
  }

  const json = localStorage.getItem("player");

  if (!json) {
    return null;
  }

  let data: SerializedPlayer | null;

  try {
    data = JSON.parse(json);
  } catch (e) {
    console.log(e);

    return null;
  }

  if (!data) {
    return null;
  }

  return {
    name: data.name,
    playerId: data.playerId,
    dob: new Date(data.dob),
  };
};
