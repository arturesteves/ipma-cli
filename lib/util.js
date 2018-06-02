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
// external
const fs = require('fs-extra');
const os = require("os");
const columnify = require('columnify');
// data files
const distrits = require("./../data/distrits-islands.json");
const weather_types = require("./../data/weather-type-classe.json");
const wind_speeds = require("./../data/wind-speed-daily-classe.json");


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
    let columns_values = [];

    for (let weather_location in data) {
        columns_values.push(filter_weather_location_json(result.globalIdLocal, result.data[weather_location]));
    }

    let columns_result = columnify(columns_values, {
        showHeaders: false,
        columnSplitter: ' | '
    });
    return columns_result;
}

function filter_weather_location_json(location_id, data) {
    //let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    let date = new Date(data.forecastDate);
    let dayOfWeek = date.getDay();
    let temp = data.tMin + "ºC - " + data.tMax + "ºC";
    return {
        location: get_global_local_name(location_id),
        temperature: temp,
        precipitaProb: "chuva " + data.precipitaProb + "%",
        forecast: data.forecastDate + " - " + days[dayOfWeek],
        weather_type: weather_type_class(data.idWeatherType),
        wind_speed: "Vento " + wind_speed_class(data.classWindSpeed)
    };
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

function is_JSON_object(obj) {
    try {
        JSON.parse(obj);
        return true;
    } catch (e) {
        return false;
    }
}

function getPathOfLocationsFile(config) {
    let path = config.file_path.replace("{username}", os.userInfo().username);
    return path + "\\" + config.filename;
}

module.exports = {
    get_global_local_id,
    relevant_data,
    read_locations_from_file,
    filter_map,
    is_JSON_object,
    getPathOfLocationsFile
};
