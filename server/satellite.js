const satellite = {
    wiresResistance: 2,
    payloadResistance:{
        OBC: 6, // 6
        Camera: 6  //6
    },
    //
    batteriesChargeAmount: [0 ,0], // Volt
    batteriesCurrentIncommingAmount: [0 ,0], // Volt
    batteriesChargeOn: [true, true],
    batteriesCapacity: 30, // Volt
    batteriesMinimumThresholdCapacity: 17, // Volt
    //
    payloadsScaleDrawAmplitude:{
        OBC: 0,
        Camera: 0,
    },
    payloadsCurrentDrawAmount:{
        OBC: 0, // Amps
        Camera: 0, // Amps
    },
    payloadsDisconnected:{
        OBC: false,
        Camera: false,
    },
    payloadMinimumDraw: 2.5, // Amp
    payloadMaximumDraw: 3, // Amp
    //
    init(environment){
        this.chargeBatteries(environment.incomingEnergy)
        this.payloadsDraw()
        this.batteriesChargeState()
        this.payloadsDrawStates()
        //console.log(">>> Satellite", this.getState())
    },
    chargeBatteries(incomingEnergy){
        for (let i = 0; i <  this.batteriesChargeOn.length; i++){
            const chargeOn = this.batteriesChargeOn[i]
            /**
             * A - amps       - incomingEnergy
             * R - resistence - wiresResistance
             * V - Volt       - totalChargeAmount
             *  -----------
             * | A * R = V |
             *  -----------
             */
            this.batteriesCurrentIncommingAmount[i] = incomingEnergy() * this.wiresResistance
            const totalChargeAmount = this.batteriesChargeAmount[i] + this.batteriesCurrentIncommingAmount[i]
            
            if (chargeOn){
                if (totalChargeAmount > this.batteriesCapacity){
                    this.batteriesChargeAmount[i] = this.batteriesCapacity
                }
                else {
                    this.batteriesChargeAmount[i] = totalChargeAmount
                }
            }
        }
    },
    payloadsDraw(){
        for (let i = 0; i <  this.batteriesChargeAmount.length; i++){
            const payloadName = Object.keys(this.payloadsCurrentDrawAmount)[i]

            if (!this.payloadsDisconnected[payloadName]){      
                let drawAmount = Math.round(this.batteriesChargeAmount[i]*Math.random()) // Volt + 10
                if (this.batteriesChargeAmount[i] - drawAmount >= 0){
                    this.batteriesChargeAmount[i] -= drawAmount
                }
                else {
                    drawAmount = this.batteriesChargeAmount[i]
                    this.batteriesChargeAmount[i] = 0
                }
                /**
                 * A - amps       - drawAmountInAmps
                 * R - resistence - payloadResistance[payloadName]
                 * V - Volt       - drawAmount
                 *  -----------
                 * | A = V / R |
                 *  -----------
                 */
                this.payloadsCurrentDrawAmount[payloadName] = drawAmount / this.payloadResistance[payloadName]
            }
        }
    },
    batteriesChargeState(){
        for (let i = 0; i <  this.batteriesChargeAmount.length; i++){

            const chargeAmount = this.batteriesChargeAmount[i]

            if (chargeAmount >= this.batteriesCapacity){
                this.batteriesChargeOn[i] = false
            }
            else if(chargeAmount <= this.batteriesMinimumThresholdCapacity){
                this.batteriesChargeOn[i] = true
            }
        }
    },
    payloadsDrawStates(){
        for (let [payloadName, drawAmountInAmps] of Object.entries(this.payloadsCurrentDrawAmount)){

            if(!this.payloadsDisconnected[payloadName]){
                if(drawAmountInAmps <= this.payloadMinimumDraw){
                    this.payloadsScaleDrawAmplitude[payloadName] = 1
                }
                else if (drawAmountInAmps < this.payloadMaximumDraw){
                    this.payloadsScaleDrawAmplitude[payloadName] = 2
                }
                else if (drawAmountInAmps >= this.payloadMaximumDraw){
                    this.payloadsScaleDrawAmplitude[payloadName] = 3
                }
            }
        }
    },
    getState(){
        const satelliteState = {
            batteriesChargeAmount: {
                amounts: this.batteriesChargeAmount, units:"V"
            },
            batteriesCurrentIncommingAmount: {
                amounts:this.batteriesCurrentIncommingAmount, units:"V"
            },
            batteriesChargeOn: this.batteriesChargeOn,
            batteriesCapacity: {
                amounts: this.batteriesCapacity, 
                units: "V"
            },
            batteriesMinimumThresholdCapacity: {
                amounts: this.batteriesMinimumThresholdCapacity + 1,
                units: "V"
            },
            //
            payloadsCurrentDrawAmount: {
                OBC: {
                    amounts:this.payloadsCurrentDrawAmount.OBC,
                    units: "A"
                },
                Camera: {
                    amounts: this.payloadsCurrentDrawAmount.Camera,
                    units: "A"
                }
            },
            payloadsScaleDrawAmplitude: this.payloadsScaleDrawAmplitude,
            payloadsDisconnected: this.payloadsDisconnected,
            payloadMinimumDraw: {
                amouts: this.payloadMinimumDraw,
                units: "A"
            },
            payloadMaximumDraw: {
                amounts:this.payloadMaximumDraw,
                units: "A"
            },
        }
        return satelliteState
    },
    setState(data){
        for(let [propName, propValue] of Object.entries(data)){
            const propChain = propName.split("/")
            const lastInChain = propChain.pop()
            let target = this
            //
            for (let prop of propChain){
                if (!target.hasOwnProperty(prop)){
                    break
                }
                target = target[prop]
            }
            //
            if (propValue.index != undefined || propValue.index != null){
                target[lastInChain][propValue.index] = propValue.value
            }
            else {
                target[lastInChain] = propValue.value
            }
        }
    }
}

module.exports = {
    satellite,
}