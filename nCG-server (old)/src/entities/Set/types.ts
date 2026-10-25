import type { Entity } from '#src/entities/common/entity-base-types.ts';

// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

/**
 * @entity `sets`
 */
export interface SetEntity extends Entity {
  /**
   * english set name, like "Dragons of Tarkir"
   */
  name: string;
  /**
   * set code, like "DTK"
   */ 
  code: string;
}

/**
 * custom set, created using magicseteditor or through other means
 */
export interface CustomSetEntity extends SetEntity {
  /**
   * author of the custom set
   */
  author: string;
  /**
   * copyright text
   */
  copyright: string;
  /**
   * mse-set content
   */
  content: string;
}

export interface OfficialSetEntity extends SetEntity {
  scryfallUri: string;
  uri: string;
  searchUri: string;
  cardCount: number;
  printSize: number;
}

/**
 * Fields a client supplies when creating a user; the server sets the rest.
 */
export type SetInput = Pick<SetEntity, 'name' | 'code'>;
export type CustomSetInput = Pick<CustomSetEntity, 'name' | 'code' | 'author' | 'copyright' | 'content'>;
export type OfficialSetInput = Pick<OfficialSetEntity, 'code'>;
