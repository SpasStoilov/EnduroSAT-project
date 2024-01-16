export interface SatelliteIncommingState{
    batteriesChargeAmount: {
        amounts: number[];
        units:string;
    };
    batteriesCurrentIncommingAmount: {
        amounts:number[];
        units:string;
    };
    batteriesChargeOn: boolean[];
    batteriesCapacity: {
        amounts: number;
        units: string;
    };
    batteriesMinimumThresholdCapacity: {
        amounts: number;
        units: string;
    };
    //
    payloadsCurrentDrawAmount: {
        OBC: {
            amounts:number;
            units: string;
        };
        Camera: {
            amounts: number;
            units: string;
        };
    };
    payloadsScaleDrawAmplitude: {
        OBC: number;
        Camera: number;
    };
    payloadsDisconnected: {
        OBC: boolean;
        Camera: boolean;
    };
    payloadMinimumDraw: {
        amounts: number;
        units: string;
    };
    payloadMaximumDraw: {
        amounts:number;
        units: string;
    };
}


export type commands = {
    [key:string]:{
        value:any; 
        index?:number;
    };
};

export enum PayloadsTypes {First="OBC", Second="Camera"}

export interface SatelliteState {
    batteries:{
        totalChargeAmount: {
            charge1:{
                stringValue:string;
                procentValue:number;
            };
            charge2:{
                stringValue:string;
                procentValue:number;
            };
        },
        currentAccumulatedChargeAmount: {
            amount1:string;
            amount2:string;
        },
        chargeB1: boolean | null;
        chargeB2: boolean | null;
        capacity: string;
        minimumThresholdCapacity:string;
    };
    //
    payloads:{
        currentDrawAmount: {
            OBC: string;
            Camera: string;
        };
        scaleDrawAmplitude: {
            OBC:  [string, string];
            Camera:  [string, string];
        };
        disconnected:{
            OBC: boolean | null;
            Camera: boolean | null;
        };
        maximumDraw: string;
        minimumDraw: string;
    };
    messenger: ([number, string] | undefined)[];
    rawData: SatelliteIncommingState;
    commands?:commands
}

export type Request = {
    method?: string;
    headers?: {
        "Content-Type": string;
    },
    body?: string;
}
export type Response = {
    data: SatelliteIncommingState;
    status: number;
}