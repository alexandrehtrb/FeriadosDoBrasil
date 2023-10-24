const DOMINGO = 0;
const SEGUNDA_FEIRA = 1;
const TERCA_FEIRA = 2;
const QUARTA_FEIRA = 3;
const QUINTA_FEIRA = 4;
const SEXTA_FEIRA = 5;
const SABADO = 6;

const JANEIRO = 1 - 1;
const FEVEREIRO = 2 - 1;
const MARCO = 3 - 1;
const ABRIL = 4 - 1;
const MAIO = 5 - 1;
const JUNHO = 6 - 1;
const JULHO = 7 - 1;
const AGOSTO = 8 - 1;
const SETEMBRO = 9 - 1;
const OUTUBRO = 10 - 1;
const NOVEMBRO = 11 - 1;
const DEZEMBRO = 12 - 1;

Date.prototype.addDays = function (days) {
    days = parseInt(days, 10);
    return new Date(this.valueOf() + 1000 * 60 * 60 * 24 * days);
}

Date.prototype.isEqualTo = function (otherDate) {
    return this.getTime() === otherDate.getTime();
}

Date.prototype.getNextWeekday = function (nextDayOfWeek) {
    var thisDayOfWeek = this.getDay();
    if (thisDayOfWeek == nextDayOfWeek) {
        return this;
    }
    else {
        var daysToAdd = (nextDayOfWeek + 7 - thisDayOfWeek) % 7;
        return this.addDays(daysToAdd);
    }
}

Date.prototype.countDaysUpTo = function (endDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((endDate - this) / oneDay)) + 1;
}
