/**
* This file is part of the <ipma-cli> project.
*
* @author <artur-esteves>
* @copyright (c)
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const colors = require('cli-color');

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
        log(this.log.debug.prefix + this.log.debug.color(message));
    }

    info(message) {
        log(this.log.info.color(message));
    }

    warning(message) {
        log(this.log.debug.prefix + this.log.warning.color(message));
    }

    error(message) {
        log(this.log.debug.prefix + this.log.error.color(message));
    }

}

// pseudo private function
function log(msg) {
    console.log(msg);
}


module.exports = Log;
