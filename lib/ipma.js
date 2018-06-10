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
//// class
///////////////////////////////////////
const request = require("request-promise");
const Log = require("./log");

///////////////////////////////////////
//// global variables
///////////////////////////////////////
const log = new Log();

///////////////////////////////////////
//// class Ipma
///////////////////////////////////////
class Ipma {

    constructor() {
        this.request_default_options = {
            headers: {
                "User-Agent": "Request-Promise"
            },
            timeout: 5000
        };
        this.base_api_url = "http://api.ipma.pt/open-data/forecast/meteorology/cities/daily";
    }

    forecast_location_several_days(global_location_id) {

    }

    forecast_locations_several_days(global_location_ids) {

    }

    forecast_locations_single_day(global_location_ids, forecast_day) {

    }

    forecast_locations_single_day(global_location_id, forecast_day) {

    }

    ///////////////////////////////////////
    //// basic support to request, in case the class doesn't support a request to a specific endpoint
    ///////////////////////////////////////

    get(url, callback) {
        _.send_request(_.construct_options("GET", url), callback);
    }

    post(url, body, callback) {
        _.send_request(_.construct_options("POST", url, body), callback);
    }

    update(url, body, callback) {
        _.send_request(_.construct_options("UPDATE", url, body), callback);
    }

    delete(url, body, callback) {
        _.send_request(_.construct_options("DELETE", url, body), callback);
    }
}

///////////////////////////////////////
//// private methods
///////////////////////////////////////

const _ = {
    construct_options(method, url, body, other_options) {
        return {
            method: method,
            ...this.request_default_options,
            ...(body && {body: body}),
            //...(other_options && other_options),
            uri: [this.base_api_url, url].join("/"),
        };
    },

    send_request(options, callback) {
        return new Promise(function (resolve, reject) {
            request(options)
                .then(function (response) {
                    log.debug("request success!");
                    if (callback) {
                        callback(response);
                        return;
                    }
                    resolve(JSON.parse(response));
                })
                .catch(function (error) {
                    log.debug("request failed!");
                    if (callback) {
                        callback(null, error);
                        return;
                    }
                    reject(error);
                });
        });
    }
};

module.exports = Ipma;
