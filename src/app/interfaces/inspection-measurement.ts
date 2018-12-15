export interface InspectionMeasurement {
    subscriberId?: number;
    inspStageId?: number;
    inspStageName?: string;
    subscriberName?: string;
    inspectionMeasurementId?: number;
    inspectionReportNumber?: string;
    componentProductDrawNumber?: string;
    lotNumber?: string;
    lotSize?: number;
    manBatchNum?: string;
    manBatchSize?: number;
    componentProductName?: string;
    inspectionType?: number;
    inspectionStage?: number;
    machineNumber?: string;
    machineName?: string;
    userName?: string;
    inspectionDate?: Date;
    shiftId?: string;
    shiftName?: string;
    customerPONumber?: string;
    customerPOQuantity?: number;
    customerPODate?: Date;
    customerNameAddress?: string;
}
