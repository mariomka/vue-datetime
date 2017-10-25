export default class TypeFlow {
  constructor (component, date) {
    this.component = component
    this.date = date
  }

  setDate (date) {
    this.date = date
  }

  open () {}

  close () {}

  ok () {
    this.component.close()
  }

  selectDay (year, month, day) {
    this.date
      .year(year)
      .month(month)
      .date(day)
  }

  selectHour (hour) {
    this.date.hour(hour)

    if (this.timeSelected && this.component.autoClose) {
      this.component.close()
    }

    this.timeSelected = true
  }

  selectMinute (minute) {
    this.date.minute(minute)

    if (this.timeSelected && this.component.autoClose) {
      this.component.close()
    }

    this.timeSelected = true
  }

  format (date, format) {
    return date ? date.format(format) : ''
  }

  isoDate () {
    return this.date.toISOString()
  }
}
