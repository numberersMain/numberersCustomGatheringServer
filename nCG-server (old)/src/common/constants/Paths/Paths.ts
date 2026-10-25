import { ep, pp } from './helpers.ts';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const BASE = '/api';
const USERS_BASE = '/users';
const USERS = BASE + USERS_BASE;
const SETS_BASE = '/sets';
const SETS = BASE + SETS_BASE;

const Paths = {
  PATH: BASE,
  Users: {
    PATH: USERS_BASE,
    Get: ep(USERS, '/all', 'GET'),
    Add: ep(USERS, '/add', 'POST'),
    Update: ep(USERS, '/update', 'PUT'),
    Delete: {
      ...ep(USERS, `/delete/:id`, 'DELETE'),
      format: (id: string) => `${USERS}/delete/${pp(id)}`,
    },
  },
  Sets: {
    PATH: SETS_BASE,
    Get: ep(SETS, '/all', 'GET'),
    Add: ep(SETS, '/add', 'POST'),
    Update: ep(SETS, '/update', 'PUT'),
    Delete: {
      ...ep(SETS, `/delete/:id`, 'DELETE'),
      format: (id: string) => `${SETS}/delete/${pp(id)}`,
    },
  },
} as const;

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default Paths;
