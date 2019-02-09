<template>
  <div class="vdatetime-month-picker">
    <div class="vdatetime-month-picker__list vdatetime-month-picker__list" ref="monthList">
      <div class="vdatetime-month-picker__item" v-for="month in months" @click="select(month)" :class="{'vdatetime-month-picker__item--selected': month.selected, 'vdatetime-month-picker__item--disabled': month.disabled}">{{ month.label }}
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import { monthIsDisabled, months } from './util'

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
    minDate: {
      type: DateTime,
      default: null
    },
    maxDate: {
      type: DateTime,
      default: null
    }
  },

  computed: {
    months () {
      return months(this.month).map((month, index) => ({
        number: ++index,
        label: month,
        selected: index === this.month,
        disabled: !index || monthIsDisabled(this.minDate, this.maxDate, this.year, index)
      }))
    }
  },

  methods: {
    select (month) {
      if (month.disabled) {
        return
      }

      this.$emit('change', parseInt(month.number))
    },

    scrollToCurrent () {
      const selectedMonth = this.$refs.monthList.querySelector('.vdatetime-month-picker__item--selected')
      this.$refs.monthList.scrollTop = selectedMonth ? selectedMonth.offsetTop - 250 : 0
    }
  },

  mounted () {
    this.scrollToCurrent()
  },

  updated () {
    this.scrollToCurrent()
  }
}
</script>

<style>
.vdatetime-month-picker {
  box-sizing: border-box;

  &::after {
    content: '';
    display: table;
    clear: both;
  }

  & * {
    box-sizing: border-box;
  }
}

.vdatetime-month-picker__list {
  float: left;
  width: 100%;
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

.vdatetime-month-picker__item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size .3s;
}

.vdatetime-month-picker__item:hover {
  font-size: 32px;
}

.vdatetime-month-picker__item--selected {
  color: #3f51b5;
  font-size: 32px;
}

.vdatetime-month-picker__item--disabled {
  opacity: 0.4;
  cursor: default;

  &:hover {
    color: inherit;
    background: transparent;
  }
}
</style>
