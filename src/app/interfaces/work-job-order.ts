import { AlertType } from "./alert";

export interface WorkJobOrder {
    workJobOrderNumber?: string;
    workJobOrderDate?: string;
    lotNumber?: string;
    lotSize?: number;
    lotSizeUnits?: string;
    manufacturingBatchNumber?: string;
    manufacturingBatchSize?: number;
    manufacturingBatchUnits?: string;
    workOrderJobNotes?: string;
    subscriberId?: number;
    subscriberName?: string;
    componentProductDrawNumber?: string;
    customerPONumber?: string;
    wjOrderId?: number;
}

export interface WorkJobOrderDialog {
    title?: string;
    content?: string;
    confirm?: boolean;
    message?: string;
    fomControlName?: string;
    actionControlText: string;
    enableControlsOrExit?: boolean;
    type?: AlertType;
}

export interface WorkJobOrderConfirm {
    workNumberConfirm?: boolean;
    lotNumberConfirm?: boolean;
    lotSizeConfirm?: boolean;
    batchNumberConfirm?: boolean;
    batchSizeConfirm?: boolean;
}
