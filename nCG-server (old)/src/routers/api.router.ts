import { Router } from 'express';

import Paths from '#src/common/constants/Paths/index.ts';

import userRouter from './user.router.ts';
import setRouter from './set.router.ts';

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const apiRouter = Router();

// Add more routers as your app grows (e.g. `postsRouter`)
apiRouter.use(Paths.Users.PATH, userRouter);
apiRouter.use(Paths.Sets.PATH, setRouter);

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default apiRouter;
