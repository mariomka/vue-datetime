import { DateTime as LuxonDateTime, Settings as LuxonSettings } from 'luxon'
import Datetime from 'src/Datetime.vue'
import { createVM } from '../helpers/utils.js'

describe('Datetime.vue', function () {
  describe('render', function () {
    it('should add class to wrapper', function () {
      const vm = createVM(this,
        `<Datetime class="class-name"></Datetime>`,
        {
          components: { Datetime }
        })

      expect(vm.$('.vdatetime')).to.have.class('class-name')
    })

    it('should print an input text', function () {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      expect(vm.$('.vdatetime-input')).to.match('input')
    })

    it('should add class to input', function () {
      const vm = createVM(this,
        `<Datetime input-class="class-name"></Datetime>`,
        {
          components: { Datetime }
        })

      expect(vm.$('.vdatetime-input')).to.have.class('class-name')
    })

    it('should add id to input', function () {
      const vm = createVM(this,
        `<Datetime input-id="id-name"></Datetime>`,
        {
          components: { Datetime }
        })

      expect(vm.$('.vdatetime-input')).to.have.id('id-name')
    })

    it('should not add empty id to input', function () {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      expect(vm.$('.vdatetime-input')).to.not.have.attribute('id')
    })

    it('should add style to input', function () {
      const vm = createVM(this,
        `<Datetime :input-style="{backgroundColor: 'cyan'}"></Datetime>`,
        {
          components: { Datetime }
        })

      expect(vm.$('.vdatetime-input')).to.have.attr('style', 'background-color: cyan;')
    })

    it('input should inherit attributes', function () {
      const vm = createVM(this,
        `<Datetime placeholder="Select date..."></Datetime>`,
        {
          components: { Datetime }
        })

      expect(vm.$('.vdatetime-input')).to.have.attr('placeholder', 'Select date...')
    })

    it('input should inherit events', function () {
      const vm = createVM(this,
        `<Datetime @click="spy"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              spy: sinon.spy()
            }
          }
        })

      expect(vm.spy).to.have.not.been.called
      vm.$('.vdatetime-input').click()
      expect(vm.spy).to.have.been.calledOnce
    })

    it('should not create hidden input by default', function () {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      expect(vm.$('.vdatetime input[type=hidden]')).to.not.exist
    })

    it('should create hidden input if name is passed', function () {
      const vm = createVM(this,
        `<Datetime hidden-name="dt"></Datetime>`,
        {
          components: { Datetime }
        })

      expect(vm.$('.vdatetime input[type=hidden]')).to.have.attr('name', 'dt')
    })

    it('should support named slots', function () {
      const vm = createVM(this,
        `<Datetime>
          <label slot="before">Start Date</label>
          <span slot="after" class="error">Invalid date</span>
        </Datetime>`,
        {
          components: { Datetime }
        })

      const children = vm.$('.vdatetime').children
      expect(children[0].nodeName).to.equal('LABEL')
      expect(children[1].nodeName).to.equal('INPUT')
      expect(children[2].nodeName).to.equal('SPAN')
    })
  })

  describe('pass props', function () {
    it('should pass phrases to popup', function (done) {
      const vm = createVM(this,
        `<Datetime :phrases="phrases"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              phrases: {
                cancel: 'Cancelar',
                ok: 'Confirmar'
              }
            }
          }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$findChild('.vdatetime-popup').phrases).to.be.eql({
          cancel: 'Cancelar',
          ok: 'Confirmar'
        })
        done()
      })
    })

    it('should render the action buttons with custom slots', function (done) {
      const vm = createVM(this,
        `<Datetime>
           <template slot="button-cancel"><i>Abort</i></template>
           <template slot="button-confirm"><strong>Confirm</strong></template>
         </Datetime>`,
        {
          components: { Datetime },
          data () {
            return {}
          }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-popup__actions')).to.exist
        expect(vm.$$('.vdatetime-popup__actions__button')[0]).to.have.html('<i>Abort</i>')
        expect(vm.$$('.vdatetime-popup__actions__button')[1]).to.have.html('<strong>Confirm</strong>')
        done()
      })
    })

    it('should render the action buttons with custom slots and scoped slot for using the local scope', function (done) {
      const vm = createVM(this,
        `<Datetime type="datetime">
           <template slot="button-cancel"><i>Abort</i></template>
           <template slot="button-confirm" slot-scope="scope">
             <span v-if="scope.step === 'date'">Next</span>
             <span v-else>Publish</span>
           </template>
         </Datetime>`,
        {
          components: { Datetime },
          data () {
            return {}
          }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        const btnCancel = vm.$$('.vdatetime-popup__actions__button')[0]
        const btnConfirm = vm.$$('.vdatetime-popup__actions__button')[1]

        expect(vm.$('.vdatetime-popup__actions')).to.exist
        expect(btnCancel).to.exist
        expect(btnCancel).to.have.html('<i>Abort</i>')
        expect(btnConfirm).to.exist
        expect(btnConfirm).to.have.text('Next')

        btnConfirm.click()

        vm.$nextTick(() => {
          expect(btnConfirm).to.have.text('Publish')
          done()
        })
      })
    })

    it('should pass use 12 hour to popup', function (done) {
      const vm = createVM(this,
        `<Datetime type="datetime" use12-hour></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$findChild('.vdatetime-popup').use12Hour).to.be.equal(true)
        done()
      })
    })

    it('should pass time steps to popup', function (done) {
      const vm = createVM(this,
        `<Datetime type="datetime" :hour-step="2" :minute-step="15"></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$findChild('.vdatetime-popup').hourStep).to.be.equal(2)
        expect(vm.$findChild('.vdatetime-popup').minuteStep).to.be.equal(15)
        done()
      })
    })

    it('should pass min and max datetimes to allowedDateRanges popup', function (done) {
      const vm = createVM(this,
        `<Datetime type="datetime" min-datetime="2018-01-01T12:35:22.000Z" max-datetime="2018-01-03T20:43:13.000Z"></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()
      vm.$nextTick(() => {
        expect(vm.$findChild('.vdatetime-popup').allowedDateTimeRanges[0][0].toUTC().toISO()).to.be.equal('2018-01-01T12:35:22.000Z')
        expect(vm.$findChild('.vdatetime-popup').allowedDateTimeRanges[0][1].toUTC().toISO()).to.be.equal('2018-01-03T20:43:13.000Z')
        done()
      })
    })

    it('should pass auto to popup', function (done) {
      const vm = createVM(this,
        `<Datetime auto></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$findChild('.vdatetime-popup').auto).to.be.equal(true)
        done()
      })
    })

    it('should pass week start to popup', function (done) {
      const vm = createVM(this,
        `<Datetime :week-start="3"></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$findChild('.vdatetime-popup').weekStart).to.be.equal(3)
        done()
      })
    })

    it('should pass datetime to popup', function (done) {
      const vm = createVM(this,
        `<Datetime type="datetime" v-model="datetime" zone="UTC+03:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00'
            }
          }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$findChild('.vdatetime-popup').datetime.toISO()).to.be.equal('2017-12-07T19:34:54.078+03:00')
        done()
      })
    })

    it('should pass flow to popup', function (done) {
      const vm = createVM(this,
        `<Datetime type="datetime" :flow="['year', 'month', 'date', 'time']"></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$findChild('.vdatetime-popup').flow).to.be.deep.equal(['year', 'month', 'date', 'time'])
        done()
      })
    })

    it('should pass title to popup', function (done) {
      const vm = createVM(this,
        `<Datetime type="datetime" title="Select your birthday"></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$findChild('.vdatetime-popup').title).to.be.equal('Select your birthday')
        done()
      })
    })
  })

  describe('types', function () {
    it('should be date type by default', function (done) {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-calendar')).to.exist
        done()
      })
    })

    it('should be date type', function (done) {
      const vm = createVM(this,
        `<Datetime type="date"></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-calendar')).to.exist
        done()
      })
    })

    it('should be datetime type', function (done) {
      const vm = createVM(this,
        `<Datetime type="datetime"></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$('.vdatetime-popup__actions__button--confirm').click()
        vm.$nextTick(() => {
          expect(vm.$('.vdatetime-time-picker')).to.exist
          done()
        })
      })
    })

    it('should be a time type', function (done) {
      const vm = createVM(this,
        `<Datetime type="time"></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-time-picker')).to.exist
        done()
      })
    })
  })

  describe('value', function () {
    it('should be empty string when value is empty', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: ''
            }
          }
        })

      expect(vm.datetime).to.be.equal('')
    })

    it('should be empty string when value is not valid', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-32-32T19:34:54.078Z'
            }
          }
        })

      expect(vm.datetime).to.be.equal('')
    })

    it('should be a UTC date by default', function () {
      const vm = createVM(this,
        `<Datetime type="datetime" v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00'
            }
          }
        })

      expect(vm.datetime).to.be.equal('2017-12-07T16:34:54.078Z')
    })

    it('should be a date in the specified time zone', function () {
      const vm = createVM(this,
        `<Datetime type="datetime" v-model="datetime" value-zone="UTC-04:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00'
            }
          }
        })

      expect(vm.datetime).to.be.equal('2017-12-07T12:34:54.078-04:00')
    })

    it('should be a date with cleared time when type is date', function () {
      const vm = createVM(this,
        `<Datetime type="date" v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078Z'
            }
          }
        })

      expect(vm.datetime).to.be.equal('2017-12-07T00:00:00.000Z')
    })

    it('should be a date with cleared time in the specified time zone when type is date', function () {
      const vm = createVM(this,
        `<Datetime type="date" v-model="datetime" value-zone="UTC+03:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T22:34:54.078Z'
            }
          }
        })

      expect(vm.datetime).to.be.equal('2017-12-08T00:00:00.000+03:00')
    })

    it('should be a time with the specified time zone', function (done) {
      const vm = createVM(this,
        `<Datetime v-model="datetime" type="time" zone="UTC-03:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T09:00:00.000Z'
            }
          }
        })

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-input').value).to.be.equal('06:00')
        done()
      })
    })

    it('should be a time in the local time zone on default', function (done) {
      const vm = createVM(this,
        `<Datetime v-model="datetime" type="time"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T09:00:00.000Z'
            }
          }
        })

      vm.$nextTick(() => {
        const time = LuxonDateTime.fromISO('2017-12-07T09:00:00.000Z').toUTC().setZone('local').toLocaleString(LuxonDateTime.TIME_24_SIMPLE)

        expect(vm.$('.vdatetime-input').value).to.be.equal(time)
        done()
      })
    })

    it('should be a time converted to utc', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime" type="time" value-zone="UTC-05:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-05T00:00:00.000Z'
            }
          }
        })

      expect(vm.datetime).to.be.equal('2017-12-04T19:00:00.000-05:00')
    })
  })

  describe('input value', function () {
    it('should be empty when value is empty', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: ''
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.empty
    })

    it('should be empty when value is not valid', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-32T19:34:54.078Z'
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.empty
    })

    it('should be a date in the local time zone by default', function () {
      const vm = createVM(this,
        `<Datetime type="datetime" v-model="datetime" :format="format"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00',
              format: LuxonDateTime.DATETIME_MED
            }
          }
        })

      const localDateString = LuxonDateTime.fromISO('2017-12-07T19:34:54.078+03:00').toLocal().toLocaleString(LuxonDateTime.DATETIME_MED)

      expect(vm.$('.vdatetime-input').value).to.be.equal(localDateString)
    })

    it('should be a date in the specified time zone', function () {
      const vm = createVM(this,
        `<Datetime type="datetime" v-model="datetime" zone="UTC+04:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00'
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.equal('Dec 7, 2017, 8:34 PM')
    })

    it('should be formatted in the specified format', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime" type="datetime" :format="format" zone="UTC+03:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00',
              format: LuxonDateTime.DATE_HUGE
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.equal('Thursday, December 7, 2017')
    })

    it('should be formatted in the specified macro format', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime" :format="format" zone="UTC+03:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00',
              format: 'yyyy-MM-dd HH:mm:ss'
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.equal('2017-12-07 19:34:54')
    })

    it('should be formatted in the specified format (time)', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime" type="time" :format="format" zone="UTC+03:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00',
              format: LuxonDateTime.TIME_24_WITH_SECONDS
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.equal('19:34:54')
    })

    it('should be formatted in the specified macro format (time)', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime" type="time" :format="format" zone="UTC+03:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00',
              format: 'HH:mm:ss'
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.equal('19:34:54')
    })

    it('should be updated if value is updated', function (done) {
      const vm = createVM(this,
        `<Datetime v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-05T00:00:00.000Z'
            }
          },
          mounted () {
            setTimeout(() => {
              this.datetime = '2017-12-07T00:00:00.000Z'
            }, 50)
          }
        })

      setTimeout(() => {
        expect(vm.$('.vdatetime-input').value).to.be.equal('Dec 7, 2017')
        done()
      }, 50)
    })
  })

  describe('hidden input value', function () {
    it('should be empty when value is empty', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime" hidden-name="dt"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: ''
            }
          }
        })

      expect(vm.$('.vdatetime input[name=dt]').value).to.be.empty
    })

    it('should be equal to value', function () {
      const datetime = '2017-12-31T19:34:54.078Z'
      const vm = createVM(this,
        `<Datetime v-model="datetime" hidden-name="dt"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return { datetime }
          }
        })

      expect(vm.$('.vdatetime input[name=dt]').value).to.equal(datetime)
    })

    it('should be equal to value even when value is not valid', function () {
      const datetime = '2017-12-32T19:34:54.078Z'
      const vm = createVM(this,
        `<Datetime v-model="datetime" hidden-name="dt"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return { datetime }
          }
        })

      expect(vm.$('.vdatetime input[name=dt]').value).to.equal(datetime)
    })

    it('should be updated if value is updated', function (done) {
      const datetime1 = '2017-12-05T00:00:00.000Z'
      const datetime2 = '2017-12-07T00:00:00.000Z'
      const vm = createVM(this,
        `<Datetime v-model="datetime" hidden-name="dt"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: datetime1
            }
          },
          mounted () {
            setTimeout(() => {
              this.datetime = datetime2
            }, 50)
          }
        })

      setTimeout(() => {
        expect(vm.$('.vdatetime input[type=hidden]').value).to.be.equal(datetime2)
        done()
      }, 50)
    })
  })

  describe('week start', function () {
    it('should be set number', function () {
      const vm = createVM(this,
        `<Datetime v-model="datetime" :week-start="4" ref="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: ''
            }
          }
        })

      expect(vm.$refs['datetime'].weekStart).to.be.equal(4)
    })

    it('should be auto from locale', function () {
      LuxonSettings.defaultLocale = 'es-ES'

      const vm = createVM(this,
        `<Datetime v-model="datetime" ref="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: ''
            }
          }
        })

      expect(vm.$refs['datetime'].weekStart).to.be.equal(1)
    })
  })

  describe('popup', function () {
    it('should open when clicking the input', function (done) {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-overlay')).to.exist
        expect(vm.$('.vdatetime-popup')).to.exist
        done()
      })
    })

    it('should open when focusing the input', function (done) {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').focus()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-overlay')).to.exist
        expect(vm.$('.vdatetime-popup')).to.exist
        done()
      })
    })

    it('should blur input when open popup', function (done) {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').focus()

      setTimeout(() => {
        expect(document.activeElement.isEqualNode(vm.$('.vdatetime-input'))).to.be.false
        done()
      }, 50)
    })

    it('should close when clicking the overlay', function (done) {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$('.vdatetime-overlay').click()
        vm.$nextTick(() => {
          expect(vm.$('.vdatetime-overlay')).to.not.exist
          expect(vm.$('.vdatetime-popup')).to.not.exist
          done()
        })
      })
    })
  })

  describe('events', function () {
    it('should update the date and close popup on confirm', function (done) {
      const vm = createVM(this,
        `<Datetime v-model="datetime" zone="UTC+02:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2020-05-07T14:32:00.000Z'
            }
          }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$$('.vdatetime-calendar__month__day')[24].click()
        vm.$('.vdatetime-popup__actions__button--confirm').click()

        vm.$nextTick(() => {
          expect(vm.datetime).to.be.equal('2020-05-20T00:00:00.000Z')
          expect(vm.$('.vdatetime-input').value).to.be.equal('May 20, 2020')
          done()
        })
      })
    })

    it('should update the datetime and close popup on confirm', function (done) {
      const vm = createVM(this,
        `<Datetime v-model="datetime" type="datetime" zone="UTC+02:00" value-zone="UTC-02:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2020-05-07T14:32:00.000Z'
            }
          }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$$('.vdatetime-calendar__month__day')[24].click()
        vm.$('.vdatetime-popup__actions__button--confirm').click()

        vm.$nextTick(() => {
          vm.$$('.vdatetime-time-picker__list--hours .vdatetime-time-picker__item')[12].click()
          vm.$('.vdatetime-popup__actions__button--confirm').click()

          vm.$nextTick(() => {
            expect(vm.datetime).to.be.equal('2020-05-20T08:32:00.000-02:00')
            expect(vm.$('.vdatetime-input').value).to.be.equal('May 20, 2020, 12:32 PM')
            expect(vm.$('.vdatetime-overlay')).to.not.exist
            expect(vm.$('.vdatetime-popup')).to.not.exist
            done()
          })
        })
      })
    })

    it('should not update value and close popup on cancel', function (done) {
      const vm = createVM(this,
        `<Datetime v-model="datetime" zone="UTC+02:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2020-05-07T00:00:00.000Z'
            }
          }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$$('.vdatetime-calendar__month__day')[21].click()
        vm.$('.vdatetime-popup__actions__button--cancel').click()
        vm.$nextTick(() => {
          expect(vm.$('.vdatetime-input').value).to.be.equal('May 7, 2020')
          expect(vm.datetime).to.be.equal('2020-05-07T00:00:00.000Z')
          expect(vm.$('.vdatetime-overlay')).to.not.exist
          expect(vm.$('.vdatetime-popup')).to.not.exist
          done()
        })
      })
    })

    it('should emit close when popup closes', function (done) {
      const vm = createVM(this,
        `<Datetime @close="spy"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              spy: sinon.spy()
            }
          }
        })

      expect(vm.spy).to.have.not.been.called
      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$('.vdatetime-popup__actions__button--cancel').click()

        vm.$nextTick(() => {
          expect(vm.spy).to.have.been.calledOnce
          done()
        })
      })
    })

    it('should update datetime when hidden input changes', function (done) {
      const vm = createVM(this,
        `<Datetime v-model="datetime" hidden-name="dt"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2020-05-07T00:00:00.000Z'
            }
          }
        })

      const newDate = '2020-06-08T00:00:00.000Z'
      const hiddenInput = vm.$('.vdatetime input[name=dt]')

      hiddenInput.value = newDate
      hiddenInput.dispatchEvent(new window.Event('input'))

      vm.$nextTick(() => {
        expect(vm.datetime).to.be.equal(newDate)
        expect(hiddenInput.value).to.be.equal(newDate)
        done()
      })
    })

    it('should select min date if clicked through', function (done) {
      const minDatetime = LuxonDateTime.utc().plus({ days: 3 }).set({ seconds: 0, millisecond: 0 }).toISO()

      const vm = createVM(this,
        `<Datetime type="datetime" v-model="datetime" :min-datetime="minDatetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: null,
              minDatetime: minDatetime
            }
          }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$('.vdatetime-popup__actions__button--confirm').click()

        vm.$nextTick(() => {
          vm.$('.vdatetime-popup__actions__button--confirm').click()

          vm.$nextTick(() => {
            expect(vm.datetime).to.be.equal(minDatetime)
            done()
          })
        })
      })
    })

    it('should select max date if clicked through', function (done) {
      const maxDatetime = LuxonDateTime.utc().minus({ days: 3 }).set({ seconds: 0, millisecond: 0 }).toISO()

      const vm = createVM(this,
        `<Datetime type="datetime" v-model="datetime" :max-datetime="maxDatetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: null,
              maxDatetime: maxDatetime
            }
          }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$('.vdatetime-popup__actions__button--confirm').click()

        vm.$nextTick(() => {
          vm.$('.vdatetime-popup__actions__button--confirm').click()

          vm.$nextTick(() => {
            expect(vm.datetime).to.be.equal(maxDatetime)
            done()
          })
        })
      })
    })
  })
})
