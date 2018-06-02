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
        log(this.log.debug.color(this.log.debug.prefix) + check_message(message));
    }

    info(message) {
        log(check_message(message))
    }

    warning(message) {
        log(this.log.debug.color(this.log.debug.prefix) + check_message(message))
    }

    error(message) {
        log(this.log.debug.color(this.log.debug.prefix) + check_message(message))
    }

}

// pseudo private function
function log(msg) {
    console.log(msg);
}

function check_message(message) {
    //log(util.is_JSON_object(message));
    //return util.is_JSON_object(message) ? JSON.stringify(message) : message;
    return JSON.stringify(message);
}

module.exports = Log;
