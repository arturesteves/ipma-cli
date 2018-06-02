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
const request = require("request-promise");
const command_line_args = require("command-line-args");
const fs = require('fs-extra');
const os = require("os");

const requests = require("./requests");

const Log = require("./log");
const log = new Log();

// files
const distrits = require("./../data/distrits-islands.json");
const weather_types = require("./../data/weather-type-classe.json");
const wind_speeds = require("./../data/wind-speed-daily-classe.json");


///////////////////////////////////////
//// config
///////////////////////////////////////
let config = {
    filename: ".ipma-locations",
};
//config.locations_path= "C:\\Users\\" + os.userInfo().username + "\\" + config.filename;
config.locations_path= "../" + config.filename;

log.info("config: " + JSON.stringify(config));

const option_definitions = [
    { name: 'globalIdLocal', alias: 'i', type: Number },
    { name: 'localName', alias: "l", type: String },
    { name: 'today', alias: 't', type: Boolean }
];
const _options = command_line_args(option_definitions);

log.debug(process.argv);
log.debug(_options);


let globalIdLocal = _options["globalIdLocal"] ? _options["globalIdLocal"] : void 0;//:1010500;
if (!globalIdLocal && _options["localName"]) {
    globalIdLocal = get_global_local_id(_options["localName"]);

} else {
    read_locations_from_file(config.locations_path)
        .then(function(locations) {
            log.debug("Locations: ");
            //debug(locations);
            log.debug(locations);
            let globalLocalIds = filter_map(locations);

            //debug("global local ids: " + globalLocalIds);
            log.debug("global local ids: " + globalLocalIds);
            globalLocalIds.forEach(function(element) {
                //debug("REQUEST");
                log.debug("REQUEST");
                //send_request(element);
                requests.forecast_local(element)
                    .then(function(result) {
                        log.info(relevant_data(result));
                    })
                    .catch(function(err) {
                        log.warning(err);
                    });
            });
        })
        .catch(function(error) {
            log.error(error);
        });
}

function send_request(globalIdLocal) {
    log.debug(globalIdLocal);
    let url = `http://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${globalIdLocal}.json`;
    log.debug("URL: " + url);
    let options = {
        uri: url,
        headers: {
            "User-Agent": "Request-Promise"
        },
        timeout: 5000   // 5 seconds until connection timeout
    };

    request(options)
        .then(function(response) {
            log.info(relevant_data(JSON.parse(response)));
            //debug_request(response);
        })
        .catch(function(error) {
            log.warning("Error! " + error);
        });
}

function filter_map(arr) {
    return arr.reduce(function(accumulator, item) {
        if(item){
            accumulator.push(get_global_local_id(item));
        }
        return accumulator;
    }, []);
}

function relevant_data(result) {
    let data = result.data;
    if (_options["today"]) {
        return filter_weather_location(result.globalIdLocal, data[0]);
    }
    let st = "";
    for (let weather_location in result.data) {
        st += filter_weather_location(result.globalIdLocal, result.data[weather_location]);
        st += "\n";
    }
    return st;
}

function filter_weather_location (location_id, data) {
    let temp = data.tMin + "ºC - " + data.tMax + "ºC";
    return get_global_local_name(location_id) + " | " + temp + " | " + data.precipitaProb + "% | " +
        data.forecastDate + " | " + weather_type_class(data.idWeatherType) + " | Vento " + wind_speed_class(data.classWindSpeed);
}

function get_global_local_id (local) {
    const data = distrits.data;
    for (let distrit in data) {
        if(data[distrit].local == local) {
            return data[distrit].globalIdLocal;
        }
    }
    return void 0;
}

function get_global_local_name(id) {
    const data = distrits.data;
    for (let distrit in data) {
        if(data[distrit].globalIdLocal == id) {
            return data[distrit].local;
        }
    }
    return void 0;
}

function read_locations_from_file(path) {
    return new Promise(function(resolve, reject) {
        fs.readFile(path, "utf8")
            .then(function(data) {
                resolve(data.split('\r\n'));
            })
            .catch(function(error) {
                log.error("error on read locations from file: " + error);
                reject(error);
            });
    });
}

function weather_type_class(id) {
    const data = weather_types.data;
    for (let weather in data) {
        if(data[weather].idWeatherType == id) {
            return data[weather].descIdWeatherTypePT;
        }
    }
    return void 0;
}

function wind_speed_class(id) {
    const data = wind_speeds.data;
    for (let wind in data) {
        if(data[wind].classWindSpeed == id) {
            return data[wind].descClassWindSpeedDailyPT;
        }
    }
    return void 0;
}

/* else {
 // usage
 debug("USAGE!");
 /*
 e.g.
 >node index.js -i 1070500
 >node index.js -l Lisboa
 >node index.js -t
 return;
 }
 */
