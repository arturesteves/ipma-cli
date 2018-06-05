/**
* This file is part of the ipma-cli project.
*
* @author artur-esteves
* @copyright (c) 2018
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

"use strict";

///////////////////////////////////////
//// imports
///////////////////////////////////////
// internal modules
const requests = require("./requests");
const util = require("./util");
const Log = require("./log");
const Cli = require("./cli");


const log = new Log();
const cli = new Cli();

cli.execute_command();
