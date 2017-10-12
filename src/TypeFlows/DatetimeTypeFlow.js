import TypeFlow from './TypeFlow'

export default class DatetimeTypeFlow extends TypeFlow {
  inputFormat () {
    return 'YYYY-MM-DD HH:mm'
  }

  open () {
    this.component.showDatePicker()
    this.timeSelected = false
  }

  ok () {
    if (this.component.show === 'date') {
      this.component.showTimePicker()
    } else {
      this.component.close()
    }
  }

  selectDay (year, month, day) {
    super.selectDay(year, month, day)

    if (this.component.autoContinue) {
      this.component.showTimePicker()
    }
  }
}
