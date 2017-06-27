console.log("Wetter.js loaded");
var weather = require('weather-js');
 
// Options: 
// search:     location name or zipcode 
// degreeType: F or C 

function getWeather(city)
{
    return new Promise((resolve, reject) => {
        weather.find({search: city, degreeType: 'C'}, function(err, result) {
        if(err) console.log(err);
            resolve(result);
        });
    });
}


module.exports = {
    getWeather : getWeather
}

function test()
{
    getWeather('Aachen').then((res) => {
        console.log("Wetter",res);
        res[0].forecast.forEach((currentItem) => {
            console.log(currentItem);
        });
    });
}