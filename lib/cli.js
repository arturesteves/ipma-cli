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
// external modules
const command_line_args = require("command-line-args");
// internal modules
const request = require("./requests");
const util = require("./util");
const Log = require("./log");
// config
const config = require("../environment/env.json");


const log = new Log();


///////////////////////////////////////
//// class
///////////////////////////////////////
class Cli {

    constructor() {
        this.args_options = [
            {name: 'global_location_id', alias: 'i', type: Number},
            {name: 'local_name', alias: "l", type: String},
            {name: 'today', alias: 't', type: Boolean}
        ];
        this.args = command_line_args(this.args_options);
    }

    execute_command() {
        // if was passed a local_name
        if (this.args["local_name"]) {
            let global_location_id = util.get_global_local_id(this.args["local_name"]);
            request.forecast_local(global_location_id)
                .then(function (result) {
                    console.log(util.relevant_data(result));
                })
                .catch(function (error) {
                    log.debug(error);
                    log.error("Request not successful.");
                });
        // if was passed a location id
        } else if (this.args["global_location_id"]) {
            request.forecast_local(this.args["global_location_id"])
                .then(function (result) {
                    console.log(util.relevant_data(result));
                })
                .catch(function (error) {
                    log.debug(error);
                    log.error("Request not successful.");
                });
        // default action - load locations from file
        } else {
            util.read_locations_from_file(util.getPathOfLocationsFile(config.development))
                .then(function (locations) {
                    log.debug(locations);
                    let globalLocalIds = util.filter_map(locations);
                    log.debug("global local ids: " + globalLocalIds);
                    globalLocalIds.forEach(function (element) {
                        request.forecast_local(element)
                            .then(function (result) {
                                console.log(util.relevant_data(result));
                            })
                            .catch(function (error) {
                                log.debug(error);
                                log.error("Request not successful.");
                            });
                    })
                })
                .catch(function (err) {
                    log.debug(err);
                    log.error("Failed to read locations from file");
                });
        }
    }
}

module.exports = Cli;
