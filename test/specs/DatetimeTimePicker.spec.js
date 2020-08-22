import { createVM } from '../helpers/utils.js'
import DatetimeTimePicker from 'src/DatetimeTimePicker.vue'

describe('DatetimeTimePicker.vue', function () {
  describe('render', function () {
    it('should render the time picker', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker :hour="3" :minute="45"></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker }
        })

      expect(vm.$('.vdatetime-time-picker')).to.exist

      const hours = vm.$$('.vdatetime-time-picker__list--hours .vdatetime-time-picker__item').map(el => el.textContent)
      expect(hours).eql(['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'])

      const minutes = vm.$$('.vdatetime-time-picker__list--minutes .vdatetime-time-picker__item').map(el => el.textContent)
      expect(minutes).eql(['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'])

      const selected = vm.$$('.vdatetime-time-picker__item--selected').map(el => el.textContent)
      expect(selected).eql(['03', '45'])
    })

    it('should render the time picker in 12 hour format', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker :hour="3" :minute="45" use12-hour></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker }
        })

      expect(vm.$('.vdatetime-time-picker')).to.exist

      const hours = vm.$$('.vdatetime-time-picker__list--hours .vdatetime-time-picker__item').map(el => el.textContent)
      expect(hours).eql(['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'])

      const minutes = vm.$$('.vdatetime-time-picker__list--minutes .vdatetime-time-picker__item').map(el => el.textContent)
      expect(minutes).eql(['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'])

      const selected = vm.$$('.vdatetime-time-picker__item--selected').map(el => el.textContent)
      expect(selected).eql(['3', '45', 'am'])
    })

    it('should render the time picker in 12 hour format (pm)', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker :hour="13" :minute="45" use12-hour></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker }
        })

      expect(vm.$('.vdatetime-time-picker')).to.exist

      const hours = vm.$$('.vdatetime-time-picker__list--hours .vdatetime-time-picker__item').map(el => el.textContent)
      expect(hours).eql(['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'])

      const minutes = vm.$$('.vdatetime-time-picker__list--minutes .vdatetime-time-picker__item').map(el => el.textContent)
      expect(minutes).eql(['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'])

      const selected = vm.$$('.vdatetime-time-picker__item--selected').map(el => el.textContent)
      expect(selected).eql(['1', '45', 'pm'])
    })

    it('should render the time picker with custom steps', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker :hour="3" :minute="45" :hour-step="2" :minute-step="15"></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker }
        })

      const hours = vm.$$('.vdatetime-time-picker__list--hours .vdatetime-time-picker__item').map(el => el.textContent)
      expect(hours).eql(['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'])

      const minutes = vm.$$('.vdatetime-time-picker__list--minutes .vdatetime-time-picker__item').map(el => el.textContent)
      expect(minutes).eql(['00', '15', '30', '45'])
    })

    it('should disable time before min time', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker :hour="8" :minute="52" min-time="08:32"></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker }
        })

      const hours = vm.$$('.vdatetime-time-picker__list--hours .vdatetime-time-picker__item')

      hours.forEach(hour => {
        const hourNumber = parseInt(hour.textContent)
        // this is disabling too many
        if (hourNumber < 8) {
          expect(hour).to.have.class('vdatetime-time-picker__item--disabled')
        } else {
          expect(hour).to.have.not.class('vdatetime-time-picker__item--disabled')
        }
      })

      const minutes = vm.$$('.vdatetime-time-picker__list--minutes .vdatetime-time-picker__item')

      minutes.forEach(minute => {
        const minuteNumber = parseInt(minute.textContent)

        if (minuteNumber < 32) {
          expect(minute).to.have.class('vdatetime-time-picker__item--disabled')
        } else {
          expect(minute).to.have.not.class('vdatetime-time-picker__item--disabled')
        }
      })
    })

    it('should disable time after max time', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker :hour="15" :minute="11" max-time="15:21"></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker }
        })

      const hours = vm.$$('.vdatetime-time-picker__list--hours .vdatetime-time-picker__item')

      hours.forEach(hour => {
        const hourNumber = parseInt(hour.textContent)
        if (hourNumber > 15) {
          expect(hour).to.have.class('vdatetime-time-picker__item--disabled')
        } else {
          expect(hour).to.have.not.class('vdatetime-time-picker__item--disabled')
        }
      })

      const minutes = vm.$$('.vdatetime-time-picker__list--minutes .vdatetime-time-picker__item')

      minutes.forEach(minute => {
        const minuteNumber = parseInt(minute.textContent)

        if (minuteNumber > 21) {
          expect(minute).to.have.class('vdatetime-time-picker__item--disabled')
        } else {
          expect(minute).to.have.not.class('vdatetime-time-picker__item--disabled')
        }
      })
    })

    it('should disable time after max time (midnight)', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker :hour="0" :minute="0" max-time="00:00"></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker }
        })

      const hours = vm.$$('.vdatetime-time-picker__list--hours .vdatetime-time-picker__item')

      hours.forEach(hour => {
        const hourNumber = parseInt(hour.textContent)

        if (hourNumber > 0) {
          expect(hour).to.have.class('vdatetime-time-picker__item--disabled')
        } else {
          expect(hour).to.have.not.class('vdatetime-time-picker__item--disabled')
        }
      })

      const minutes = vm.$$('.vdatetime-time-picker__list--minutes .vdatetime-time-picker__item')

      minutes.forEach(minute => {
        const minuteNumber = parseInt(minute.textContent)

        if (minuteNumber > 0) {
          expect(minute).to.have.class('vdatetime-time-picker__item--disabled')
        } else {
          expect(minute).to.have.not.class('vdatetime-time-picker__item--disabled')
        }
      })
    })

    it('should render the time picker with am/pm suffixes', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker :hour="15" :minute="11" use12-hour></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker }
        })

      const suffixes = vm.$$('.vdatetime-time-picker__list--suffix .vdatetime-time-picker__item').map(el => el.textContent)
      expect(suffixes).eql(['am', 'pm'])
    })
  })

  describe('events', function () {
    it('should emit change event on select a hour', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker @change="onChange" :hour="3" :minute="45"></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker },
          data () {
            return {
              hour: null
            }
          },
          methods: {
            onChange ({ hour }) {
              this.hour = hour
            }
          }
        })

      vm.$$('.vdatetime-time-picker__list--hours .vdatetime-time-picker__item')[10].click()
      expect(vm.hour).to.be.equal(10)
    })

    it('should not emit change event on select a disabled hour', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker @change="spy" :hour="12" :minute="45" max-time="04:15"></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker },
          data () {
            return {
              spy: sinon.spy()
            }
          }
        })

      vm.$$('.vdatetime-time-picker__list--hours .vdatetime-time-picker__item')[10].click()
      expect(vm.spy).to.have.not.been.called
    })

    it('should emit change event on select a minute', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker @change="onChange" :hour="3" :minute="45"></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker },
          data () {
            return {
              minute: null
            }
          },
          methods: {
            onChange ({ minute }) {
              this.minute = minute
            }
          }
        })

      vm.$$('.vdatetime-time-picker__list--minutes .vdatetime-time-picker__item')[30].click()
      expect(vm.minute).to.be.equal(30)
    })

    it('should not emit change event on select a disabled minute', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker @change="spy" :hour="3" :minute="45" max-time="03:15"></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker },
          data () {
            return {
              spy: sinon.spy()
            }
          }
        })

      vm.$$('.vdatetime-time-picker__list--minutes .vdatetime-time-picker__item')[30].click()
      expect(vm.spy).to.have.not.been.called
    })

    it('should emit change event on suffix change am -> pm', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker @change="onChange" :hour="3" :minute="45" use12-hour></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker },
          data () {
            return {
              hour: null,
              suffixTouched: false
            }
          },
          methods: {
            onChange ({ hour, suffixTouched }) {
              this.hour = hour
              this.suffixTouched = suffixTouched
            }
          }
        })

      vm.$$('.vdatetime-time-picker__list--suffix .vdatetime-time-picker__item')[1].click()
      expect(vm.hour).to.be.equal(15)
      expect(vm.suffixTouched).to.be.equal(true)
    })

    it('should emit change event on suffix change pm -> am', function () {
      const vm = createVM(this,
        `<DatetimeTimePicker @change="onChange" :hour="13" :minute="45" use12-hour></DatetimeTimePicker>`,
        {
          components: { DatetimeTimePicker },
          data () {
            return {
              hour: null,
              suffixTouched: false
            }
          },
          methods: {
            onChange ({ hour, suffixTouched }) {
              this.hour = hour
              this.suffixTouched = suffixTouched
            }
          }
        })

      vm.$$('.vdatetime-time-picker__list--suffix .vdatetime-time-picker__item')[0].click()
      expect(vm.hour).to.be.equal(1)
      expect(vm.suffixTouched).to.be.equal(true)
    })
  })
})
