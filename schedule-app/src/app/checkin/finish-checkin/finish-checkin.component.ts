import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SearchParamService } from '../search-param.service';

@Component({
    templateUrl: 'finish-checkin.component.html',
    styleUrls: ['finish-checkin.component.css']
})

export class FinishCheckinComponent implements OnInit {

    carwashName: string;
    date: Date;
    time: string;

    constructor(private searchParam: SearchParamService) { }

    ngOnInit() { 
        this.carwashName = this.searchParam.carwashName;
        this.date = this.searchParam.date;
        this.time = this.searchParam.time;
    }
}