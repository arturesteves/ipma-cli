let should = require('chai').should();
let util = require("../lib/util");
const os = require("os");

///////////////////////////////////////
//// a 'it' contains a test to each function
///////////////////////////////////////

describe("Test util functions - good input", function () {
    it("filter_map function", function () {
        const arr1 = ["Lisboa", "Castelo Branco"];
        let result = util.filter_map(arr1);
        result.forEach(function(element) {
            element.should.be.a("number");
        });
    });

    it("filter_weather_location_json function", function () {
        const location1 = 1110600;
        const data = {
            "precipitaProb": "48.0",
            "tMin": "12.9",
            "tMax": "20.2",
            "predWindDir": "NW",
            "idWeatherType": 3,
            "classWindSpeed": 2,
            "longitude": "-9.1286",
            "forecastDate": "2018-06-05",
            "latitude": "38.7660"
        };
/*
        // use it against the function relevant_data
        let result = util._filter_weather_location_json(location1, data);
        result.should.be.a("object");
        result.should.have.property("location");
        result.should.have.property("temperature");
        result.should.have.property("precipitaProb");
        result.should.have.property("forecast");
        result.should.have.property("weather_type");
        result.should.have.property("wind_speed");
        result.location.should.be.a("string");
        result.temperature.should.be.a("string");
        result.precipitaProb.should.be.a("string");
        result.forecast.should.be.a("string");
        result.weather_type.should.be.a("string");
        result.wind_speed.should.be.a("string");
*/
    });

    it("get_global_local_id function", function () {
        const location1 = "Lisboa";
        const id1 = 1110600;
        let result = util.get_global_local_id(location1);
        result.should.be.a("number");
        result.should.be.equal(id1);
    });

    it("getPathOfLocationsFile function", function () {
        let config = {"file_path": "C:\\Users\\{username}",
                      "filename": "locations"};
        let user = os.userInfo().username;
        let expected = `C:\\Users\\${user}\\locations`;

        let result1 = util.getPathOfLocationsFile(config);

        result1.should.be.a("string");
        result1.should.be.equal(expected);
    });
});
