import { type SetEntity } from '#src/entities/Set/index.ts';

import orm from './MockOrm.ts';

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * See if a user with the given id exists.
 */
async function persists(id: string): Promise<boolean> {
  const db = await orm.openDb();
  for (const set of db.sets) {
    if (set.id === id) return true;
  }
  return false;
}

/**
 * Get all users.
 */
async function getAll(): Promise<SetEntity[]> {
  const db = await orm.openDb();
  return db.sets.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Add one user.
 */
async function addOne(set: SetEntity): Promise<void> {
  const db = await orm.openDb();
  db.sets.push(set);
  return orm.saveDb(db);
}

/**
 * Update a user.
 */
async function updateOne(set: SetEntity): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.sets.length; i++) {
    if (db.sets[i].id === set.id) {
      const dbSet = db.sets[i];
      db.sets[i] = {
        ...dbSet,
        ...set
      };
      return orm.saveDb(db);
    }
  }
}

/**
 * Delete one user.
 */
async function deleteOne(id: string): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.sets.length; i++) {
    if (db.sets[i].id === id) {
      db.sets.splice(i, 1);
      return orm.saveDb(db);
    }
  }
}

// ============================ Unit-tests Only ============================ //

/**
 * Delete every user record.
 *
 * @testOnly
 */
async function deleteAllSets(): Promise<void> {
  const db = await orm.openDb();
  db.sets = [];
  return orm.saveDb(db);
}

/**
 * Insert copies of `users` with fresh ids; the inputs are not modified.
 *
 * @testOnly
 */
async function insertMultiple(
  sets: SetEntity[] | readonly SetEntity[],
): Promise<SetEntity[]> {
  const db = await orm.openDb();
  db.sets = [...db.sets, ...sets];
  await orm.saveDb(db);
  return [...sets];
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export const UserRepoTestOnly = {
  deleteAllSets,
  insertMultiple,
} as const;

export default {
  persists,
  getAll,
  addOne,
  updateOne,
  deleteOne,
} as const;
