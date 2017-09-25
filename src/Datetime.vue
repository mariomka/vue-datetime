<style lang="scss">
    .vdatetime {
        > * {
            box-sizing: border-box;
        }
    }

    .vdatetime-fade-enter-active,
    .vdatetime-fade-leave-active {
        transition: opacity .5s
    }

    .vdatetime-fade-enter,
    .vdatetime-fade-leave-to {
        opacity: 0
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
        width: 340px;
        max-width: calc(100% - 30px);
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
        color: #444;
        font-family: -apple-system, BlinkMacSystemFont,
        "Segoe UI", "Roboto", "Oxygen",
        "Ubuntu", "Cantarell", "Fira Sans",
        "Droid Sans", "Helvetica Neue", sans-serif;
        background: #fff;
    }

    .vdatetime-popup__header {
        padding: 15px 30px;
        background: #3f51b5;
        color: #fff;
        font-size: 32px;
        text-transform: capitalize;

        .vdatetime-popup__year {
            display: block;
            font-weight: 300;
            font-size: 14px;
            opacity: 0.7;
            cursor: pointer;
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
        }

        &:hover svg path {
            stroke: #3f51b5;
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
            }
        }
    }

    .vdatetime-popup__date-picker__item:hover,
    .vdatetime-popup__date-picker__item--selected {
        > span > span {
            color: #fff;
            background: #3f51b5;
        }
    }

    .vdatetime-popup__date-picker__item--header {
        font-weight: bold;
    }

    .vdatetime-popup__date-picker__item--disabled {
        opacity: 0.5;
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
        height: 380px;
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
    }

    .vdatetime-popup__list-picker__item:hover,
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

        &:hover {
            color: #444;
        }
    }

</style>
<template>
    <div class="vdatetime" :class="wrapperClass">
        <input v-bind="$attrs"
               v-on="$listeners"
               type="text"
               readonly="readonly"
               :placeholder="placeholder"
               :value="dateFormatted"
               :class="inputClass"
               :required="required"
               @click="open"
               @focus="open"/>
        <transition name="vdatetime-fade">
            <div v-if="isOpen">
                <div v-if="mode === 'popup'" class="vdatetime-overlay" @click.self="close"></div>
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
                                        <path fill="none" stroke="#231f20" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
                                    </svg>
                                </div>
                                <div class="vdatetime-popup__month-selector__current">{{ currentMonth }}</div>
                                <div class="vdatetime-popup__month-selector__next" @click="nextMonth">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
                                        <path fill="none" stroke="#231f20" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="vdatetime-popup__date-picker">
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
                        <div class="vdatetime-popup__actions__button" @click="close">Cancel</div>
                        <div class="vdatetime-popup__actions__button" @click="ok">Ok</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
  import moment from 'moment'

  export default {
    props: {
      wrapperClass: {
        type: String
      },
      inputClass: {
        type: String
      },
      placeholder: {
        type: String
      },
      value: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'date'
      },
      mode: {
        type: String,
        default: 'popup'
      },
      mondayFirst: {
        type: Boolean,
        default: false,
      },
      inputFormat: {
        type: String,
        default () {
          return this.type === 'datetime' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'
        }
      },
      autoClose: {
        type: Boolean,
        default: false
      },
      locale: {
        type: String,
        default: null
      },
      disabledDates: {
        type: Array,
        default () {
          return []
        }
      },
      required: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        isOpen: false,
        date: this.value.length ? moment(this.value).locale(this.locale) : null,
        newDate: null,
        show: null,
        currentMonthDate: null,
        timeSelected: false
      }
    },

    computed: {
      dateFormatted () {
        return this.date ? this.date.format(this.inputFormat) : ''
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
        let weekdays = moment.weekdaysMin()

        if (this.mondayFirst) {
          weekdays.push(weekdays.shift())
        }

        return weekdays
      },
      currentMonthDays () {
        const firstDay = this.currentMonthDate.clone().date(1).day() - (this.mondayFirst ? 1 : 0)
        let days = []
        let month = this.currentMonthDate.month() + 1
        let year = this.currentMonthDate.year()

        // fill start
        for (let i = firstDay - 1; i >= 0; i--) {
          days.push({
            number: '',
            selected: false,
            disabled: this.isDisabled(moment([year, month, +i]))
          })
        }

        // add current month days
        const daysInMonth = this.currentMonthDate.daysInMonth()
        const date = this.newDate.date()
        month = this.currentMonthDate.month()
        year = this.currentMonthDate.year()
        const isCurrentMonth = month === this.newDate.month() &&
                               year === this.newDate.year()

        for (let i = 1; i <= daysInMonth; i++) {
          days.push({
            number: i,
            selected: isCurrentMonth && i === date,
            disabled: this.isDisabled(moment([year, month, +i]))
          })
        }

        return days
      },
      years () {
        let years = []
        const currentYear = moment().year()
        const year = this.newDate.year()

        for (let i = currentYear - 100; i < currentYear + 100; i++) {
          years.push({
            number: i,
            selected: i === year
          })
        }

        return years
      },
      hours () {
        let hours = []
        const hour = this.newDate.hour()

        for (let i = 0; i < 24; i++) {
          hours.push({
            number: i < 10 ? '0' + i : i,
            selected: i === hour
          })
        }

        return hours
      },
      minutes () {
        let minutes = []
        const minute = this.newDate.minute()

        for (let i = 0; i < 60; i++) {
          minutes.push({
            number: i < 10 ? '0' + i : i,
            selected: i === minute
          })
        }

        return minutes
      },
      disabledDatesParsed () {
        return this.disabledDates.map(function (item) {
          return Array.isArray(item) ? [moment(item[0]), moment(item[1])] : [moment(item), moment(item).add(1, 'day')]
        })
      }
    },

    methods: {
      open () {
        this.newDate = this.date ? this.date : moment().locale(this.locale)
        this.currentMonthDate = moment([this.newDate.year(), this.newDate.month(), 1]).locale(this.locale)
        this.isOpen = true
        this.showDatePicker()

        this.$nextTick(() => {
          let height = (this.$refs.popupBody.clientHeight - 25) + 'px'
          this.$refs.hourPicker.style.height = height
          this.$refs.minutePicker.style.height = height
          this.$refs.yearPicker.style.height = height
        })
      },
      close (save = false) {
        if (save === true) {
          this.date = this.newDate
          this.$emit('input', this.date.toISOString())
        } else {
          this.newDate = this.date
        }

        this.isOpen = false
      },
      ok () {
        if (this.show === 'date' && this.type === 'datetime') {
          this.showTimePicker()
        } else if (this.show === 'year') {
          this.showDatePicker()
        } else {
          this.close(true)
        }
      },
      showDatePicker () {
        this.show = 'date'
      },
      showTimePicker () {
        this.timeSelected = false
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
      selectDay (day) {
        this.newDate = this.newDate
          .clone()
          .month(this.currentMonthDate.month())
          .year(this.currentMonthDate.year())
          .date(day)

        if (this.type === 'date' && this.autoClose) {
          this.close(true)
        } else if (this.type === 'datetime' && this.autoClose) {
          this.showTimePicker()
        }
      },
      selectHour (hour) {
        this.newDate = this.newDate.clone().hour(hour)

        if (this.timeSelected && this.autoClose) {
          this.close(true)
        }

        this.timeSelected = true
      },
      selectMinute (minute) {
        this.newDate = this.newDate.clone().minute(minute)

        if (this.timeSelected && this.autoClose) {
          this.close(true)
        }

        this.timeSelected = true
      },
      selectYear (year) {
        this.currentMonthDate = this.currentMonthDate.clone().year(year)
        this.newDate = this.newDate.clone().year(year)

        if (this.autoClose) {
          this.showDatePicker()
        }
      },
      isDisabled (date) {
        return this.disabledDatesParsed && this.disabledDatesParsed.find(function (dates) {
          return date.isBetween(dates[0], dates[1], 'day', '[)')
        }) !== undefined
      }
    }
  }
</script>
