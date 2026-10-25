import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';

import {
  getISOString,
  ISOStringSchema,
} from '#src/common/utils/date.utils.ts';

import type { CustomSetEntity, CustomSetInput, OfficialSetEntity, OfficialSetInput, SetEntity, SetInput } from './types.ts';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

/** @ValueFactoryFunction */
const CustomSetDefaults = () => ({
  id: genId(),
  created: getISOString(),
  author: "Unnamed Author",
  copyright: "",
  content: "",
  name: "Unnamed Set",
  code: "UNMD"
});
/** @ValueFactoryFunction */
const OfficialSetDefaults = () => ({
  id: genId(),
  created: getISOString(),
  scryfallUri: "https://scryfall.com/sets/dtk",
  uri: "https://api.scryfall.com/sets/7e72625f-f320-4552-a719-d11e2f1853bd",
  searchUri: "https://api.scryfall.com/cards/search?include_extras=true&include_variations=true&order=set&q=e%3Adtk&unique=prints",
  cardCount: 264,
  printSize: 264,
  name: "Dragons of Tarkir",
  code: "dtk"
});

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const ObjectIdSchema = z.uuidv7('Not a valid uuid7 id');

const SetInputSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  code: z.string().min(3, 'Set code must be 3-4 letters').max(4, 'Set code must be 3-4 letters')
}) satisfies z.ZodType<SetInput>;
const CustomSetInputSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  code: z.string().min(3, 'Set code must be 3-4 letters').max(4, 'Set code must be 3-4 letters'),
  author: z.string(),
  copyright: z.string(),
  content: z.string()
}) satisfies z.ZodType<CustomSetInput>;
const OfficialSetInputSchema = z.object({
  code: z.string().min(3, 'Set code must be 3-4 letters').max(4, 'Set code must be 3-4 letters')
}) satisfies z.ZodType<OfficialSetInput>;

const SetSchema = SetInputSchema.extend({
  id: ObjectIdSchema,
  created: ISOStringSchema,
}) satisfies z.ZodType<SetEntity>;
const CustomSetSchema = CustomSetInputSchema.extend({
  id: ObjectIdSchema,
  created: ISOStringSchema,
}) satisfies z.ZodType<CustomSetEntity>;
const OfficialSetSchema = OfficialSetInputSchema.extend({
  name: z.string().min(1, 'Name cannot be empty'),
  id: ObjectIdSchema,
  created: ISOStringSchema,
  scryfallUri: z.string().startsWith("https://scryfall.com/sets/", "Not a valid Scryfall URI"),
  uri: z.string().startsWith("https://api.scryfall.com/sets/", "Not a valid URI"),
  searchUri: z.string().startsWith("https://api.scryfall.com/cards/search", "Not a valid Search URI"),
  cardCount: z.int(),
  printSize: z.int()
}) satisfies z.ZodType<OfficialSetEntity>;

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Factory-function.
 *
 * Create a `UserEntity` from a partial or `undefined`
 */
function create(set?: Partial<SetEntity>): SetEntity {
  if (existsOfficially(set?.code)) {
    return { ...OfficialSetDefaults(), ...set };
  } else {
    return { ...CustomSetDefaults(), ...set};
  }
}

/**
 * Factory-function.
 *
 * Create a `UserEntity` from individual properties
 */
function of(code: string): SetEntity {
  return create({code: code});
}

function existsOfficially(code?: string) {
  return code == "DTK";
}

/**
 * Generate a uuid7 id.
 */
function genId(): string {
  return uuidv7();
}

/**
 * Check if a valid user object
 */
function isSet(val: unknown): val is SetEntity {
  return SetSchema.safeParse(val).success;
}
function isCustomSet(val: unknown): val is CustomSetEntity {
  return CustomSetSchema.safeParse(val).success;
}
function isOfficialSet(val: unknown): val is OfficialSetEntity {
  return OfficialSetSchema.safeParse(val).success;
}

/**
 * Check if a valid end users input fields are valid.
 */
function isSetInput(val: unknown): val is SetInput {
  return SetInputSchema.safeParse(val).success;
}
function isCustomSetInput(val: unknown): val is CustomSetInput {
  return CustomSetInputSchema.safeParse(val).success;
}
function isOfficialSetInput(val: unknown): val is OfficialSetInput {
  return OfficialSetInputSchema.safeParse(val).success;
}

/**
 * Test if an id is a valid user id.
 */
function isObjectId(val: unknown): val is string {
  return ObjectIdSchema.safeParse(val).success;
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  of,
  create,
  genId,
  is: {
    id: isObjectId,
    set: isSet,
    input: isSetInput,
    officialSet: isOfficialSet,
    officialInput: isOfficialSetInput,
    customSet: isCustomSet,
    customInput: isCustomSetInput,
  },
  Schemas: {
    Main: SetSchema,
    Input: SetInputSchema,
    Official: OfficialSetSchema,
    OfficialInput: OfficialSetInputSchema,
    Custom: CustomSetSchema,
    CustomInput: CustomSetInputSchema,
    Id: ObjectIdSchema,
  },
} as const;
