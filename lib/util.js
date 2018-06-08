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


function filter_data_multiple_days(result, obj) {
    let data = result.data;
    let columns_values = [];
    let number_of_days = obj.forecast;

    for(let element in data) {
        if(number_of_days > 0) {
            let obj = filter_weather_location_json(result.globalIdLocal, data[element]);
            obj.forecast = data[element].forecastDate + " - " + get_day_of_week(data[element].forecastDate);
            columns_values.push(obj);
            number_of_days--;
        } else {
            break;
        }
    }

    return columnify(columns_values, {
        showHeaders: false,
        columnSplitter: ' | '
    });
}

function filter_data_single_day (result, locations_ids) {
    let data = result.data;
    let columns_values = [];

    locations_ids.forEach(function(element) {
        let location_forecast = find_and_return (data, "globalIdLocal", element);
        let obj = filter_weather_location_json(location_forecast.globalIdLocal, location_forecast);
        obj.forecast = result.forecastDate + " - " + get_day_of_week(result.forecastDate);
        columns_values.push(obj);

    });

    return columnify(columns_values, {
        showHeaders: false,
        columnSplitter: ' | '
    });
}

function filter_weather_location_json(location_id, data) {
    let temp = data.tMin + "ºC - " + data.tMax + "ºC";
    return {
        location: get_global_local_name(location_id),
        temperature: temp,
        precipitaProb: "chuva " + data.precipitaProb + "%",
        weather_type: weather_type_class(data.idWeatherType),
        wind_speed: "Vento " + wind_speed_class(data.classWindSpeed)
    };
}

function get_day_of_week(forecast_date) {
    let days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    let date = new Date(forecast_date);
    let dayOfWeek = date.getDay();
    return days[dayOfWeek];
}

function get_global_local_id (local) {
    return find_and_return(distrits.data, "local", local, "globalIdLocal");
}

function get_global_local_name(id) {
    return find_and_return(distrits.data, "globalIdLocal", id, "local");
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
    return find_and_return(weather_types.data, "idWeatherType", id, "descIdWeatherTypePT");
}

function wind_speed_class(id) {
    return find_and_return(wind_speeds.data, "classWindSpeed", id, "descClassWindSpeedDailyPT");
}

function get_path_of_locations_file(config) {
    let path = config.file_path.replace("{username}", os.userInfo().username);
    return path + "\\" + config.filename;
}

function find_and_return (arr, compare_prop, val, return_prop) {
    let founded = arr.find(function(element) {
        return element[compare_prop] == val;
    });

    return return_prop ? founded[return_prop] : founded;
}

module.exports = {
    get_global_local_id,
    filter_data_multiple_days,
    filter_data_single_day,
    read_locations_from_file,
    filter_map,
    get_path_of_locations_file
};
