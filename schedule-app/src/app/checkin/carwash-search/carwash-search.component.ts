import { Component, OnInit }    from '@angular/core';
import { Router }               from '@angular/router';
//import { HttpClient } from '@angular/common/http';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
 
// Observable class extensions
import 'rxjs/add/observable/of';
 
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

import { SearchParamService } from '../search-param.service';
import { ScheduleService } from '../../schedule.service';

@Component({
//    selector: 'carwash-search',
    templateUrl: 'carwash-search.component.html',
    styleUrls: ['carwash-search.component.css']
})

export class CarwashSearchComponent implements OnInit {

    carwashName: string;
    datepickerDate: Date;
    options: string[];

    schedulesNames: Observable<string[]>;
    private searchTerms = new Subject<string>();

    constructor( 
        private searchParam: SearchParamService,
        private router: Router,
        private scheduleService: ScheduleService
    ) { }

    searchSchedulesByName(term: string): void{
        this.searchTerms.next(term);
    }

    ngOnInit() { 
        this.carwashName = this.searchParam.carwashName;
        this.datepickerDate = this.searchParam.date || new Date();

    //    this.options = ['first', 'second', 'sixth'];

        this.schedulesNames = this.searchTerms
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap( term => term 
                ? this.scheduleService.getNamesOfSchedules(term)
                : Observable.of<string[]>([]))
            .catch(error => {
                // TODO: add real error handling
                console.log(error);
                return Observable.of<string[]>([]);
            });
    }

    onChange(event: any): void{
      /*  this.date = this.datepickerDate; /*this.datepickerDate.getDate() 
                    + '.' + this.datepickerDate.getMonth()
                    + '.' + this.datepickerDate.getFullYear();*/

    //    this.searchParam.date = this.datepickerDate;
    }

    searchButtonClick(){
        this.searchParam.date = this.datepickerDate;
        this.searchParam.carwashName = this.carwashName;

        this.router.navigate(['/schedules']);
    }

    filter(val: string): string[] {
        return this.options.filter(option =>
          option.toLowerCase().indexOf(val.toLowerCase()) === 0);
     }
}