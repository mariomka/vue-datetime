import { createVM } from '../helpers/utils.js'
import DatetimeTimePicker from 'src/DatetimeTimePicker.vue'

describe('DatetimeTimePicker.vue', function () {
  describe('render', function () {
    it('should render a time picker', function () {
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

    it('should render a time picker with custom steps', function () {
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
            onChange (hour) {
              this.hour = hour
            }
          }
        })

      vm.$$('.vdatetime-time-picker__list--hours .vdatetime-time-picker__item')[10].click()
      expect(vm.hour).to.be.equal(10)
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
            onChange (hour, minute) {
              this.minute = minute
            }
          }
        })

      vm.$$('.vdatetime-time-picker__list--minutes .vdatetime-time-picker__item')[30].click()
      expect(vm.minute).to.be.equal(30)
    })
  })
})
