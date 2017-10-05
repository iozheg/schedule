export class Checkin {
    date: Date;
    time: Date;
    
    schedule: number;    
    client: number;

    create_date: Date;
    active: boolean;

    constructor(checkin){
        this.schedule = checkin.schedule;
        this.date = new Date(checkin.date);
        this.time = new Date(checkin.time);
        this.create_date = new Date(checkin.create_date);
        this.active = checkin.active;
        this.client = checkin.client;
    }

    get checkinDate (): string {
        // Return checkin date in format 'dd.mm.yyyy'
        return this.date.getDate() + '.' + this.date.getMonth() 
                + '.' + this.date.getFullYear();
    }

    get checkinTime (): string {
        // Return checkin time in format 'hh:mm'
        return this.preceding_0(this.time);
    }
    get createDate (): string {
        // Return create date in format 'dd.mm.yyyy'
        return this.create_date.getDate() + '.' + this.create_date.getMonth() 
                + '.' + this.create_date.getFullYear();
    }

    private preceding_0(value: Date): string {
        // Add the preceding '0' to output string if hours or minutes <10
        let hoursStr = value.getHours() < 10 ? '0' + value.getHours() : value.getHours().toString();
        let minutesStr = value.getMinutes() < 10 ? '0' + value.getMinutes() : value.getMinutes().toString();

        return hoursStr + ":" + minutesStr;
    }
}