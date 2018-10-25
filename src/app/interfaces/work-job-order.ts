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
    SubscriberName?: string;
    componentProductDrawNumber?: string;
    customerPONumber?: string;
}

export interface WorkJobOrderDialog {
    workJobOrderNumber?: string;
    workJobOrderAcknwldgmnt?: boolean;
}
