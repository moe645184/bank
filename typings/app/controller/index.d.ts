// This file is created by egg-ts-helper@1.33.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccount = require('../../../app/controller/account');
import ExportBank = require('../../../app/controller/bank');
import ExportHome = require('../../../app/controller/home');

declare module 'egg' {
  interface IController {
    account: ExportAccount;
    bank: ExportBank;
    home: ExportHome;
  }
}
