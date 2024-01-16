const {environment} = require("./environment.js")
const {satellite} = require("./satellite.js")

function startEnvironmentSumulation(){
    satellite.init(environment)
    // setInterval(() => {
    //     satellite.init(environment)
    // }, 7000)
}

module.exports = {
    startEnvironmentSumulation,
}