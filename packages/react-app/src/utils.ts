export function tsToDate(ts: string): Date {
    return new Date(Number(ts) * 1000);
}

export function timesAgo(date: Date): string { // source: https://stackoverflow.com/a/55999110/458679
    const seconds = Math.floor((+new Date() - +date) / 1000); // get the diffrence of date object sent with current date time of the system time
    let interval = Math.floor(seconds / 31536000); // divide seconds by seconds in avg for a year to get years 

    //conditioning based on years derived above 
    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000); // months check similar to years
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400); // days check similar to above 
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600); // hours check
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60); // minutes check 
    if (interval > 1) {
        return interval + " min";
    }
    return Math.floor(seconds) + " seconds"; // seconds check at the end
}

// withYears        22 years
// withMonths       9 months
// withDays         5 days
// withPreviousDay  24 hours
// withHours        2 hours
// withMinutes      5 min

