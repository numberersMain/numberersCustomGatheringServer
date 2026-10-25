import { NotFoundError } from '#src/common/classes/route-errors.ts';
import Set, {
  type SetEntity,
  type SetInput,
  type CustomSetEntity,
  type CustomSetInput,
  type OfficialSetEntity,
  type OfficialSetInput,
} from '#src/entities/Set/index.ts';
import SetRepo from '#src/repos/SetRepo.ts';
import UserRepo from '#src/repos/UserRepo.ts';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const SetServiceErrors = {
  SET_NOT_FOUND: 'User not found',
} as const;

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Get all users.
 */
function getAll(): Promise<SetEntity[]> {
  return SetRepo.getAll();
}

/**
 * Create a user from client input; the id and created date are set here.
 */
async function addOne(input: SetInput): Promise<SetEntity> {
  const set = Set.create(input);
  await SetRepo.addOne(set);
  return set;
}

/**
 * Update one user.
 */
async function updateOne(set: SetEntity): Promise<void> {
  const persists = await SetRepo.persists(set.id);
  if (!persists) throw new NotFoundError(SetServiceErrors.SET_NOT_FOUND);
  return SetRepo.updateOne(set);
}

/**
 * Delete a user by their id.
 */
async function deleteOne(id: string): Promise<void> {
  const persists = await SetRepo.persists(id);
  if (!persists) throw new NotFoundError(SetServiceErrors.SET_NOT_FOUND);
  return SetRepo.deleteOne(id);
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  Errors: SetServiceErrors,
  getAll,
  addOne,
  updateOne,
  deleteOne,
} as const;
