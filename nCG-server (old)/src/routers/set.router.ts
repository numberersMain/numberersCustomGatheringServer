import { Router } from 'express';
import validate from 'express-zod-safe';

import HttpStatusCodes from '#src/common/constants/HttpStatusCodes.ts';
import Paths from '#src/common/constants/Paths/index.ts';
import Set from '#src/entities/Set/index.ts';
import SetService from '#src/services/SetService.ts';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

// Shorthand for the path strings
const P = {
  GET: Paths.Sets.Get.PATH,
  ADD: Paths.Sets.Add.PATH,
  UPDATE: Paths.Sets.Update.PATH,
  DELETE: Paths.Sets.Delete.PATH,
} as const;

// Middlware `validators`
const V = {
  add: validate({ body: { set: Set.Schemas.Input } }),
  update: validate({ body: { set: Set.Schemas.Main } }),
  delete: validate({ params: { id: Set.Schemas.Id } }),
} as const;
const CustomV = {
  add: validate({ body: { cset: Set.Schemas.CustomInput } }),
  update: validate({ body: { cset: Set.Schemas.Custom } }),
  delete: validate({ params: { id: Set.Schemas.Id } }),
} as const;
const OfficialV = {
  add: validate({ body: { oset: Set.Schemas.OfficialInput } }),
  update: validate({ body: { oset: Set.Schemas.Official } }),
  delete: validate({ params: { id: Set.Schemas.Id } }),
} as const;

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const router = Router();

// Get all users
router.get(P.GET, async (_, res) => {
  const sets = await SetService.getAll();
  res.status(HttpStatusCodes.OK).json({ sets });
});

// Add one user
router.post(P.ADD, V.add, async (req, res) => {
  const { set } = req.body;
  const created = await SetService.addOne(set);
  res.status(HttpStatusCodes.CREATED).json({ set: created });
});

// Update one user
router.put(P.UPDATE, V.update, async (req, res) => {
  const { set } = req.body;
  await SetService.updateOne(set);
  res.status(HttpStatusCodes.OK).end();
});

// Delete one user
router.delete(P.DELETE, V.delete, async (req, res) => {
  const { id } = req.params;
  await SetService.deleteOne(id);
  res.status(HttpStatusCodes.OK).end();
});

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default router;
