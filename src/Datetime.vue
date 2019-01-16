<template>
    <div class="vdatetime" :class="wrapperClass">
        <input ref="input"
               v-bind="$attrs"
               v-on="$listeners"
               type="text"
               :placeholder="placeholder"
               :value="inputValue"
               :class="inputClass"
               :required="required"
               @click="open"
               @focus="open"/>
        <transition name="vdatetime-fade">
            <div v-if="isOpen">
                <div class="vdatetime-overlay" @click.self="close(false)"></div>
                <div class="vdatetime-popup">
                    <div class="vdatetime-popup__header">
                        <div class="vdatetime-popup__year" @click="showYearPicker">{{ newYear }}</div>
                        {{ newDay }}
                    </div>
                    <div class="vdatetime-popup__body" ref="popupBody">
                        <div v-show="show === 'date'">
                            <div class="vdatetime-popup__month-selector">
                                <div class="vdatetime-popup__month-selector__previous" @click="previousMonth">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
                                        <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
                                    </svg>
                                </div>
                                <div class="vdatetime-popup__month-selector__current">{{ currentMonth }}</div>
                                <div class="vdatetime-popup__month-selector__next" @click="nextMonth">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
                                        <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="vdatetime-popup__date-picker" :style="{height: datePickerHeight}">
                                <div class="vdatetime-popup__date-picker__item vdatetime-popup__date-picker__item--header" v-for="weekday in weekdays">{{ weekday }}</div>
                                <div class="vdatetime-popup__date-picker__item" v-for="day in currentMonthDays" @click="!day.disabled && selectDay(day.number)" :class="{'vdatetime-popup__date-picker__item--selected': day.selected, 'vdatetime-popup__date-picker__item--disabled': day.disabled}">
                                    <span><span>{{ day.number }}</span></span>
                                </div>
                            </div>
                        </div>
                        <div v-show="show === 'time'" class="vdatetime-popup__list-picker-wrapper">
                            <div class="vdatetime-popup__list-picker vdatetime-popup__list-picker--half" ref="hourPicker">
                                <div class="vdatetime-popup__list-picker__item" v-for="hour in hours" @click="selectHour(hour.number)" :class="{'vdatetime-popup__list-picker__item--selected': hour.selected}">{{ hour.number }}</div>
                            </div>
                            <div class="vdatetime-popup__list-picker vdatetime-popup__list-picker--half" ref="minutePicker">
                                <div class="vdatetime-popup__list-picker__item" v-for="minute in minutes" @click="selectMinute(minute.number)" :class="{'vdatetime-popup__list-picker__item--selected': minute.selected}">{{ minute.number }}</div>
                            </div>
                        </div>
                        <div v-show="show === 'year'" class="vdatetime-popup__list-picker-wrapper">
                            <div class="vdatetime-popup__list-picker" ref="yearPicker">
                                <div class="vdatetime-popup__list-picker__item" v-for="year in years" @click="selectYear(year.number)" :class="{'vdatetime-popup__list-picker__item--selected': year.selected}">{{ year.number }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="vdatetime-popup__actions">
                        <div class="vdatetime-popup__actions__button" @click="close(false)">{{ i18n.cancel }}</div>
                        <div class="vdatetime-popup__actions__button" @click="ok">{{ i18n.ok }}</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
  import Vue from 'vue'
  import moment from 'moment'
  import * as util from './util'
  import typeFlowFactory from './TypeFlows'

  export default {
    props: {
      value: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'date'
      },
      inputFormat: {
        type: String,
        default: ''
      },
      wrapperClass: {
        type: String
      },
      inputClass: {
        type: String
      },
      placeholder: {
        type: String
      },
      momentLocale: {
        type: String,
        default: null
      },
      minDate: {
        type: String,
        default: null
      },
      maxDate: {
        type: String,
        default: null
      },
      disabledDates: {
        type: Array,
        default () {
          return []
        }
      },
      mondayFirst: {
        type: Boolean,
        default: false,
      },
      autoContinue: {
        type: Boolean,
        default: false
      },
      autoClose: {
        type: Boolean,
        default: false
      },
      required: {
        type: Boolean,
        default: false
      },
      i18n: {
        type: Object,
        default () {
          return {
            ok: 'Ok',
            cancel: 'Cancel'
          }
        }
      }
    },

    data () {
      let date = this.getDate()

      return {
        isOpen: false,
        show: null,
        date: date,
        newDate: null,
        currentMonthDate: null,
        typeFlow: typeFlowFactory(this.type, this, date ? date.clone() : moment().locale(this.momentLocale)),
        datePickerItemHeight: null
      }
    },

    watch: {
      value (newValue) {
        this.date = this.getDate()
        this.typeFlow.setDate(this.date ? this.date.clone() : moment().locale(this.momentLocale))
        this.newDate = this.getNewDate()
        this.currentMonthDate = this.getCurrentMonthDate()
      }
    },

    created () {
      if (this.date) {
        this.$emit('input', this.typeFlow.isoDate())
      }
    },

    computed: {
      inputValue () {
        return this.typeFlow.format(this.date, this.inputFormat || this.typeFlow.inputFormat())
      },
      newDay () {
        return this.newDate.format('ddd, MMM D')
      },
      newYear () {
        return this.newDate.format('YYYY')
      },
      currentMonth () {
        return this.currentMonthDate.format('MMMM YYYY')
      },
      weekdays () {
        return util.weekdays(this.momentLocale, this.mondayFirst)
      },
      currentMonthDays () {
        const currentYear = this.currentMonthDate.year()
        const currentMonth = this.currentMonthDate.month()
        const isCurrentMonth = currentYear === this.newDate.year() &&
                               currentMonth === this.newDate.month()

        let days = util.monthDays(currentMonth, currentYear, this.mondayFirst)

        return days.map(day => {
          return {
            number: day || '',
            selected: day ? isCurrentMonth && day === this.newDate.date() : false,
            disabled: day ? this.isDisabled(moment([currentYear, currentMonth, day])) : true
          }
        })
      },
      years () {
        return util.years().map(year => {
          return {
            number: year,
            selected: year === this.newDate.year()
          }
        })
      },
      hours () {
        return util.hours().map(hour => {
          return {
            number: hour,
            selected: parseInt(hour) === parseInt(this.newDate.hour())
          }
        })
      },
      minutes () {
        return util.minutes().map(minute => {
          return {
            number: minute,
            selected: parseInt(minute) === this.newDate.minute()
          }
        })
      },
      disabledDatesRanges () {
        return this.disabledDates.map(function (item) {
          return Array.isArray(item) ? [moment(item[0]), moment(item[1])] : [moment(item), moment(item).add(1, 'day')]
        })
      },
      datePickerHeight () {
        let height = (Math.ceil(this.currentMonthDays.length / 7) + 1) * this.datePickerItemHeight

        return height ? height + 'px' : 'auto'
      }
    },

    methods: {
      getDate () {
        return this.value.length ? moment(this.value, this.type === 'time' ? 'HH:mm' : null).locale(this.momentLocale) : null
      },
      getNewDate () {
        let newDate = this.date ? this.date.clone() : moment().locale(this.momentLocale)

        for (let i = 0; i < 1e5 && this.isDisabled(newDate); i++) {
          newDate = newDate.clone().add(1, 'day')
        }

        return newDate
      },
      getCurrentMonthDate () {
        return moment([this.newDate.year(), this.newDate.month(), 1]).locale(this.momentLocale)
      },
      open () {
        this.newDate = this.getNewDate()
        this.currentMonthDate = this.getCurrentMonthDate()

        this.isOpen = true
        this.$refs.input.blur()
        this.typeFlow.open()

        this.$nextTick(() => {
          let height = (this.$refs.popupBody.clientHeight - 25) + 'px'
          this.$refs.hourPicker.style.height = height
          this.$refs.minutePicker.style.height = height
          this.$refs.yearPicker.style.height = height
        })
      },
      close (save = true) {
        this.typeFlow.close()

        if (save === true) {
          this.date = this.typeFlow.date.clone()
          this.$emit('input', this.typeFlow.isoDate())
        }

        this.isOpen = false
      },
      ok () {
        if (this.show === 'year') {
          this.showDatePicker()
        } else {
          this.typeFlow.ok()
        }
      },
      showDatePicker () {
        this.show = 'date'

        this.$nextTick(() => {
          this.datePickerItemHeight = this.$refs.popupBody.getElementsByClassName('vdatetime-popup__date-picker__item')[7].offsetHeight
        })
      },
      showTimePicker () {
        this.show = 'time'

        this.$nextTick(() => {
          let selectedHour = this.$refs.hourPicker.querySelector('.vdatetime-popup__list-picker__item--selected')
          let selectedMinute = this.$refs.minutePicker.querySelector('.vdatetime-popup__list-picker__item--selected')

          this.$refs.hourPicker.scrollTop = selectedHour ? selectedHour.offsetTop - 250 : 0
          this.$refs.minutePicker.scrollTop = selectedMinute ? selectedMinute.offsetTop - 250 : 0
        })
      },
      showYearPicker () {
        this.show = 'year'

        this.$nextTick(() => {
          let selectedYear = this.$refs.yearPicker.querySelector('.vdatetime-popup__list-picker__item--selected')

          this.$refs.yearPicker.scrollTop = selectedYear ? selectedYear.offsetTop - 250 : 0
        })
      },
      previousMonth () {
        this.currentMonthDate = this.currentMonthDate.clone().subtract(1, 'month')
      },
      nextMonth () {
        this.currentMonthDate = this.currentMonthDate.clone().add(1, 'month')
      },
      selectYear (year) {
        this.currentMonthDate = this.currentMonthDate.clone().year(year)
        this.newDate = this.newDate.clone().year(year)

        if (this.autoContinue) {
          this.showDatePicker()
        }
      },
      selectDay (day) {
        this.typeFlow.selectDay(this.currentMonthDate.year(), this.currentMonthDate.month(), day)
        this.newDate = this.typeFlow.date.clone()
      },
      selectHour (hour) {
        this.typeFlow.selectHour(hour)
        this.newDate = this.typeFlow.date.clone()
      },
      selectMinute (minute) {
        this.typeFlow.selectMinute(minute)
        this.newDate = this.typeFlow.date.clone()
      },
      isDisabled (date) {
        return (this.minDate && date.isBefore(this.minDate, 'day')) ||
               (this.maxDate && date.isAfter(this.maxDate, 'day')) ||
               (this.disabledDatesRanges && this.disabledDatesRanges.find(function (dates) {
                 return date.isBetween(dates[0], dates[1], 'day', '[)')
               }) !== undefined)
      }
    }
  }
</script>

<style lang="scss">
    .vdatetime {
        > * {
            box-sizing: border-box;
        }
    }

    .vdatetime-fade-enter-active,
    .vdatetime-fade-leave-active {
        transition: opacity .4s;
    }

    .vdatetime-fade-enter,
    .vdatetime-fade-leave-to {
        opacity: 0;
    }

    .vdatetime-overlay {
        z-index: 999;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        transition: opacity .5s;
    }

    .vdatetime-popup {
        z-index: 1000;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        user-select: none;
        width: 340px;
        max-width: calc(100% - 30px);
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
        color: #444;
        font-family: -apple-system, BlinkMacSystemFont,
        "Segoe UI", "Roboto", "Oxygen",
        "Ubuntu", "Cantarell", "Fira Sans",
        "Droid Sans", "Helvetica Neue", sans-serif;
        background: #fff;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    .vdatetime-popup__header {
        padding: 15px 30px;
        background: #3f51b5;
        color: #fff;
        font-size: 32px;
        text-transform: capitalize;
    }

    .vdatetime-popup__year {
        display: block;
        font-weight: 300;
        font-size: 14px;
        opacity: 0.7;
        cursor: pointer;
        transition: opacity .3s;

        &:hover {
            opacity: 1;
        }
    }

    .vdatetime-popup__body {
        padding: 15px 0 10px;
        font-size: 16px;
        user-select: none;
    }

    .vdatetime-popup__month-selector {
        position: relative;
        padding: 0 30px;
        margin-bottom: 15px;
        width: 100%;
    }

    .vdatetime-popup__month-selector__previous,
    .vdatetime-popup__month-selector__next {
        position: absolute;
        top: 0;
        padding: 0 5px;
        width: 8px;
        cursor: pointer;

        svg {
            width: 8px;

            path {
                transition: stroke .3s;
            }
        }

        &:hover svg path {
            stroke: #888;
        }
    }

    .vdatetime-popup__month-selector__previous {
        left: 25px;
    }

    .vdatetime-popup__month-selector__next {
        right: 25px;
        transform: scaleX(-1);
    }

    .vdatetime-popup__month-selector__current {
        text-align: center;
        text-transform: capitalize;
    }

    .vdatetime-popup__date-picker {
        padding: 0 20px;
        transition: height .2s;
    }

    .vdatetime-popup__date-picker__item {
        display: inline-block;
        width: #{100%/7};
        line-height: 36px;
        text-align: center;
        font-size: 15px;
        font-weight: 300;
        cursor: pointer;

        > span {
            display: block;
            width: 100%;
            position: relative;
            height: 0;
            padding: 0 0 100% 0;
            overflow: hidden;

            > span {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                border: 0;
                border-radius: 50%;
                transition: background-color .3s, color .3s;
            }
        }
    }

    .vdatetime-popup__date-picker__item:hover > span > span {
        background: #eee;
    }

    .vdatetime-popup__date-picker__item--selected {
        & > span > span,
        &:hover > span > span {
            color: #fff;
            background: #3f51b5;
        }
    }

    .vdatetime-popup__date-picker__item--header {
        font-weight: bold;
    }

    .vdatetime-popup__date-picker__item--disabled {
        opacity: 0.4;
        cursor: default;

        &:hover > span > span {
            color: inherit;
            background: transparent;
        }
    }

    .vdatetime-popup__list-picker-wrapper {
        &:after {
            content: '';
            display: table;
            clear: both;
        }
    }

    .vdatetime-popup__list-picker {
        height: 305px;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 3px;
        }

        &::-webkit-scrollbar-track {
            background: #efefef;
        }

        &::-webkit-scrollbar-thumb {
            background: #ccc;
        }
    }

    .vdatetime-popup__list-picker--half {
        float: left;
        width: 50%;
    }

    .vdatetime-popup__list-picker__item {
        padding: 10px 0;
        font-size: 20px;
        text-align: center;
        cursor: pointer;
        transition: font-size .3s;
    }

    .vdatetime-popup__list-picker__item:hover {
        font-size: 32px;
    }

    .vdatetime-popup__list-picker__item--selected {
        color: #3f51b5;
        font-size: 32px;
    }

    .vdatetime-popup__actions {
        padding: 0 20px 10px 30px;
        text-align: right;
    }

    .vdatetime-popup__actions__button {
        display: inline-block;
        border: none;
        padding: 10px 20px;
        background: transparent;
        font-size: 16px;
        color: #3f51b5;
        cursor: pointer;
        transition: color .3s;

        &:hover {
            color: #444;
        }
    }
</style>
