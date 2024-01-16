import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { SatelliteState, SatelliteIncommingState, Request, Response, commands } from "./types"

let currnetMsgId = 0

const initialState : SatelliteState = {
    batteries:{
        totalChargeAmount: {
            charge1:{
                stringValue: "",
                procentValue: 0
            },
            charge2:{
                stringValue: "",
                procentValue: 0
            }
        },
        currentAccumulatedChargeAmount: {
            amount1: "",
            amount2: ""
        },
        chargeB1: null,
        chargeB2: null,
        capacity: "",
        minimumThresholdCapacity:"",
    },
    //
    payloads:{
        currentDrawAmount: {
            OBC: "",
            Camera: "",
        },
        scaleDrawAmplitude: {
            OBC: ["", ""],
            Camera:  ["", ""],
        },
        disconnected:{
            OBC: null,
            Camera: null,
        },
        maximumDraw: "",
        minimumDraw: ""
    },
    messenger: [], 
    rawData:({} as SatelliteIncommingState)
}

const SatelliteSlice = createSlice({
    name: "satellite",
    initialState,
    reducers:{
        setTotalChargeAmount(state){
            const payload = state.rawData
            
            if(Object.keys(state.rawData).length){
                state.batteries.totalChargeAmount.charge1.stringValue = 
                    `${payload.batteriesChargeAmount.amounts[0].toFixed(1)}${payload.batteriesChargeAmount.units}`
                state.batteries.totalChargeAmount.charge1.procentValue = 
                    payload.batteriesChargeAmount.amounts[0] / payload.batteriesCapacity.amounts
    
                state.batteries.totalChargeAmount.charge2.stringValue = 
                    `${payload.batteriesChargeAmount.amounts[1].toFixed(1)}${payload.batteriesChargeAmount.units}`
                state.batteries.totalChargeAmount.charge2.procentValue = 
                     payload.batteriesChargeAmount.amounts[1] / payload.batteriesCapacity.amounts
            }
        },
        setCurrentAccumulatedChargeAmount(state){
            const payload = state.rawData
            if(Object.keys(state.rawData).length){
                state.batteries.currentAccumulatedChargeAmount.amount1 = 
                    `${payload.batteriesCurrentIncommingAmount.amounts[0]}${payload.batteriesCurrentIncommingAmount.units}`
                state.batteries.currentAccumulatedChargeAmount.amount2 = 
                    `${payload.batteriesCurrentIncommingAmount.amounts[1]}${payload.batteriesCurrentIncommingAmount.units}`
            }
        },
        setBatteriesCommonValues(state){
            const payload = state.rawData

            if(Object.keys(state.rawData).length){
                state.batteries.chargeB1 = payload.batteriesChargeOn[0]
                state.batteries.chargeB2 = payload.batteriesChargeOn[1]
    
                state.batteries.capacity = 
                    `${payload.batteriesCapacity.amounts}`
                state.batteries.minimumThresholdCapacity = 
                    `${payload.batteriesMinimumThresholdCapacity.amounts}`
            }

        },
        setCurrentDrawAmount(state){
            const payload = state.rawData
            if(Object.keys(state.rawData).length){
                state.payloads.currentDrawAmount.OBC = 
                    `${payload.payloadsCurrentDrawAmount.OBC.amounts.toFixed(1)}${payload.payloadsCurrentDrawAmount.OBC.units}`
                state.payloads.currentDrawAmount.Camera = 
                 `${payload.payloadsCurrentDrawAmount.Camera.amounts.toFixed(1)}${payload.payloadsCurrentDrawAmount.Camera.units}`
            }

        },
        setScaleDrawAmplitude(state){
            const payload = state.rawData

            if(Object.keys(state.rawData).length){
                const msgHelper:{ [key: number]: [string, string] } = {
                    1: ["low", "green"],
                    2: ["high", "yellow"],
                    3: ["extremely high", "red"]
                }
                state.payloads.scaleDrawAmplitude.OBC = msgHelper[payload.payloadsScaleDrawAmplitude.OBC]
                state.payloads.scaleDrawAmplitude.Camera = msgHelper[payload.payloadsScaleDrawAmplitude.Camera]
            }

        },
        setDisconnectedPayloads(state){
            const payload = state.rawData

            if(Object.keys(state.rawData).length){
                state.payloads.disconnected.OBC = payload.payloadsDisconnected.OBC
                state.payloads.disconnected.Camera = payload.payloadsDisconnected.Camera
            }

        },
        setCommonPayloadsValues(state){
            const payload = state.rawData

            if(Object.keys(state.rawData).length){
                state.payloads.maximumDraw = 
                    `${payload.payloadMaximumDraw.amounts}${payload.payloadMaximumDraw.units}`
                state.payloads.minimumDraw = 
                    `${payload.payloadMinimumDraw.amounts}${payload.payloadMinimumDraw.units}`
            }

        },
        setMessenger(state){
            if(Object.keys(state.rawData).length){
                //
                state.messenger = []
            
                // Batteres msg:
                for (let [name, value] of Object.entries(state.batteries.totalChargeAmount)){
                    
                    let {stringValue} = value
                    stringValue = stringValue.replace("V", "")

                    const packId = name[name.length-1]
                    
                    Number(stringValue) >= Number(state.batteries.capacity) 
                        && state.messenger.push(
                            [
                                currnetMsgId,
                                `Pack-${packId} has reached the maximum capacity of ${value.stringValue}`
                            ]
                        )
                    Number(stringValue) < Number(state.batteries.minimumThresholdCapacity)
                        && state.messenger.push(
                            [
                                currnetMsgId, 
                                `Pack-${packId} needs charging - ${value.stringValue}.\nMinimum threshold has been passed - ${state.batteries.minimumThresholdCapacity}V`
                            ]
                        )
                    currnetMsgId++
                }
                // Payloads msg:
                for (let [payload, value] of Object.entries(state.payloads.scaleDrawAmplitude)){
                    const [ _ , level] = value
                    level != "low" && state.messenger.push([currnetMsgId, `${payload} is in the ${level} Current draw zone`])
                    currnetMsgId++
                }
            }

            // console.log("state.messenger >>>", state.messenger);
    
        },
    },
    extraReducers:(builder)=>{
        builder
            .addCase(
                fetchSatelliteState.fulfilled,
                (state, action:PayloadAction<Response>)=>{
                    if (action.payload.status != 404){
                        state.rawData = action.payload.data
                    }
                }
            )
    }
})

export const fetchSatelliteState = createAsyncThunk(
    "satellite/fetchSatelliteState",
    async (action?: commands):Promise<Response>=>{
        
        let request: Request = {};
    
        if (action && Object.keys(action).length){
            request = {
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(action)
            }
        }
        const response = await fetch("http://localhost:3030/satellite", request)
        const data: SatelliteIncommingState = await response.json()
        return {data, status: response.status}
    }
)

export const {
    setTotalChargeAmount,
    setCurrentAccumulatedChargeAmount,
    setBatteriesCommonValues,
    setCurrentDrawAmount,
    setScaleDrawAmplitude,
    setDisconnectedPayloads,
    setCommonPayloadsValues,
    setMessenger

} = SatelliteSlice.actions

export default SatelliteSlice.reducer;