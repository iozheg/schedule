import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';

//import 'rxjs/add/operator/switchMap';
//import { Observable } from 'rxjs/Observable';

import { Schedule } from '../schedule';
import { SearchParamService } from '../search-param.service';
import { SCHEDULES } from '../mock-schedules';

@Component({
    //selector: 'schedule-choice',
    templateUrl: 'schedule-choice.component.html',
    styleUrls: ['schedule-choice.component.css']
})

export class ScheduleChoiceComponent implements OnInit {
    
    carwashName: string;
    date: Date;
    schedules = SCHEDULES;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private searchParam: SearchParamService
    ) {}

    ngOnInit() { 
        this.carwashName = this.searchParam.carwashName;
        this.date = this.searchParam.date || new Date();
    }

    scheduleClick(id): void{
        this.searchParam.selectedScheduleId = id;
        this.router.navigate(['/schedules/time']);
    }
}