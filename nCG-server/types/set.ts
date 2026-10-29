import { instance } from "../persistance/persistance.ts";
import { loadSetFromScryfall, setExistsOfficially } from "../web/index.ts";
import { Entity } from "./entity.ts";

export const sets:Map<string, Set> = new Map<string, Set>();
export function setExists(code:string):boolean {
    return sets.has(code)
}

export class Set extends Entity {
  /**
   * english set name, like "Dragons of Tarkir"
   */
  name: string = "NOT FILLED YET";
  /**
   * set code, like "DTK"
   */ 
  code: string;

  constructor(code:string, id?:string) {
    super(id);
    this.code = code;
  }

  persist() {
    return instance.storeSet(this.code, this);
  }
}

/**
 * custom set, created using magicseteditor or through other means
 */
export class CustomSet extends Set  {
  /**
   * author of the custom set
   */
  author: string = "NOT FILLED YET";
  /**
   * copyright text
   */
  copyright: string = "NOT FILLED YET";
  /**
   * mse-set content
   */
  content: string = "NOT FILLED YET";
}

export class OfficialSet extends Set {
  scryfallUri: string = "NOT LOADED YET";
  uri: string = "NOT LOADED YET";
  searchUri: string = "NOT LOADED YET";
  cardCount: number = -1;
  printSize: number = -1;
}

export async function from(code:string):Promise<Set> {
    if (setExists(code)) { // Set found in list of existing sets; no web call needed
        // fallback object will never be used, since setExsistsCustom is checked
        return sets.get(code) ?? new Set("NUM");
    } else if (await setExistsOfficially(code)) { // See if official/custom; if official load from scryfall
        return (await loadSetFromScryfall(code)).persist();
    } else { // Set not official and not in local list; create new custom set
        return (new CustomSet(code)).persist();
    }
}