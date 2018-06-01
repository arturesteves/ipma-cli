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
        this.log_colors = {
            error: colors.red.bold,
            warning: colors.yellow,
            info: colors.green,
        }
    }

    info(message) {
        log(this.log_colors.info(message));
    }

    warning(message) {
        log(this.log_colors.warning(message));
    }

    error(message) {
        log(this.log_colors.error(message));
    }

}

// pseudo private function
function log(msg) {
    console.log(msg);
}

module.exports = Log;
