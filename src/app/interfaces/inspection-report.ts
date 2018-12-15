import { AlertType } from './alert';

export interface InspectionReport {
    inspReportNumber?: string;
    workJobOrderNumber?: string;
    lotNumber?: string;
    lotSize?: number;
    inspectionTypeId?: string;
    inspectionStageId?: string;
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