# vue-datetime
> Mobile friendly datetime picker for Vue. Supports date, datetime and time modes, i18n and disabling dates.

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Latest Version on NPM](https://img.shields.io/npm/v/vue-datetime.svg?style=flat-square)](https://npmjs.com/package/vue-datetime)
[![npm](https://img.shields.io/npm/dt/vue-datetime.svg?style=flat-square)](https://www.npmjs.com/package/vue-datetime)

## Demo

[![demo](https://raw.githubusercontent.com/mariomka/vue-datetime/master/docs/demo.gif)](http://mariomka.github.io/vue-datetime)

**[Go to demo](http://mariomka.github.io/vue-datetime)**.

# Install

yarn

```bash
yarn add vue-datetime
```

npm

```bash
npm install vue-datetime --save
```

## Register the component

```js
import Datetime from 'vue-datetime';

Vue.use(Datetime);
```

### Register manually

#### Global

```js
import { Datetime } from 'vue-datetime';

Vue.component('datetime', Datetime);
```

#### Local

```js
import { Datetime } from 'vue-datetime';

Vue.extend({
  template: '...',
  components: {
    datetime: Datetime
  }
});
```

## Usage

### Minimal

```html
<datetime v-model="date"></datetime>
```

### Complete

```html
<datetime v-model="date"
          type="datetime"
          input-format="DD-MM-YYYY HH:mm"
          wrapper-class="my-wrapper-class"
          input-class="my-input-class"
          placeholder="Select date"
          moment-locale="es"
          :i18n="{ok:'De acuerdo', cancel:'Cancelar'}"
          :disabled-dates="['2017-09-07', ['2017-09-25', '2017-10-05']]"
          max-date="2017-12-10"
          min-date="2017-07-10"
          monday-first
          auto-continue
          auto-close
          required></datetime>
```

### Third-party libraries

The component has a dependency, moment.js, and it behaves like an input text. It should work well with third-party libraries.

How to use with other libraries:

- [Use with Vue-Formly](https://gist.github.com/AndresCL/2e45360643a1858883616d349e0a9171) @AndresCL

## Params

Parameter | Type | Default
--------- | ---- | ------
v-model (*required*) | Date `String` | -
type | `String`: *date*, *datetime* or *time* | `date`
input-format | `String` | `YYYY-MM-DD`, `YYYY-MM-DD HH:mm` or `HH:mm`
wrapper-class | `String` | `null`
input-class | `String` | `null`
placeholder | `String` | `null`
moment-locale | `String` | `null`
i18n | `Object` | `{ok: 'Ok', cancel: 'Cancel'}`
disabled-dates | `Array` of date `Strings` | `[]`
min-date | Date `String` | `null`
max-date | Date `String` | `null`
monday-first | `Boolean` | `false`
auto-continue | `Boolean` | `false`
auto-close | `Boolean` | `false`
required | `Boolean` | `false`

The component is based on [Moment.js](https://momentjs.com), check out documentation to set dates (ISO 8601 recommended), `input-format` and `moment-locale`.

## Time zone

If a time zone offset is not present, the local time zone is used.

The user selects in his local time but datetime returned is UTC.

## Events

Component emits the `input` event to work with `v-model`. [More info](https://vuejs.org/v2/guide/components.html#Form-Input-Components-using-Custom-Events).

## Theming

Theming is supported by overwriting CSS classes, you can see all CSS in [Datetime.vue](src/Datetime.vue).

Also there is an example in **[demo](http://mariomka.github.io/vue-datetime)**.

# License

[The MIT License](http://opensource.org/licenses/MIT)
