import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'carwash-search',
    templateUrl: 'carwash-search.component.html',
    styleUrls: ['carwash-search.component.css']
})

export class CarwashSearchComponent implements OnInit {

    carwashName: string;
    datepickerDate: Date;
    date: string;

    constructor() { }

    ngOnInit() { }

    onChange(event: any): void{
        this.date = this.datepickerDate.getDate() 
                    + '.' + this.datepickerDate.getMonth()
                    + '.' + this.datepickerDate.getFullYear();
    }
}