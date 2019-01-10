import { AlertType } from './alert';
import { PartIdentificationData } from './part-identification';

export class InspectionReport {
    inspReportNumber?: string;
    workJobOrderNumber?: string;
    lotNumber?: string;
    lotSize?: number;
    inspectionTypeId?: string;
    inspectionStageId?: string;
    inspectionDate?: string;
    manufacturingBatchNumber?: string;
    manufacturingBatchSize?: number;
    subscriberId?: number;
    subscriberName?: string;
    componentProductDrawNumber?: string;
    componentProdcuctName?: string;
    customerPONumber?: string;
    customerPoDate?: string;
    customerPoQuantity?: string;
    userId?: string;
    workJobOrderId?: number;
    customerNameAddress?: string;
    lineItemData?: PartIdentificationData[];
}


export interface InspectionReportDialog {
    title?: string;
    content?: string;
    confirm?: boolean;
    message?: string;
    fomControlName?: string;
    actionControlText: string;
    enableControlsOrExit?: boolean;
    type?: AlertType;
}

export interface InspectionReportConfirm {
    reportNumber?: boolean;
    workNumberConfirm?: boolean;
    lotNumberConfirm?: boolean;
    lotSizeConfirm?: boolean;
    batchNumberConfirm?: boolean;
    batchSizeConfirm?: boolean;
}