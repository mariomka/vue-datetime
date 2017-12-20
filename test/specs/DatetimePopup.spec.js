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
                zone: '+2'
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
                zone: '+2'
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
  })
})
