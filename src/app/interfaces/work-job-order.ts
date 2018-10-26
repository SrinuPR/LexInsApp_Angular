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
}

export interface WorkJobOrderDialog {
    title?: string;
    content?: string;
    confirm?: boolean;
}

export interface WorkJobOrderConfirm {
    workNumberConfirm?: boolean;
    lotNumberConfirm?: boolean;
    lotSizeConfirm?: boolean;
    batchNumberConfirm?: boolean;
    batchSizeConfirm?: boolean;
}
