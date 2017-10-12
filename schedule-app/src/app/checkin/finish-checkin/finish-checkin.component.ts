import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SearchParamService } from '../search-param.service';
import { UTCDate } from '../../time';

@Component({
    templateUrl: 'finish-checkin.component.html',
    styleUrls: ['finish-checkin.component.css']
})

export class FinishCheckinComponent implements OnInit {

    carwashName: string;
    selectedDate: UTCDate;
    time: string;

    constructor(private searchParam: SearchParamService) { }

    ngOnInit() { 
        this.carwashName = this.searchParam.carwashName;
        this.selectedDate = this.searchParam.date;
        this.time = this.searchParam.time;
    }
}