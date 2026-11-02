import { Entity } from "./entity.ts";

export type UserSettings = {
    accentColor:string;
}

export const defaultSettings:UserSettings = {
    accentColor: "#ff6699"
}

export default class User extends Entity {
    username:string;
    settings:UserSettings = defaultSettings;
    friends:User[] = [];

    constructor(username:string) {
        super();
        this.username = username;
    }
}