import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

//import 'rxjs/add/operator/switchMap';
//import { Observable } from 'rxjs/Observable';

import { Schedule } from '../schedule';
import { SearchParamService } from '../search-param.service';
import { SCHEDULES } from '../mock-schedules';
import { ScheduleService } from '../../schedule.service';

@Component({
    //selector: 'schedule-choice',
    templateUrl: 'schedule-choice.component.html',
    styleUrls: ['schedule-choice.component.css']
})

export class ScheduleChoiceComponent implements OnInit {
    
    carwashName: string;
    date: Date;
    schedules: Schedule[];
    
    constructor(
        private router: Router,
        private searchParam: SearchParamService,
        private scheduleService: ScheduleService
    ) {}

    ngOnInit() { 
        this.carwashName = this.searchParam.carwashName || '';
        this.date = this.searchParam.date;

        this.scheduleService.getSchedulesBriefInfo(this.carwashName)
            .then( schedules => this.schedules = schedules );

    //    console.log(this.searchParam);
    }

    scheduleClick(id): void{
        this.searchParam.date = this.date;
        this.searchParam.selectedScheduleId = id;
    //    this.searchParam.carwashName = getScheduleById(id).name;
        
        this.router.navigate(['/schedules/time']);
    }
/*
    getScheduleById(id: number): Schedule{
        for(let sch in this.schedules){
            if (SCHEDULES[sch].id == id)
                return SCHEDULES[sch];
        }
    
        return null;*/
}