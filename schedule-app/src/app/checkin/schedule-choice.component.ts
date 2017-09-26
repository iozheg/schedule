import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap} from '@angular/router';

import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { Schedule } from './schedule';
import { SCHEDULES } from './mock-schedules';

@Component({
    //selector: 'schedule-choice',
    templateUrl: 'schedule-choice.component.html',
    styleUrls: ['schedule-choice.component.css']
})

export class ScheduleChoiceComponent implements OnInit {
    
    carwashName: string;
    date: string;
    schedules = SCHEDULES;
    
    constructor(
        private route: ActivatedRoute
    ) {}

    ngOnInit() { 
        this.carwashName = this.route.snapshot.paramMap.get('carwashName') || 'none';
        this.date = this.route.snapshot.paramMap.get('date') || 'none';
    /*    this.route.paramMap
            .switchMap((params: ParamMap) => {
                

                alert(this.date);
                return new Observable();
            })*/
    }

    scheduleClick(id): void{
        alert(id);
    }
}