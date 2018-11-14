import { DateTime } from 'luxon'
import { createVM } from '../helpers/utils.js'
import DatetimeMonthPicker from 'src/DatetimeMonthPicker.vue'
import { months as utilsMonths } from 'src/util.js'

describe('DatetimeMonthPicker.vue', function () {
  describe('render', function () {
    it('should render the months picker', function () {
      const vm = createVM(this,
        `<DatetimeMonthPicker :year="2020" :month="05"></DatetimeMonthPicker>`,
        {
          components: { DatetimeMonthPicker }
        })

      expect(vm.$('.vdatetime-month-picker')).to.exist

      const months = vm.$$('.vdatetime-month-picker__list .vdatetime-month-picker__item')
        .map(el => el.textContent.trim())

      expect(months).eql(utilsMonths())
    })

    it('should disable months', function () {
      const vm = createVM(this,
        `<DatetimeMonthPicker :min-date="minDate" :max-date="maxDate" :year="2018" :month="10"></DatetimeMonthPicker>`,
        {
          components: { DatetimeMonthPicker },
          data () {
            return {
              minDate: DateTime.fromISO('2018-07-01T00:00:00.000Z').toUTC(),
              maxDate: DateTime.fromISO('2018-12-01T00:00:00.000Z').toUTC()
            }
          }
        })

      const months = vm.$$('.vdatetime-month-picker__list .vdatetime-month-picker__item')

      months.forEach(month => {
        const monthName = month.textContent.trim()

        if (!(['July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName) === -1)) {
          expect(month).to.have.not.class('vdatetime-month-picker__item--disabled')
        } else {
          expect(month).to.have.class('vdatetime-month-picker__item--disabled')
        }
      })
    })
  })

  describe('events', function () {
    it('should emit change event on select a month', function () {
      const vm = createVM(this,
        `<DatetimeMonthPicker @change="onChange" :year="2020" :month="5"></DatetimeMonthPicker>`,
        {
          components: { DatetimeMonthPicker },
          data () {
            return {
              year: null,
              month: null
            }
          },
          methods: {
            onChange (month) {
              this.month = month
            }
          }
        })

      vm.$$('.vdatetime-month-picker__list .vdatetime-month-picker__item')[2].click()
      expect(vm.month).to.be.equal(3)
    })

    it('should disable change event when month is disabled', function () {
      const vm = createVM(this,
        `<DatetimeMonthPicker :min-date="minDate" :max-date="maxDate" :year="2018" :month="10"></DatetimeMonthPicker>`,
        {
          components: { DatetimeMonthPicker },
          data () {
            return {
              minDate: DateTime.fromISO('2018-07-01T00:00:00.000Z').toUTC(),
              maxDate: DateTime.fromISO('2018-12-01T00:00:00.000Z').toUTC()
            }
          }
        })
      vm.$$('.vdatetime-month-picker__list .vdatetime-month-picker__item')[3].click()
      expect(vm.month).not.to.be.equal(3)
    })
  })
})
