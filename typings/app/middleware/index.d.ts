// This file is created by egg-ts-helper@1.33.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuth = require('../../../app/middleware/auth');

declare module 'egg' {
  interface IMiddleware {
    auth: typeof ExportAuth;
  }
}
