import TypeFlow from './TypeFlow'

export default class DateTypeFlow extends TypeFlow {
  inputFormat () {
    return 'YYYY-MM-DD'
  }

  open () {
    this.component.showDatePicker()
  }

  selectDay (year, month, day) {
    super.selectDay(year, month, day)

    if (this.component.autoClose) {
      this.component.close()
    }
  }
}
