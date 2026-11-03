import * as fs from 'fs';
import { instance } from "../persistance/persistance.ts";
import { Set, setExists, CustomSet } from "../types/set.ts";
import { setExistsOfficially, loadSetFromScryfall } from "../web/index.ts";
import StreamZip from "node-stream-zip";


export async function setFrom(code: string): Promise<Set> {
  if (setExists(code)) { // Set found in list of existing sets; no web call needed
    return instance.loadSet(code);
  } else if (await setExistsOfficially(code)) { // See if official/custom; if official load from scryfall
    return (await loadSetFromScryfall(code)).persist();
  } else { // Set not official and not in local list; create new custom set
    return (new CustomSet(code)).persist();
  }
}

export async function importSetFromMSE(content:Buffer):Promise<CustomSet> {
  const now:number = Date.now();
  if (!fs.existsSync("temp/")) {
    fs.mkdirSync("temp");
  }
  const fn:string = "temp/unzip" + now + ".zip";
  fs.writeFileSync(fn, content);
  var setData:string = "LOADING";
  var iconData:string = "LOADING";

  const zip:StreamZip = new StreamZip({file: fn});
  var zipReady:boolean = false;
  zip.on('ready', () => {
    setData = zip.entryDataSync("set").toString();
    iconData = zip.entryDataSync("symbol1.mse-symbol").toString();
    zip.close();
    zipReady = true;
  });

  while (!zipReady) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  const code:string = findMSESetStringByKey(setData, "set_code");
  const set:CustomSet = new CustomSet(code);
  set.author = findMSESetStringByKey(setData, "artist");
  set.copyright = findMSESetStringByKey(setData, "copyright");
  set.name = findMSESetStringByKey(setData, "title");
  set.content = setData;
  set.icon = {
    data: iconData,
    type: 'mse-symbol'
  };

  set.persist();
  return set;
}

function findMSESetStringByKey(file:string, key:string):string {
  const lines:string[] = file.split(/\r?\n/);
  for (const line of lines) {
    const trimmedLine:string = line.trim();
    if (trimmedLine.startsWith(key + ":")) {
      return trimmedLine.substring(trimmedLine.indexOf(":") + 1).trim()
    }
  }
  return "NOT FOUND";
}