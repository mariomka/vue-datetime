**WORK IN PROGRESS: DO NOT USE YET**

# vue-datetime-picker
> Mobile friendly datetime picker for Vue. Supports date, datetime and ~~time~~ modes, popup, ~~dropdown~~, ~~inline~~ presentations, i18n and disabling dates.

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Latest Version on NPM](https://img.shields.io/npm/v/vue-datetime-picker.svg?style=flat-square)](https://npmjs.com/package/vue-datetime-picker)
[![npm](https://img.shields.io/npm/dt/vue-datetime-picker.svg?style=flat-square)](https://www.npmjs.com/package/vue-datetime-picker)

## Demo

**[Go to demo](http://mariomka.github.io/vue-datetime-picker)**.

# Install

yarn

```bash
yarn add vue-datetime-picker
```

npm

```bash
npm install vue-datetime-picker --save
```

## Setup

Register the plugin.

```js
import DatetimePicker from 'vue-datetime-picker';

Vue.use(DatetimePicker);
```

Or register components manually.

```js
import {DatetimePicker} from 'vue-datetime-picker';

Vue.component('datetime-picker', DatetimePicker);
```

## Usage

```html
<datetime-picker v-model="date"
                 placeholder="Select date"
                 type="datetime"
                 locale="es"
                 input-format="DD-MM-YYYY HH:mm"
                 input-class="my-input-class"
                 wrapper-class="my-wrapper-class"
                 :disabled-dates="['2017-09-07', ['2017-09-25', '2017-10-05']]"
                 auto-close
                 monday-first
                 required></datetime-picker>
```

# License

[The MIT License](http://opensource.org/licenses/MIT)
