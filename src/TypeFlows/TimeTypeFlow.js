import TypeFlow from './TypeFlow'

export default class TimeTypeFlow extends TypeFlow {
  inputFormat () {
    return 'HH:mm'
  }

  open () {
    this.component.showTimePicker()
  }

  isoDate () {
    return this.date.format('HH:mm') + ':00Z'
  }
}
