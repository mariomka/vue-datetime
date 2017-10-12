**WORK IN PROGRESS: DO NOT USE YET**

# vue-datetime
> Mobile friendly datetime picker for Vue. Supports date, datetime and time modes, i18n and disabling dates.

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Latest Version on NPM](https://img.shields.io/npm/v/vue-datetime.svg?style=flat-square)](https://npmjs.com/package/vue-datetime)
[![npm](https://img.shields.io/npm/dt/vue-datetime.svg?style=flat-square)](https://www.npmjs.com/package/vue-datetime)

## Demo

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

## Setup

Register the plugin.

```js
import Datetime from 'vue-datetime';

Vue.use(Datetime);
```

Or register components manually.

```js
import {Datetime} from 'vue-datetime';

Vue.component('datetime', Datetime);
```

## Usage

### Minimal

```html
<datetime v-model="date"></datetime>
```

### Full

```html
<datetime v-model="date"
          placeholder="Select date"
          type="datetime"
          locale="es"
          input-format="DD-MM-YYYY HH:mm"
          input-class="my-input-class"
          wrapper-class="my-wrapper-class"
          :disabled-dates="['2017-09-07', ['2017-09-25', '2017-10-05']]"
          auto-continue
          auto-close
          monday-first
          required></datetime>
```

# License

[The MIT License](http://opensource.org/licenses/MIT)
