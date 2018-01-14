import { DateTime as LuxonDatetime, Settings as LuxonSettings } from 'luxon'
import { createVM } from '../helpers/utils.js'
import DatetimeCalendar from 'src/DatetimeCalendar.vue'

describe('DatetimeCalendar.vue', function () {
  describe('render', function () {
    it('should render a calendar', function () {
      LuxonSettings.defaultLocale = 'en'
      const vm = createVM(this,
        `<DatetimeCalendar :year="2017" :month="4"></DatetimeCalendar>`,
        {
          components: { DatetimeCalendar }
        })

      expect(vm.$('.vdatetime-calendar')).to.exist
      expect(vm.$('.vdatetime-calendar__current--month')).to.have.text('April 2017')

      const weekdays = vm.$$('.vdatetime-calendar__month__weekday').map(el => el.textContent)
      expect(weekdays).deep.equal(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])

      const days = vm.$$('.vdatetime-calendar__month__day').map(el => el.textContent)
      expect(days).deep.equal(['', '', '', '', '', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'])
    })

    it('should render a calendar in default locale', function () {
      LuxonSettings.defaultLocale = 'es'
      const vm = createVM(this,
        `<DatetimeCalendar :year="2018" :month="7"></DatetimeCalendar>`,
        {
          components: { DatetimeCalendar }
        })

      expect(vm.$('.vdatetime-calendar__current--month')).to.have.text('Julio 2018')

      const weekdays = vm.$$('.vdatetime-calendar__month__weekday').map(el => el.textContent)
      expect(weekdays).deep.equal(['Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.', 'Dom.'])
    })

    it('should select the current day', function () {
      const vm = createVM(this,
        `<DatetimeCalendar :year="2018" :month="7" :day="10"></DatetimeCalendar>`,
        {
          components: { DatetimeCalendar }
        })

      expect(vm.$('.vdatetime-calendar__month__day--selected')).to.have.text('10')
    })

    it('should disable days before min date', function () {
      const vm = createVM(this,
        `<DatetimeCalendar :year="2018" :month="7" :day="10" :min-date="minDate"></DatetimeCalendar>`,
        {
          components: { DatetimeCalendar },
          data () {
            return {
              minDate: LuxonDatetime.fromISO('2018-07-06T12:00:00')
            }
          }
        })

      const monthDays = vm.$$('.vdatetime-calendar__month__day')

      monthDays.forEach(monthDay => {
        const dayNumber = parseInt(monthDay.textContent)

        if (isNaN(dayNumber) || dayNumber < 6) {
          expect(monthDay).to.have.class('vdatetime-calendar__month__day--disabled')
        } else {
          expect(monthDay).to.have.not.class('vdatetime-calendar__month__day--disabled')
        }
      })
    })

    it('should disable days after max date', function () {
      const vm = createVM(this,
        `<DatetimeCalendar :year="2018" :month="7" :day="10" :max-date="maxDate"></DatetimeCalendar>`,
        {
          components: { DatetimeCalendar },
          data () {
            return {
              maxDate: LuxonDatetime.fromISO('2018-07-12T00:00:00')
            }
          }
        })

      const monthDays = vm.$$('.vdatetime-calendar__month__day')

      monthDays.forEach(monthDay => {
        const dayNumber = parseInt(monthDay.textContent)

        if (isNaN(dayNumber) || dayNumber > 12) {
          expect(monthDay).to.have.class('vdatetime-calendar__month__day--disabled')
        } else {
          expect(monthDay).to.have.not.class('vdatetime-calendar__month__day--disabled')
        }
      })
    })
  })

  describe('navigation', function () {
    it('should render a next month when clicking next', function (done) {
      const vm = createVM(this,
        `<DatetimeCalendar :year="2017" :month="4"></DatetimeCalendar>`,
        {
          components: { DatetimeCalendar }
        })

      vm.$('.vdatetime-calendar__navigation--next').click()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-calendar__current--month')).to.have.text('May 2017')
        const days = vm.$$('.vdatetime-calendar__month__day').map(el => el.textContent)
        expect(days).deep.equal(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'])
        done()
      })
    })

    it('should render a next month when clicking next even at end of the year', function (done) {
      const vm = createVM(this,
        `<DatetimeCalendar :year="2017" :month="12"></DatetimeCalendar>`,
        {
          components: { DatetimeCalendar }
        })

      vm.$('.vdatetime-calendar__navigation--next').click()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-calendar__current--month')).to.have.text('January 2018')
        const days = vm.$$('.vdatetime-calendar__month__day').map(el => el.textContent)
        expect(days).deep.equal(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'])
        done()
      })
    })

    it('should render a previous month when clicking previous', function (done) {
      const vm = createVM(this,
        `<DatetimeCalendar :year="2017" :month="4"></DatetimeCalendar>`,
        {
          components: { DatetimeCalendar }
        })

      vm.$('.vdatetime-calendar__navigation--previous').click()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-calendar__current--month')).to.have.text('March 2017')
        const days = vm.$$('.vdatetime-calendar__month__day').map(el => el.textContent)
        expect(days).deep.equal(['', '', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'])
        done()
      })
    })

    it('should render a previous month when clicking previous even at beginning of year', function (done) {
      const vm = createVM(this,
        `<DatetimeCalendar :year="2017" :month="1"></DatetimeCalendar>`,
        {
          components: { DatetimeCalendar }
        })

      vm.$('.vdatetime-calendar__navigation--previous').click()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-calendar__current--month')).to.have.text('December 2016')
        const days = vm.$$('.vdatetime-calendar__month__day').map(el => el.textContent)
        expect(days).deep.equal(['', '', '', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'])
        done()
      })
    })
  })

  describe('events', function () {
    it('should emit change event on select a day', function () {
      const vm = createVM(this,
        `<DatetimeCalendar @change="onChange" :year="2017" :month="4"></DatetimeCalendar>`,
        {
          components: { DatetimeCalendar },
          data () {
            return {
              year: null,
              month: null,
              day: null
            }
          },
          methods: {
            onChange (year, month, day) {
              this.year = year
              this.month = month
              this.day = day
            }
          }
        })

      vm.$$('.vdatetime-calendar__month__day')[10].click()
      expect(vm.year).to.be.equal(2017)
      expect(vm.month).to.be.equal(4)
      expect(vm.day).to.be.equal(6)
    })

    it('should not emit change event on select a disabled day', function () {
      const vm = createVM(this,
        `<DatetimeCalendar @change="spy" :year="2017" :month="4" :max-date="maxDate"></DatetimeCalendar>`,
        {
          components: { DatetimeCalendar },
          data () {
            return {
              maxDate: LuxonDatetime.fromISO('2017-04-04T04:04:04.000Z'),
              spy: sinon.spy()
            }
          }
        })

      vm.$$('.vdatetime-calendar__month__day')[10].click()
      expect(vm.spy).to.have.not.been.called
    })
  })
})
