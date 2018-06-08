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
            {name: "forecast", alias: 'f', type: Number},
            {name: "forecast_day", alias: 'd', type: Number},
            {name: "global_location_id", alias: 'i', type: Number, multiple: true},
            {name: "local_name", alias: 'l', type: String, multiple: true},
            {name: "today", alias: 't', type: Boolean},
            {name: "tomorrow", alias: 'm', type: Boolean}
        ];
        this.args = command_line_args(this.args_options);
        this.default = {
            forecast: 2,    // forecast today and tomorrow
            max_forecast: 5,
            max_single_day_forecast: 3,
            today: 0
        }
    }


    execute_command() {
        get_locations_ids(this.args).then(function (locations_ids) {
            if (this.args["forecast"]) {
                const forecast = (this.args["forecast"] > this.default.max_forecast || this.args["forecast"] < 1) ?
                    this.default.max_forecast : this.args["forecast"];
                make_request_multiple_days(locations_ids, forecast);
            }
            else if (this.args["forecast_day"]) {
                const forecast_day = (this.args["forecast_day"] > this.default.max_single_day_forecast ||
                    this.args["forecast_day"] < 1) ? this.default.today : this.args["forecast_day"] - 1;

                make_request_single_day(locations_ids, forecast_day);
            }
            else if (this.args["today"]) {
                make_request_single_day(locations_ids, 0);
            }
            else if (this.args["tomorrow"]) {
                make_request_single_day(locations_ids, 1);
            }
            else {
                make_request_multiple_days(locations_ids, this.default.forecast);
            }

        }.bind(this))   // bind this to use it inside the promise result
            .catch(function (error) {
                log.debug(error);
            });
    }
}

function get_locations_ids(args) {
    return new Promise(function (resolve, reject) {
        let locations_ids = [];
        if (args["local_name"]) {

            args["local_name"].forEach(function (element) {
                locations_ids.push(util.get_global_local_id(element));
            });

            if (locations_ids) {
                resolve(locations_ids);
            } else {
                const message = "No locations";
                log.error(message);
                reject(message);
            }
        } else if (args["global_location_id"]) {

            if (locations_ids) {
                resolve(args["global_location_id"]);
            } else {
                const message = "No locations";
                log.error(message);
                reject(message);
            }
        } else {    // default action - load locations from file

            util.read_locations_from_file(util.get_path_of_locations_file(config.development))
                .then(function (locations) {
                    locations_ids = util.filter_map(locations);
                    resolve(locations_ids);
                })
                .catch(function (err) {
                    const message = "Failed to read locations from file";
                    log.debug(err);
                    log.error(message);
                    reject(message);
                });

        }
    });
}

function make_request_multiple_days(locations_ids, forecast) {
    locations_ids.forEach(function (element) {
        request.forecast_location_several_days(element)
            .then(function (result) {
                console.log(util.filter_data_multiple_days(result, forecast));
            })
            .catch(function (error) {
                log.debug(error);
                log.error("Request not successful.");
            });
    })
}

function make_request_single_day(locations_ids, forecast_day) {
    request.forecast_locations_single_day(forecast_day)
        .then(function (result) {
            console.log(util.filter_data_single_day(result, locations_ids));
        })
        .catch(function (error) {
            log.debug(error);
            log.error("Request not successful.");
        });
}

module.exports = Cli;
