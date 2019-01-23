import { Injectable } from '@angular/core';
import { InspectionReport, InspectionReportConfirm } from '../interfaces/inspection-report';
import { HttpService } from './http.service';
import { InspectionMeasurement } from '../interfaces/inspection-measurement';

@Injectable({
    providedIn: 'root'
})
export class InspectionReportService {
    inspectionReport: InspectionReport;
    inspectionReportConfirm: InspectionReportConfirm;
    constructor(public httpService: HttpService) {
        this.inspectionReport = {};
        this.inspectionReportConfirm = {};
    }

    getComponentData(subscriberId: number) {
        return this.httpService.get('inspectionMaster/componentDrawNum/' + subscriberId);
    }

    getCustomerPOData(subscriberId: number) {
        return this.httpService.get('/workjoborder/customerpo/' + subscriberId);
    }

    getWorkJobOrderByPCNum(productComNum: number) {
        return this.httpService.get('workjoborder/wjList/' + productComNum);
    }

    createInspectionReport(iReport: InspectionReport) {
        return this.httpService.post('inspectionreportmaster/reportsave', iReport);
    }

    getInspectionTypesOfComponent(compNumber: number) {
        return this.httpService.get('inspectionMaster/inspData/' + compNumber);
    }

     getInspectionMeasurementsForPid(compNumber: number) {
         return this.httpService.get('insplineitem/report/' + compNumber).map(res => {
             console.log('result from srevice:' + res);
             return res.body.results;
         });
     }
     addPartForMeasurements(partNum: number, iMeasurement: InspectionMeasurement) {
        return this.httpService.post('inspectionMeasurement/validate/' + partNum, iMeasurement).map(res => {
            console.log('result from srevice:' + res);
            return res.body.results;
        });
    }
    createPIForReport( iMeasurement: InspectionMeasurement) {
        return this.httpService.post('inspectionMeasurement/save', iMeasurement).map(res => {
            console.log('result from srevice:' + res);
            return res;
        });
    }

    createPIForPart( iMeasurement: InspectionMeasurement) {
        return this.httpService.post('inspectionMeasurement/savePart', iMeasurement).map(res => {
            console.log('result from srevice:' + res);
            return res ;
        });
    }
    getInspectionStagesOfComponent(compNumber: number) {
        return this.httpService.get('inspectionMaster/inspData/' + compNumber)
        .map(res => {
            console.log('result from srevice:' + res);
            return res.body.results;
        });
    }
}