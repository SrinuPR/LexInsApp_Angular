export interface PartIdentificationData {
    partVerifId: number;
    measurementName: string;
    measuredValue: number;
    actualBaseMeasure: number;
    actualUpperLimit: number;
    actualLowerLimit: number;
    deviation: number;
    status: string;
    partIdentificationNumber: number;
}