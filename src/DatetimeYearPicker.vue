<template>
  <div class="vdatetime-year-picker">
    <div class="vdatetime-year-picker__list vdatetime-year-picker__list" ref="yearList">
      <div class="vdatetime-year-picker__item" v-for="year in years" @click="select(year)" :class="{'vdatetime-year-picker__item--selected': year.selected, 'vdatetime-year-picker__item--disabled': year.disabled}">{{ year.number }}
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import { yearIsDisabled, years } from './util'

export default {
  props: {
    year: {
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
    years () {
      return years(this.year).map(year => ({
        number: year,
        selected: year === this.year,
        disabled: !year || yearIsDisabled(this.minDate, this.maxDate, year)
      }))
    }
  },

  methods: {
    select (year) {
      if (year.disabled) {
        return
      }

      this.$emit('change', parseInt(year.number))
    },

    scrollToCurrent () {
      const selectedYear = this.$refs.yearList.querySelector('.vdatetime-year-picker__item--selected')
      this.$refs.yearList.scrollTop = selectedYear ? selectedYear.offsetTop - 250 : 0
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
.vdatetime-year-picker {
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

.vdatetime-year-picker__list {
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

.vdatetime-year-picker__item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size .3s;
}

.vdatetime-year-picker__item:hover {
  font-size: 32px;
}

.vdatetime-year-picker__item--selected {
  color: #3f51b5;
  font-size: 32px;
}

.vdatetime-year-picker__item--disabled {
  opacity: 0.4;
  cursor: default;

  &:hover {
    color: inherit;
    background: transparent;
  }
}
</style>
