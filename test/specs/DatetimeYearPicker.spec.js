import { DateTime } from 'luxon'
import { createVM } from '../helpers/utils.js'
import DatetimeYearPicker from 'src/DatetimeYearPicker.vue'

describe('DatetimeYearPicker.vue', function () {
  describe('render', function () {
    it('should render the year picker', function () {
      const vm = createVM(this,
        `<DatetimeYearPicker :year="2020"></DatetimeYearPicker>`,
        {
          components: { DatetimeYearPicker }
        })

      expect(vm.$('.vdatetime-year-picker')).to.exist

      const years = vm.$$('.vdatetime-year-picker__list .vdatetime-year-picker__item')
        .map(el => parseInt(el.textContent))
      const yearList = new Array(201).fill(null).map((item, index) => 1920 + index)

      expect(years).eql(yearList)

      const selected = parseInt(vm.$('.vdatetime-year-picker__item--selected').textContent)
      expect(selected).eql(2020)
    })

    it('should disable years', function () {
      const vm = createVM(this,
        `<DatetimeYearPicker :min-date="minDate" :max-date="maxDate" :year="2018"></DatetimeYearPicker>`,
        {
          components: { DatetimeYearPicker },
          data () {
            return {
              minDate: DateTime.fromISO('2018-01-01T00:00:00.000Z').toUTC(),
              maxDate: DateTime.fromISO('2018-12-01T00:00:00.000Z').toUTC()
            }
          }
        })

      const years = vm.$$('.vdatetime-year-picker__list .vdatetime-year-picker__item')

      years.forEach(year => {
        const yearNumber = parseInt(year.textContent)

        if (yearNumber === 2018) {
          expect(year).to.have.not.class('vdatetime-year-picker__item--disabled')
        } else {
          expect(year).to.have.class('vdatetime-year-picker__item--disabled')
        }
      })
    })
  })

  describe('events', function () {
    it('should emit change event on select a year', function () {
      const vm = createVM(this,
        `<DatetimeYearPicker @change="onChange" :year="2020"></DatetimeYearPicker>`,
        {
          components: { DatetimeYearPicker },
          data () {
            return {
              year: null
            }
          },
          methods: {
            onChange (year) {
              this.year = year
            }
          }
        })

      vm.$$('.vdatetime-year-picker__list .vdatetime-year-picker__item')[110].click()
      expect(vm.year).to.be.equal(2030)
    })

    it('should disable change event when year is disabled', function () {
      const vm = createVM(this,
        `<DatetimeYearPicker :min-date="minDate" :max-date="maxDate" :year="2018"></DatetimeYearPicker>`,
        {
          components: { DatetimeYearPicker },
          data () {
            return {
              minDate: DateTime.fromISO('1920-01-01'),
              maxDate: DateTime.fromISO('2000-12-01')
            }
          }
        })
      vm.$$('.vdatetime-year-picker__list .vdatetime-year-picker__item')[0].click()
      expect(vm.year).not.to.be.equal(1918)
    })
  })
})
