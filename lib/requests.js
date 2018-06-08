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

const request = require("request-promise");
const Log = require("./log");
const log = new Log();
const base_api_url="http://api.ipma.pt/open-data/forecast/meteorology/cities/daily";

let config = {
    headers: {
        "User-Agent": "Request-Promise"
    },
    timeout: 5000
};

function forecast_location_several_days(global_location_id) {
    let url = `${base_api_url}/${global_location_id}.json`;
    let options ={...config, uri: url};
    return send_request(options);
}

function forecast_locations_single_day(id_day) {
    let url = `${base_api_url}/hp-daily-forecast-day${id_day}.json`;
    let options ={...config, uri: url};
    return send_request(options);
}

function send_request(options) {
    return new Promise(function(resolve, reject) {
        request(options)
            .then(function(response) {
                log.debug("request success!");
                resolve(JSON.parse(response));
            })
            .catch(function(error) {
                log.debug("request failed!");
                reject(error);
            });
    });
}

module.exports = {
    forecast_location_several_days,
    forecast_locations_single_day
};
