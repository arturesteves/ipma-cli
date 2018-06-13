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
// external module
const colors = require("cli-color");
// internal module
const util = require("./util");

///////////////////////////////////////
//// class
///////////////////////////////////////
class Log {

    constructor(){
        this.log = {
            error: {
                color: colors.red.bold,
                prefix: "Error: "
            },
            warning: {
                color: colors.yellow,
                prefix: "Warning: "
            },
            info: {
                color: colors.white,
            },
            debug: {
                color: colors.cyanBright,
                prefix: "Debug: "
            },
            string: {
                color: colors.green,
            },
            default: {
                color: colors.white
            }
        };

    }

    debug(message) {
        if(process.env.DEVELOPMENT) {
            log(this.log.debug.color(this.log.debug.prefix), message);
        }
    }

    info(message) {
        log(message);
    }

    warning(message) {
        log(this.log.warning.color(this.log.warning.prefix), message)
    }

    error(message) {
        log(this.log.error.color(this.log.error.prefix), message)
    }

}

// pseudo private function
function log(prefix, msg) {
    if(msg && msg.constructor == Object) {
        console.log(prefix);
        console.log(msg);
    } else {
        console.log(prefix, msg);
    }
}

module.exports = Log;
