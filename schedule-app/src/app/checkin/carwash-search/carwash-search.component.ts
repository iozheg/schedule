import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SearchParamService } from '../search-param.service';

@Component({
    selector: 'carwash-search',
    templateUrl: 'carwash-search.component.html',
    styleUrls: ['carwash-search.component.css']
})

export class CarwashSearchComponent implements OnInit {

    carwashName: string;
    datepickerDate: Date;
//    date: Date;

    constructor( 
        private searchParam: SearchParamService,
        private router: Router
    ) { }

    ngOnInit() { 
        this.carwashName = this.searchParam.carwashName;
        this.datepickerDate = this.searchParam.date || new Date();
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
}