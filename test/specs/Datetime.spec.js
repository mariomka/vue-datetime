import { DateTime as LuxonDateTime } from 'luxon'
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

    it('input should render custom phrases', function () {
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
        expect(vm.$('.vdatetime-popup__actions__button--confirm').innerText).to.be.equal('Confirmar')
        expect(vm.$('.vdatetime-popup__actions__button--cancel').innerText).to.be.equal('Cancelar')
      })
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
  })

  describe('types', function () {
    it('should be date type by default', function () {
      const vm = createVM(this,
        `<Datetime></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-calendar')).to.exist
      })
    })

    it('should be date type', function () {
      const vm = createVM(this,
        `<Datetime type="date"></Datetime>`,
        {
          components: { Datetime }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        expect(vm.$('.vdatetime-calendar')).to.exist
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
  })

  describe('value', function () {
    it('should be null when value is empty', function () {
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

      expect(vm.datetime).null
    })

    it('should be null when value is not valid', function () {
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

      expect(vm.datetime).null
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
        `<Datetime type="datetime" v-model="datetime"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2017-12-07T19:34:54.078+03:00'
            }
          }
        })

      expect(vm.$('.vdatetime-input').value).to.be.equal('Dec 7, 2017, 5:34 PM')
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
        `<Datetime v-model="datetime" :format="format" zone="UTC"></Datetime>`,
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
    it('should update value and close popup on confirm ', function (done) {
      const vm = createVM(this,
        `<Datetime v-model="datetime" zone="UTC+02:00"></Datetime>`,
        {
          components: { Datetime },
          data () {
            return {
              datetime: '2020-05-07T05:22:00.123Z'
            }
          }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$$('.vdatetime-calendar__month__day')[23].click()
        vm.$('.vdatetime-popup__actions__button--confirm').click()
        vm.$nextTick(() => {
          expect(vm.$('.vdatetime-input').value).to.be.equal('May 20, 2020')
          expect(vm.datetime).to.be.equal('2020-05-20T05:22:00.123Z')
          expect(vm.$('.vdatetime-overlay')).to.not.exist
          expect(vm.$('.vdatetime-popup')).to.not.exist
          done()
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
              datetime: '2020-05-07T05:22:00.123Z'
            }
          }
        })

      vm.$('.vdatetime-input').click()

      vm.$nextTick(() => {
        vm.$$('.vdatetime-calendar__month__day')[21].click()
        vm.$('.vdatetime-popup__actions__button--cancel').click()
        vm.$nextTick(() => {
          expect(vm.$('.vdatetime-input').value).to.be.equal('May 7, 2020')
          expect(vm.datetime).to.be.equal('2020-05-07T05:22:00.123Z')
          expect(vm.$('.vdatetime-overlay')).to.not.exist
          expect(vm.$('.vdatetime-popup')).to.not.exist
          done()
        })
      })
    })
  })
})
