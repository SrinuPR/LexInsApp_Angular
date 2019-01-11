import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SubscribersComponent } from './subcribers.component';

@Component({
    selector: 'app-users-list-dialog',
    templateUrl: './users-list-dialog.component.html',
    styleUrls: ['./users-list-dialog.component.scss']
})

export class UsersListDialogComponent {
    currentPage = 0;
    pageSize = 5;
    pagedResults: Array<any> = [];
    constructor(
        public dialogRef: MatDialogRef<SubscribersComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserListDialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    pageChange(event) {
        this.currentPage = event.pageIndex;
        this.getPageChanged();
    }

    getPageChanged() {
        const start: number = this.currentPage * this.pageSize;
        const end: number = start + this.pageSize;
        this.pagedResults = this.data.userDetails.slice(start, end);
    }
}

export interface UserListDialogData {
    subscriberName: string;
    userDetails: Array<string>;
}
