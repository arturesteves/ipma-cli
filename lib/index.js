/**
* This file is part of the <ipma-cli> project.
*
* @author <artur-esteves>
* @copyright (c)
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

// SET DEBUG=* on the terminal
const debug_request = require("debug")("request");
const debug_cli_args = require("debug")("cli-args");
const debug = require("debug")("general");

const distrits = require("./../data/distrits-islands.json");
const os = require("os");

///////////////////////////////////////
//// config
///////////////////////////////////////
let config = {
    filename: ".ipma-locations",
};
//config.locations_path= "C:\\Users\\" + os.userInfo().username + "\\" + config.filename;
config.locations_path= "../" + config.filename;

debug("config: " + JSON.stringify(config));

const option_definitions = [
    { name: 'globalIdLocal', alias: 'i', type: Number },
    { name: 'localName', alias: "l", type: String }
];
const _options = command_line_args(option_definitions);

debug_cli_args(process.argv);
debug(_options);



let globalIdLocal = _options["globalIdLocal"] ? _options["globalIdLocal"] : void 0;//:1010500;
if (!globalIdLocal && _options["localName"]) {
    globalIdLocal = get_global_local_id(_options["localName"]);

} else {
    let locations = read_locations_from_file(config.locations_path);
    // iterate over every location
        // get the global id
        //globalIdLocal =
        // perform request

}

/* else {
    // usage
    debug("USAGE!");
    /*
        e.g.
            >node index.js -i 1070500
            >node index.js -l Lisboa
    return;
}
*/

debug(globalIdLocal);
let url = `http://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${globalIdLocal}.json`;
let options = {
    uri: url,
    headers: {
        "User-Agent": "Request-Promise"
    },
};

console.log("fetching...");
// fetch wallpaper data
request(options)
    .then(function(response) {
        console.log(relevant_data(response));
        //debug_request(response);
    })
    .catch(function(error) {
        debug_request("Error! " + error);
    });


function relevant_data(data) {
    return data;
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

function read_locations_from_file(path) {
    //debug(fs.readFile);
    fs.readFile(path, "utf8")
        .then(function(data) {
            debug("File data! - file located at: " + path);
            debug(data);
        })
        .catch(function(error) {
           debug("error on read locations from file: " + error);
        });
}
