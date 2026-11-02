import { Entity } from "./entity.ts";
import type User from "./user.ts";

export default class Blog<T extends Entity> extends Entity {
    description:string = "NO DESCRIPTION ENTERED YET";
    entity:T;
    createdOn:Date = new Date();
    createdBy:User;

    constructor(entity:T, createdBy:User) {
        super();
        this.entity = entity;
        this.createdBy = createdBy;
    }
}