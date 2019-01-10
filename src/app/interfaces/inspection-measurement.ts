import { AlertType } from './alert';
import { PartIdentificationData } from './part-identification';

export interface InspectionMeasurement {
    subscriberId?: number;
    inspStageId?: number;
    inspStageName?: string;
    subscriberName?: string;
    inspectionMeasurementId?: number;
    inspectionReportNumber?: string;
    compProductDrawNum?: string;
    lotNumber?: string;
    lotSize?: number;
    manufacturingBatchNumber?: string;
    manufacturingBatchSize?: number;
    componentProductName?: string;
    inspectionType?: number;
    inspectionStage?: number;
    facilityMachineNumber?: string;
    facilityMachineName?: string;
    userId?: string;
    userName?: string;
    inspectionDate?: string;
    shiftID?: string;
    shiftName?: string;
    customerPONumber?: string;
    customerPOQuantity?: number;
    customerPODate?: string;
    customerNameAddress?: string;
    workOrderId?: number;
    workJobOrderNumber?: string;
    partIdentificationNumber?: string;
    measurementName?: string;
    measuredValue?: number;
    actualBaseMeasure?: string;
    actualUpperLimit?: number;
    partIdentifications?: PartIdentificationData[];
    producedQuantity?: number;
    inspectedQuantity?: number;
}

export interface InspectionMeasurementDialog {
    title?: string;
    content?: string;
    confirm?: boolean;
    message?: string;
    fomControlName?: string;
    actionControlText: string;
    enableControlsOrExit?: boolean;
    type?: AlertType;
}

export interface InspectionMeasurementConfirm {
    reportNumber?: boolean;
    workNumberConfirm?: boolean;
    lotNumberConfirm?: boolean;
    lotSizeConfirm?: boolean;
    batchNumberConfirm?: boolean;
    batchSizeConfirm?: boolean;
}