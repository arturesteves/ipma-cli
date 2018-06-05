let should = require('chai').should();
let requests = require("../lib/requests");

const Log = require("../lib/log");
const log = new Log();

// data request simulation
const data_requests = {
    forecast_local: {
        "owner": "IPMA",
        "country": "PT",
        "data": [
            {
                "precipitaProb": "83.0",
                "tMin": "12.2",
                "tMax": "17.7",
                "predWindDir": "NW",
                "idWeatherType": 7,
                "classWindSpeed": 2,
                "longitude": "-8.6535",
                "forecastDate": "2018-06-01",
                "classPrecInt": 1,
                "latitude": "40.6413"
            },
            {
                "precipitaProb": "2.0",
                "tMin": "13.9",
                "tMax": "18.5",
                "predWindDir": "NW",
                "idWeatherType": 3,
                "classWindSpeed": 2,
                "longitude": "-8.6535",
                "forecastDate": "2018-06-02",
                "latitude": "40.6413"
            },
            {
                "precipitaProb": "72.0",
                "tMin": "13.6",
                "tMax": "16.6",
                "predWindDir": "NW",
                "idWeatherType": 10,
                "classWindSpeed": 2,
                "longitude": "-8.6535",
                "forecastDate": "2018-06-03",
                "classPrecInt": 1,
                "latitude": "40.6413"
            },
            {
                "precipitaProb": "100.0",
                "tMin": "13.9",
                "tMax": "16.9",
                "predWindDir": "W",
                "idWeatherType": 7,
                "classWindSpeed": 2,
                "longitude": "-8.6535",
                "forecastDate": "2018-06-04",
                "classPrecInt": 1,
                "latitude": "40.6413"
            },
            {
                "precipitaProb": "55.0",
                "tMin": "14.4",
                "tMax": "17.7",
                "predWindDir": "NW",
                "idWeatherType": 4,
                "classWindSpeed": 2,
                "longitude": "-8.6535",
                "forecastDate": "2018-06-05",
                "latitude": "40.6413"
            }
        ],
        "globalIdLocal": 1010500,
        "dataUpdate": "2018-06-01T19:02:02"
    },
    forecast_day: {}
};

//describe.only("Test correctness of simulation requests", function () {
describe("Test correctness of simulation requests", function () {
    it("Test keys of endpoint forecast local", function () {
        const response = data_requests.forecast_local;

        response.should.be.a("object");
        response.should.have.property("owner");
        response.should.have.property("country");
        response.should.have.property("data");
        response.should.have.property("globalIdLocal");
        response.should.have.property("dataUpdate");
        response.data.should.be.a("array");

        const first_item = response.data[0];
        first_item.should.be.a("object");
        first_item.should.have.property("precipitaProb");
        first_item.should.have.property("tMin");
        first_item.should.have.property("tMax");
        first_item.should.have.property("predWindDir");
        first_item.should.have.property("idWeatherType");
        first_item.should.have.property("classWindSpeed");
        first_item.should.have.property("longitude");
        first_item.should.have.property("forecastDate");
        first_item.should.have.property("latitude");
        first_item.should.have.property("forecastDate");
        first_item.should.have.property("forecastDate");

        response.data.should.have.lengthOf(5);
    });
});


describe("Test correctness of real requests", function () {
    it("Test keys of endpoint forecast local", function () {
        const global_location_id = 1010500; // Aveiro

        return requests.forecast_local(global_location_id)
            .then(function (response) {
                log.debug("TEST request successful!");
                response.should.be.a("object");
                response.should.have.property("owner");
                response.should.have.property("country");
                response.should.have.property("data");
                response.should.have.property("globalIdLocal");
                response.should.have.property("dataUpdate");
                response.data.should.be.a("array");

                const first_item = response.data[0];
                first_item.should.be.a("object");
                first_item.should.have.property("precipitaProb");
                first_item.should.have.property("tMin");
                first_item.should.have.property("tMax");
                first_item.should.have.property("predWindDir");
                first_item.should.have.property("idWeatherType");
                first_item.should.have.property("classWindSpeed");
                first_item.should.have.property("longitude");
                first_item.should.have.property("forecastDate");
                first_item.should.have.property("latitude");
                first_item.should.have.property("forecastDate");
                first_item.should.have.property("forecastDate");

                response.data.should.have.lengthOf(5);
            });
    });
});
