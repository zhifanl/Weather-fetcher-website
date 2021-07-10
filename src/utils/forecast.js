const request = require('postman-request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=364955c21ad3fd81df2dc6298542c259&query=' + latitude + ',' + longitude + '&units=f'
    // console.log(url)
    request({ url, json: true }, (error, {body}={}) => {

        if (error)
            callback("Unable to connect to weather service",undefined)
        else if (body.error) {
            // console.log(response.body.error)
            callback("Unable to find location",undefined)
        } else
            callback(undefined,body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature + " degrees out. It feels like " + body.current.feelslike + " degrees.")
    })
}

module.exports = forecast
