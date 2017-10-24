import { Schedule } from './schedule';

export const SCHEDULES: Schedule[] = [
    new Schedule({id: 1, name: 'first', 
                description: 'This is first carwash',
                tel_number: '+79199194565',
                address: 'tyumen',
                work_days: 63,
                work_time_start: new Date().setHours(8,0,0,0), 
                work_time_end: new Date().setHours(22,0,0,0),
                dinner_break_start: new Date().setHours(12,30,0,0),
                dinner_break_end: new Date().setHours(13,0,0,0),
                time_interval: new Date().setHours(0,15,0,0),
                checkin_amount: 1,
                active: true,
                create_date: new Date(),
                owner: 1
            }),
    new Schedule({id: 2, name: 'second', 
                work_days: 1, 
                work_time_start: new Date().setHours(8,0,0,0), 
                work_time_end: new Date().setHours(7,30,0,0),
                time_interval: new Date().setHours(0,30,0,0),
            }),
    new Schedule({id: 3, name: 'third', 
                work_days: 5,
                work_time_start: new Date().setHours(8,0,0,0), 
                work_time_end: new Date().setHours(7,30,0,0),
                time_interval: new Date().setHours(2,0,0,0),
            }),
    new Schedule({id: 4, name: 'fourth', 
                work_days: 127,
                work_time_start: new Date().setHours(8,0,0,0), 
                work_time_end: new Date().setHours(0,0,0,0),
                time_interval: new Date().setHours(0,30,0,0),
            }),
/*    new Schedule({id: 5, name: 'fifth', work_days: 64}),
    new Schedule({id: 6, name: '6first', work_days: 4}),
    new Schedule({id: 7, name: '7second'}),
    new Schedule({id: 8, name: '8third'}),
    new Schedule({id: 9, name: '9fourth'}),
    new Schedule({id: 10, name: '10fifth'}),
    new Schedule({id: 2, name: 'second', work_days: 1}),
    new Schedule({id: 3, name: 'third', work_days: 5}),
    new Schedule({id: 4, name: 'fourth', work_days: 127}),
    new Schedule({id: 5, name: 'fifth', work_days: 64}),
    new Schedule({id: 6, name: '6first', work_days: 4}),
    new Schedule({id: 7, name: '7second'}),
    new Schedule({id: 8, name: '8third'}),
    new Schedule({id: 9, name: '9fourth'}),
    new Schedule({id: 10, name: '10fifth'})*/
]

export function getScheduleById(id: number): Schedule{
    for(let sch in SCHEDULES){
        if (SCHEDULES[sch].id == id)
            return SCHEDULES[sch];
    }

    return null;
}