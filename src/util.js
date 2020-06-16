import { DateTime, Info, Settings } from 'luxon'
import FlowManager from './FlowManager'

export function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function datetimeFromISO (string) {
  const datetime = DateTime.fromISO(string).toUTC()

  return datetime.isValid ? datetime : null
}

export function monthDays (year, month, weekStart) {
  const monthDate = DateTime.local(year, month, 1)
  let firstDay = monthDate.weekday - weekStart

  if (firstDay < 0) {
    firstDay += 7
  }
  let lastDay = (weekStart - monthDate.weekday - monthDate.daysInMonth) % 7
  if (lastDay < 0) {
    lastDay += 7
  }

  return Array.apply(null, Array(monthDate.daysInMonth + firstDay + lastDay))
    .map((value, index) =>
      (index + 1 <= firstDay || index >= firstDay + monthDate.daysInMonth) ? null : (index + 1 - firstDay)
    )
}

function getDateFromDateTime (dateTime) {
  return DateTime.fromObject({ year: dateTime.c.year, month: dateTime.c.month, day: dateTime.c.day, zone: 'UTC' })
}

function checkAllowedDateTimeRanges (allowedDateTimeRanges, startCheck, endCheck = null) {
  endCheck = endCheck || startCheck
  return allowedDateTimeRanges && !allowedDateTimeRanges.find(function (dates) {
    const startDate = dates[0] ? getDateFromDateTime(dates[0]) : null
    const endDate = dates[1] ? getDateFromDateTime(dates[1]) : null
    return (startDate && startCheck >= startDate) && (endDate && endCheck <= endDate)
  })
}

// This is needed to reduce what we pass to the time component keeping it loose-ish for isolated use
export function findAllowedDateTimeRanges (allowedDateTimeRanges, startDay, endDay = null) {
  endDay = endDay || startDay
  return allowedDateTimeRanges.filter(function (dates) {
    const startDateTime = dates[0] ? dates[0] : null
    const endDateTime = dates[1] ? dates[1] : null
    return (startDateTime && (startDay >= startDateTime)) || (endDateTime && (endDay <= endDateTime))
  })
}

export function monthDayIsDisabled (allowedDateTimeRanges, year, month, day) {
  return checkAllowedDateTimeRanges(allowedDateTimeRanges, DateTime.fromObject({ year, month, day, zone: 'UTC' }))
}

export function monthIsDisabled (allowedDateTimeRanges, year, month) {
  return checkAllowedDateTimeRanges(
    allowedDateTimeRanges,
    DateTime.utc(year, month, DateTime.utc(year, month).daysInMonth),
    DateTime.utc(year, month, 1)
  )
}

export function yearIsDisabled (allowedDateTimeRanges, year) {
  return checkAllowedDateTimeRanges(allowedDateTimeRanges, DateTime.utc(year))
}

export function hourIsDisabled (validTimes, hour) {
  return !validTimes.hours.find(hourX => hourX === hour)
}

export function minuteIsDisabled (validTimes, hour, minute) {
  return !validTimes.minutes.find(minuteX => minuteX === minute) && !hourIsDisabled(validTimes, hour)
}

// just adding cause why not :)
export function secondIsDisabled (validTimes, hour, minute, second) {
  return !validTimes.seconds.find(secondX => secondX === second) && !hourIsDisabled(validTimes, hour) && !minuteIsDisabled(validTimes, minute)
}

export function weekdays (weekStart) {
  if (--weekStart < 0) {
    weekStart = 6
  }

  let weekDays = Info.weekdays('short').map(weekday => capitalize(weekday))

  weekDays = weekDays.concat(weekDays.splice(0, weekStart))

  return weekDays
}

export function months () {
  return Info.months().map(month => capitalize(month))
}

export function hours (step) {
  return Array.apply(null, Array(Math.ceil(24 / step))).map((item, index) => index * step)
}

export function minutes (step) {
  return Array.apply(null, Array(Math.ceil(60 / step))).map((item, index) => index * step)
}

export function years (current) {
  return Array.apply(null, Array(201)).map((item, index) => current - 100 + index)
}

export function pad (number) {
  return number < 10 ? '0' + number : number
}

export function startOfDay (datetime) {
  return datetime.startOf('day')
}

export function createFlowManager (flow) {
  return new FlowManager(flow, 'end')
}

export function createFlowManagerFromType (type) {
  let flow = []

  switch (type) {
    case 'datetime':
      flow = ['date', 'time']
      break
    case 'time':
      flow = ['time']
      break
    default:
      flow = ['date']
  }

  return new FlowManager(flow, 'end')
}

export function weekStart () {
  let weekstart

  try {
    weekstart = require('weekstart/package.json').version ? require('weekstart') : null
  } catch (e) {
    weekstart = window.weekstart
  }

  const firstDay = weekstart ? weekstart.getWeekStartByLocale(Settings.defaultLocale) : 1

  return firstDay === 0 ? 7 : firstDay
}
