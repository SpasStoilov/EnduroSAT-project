async function Data(req, res){
    const {startEnvironmentSumulation} = require("./initEnvSimulation.js")
    startEnvironmentSumulation()
    //
    const {satellite} = require("./satellite.js")
    console.log(">>> Satellite on---{")
    console.log("req.url     :", req.url)
    console.log("req.params  :", req.params)
    console.log("req.query   :", req.query)
    
    try{
        const satelliteState = satellite.getState()
        console.log("satellite state :", satelliteState)
        //
        res.status(202)
        res.json(satelliteState)
    }
    catch (err){
        console.log("!Error!  :", err.message)
        res.status(404)
        res.json({error:err.message})
    }

    console.log(">>> Satellite }---off")
}

async function Command(req, res){
    // Environment Sumulation
    const {startEnvironmentSumulation} = require("./initEnvSimulation.js")
    startEnvironmentSumulation()
    //
    const {satellite} = require("./satellite.js")
    console.log(">>> Command Satellite on---{")
    console.log("req.url     :", req.url)
    console.log("req.params  :", req.params)
    console.log("req.query   :", req.query)
    console.log("req.body/commands   :", req.body)

    try{
        satellite.setState(req.body)
        const currentStateSAT = satellite.getState()
        console.log("satellite state :", currentStateSAT)
        //
        res.status(202)
        res.json(currentStateSAT)
    }
    catch (err){
        console.log("!Error!  :", err.message)
        res.status(404)
        res.json({error:err.message})
    }

    console.log(">>> Command Satellite }---off")
}

module.exports = {
    Data,
    Command
}