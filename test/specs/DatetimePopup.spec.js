import { DateTime as LuxonDatetime, Settings as LuxonSettings } from 'luxon'
import { createVM } from '../helpers/utils.js'
import DatetimePopup from 'src/DatetimePopup.vue'

describe('DatetimePopup.vue', function () {
  describe('render', function () {
    it('should render the popup', function () {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local()
            }
          }
        })

      expect(vm.$('.vdatetime-popup')).to.exist
    })

    it('should render the header', function () {
      LuxonSettings.defaultLocale = 'es-ES'
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.fromObject({
                year: 2017,
                month: 5,
                day: 12
              })
            }
          }
        })

      expect(vm.$('.vdatetime-popup__year').textContent).to.be.equal('2017')
      expect(vm.$('.vdatetime-popup__date').textContent).to.be.equal('12 de mayo')
    })

    it('should render the body', function () {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local()
            }
          }
        })

      expect(vm.$('.vdatetime-popup__body')).to.exist
    })

    it('should render the action buttons', function () {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local()
            }
          }
        })

      expect(vm.$('.vdatetime-popup__actions')).to.exist
      expect(vm.$$('.vdatetime-popup__actions__button')[0]).to.have.text('Cancel')
      expect(vm.$$('.vdatetime-popup__actions__button')[1]).to.have.text('Ok')
    })

    it('should render the calendar by default', function () {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local()
            }
          }
        })

      expect(vm.$('.vdatetime-popup__body .vdatetime-calendar')).to.exist
    })

    it('should render the calendar when type is date', function () {
      const vm = createVM(this,
        `<DatetimePopup type="date" :datetime="datetime"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local()
            }
          }
        })

      expect(vm.$('.vdatetime-popup__body .vdatetime-calendar')).to.exist
    })

    it('should render the time picker when type is datetime', function (done) {
      const vm = createVM(this,
        `<DatetimePopup type="datetime" :datetime="datetime"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local()
            }
          }
        })

      vm.$('.vdatetime-popup__actions__button--confirm').click()
      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-popup__body .vdatetime-time-picker')).to.exist
        done()
      })
    })

    it('should render the year picker', function (done) {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local()
            }
          }
        })

      vm.$('.vdatetime-popup__year').click()
      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-popup__body .vdatetime-year-picker')).to.exist
        done()
      })
    })

    it('should render the calendar on confirm in year picker', function (done) {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local()
            }
          }
        })

      vm.$('.vdatetime-popup__year').click()
      vm.$nextTick(() => {
        vm.$('.vdatetime-popup__actions__button--confirm').click()
        vm.$nextTick(() => {
          expect(vm.$('.vdatetime-popup__body .vdatetime-calendar')).to.exist
          done()
        })
      })
    })

    it('should render custom phrases', function () {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime" :phrases="phrases"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local(),
              phrases: {
                cancel: 'Cancelar',
                ok: 'Confirmar'
              }
            }
          }
        })

      expect(vm.$('.vdatetime-popup__actions__button--confirm').innerText).to.be.equal('Confirmar')
      expect(vm.$('.vdatetime-popup__actions__button--cancel').innerText).to.be.equal('Cancelar')
    })
  })

  describe('pass props', function () {
    it('should pass time steps to time picker', function (done) {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime" type="datetime" :hour-step="2" :minute-step="15"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local()
            }
          }
        })

      vm.$('.vdatetime-popup__actions__button--confirm').click()

      vm.$nextTick(() => {
        expect(vm.$findChild('.vdatetime-time-picker').hourStep).to.be.equal(2)
        expect(vm.$findChild('.vdatetime-time-picker').minuteStep).to.be.equal(15)
        done()
      })
    })

    it('should pass min and max date to calendar', function () {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime" type="datetime" :min-datetime="minDatetime" :max-datetime="maxDatetime"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local(),
              minDatetime: LuxonDatetime.fromISO('2018-01-01T12:35:22.000Z'),
              maxDatetime: LuxonDatetime.fromISO('2018-01-03T20:43:13.000Z')
            }
          }
        })

      expect(vm.$findChild('.vdatetime-calendar').minDate.toISODate()).to.be.equal('2018-01-01')
      expect(vm.$findChild('.vdatetime-calendar').maxDate.toISODate()).to.be.equal('2018-01-03')
    })

    it('should pass min and max time to time picker when date are equals', function (done) {
      const minDatetime = LuxonDatetime.fromISO('2018-01-01T12:35:22.000Z')
      const maxDatetime = LuxonDatetime.fromISO('2018-01-01T20:43:13.000Z')

      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime" type="datetime" :min-datetime="minDatetime" :max-datetime="maxDatetime"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.fromISO('2018-01-01T17:42:11.000Z'),
              minDatetime: minDatetime,
              maxDatetime: maxDatetime
            }
          }
        })

      vm.$('.vdatetime-popup__actions__button--confirm').click()

      vm.$nextTick(() => {
        expect(vm.$findChild('.vdatetime-time-picker').minTime).to.be.equal(minDatetime.toFormat('HH:mm'))
        expect(vm.$findChild('.vdatetime-time-picker').maxTime).to.be.equal(maxDatetime.toFormat('HH:mm'))
        done()
      })
    })
  })

  describe('events', function () {
    it('should emit confirm event on confirm', function () {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime" @confirm="onConfirm"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.fromObject({
                year: 2017,
                month: 7,
                day: 23,
                zone: 'UTC+02:00'
              }),
              newDatetime: ''
            }
          },
          methods: {
            onConfirm (datetime) {
              this.newDatetime = datetime.toISO()
            }
          }
        })

      vm.$$('.vdatetime-calendar__month__day')[22].click()
      vm.$('.vdatetime-popup__actions__button--confirm').click()
      expect(vm.newDatetime).to.be.equal('2017-07-18T00:00:00.000+02:00')
    })

    it('should emit confirm event on confirm when type is datetime', function (done) {
      const vm = createVM(this,
        `<DatetimePopup type="datetime" :datetime="datetime" @confirm="onConfirm"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.fromObject({
                year: 2017,
                month: 7,
                day: 23,
                zone: 'UTC+02:00'
              }),
              newDatetime: ''
            }
          },
          methods: {
            onConfirm (datetime) {
              this.newDatetime = datetime.toISO()
            }
          }
        })

      vm.$$('.vdatetime-calendar__month__day')[15].click()
      vm.$('.vdatetime-popup__actions__button--confirm').click()
      vm.$nextTick(() => {
        vm.$$('.vdatetime-time-picker__list--hours .vdatetime-time-picker__item')[4].click()
        vm.$nextTick(() => {
          vm.$$('.vdatetime-time-picker__list--minutes .vdatetime-time-picker__item')[15].click()
          vm.$('.vdatetime-popup__actions__button--confirm').click()
          expect(vm.newDatetime).to.be.equal('2017-07-11T04:15:00.000+02:00')
          done()
        })
      })
    })

    it('should emit cancel event on cancel', function () {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime" @cancel="spy"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local(),
              spy: sinon.spy()
            }
          }
        })

      expect(vm.spy).to.have.not.been.called
      vm.$('.vdatetime-popup__actions__button--cancel').click()
      expect(vm.spy).to.have.been.calledOnce
    })

    it('should emit cancel event on key up ESC', function (done) {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime" @cancel="spy"></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local(),
              spy: sinon.spy()
            }
          }
        })

      expect(vm.spy).to.have.not.been.called

      const event = document.createEvent('Event')
      event.keyCode = 27
      event.initEvent('keyup')
      document.dispatchEvent(event)

      vm.$nextTick(() => {
        expect(vm.spy).to.have.been.calledOnce
        done()
      })
    })
  })

  describe('auto', function () {
    it('should close on change date when auto is active', function () {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime" @confirm="spy" auto></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local(),
              spy: sinon.spy()
            }
          }
        })

      expect(vm.spy).to.have.not.been.called
      vm.$findChild('.vdatetime-popup').onChangeDate(2017, 5, 10)
      expect(vm.spy).to.have.been.calledOnce
    })

    it('should close year picker on change year when auto is active', function (done) {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime" auto></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local()
            }
          }
        })

      vm.$('.vdatetime-popup__year').click()
      vm.$nextTick(() => {
        vm.$findChild('.vdatetime-popup').onChangeYear(2017)
        vm.$nextTick(() => {
          expect(vm.$('.vdatetime-popup__body .vdatetime-calendar')).to.exist
          done()
        })
      })
    })

    it('should close time picker on change time when auto is active', function (done) {
      const vm = createVM(this,
        `<DatetimePopup :datetime="datetime" auto></DatetimePopup>`,
        {
          components: { DatetimePopup },
          data () {
            return {
              datetime: LuxonDatetime.local()
            }
          }
        })

      vm.$('.vdatetime-popup__year').click()
      vm.$nextTick(() => {
        vm.$findChild('.vdatetime-popup').onChangeTime(14, 15) // First select hour
        vm.$findChild('.vdatetime-popup').onChangeTime(14, 30) // then minute
        vm.$nextTick(() => {
          expect(vm.$('.vdatetime-popup__body .vdatetime-calendar')).to.exist
          done()
        })
      })
    })
  })
})
