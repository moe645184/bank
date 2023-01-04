// This file is created by egg-ts-helper@1.33.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBank = require('../../../app/model/bank');

declare module 'egg' {
  interface IModel {
    Bank: ReturnType<typeof ExportBank>;
  }
}
