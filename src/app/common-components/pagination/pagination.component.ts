import { Component, OnDestroy, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
    @Input() dataLength;
    @Input() pageSize = 10;
    @Input() currentPage = 1;
    @Output() pageChange = new EventEmitter<any>();
    pageSizeOptions = [5, 10, 20];

    changePage(event) {
        this.pageChange.emit(event);
    }
}


