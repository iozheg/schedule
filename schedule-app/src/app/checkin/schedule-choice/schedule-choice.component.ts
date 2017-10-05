import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';

//import 'rxjs/add/operator/switchMap';
//import { Observable } from 'rxjs/Observable';

import { Schedule } from '../schedule';
import { SCHEDULES } from '../mock-schedules';

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
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() { 
        this.carwashName = this.route.snapshot.paramMap.get('carwashName') || 'none';
        this.date = this.route.snapshot.paramMap.get('date') || 'none';
    }

    scheduleClick(id): void{
        this.router.navigate(['/schedules/time', {scheduleId: id, date: this.date}]);
    }
}