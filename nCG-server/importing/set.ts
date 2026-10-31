import { instance } from "../persistance/persistance.ts";
import { Set, setExists, CustomSet } from "../types/set.ts";
import { setExistsOfficially, loadSetFromScryfall } from "../web/index.ts";


export async function setFrom(code: string): Promise<Set> {
  if (setExists(code)) { // Set found in list of existing sets; no web call needed
    return instance.loadSet(code);
  } else if (await setExistsOfficially(code)) { // See if official/custom; if official load from scryfall
    return (await loadSetFromScryfall(code)).persist();
  } else { // Set not official and not in local list; create new custom set
    return (new CustomSet(code)).persist();
  }
}
