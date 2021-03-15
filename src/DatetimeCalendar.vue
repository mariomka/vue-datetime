<template>
  <div class="vdatetime-calendar">
    <div class="vdatetime-calendar__navigation">
      <div class="vdatetime-calendar__navigation--previous" @click="previousMonth">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
          <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
        </svg>
      </div>
      <div class="vdatetime-calendar__current--month">{{ monthName }} {{ newYear }}</div>
      <div class="vdatetime-calendar__navigation--next" @click="nextMonth">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
          <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
        </svg>
      </div>
    </div>
    <div :class="{ 'vdatetime-calendar__display': showWeekNumbers }">
      <div v-if="showWeekNumbers" class="vdatetime-calendar__display__weeknumbers">
        <table>
          <tr v-for="weekNumber in weekNumbers" :key="weekNumber">
            <td>{{ weekNumber }}</td>
          </tr>
        </table>
      </div>
      <div :class="showWeekNumbers ? 'vdatetime-calendar__display__month--weeknumbers' : 'vdatetime-calendar__display__month'">
        <div class="vdatetime-calendar__display__month__weekday" v-for="weekday in weekdays">{{ weekday }}</div>
        <div class="vdatetime-calendar__display__month__day" v-for="day in days" @click="selectDay(day)" :class="{'vdatetime-calendar__display__month__day--selected': day.selected,'vdatetime-calendar__display__month__day--disabled': day.disabled}">
          <span><span>{{ day.number }}</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import { monthDayIsDisabled, monthDays, months, weekdays } from './util'

export default {
  props: {
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number,
      required: true
    },
    day: {
      type: Number,
      default: null
    },
    disabled: {
      type: Array
    },
    minDate: {
      type: DateTime,
      default: null
    },
    maxDate: {
      type: DateTime,
      default: null
    },
    weekStart: {
      type: Number,
      default: 1
    },
    showWeekNumbers: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      newDate: DateTime.fromObject({ year: this.year, month: this.month, zone: 'UTC' }),
      weekdays: weekdays(this.weekStart),
      months: months(),
      weekNumbers: []
    }
  },
  mounted () {
    if (this.showWeekNumbers) {
      this.getWeekNumberForDisplayedMonth()
    }
  },
  computed: {
    newYear () {
      return this.newDate.year
    },
    newMonth () {
      return this.newDate.month
    },
    monthName () {
      return this.months[this.newMonth - 1]
    },
    days () {
      return monthDays(this.newYear, this.newMonth, this.weekStart).map(day => ({
        number: day,
        selected: day && this.year === this.newYear && this.month === this.newMonth && this.day === day,
        disabled: !day || monthDayIsDisabled(this.minDate, this.maxDate, this.newYear, this.newMonth, day)
      }))
    }
  },

  methods: {
    selectDay (day) {
      if (day.disabled) {
        return
      }

      this.$emit('change', this.newYear, this.newMonth, day.number)
    },
    getWeekNumberForDisplayedMonth () {
      const weekNumbers = []
      const weeksInMonth = this.days.length / 7
      const firstWeekOfMonth = DateTime.local(this.newYear, this.newMonth, 1)
        .weekNumber

      weekNumbers.push(this.getFormattedWeekNumber(firstWeekOfMonth))
      let weekNumber
      if (DateTime.local(this.newYear, this.newMonth, 7).weekNumber === 1) {
        weekNumber = 0
      } else {
        weekNumber = firstWeekOfMonth
      }
      for (let counter = 1; counter < weeksInMonth; counter++) {
        weekNumber++
        weekNumbers.push(this.getFormattedWeekNumber(weekNumber))
      }
      this.weekNumbers = weekNumbers
    },
    getFormattedWeekNumber (weekNumber) {
      let stringifiedWeekNumber = weekNumber.toString()
      if (stringifiedWeekNumber.length === 1) {
        stringifiedWeekNumber = '0' + stringifiedWeekNumber
      }
      return stringifiedWeekNumber
    },
    previousMonth () {
      this.newDate = this.newDate.minus({ months: 1 })
      if (this.showWeekNumbers) {
        this.getWeekNumberForDisplayedMonth()
      }
    },
    nextMonth () {
      this.newDate = this.newDate.plus({ months: 1 })
      if (this.showWeekNumbers) {
        this.getWeekNumberForDisplayedMonth()
      }
    }
  }
}
</script>

<style>
.vdatetime-calendar__navigation,
.vdatetime-calendar__navigation * {
  box-sizing: border-box;
}

.vdatetime-calendar__navigation {
  position: relative;
  margin: 15px 0;
  padding: 0 30px;
  width: 100%;
}

.vdatetime-calendar__navigation--previous,
.vdatetime-calendar__navigation--next {
  position: absolute;
  top: 0;
  padding: 0 5px;
  width: 18px;
  cursor: pointer;

  & svg {
    width: 8px;
    height: 13px;

    & path {
      transition: stroke .3s;
    }
  }

  &:hover svg path {
    stroke: #888;
  }
}

.vdatetime-calendar__navigation--previous {
  left: 25px;
}

.vdatetime-calendar__navigation--next {
  right: 25px;
  transform: scaleX(-1);
}

.vdatetime-calendar__current--month {
  text-align: center;
  text-transform: capitalize;
}

.vdatetime-calendar__display {
  display: flex;
  justify-content: space-evenly;
}

.vdatetime-calendar__display__weeknumbers {
  width: 20%;
  padding-top: 36px;
  padding-left: 20px;

  & table {
    width: 100%;
  }

  & tr {
    height: 36px;
    width: 100%;
  }
}

@media (max-width: 375px) {
  .vdatetime-calendar__display__weeknumbers tr {
    height: 10vw;
  }
}

.vdatetime-calendar__display__month--weeknumbers {
  padding: 0 20px 0 5px;
  transition: height .2s;
  width: 80%;
}

.vdatetime-calendar__display__month {
  padding: 0 20px;
  transition: height .2s;
}

.vdatetime-calendar__display__month__weekday,
.vdatetime-calendar__display__month__day {
  display: inline-block;
  width: calc(100% / 7);
  line-height: 36px;
  text-align: center;
  font-size: 15px;
  font-weight: 300;
  cursor: pointer;

  & > span {
    display: block;
    width: 100%;
    position: relative;
    height: 0;
    padding: 0 0 100%;
    overflow: hidden;

    & > span {
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

.vdatetime-calendar__display__month__weekday {
  font-weight: bold;
}

.vdatetime-calendar__display__month__day:hover > span > span {
  background: #eee;
}

.vdatetime-calendar__display__month__day--selected {
  & > span > span,
  &:hover > span > span {
    color: #fff;
    background: #3f51b5;
  }
}

.vdatetime-calendar__display__month__day--disabled {
  opacity: 0.4;
  cursor: default;

  &:hover > span > span {
    color: inherit;
    background: transparent;
  }
}
</style>
