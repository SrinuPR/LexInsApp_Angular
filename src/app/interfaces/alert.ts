export interface Alert {
    message?: string;
    showAlert?: boolean;
    isSuccess?: boolean;
    type?: AlertType;
}

export enum AlertType {
    INFO = 'INFO',
    ERROR = 'ERROR',
    WARNING = 'WARNING'
}
