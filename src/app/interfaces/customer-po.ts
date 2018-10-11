export interface CustomerPO {
    componentId: number;
    customerPoId?: number;
    subscriberId: number;
    subscriberName: string;
    customerPONumber: string;
    customerPODate: string;
    customerPOQuantity?: number;
    poNotes: string;
}
