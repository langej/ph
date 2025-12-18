# pH - the plain html UI framework

- plain html powered by web components
- no build step required
- only ~6kb in size
- the browser console is your dev tool

---

- [How to use](#how-to-use)
    - [Load from cdn](#load-from-cdn)
    - [Component declaration](#component-declaration)
        - [Using attributes](#using-attributes)
        - [Using signals, computed properties, constants and methods](#using-signals-computed-properties-constants-and-methods)
            - [Automatic local-storage persistence](#automatic-local-storage-persistence)
        - [Event handling](#event-handling)
            - [Event modifiers](#event-modifiers)
            - [Emitting events](#emitting-events)
        - [Binding attributes](#binding-attributes)
        - [Control flow](#control-flow)
        - [Lists](#lists)
        - [Slots](#slots)
        - [Refs](#refs)
        - [Lifecycle hooks and watchers](#lifecycle-hooks-and-watchers)
    - [Store](#store)
    - [JS Imports](#js-imports)

# How to use

## Load from cdn

```html
<head>
    <script src="https://cdn.jsdelivr.net/gh/langej/ph@v0.1.1/dist/ph.js"></script>
    <script type="module">
        ph.init() // trigger initialization
    </script>
</head>
```

> [!NOTE]
> you need to use `type="module"` when calling `ph.init()` to ensure that it runs after the main script has loaded.

Alternatively, you can import the `ph.esm.js` file directly in your module:

```html
<head>
    <script type="module">
        import ph from 'https://cdn.jsdelivr.net/gh/langej/ph@v0.1.1/dist/ph.esm.js'
        ph.init()
    </script>
</head>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWAHAOgGwGYA0IAzvAgMYAu8UyIGAFuWLCAQGYQKHIDaoAdgEMwiJLQZMWIUgHs+lOTQA8hUgCcIAB3IACcgE8N8ALwAdcNKgBXBGYB8JvtqfaIYDdNU6Ndba1XSwbQByBnINQiQAekjSKD4MACtCKBIIADdVDD54ckiAczpI2AE+PPgEyO8AATSABgwARkbIqAhCXO8MeEIwRMIgh2dtTog+CHIACgBKB0VIlXUtW0liMnIIWS5RACYkBoaAWl2GnBAAXzx+IRFaJMkZOXgFUXPLkEFhGgxSQi4CB-k5Bo5wAumcgA)

## Component declaration

Components are declared using the `<ph-component>` tag with a required `tag` attribute specifying the custom element name.
The content of the component needs to be defined in a `<template>` tag.

```html
<ph-component tag="your-component">
    <template>
        <h1>Hello from your component</h1>
    </template>
</ph-component>

<your-component></your-component>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWAHAOgGwGYA0IAzvAgMYAu8UyIGAFuWLCAQGYQKHIDaoAdgEMwiJLQZMWIUgHs+lOTQA8hUgCcIAB3IACcgE8N8ALwAdcNKgBXBGYB8JvtqfaIYDdNU6Ndba1XSwbQByBnINQiQAekjSKD4MACtCKBIIADdVDD54ckiAczpI2AE+PPgEyO8AATSABgwARkbIqAhCXO8MeEIwRMIgh2dtTog+CHIACgBKB0VIlXUtez5Z7wBaGTdZeDldATzTED1pS1UNgPdsuTtB50VKN2LKZaGhxToG2wAJElhpX38gWOp20m0uO3Icw+LzukQeGie8GWc3WYO2cmWs2BZzRV3Itjm2POWzxtkkxDI5Agsi4oiwSAaABYQABfPD8IQiWhJSQyOQQmis9kgQTCGgYUiELgEPnyciClkAXRZQA)

### Using attributes

Attributes can be declared on the `<template>` tag using the `attributes` attribute. They are available as variables inside the component. Multiple attributes can be separated by commas.

Declared attributes will be added to the observed attributes of the component, so changes to them will be reflected inside the component.

```html
<ph-component tag="your-component">
    <template attributes="greeting, name">
        <h1>{{ greeting }} from {{ name }}</h1>
    </template>
</ph-component>

<your-component greeting="Hello" name="your component"></your-component>

<!-- changes will be reflected inside the component -->
<script>
    const component = document.querySelector('your-component')
    setTimeout(() => {
        component.setAttribute('greeting', 'Hi')
        component.setAttribute('name', 'the updated component')
    }, 1000)
</script>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWAHAOgGwGYA0IAzvAgMYAu8UyIGAFuWLCAQGYQKHIDaoAdgEMwiJLQZMWIUgHs+lOTQA8hUgCcIAB3IACcgE8N8ALwAdcNKgBXBGYB8JvtqfaIYDdNU6Ndba1XSwbQByBnINQiQAekjSKD4MACtCKBIIADdVDD54ckiAczpI2AE+PPgEyO8AATSABgwARkbIqAhCXO8MeEIwRMIgh2dtTog+CHIACgBKB0VIlXUtez5Z7wBaGTdZeDldATzTED1pS1UNgPdsuTtB50VKN2LKbQFycnUAI0tKQkO81XgOVGeTw2kEwhujiGdzoDVswGA2n+gPIwO0AF90b5-IEEWChPAMei5rDlkM5g8NE94Ms5utNpcduRlrNjqdzlsrjpkUDSocABIkWDSMz44SHNmqbQM7bXEC2OaSjmMuQsviKACEazW0roJTKhG0AHcOLBtB9CQDWGRKFAXHxCNBCeQ6ISZVztNraQtNMzbk4ZA6dO6mdojNooNJSJZhHIMABHSzwVR6ADKJHgFA8EyCSpDciCMyhTmI5AAKq54CdJtMw7ZtMB-dD8+QMKWAIJvT7feA5nmo0pBUFBfkQQtNoYtts5TvvCBfSg58HwIfBF2EywaKCvKjSi6y8jj4sY0ENWrnotzH1LSTEG0QWRcUQNACcSAaACYQOi8PwCTQ+kkQN5HIGhv1-EBlwA0hCC4AhgKZMD0QAXXRIA)

### Using signals, computed properties, constants and methods

Signals, computed properties, constants and methods can be declared using the respective `<ph-signal>`, `<ph-computed>`, `<ph-const>` and `<ph-method>` components.

Methods are defined using a `<script>` tag inside the `<ph-method>` component.
With the `args` attribute you can define a comma-separated list of parameters. Optionally you can also use type hints after a `:` but these are for readability only, yet.

```html
<ph-component tag="example-calculator">
    <template>
        <ph-signal name="a" value="1"></ph-signal>
        <ph-signal name="b" value="2"></ph-signal>
        <ph-computed name="result" value="a * b"></ph-computed>
        <ph-const name="title" value="`Simple Multiplier`"></ph-const>

        <ph-method name="reset">
            <script args="newA: Number, newB: Number">
                a = newA ?? 1
                b = newB ?? 2
            </script>
        </ph-method>

        <h1>{{ title }}</h1>
        <p>
            <input type="number" .value="a" @input="a = $e.target.value" />
            <span>*</span>
            <input type="number" .value="b" @input="b = $e.target.value" />
            <span>=</span>
            <span>{{ result }}</span>
        </p>
        <button @click="reset()">Reset</button>
    </template>
</ph-component>

<example-calculator></example-calculator>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAQGYQKHIDaoAdgEMwiJLQZMWIUgHs+lOTQA8hUgCcIAB3IACcgE8N8ALwAdcNKgBXBGYB8JvtqfaIYDdNU6Ndba1XSwbQByBnINQiQAekjSKD4MACtCKBIIADdVDD54ckiAczpI2AE+PPgEyO8AATSABgwARkbIqAhCXO8MeEIwRMIgh2dtTog+CHIACgBKB0VIlXUtez5Z7wBaGTdZeDldATzTEHgADyENBA2BWFJrAXIPO0HnRUo3YsploaHFdcIIPMEsG0gmEhwEZm0aSulmMZgadjmv3+gM+XycPzoaz+AKuwKEsJAACMIVDYDDDmgEZVMdiUU80RiNgENJZKFA8aCzKputZyCToQSBNoAFTaYkgWyIzGbFls1EM9YyPjtDkE8jjGwgSECw4AAwAyq5zvBtABZXmaWAQeCqXVUxWydrLelfRnCch0Cyqw7c4h8iUutHohaaHQCVR5QiHbIAdwAgkhtAA5SxgQk2vDA+AxgBCiZTaZtj0cQdLQqMWfj2gA-NXtPCS6W0YTtBXYzma3XKY2m3MQ0tA89qWt3Z6oM6e986A1bMBgLoNSaAL5LubT+WujQb0uKUay3QGAl8VPp1QQjCk8lmcFaqp71lg1vaAAk8Aw5HDZXIF4FEMi26DZQNBKWxhT7YC+AAhl7x0fRDGjE8iy1H8yQJcVtDvPhZUOFsK1fd9PxyFCYT-KDXUICDbCMcCQMHBkKJAudtF9XltBXGjILo7RETIxRCVZe5HCqUgrVIABrH1uhyaY7AAJSk8g5n48hBI3OZXnOO54GWKUmS2bI5AnRQTjOC5SCuG53g8SVIhMt54Eua5bnuVRbEkYgyHVR0aAAZgaJAABYGhAJc8H4fEaD6SQlXkcgaBCsKQBBERaFIQguAIGKdji0QQoAXSXIA)

#### Automatic local-storage persistence

Signals can be automatically persisted to local-storage by adding the `local-storage` attribute to the `<ph-signal>` tag.
The value of the attribute will be used as a prefix for the local-storage key. If no value is provided, the key will be the signal name.

```html
<!-- this will persist the signal value under the key "count" in local storage -->
<ph-signal name="count" value="0" local-storage></ph-signal>
<!-- this will persist the signal value under the key "example/count" in local storage -->
<ph-signal name="count" value="0" local-storage="example"></ph-signal>
```

### Event handling

Events can be handled using the `@event` syntax. The event object is available as `$e`.

```html
<ph-component tag="example-events">
    <template>
        <button @click="alert('click!')">Click me</button>
        <input @change="alert($e.target.value)" />
    </template>
</ph-component>

<example-events></example-events>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAQGYQKHIDaoAdgEMwiJLQZMWIUgHs+lOTQA8hUgCcIAB3IACcgE8N8ALwAdcNKgBXBGYB8JvtqfaIYDdNU6Ndba1XSwbQByBnINQiQAekjSKD4MACtCKBIIADdVDD54ckiAczpI2AE+PPgEyO8AATSABgwARkbIqAhCXO8MeEIwRMIgh2dtTog+CHIACgBKB0VIlXUtez5Z7wBaGTdZeDldATzTEHgADyENBDX4NJ3yQjtB50VKN2LKZaGhxQAjS3JyWW0VVIsAgpAA1ocBAhPBMgsDQWCAIRBGYgWwAYRB4O0wjmPz+sneHycilGGl+gNIdBKZUh0MmABJ4BhyAJVGVyBg0lDLPBUdpIkSSZFnucBG9ZpU6BsAu5snJlrMTmcLlcboRbHNlS94JdrnINZJiGRyBBZFxRA00EgAMw2kAAXzw-CEIloSUkMjkNxojudIEEwhoGFIhC4BC98nIvodAF0HUA)

#### Event modifiers

Event handlers can be modified using event modifiers. Multiple modifiers can be separated by a dot (`.`).
The following modifiers are available:

| Modifier        | Description                                                                   |
| --------------- | ----------------------------------------------------------------------------- |
| `prevent`       | Calls `event.preventDefault()`                                                |
| `stop`          | Calls `event.stopPropagation()`                                               |
| `ctrl`          | Only calls the event handler if the `ctrl` key is pressed                     |
| `shift`         | Only calls the event handler if the `shift` key is pressed                    |
| `alt`           | Only calls the event handler if the `alt` key is pressed                      |
| `meta`          | Only calls the event handler if the `meta` key is pressed                     |
| `escape`        | Only calls the event handler if the `escape` key is pressed (keyboard events) |
| `enter`         | Only calls the event handler if the `enter` key is pressed (keyboard events)  |
| `debounce:<ms>` | Debounces the event handler by the specified milliseconds                     |
| `throttle:<ms>` | Throttles the event handler by the specified milliseconds                     |

```html
<ph-component tag="example-modifiers">
    <template>
        <form @submit.prevent="console.log('form submitted!')">
            <input type="text" />
            <button type="submit">Submit</button>
        </form>
        <button @click.debounce:1000="console.log('debounced click!')">Debounced Click</button>
        <button @click.throttle:1000="console.log('throttled click!')">Throttled Click</button>
        <button @click.ctrl.alt.shift="console.log('ctrl+alt+shift+click!')">Ctrl Alt Shift Click</button>
    </template>
</ph-component>
<example-modifiers></example-modifiers>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAsUADBgAjL1pUBCEVZEY8IRgeYQJfoGWoxAcEOQAFACUfgZpxmYWvhybkQC07CGc8LrWgtXOIPAAHsrCCEdgbhBS8CaEPrOBBpQQkJKPs5nMDBIwvE2oR3AAjSDkDDCEzwYoXci3HTcBAYWBsaorBKQkzxWEI5aUKAAQgSGxAoLBTIMi2E7istnst0o93ILksaUZTPBcPZ5E41jsjhc5MRPgAyvDEVtReRxRwhWCtiSwJqRWKJW1SLAIKQANYYQpwtjuDikeBIHqdZ1Yzg4+B4glEq02u1USzG01m2n07wAEXg1tt9qglgAwibzSqDRq-szVerLEbExbyHRYmqEI7nZ1XVweB78YSEnmC+QELHA+aQz4ACr5tiF-0JoPJtWcPX-DOGpsWigmWAYQSwJGEOgfTEubEVz3V8ewADU0-IG7nC43o5bDLj5AnlgAgjPLPL5xIrD2k2lh6n-P80oDnoIQZtWnQTnFQgqXR9gMB4nheN5Bk+b5vC2MCgXgV53mgwhvC0YgyHICA3RoHocCQABmABOEAAF88EUZRVFofItB0PRyBoMiKJAJQVBoDBSEIWRWE4BimNIgBdUigA)

#### Emitting events

Events can be emitted using the `self.emit` method. The first argument is the event name, the second argument is an optional payload.
If a payload is provided, it will be available as the `detail` property of the event object. See [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)

```html
<ph-component tag="example-emitter">
    <template>
        <button @click="self.emit('clicked')">Listen for event</button>
        <button @click="self.emit('custom-event', 'some data')">Emit event</button>
    </template>
</ph-component>

<!-- event payloads are available as $e.detail -->
<example-emitter @clicked="alert('button clicked event received')" @custom-event="alert('custom-event received with detail: ' + $e.detail)"></example-emitter>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAsUADBgAjL1pUBCEVZEY8IRgeYQJfoGWoxAcEOQAFACUfgZpxmYWvhybkQC07CGc8LrWgtXOIPAAHsrCCEfwkOSUJj6zgQaUIUJKPs5nMDAAjdwfTiWNqkWAQUgAa1uxFgEjG7xWCThCMRVASGxA3gAMkM9NEwpZ4MULuQthCoRxgSCAuDIeRobD4UiUSR0W9lljSO5hnFXjTdAk8IluCpLFBBORBASfABRd5UiV0tIMjlMn6stL-Z6K+D7LbHU6hCq6fabACERyOmtp80ENlgbEEUEIlkEJngfuKgmkgjBCD9voAJPAMIUldJLE7zQ8ni8BR94CYYTikVRboIEOEsbrobm8VAXZcA6R4CV8YScyKOWBxbSC0XVtjm2Lqa6a3WaZWAO7LKLxkOwJCJSwAaksMbjlUnhO8W1TAPgr3en28WlR8AoEE4sjUABYkJ0QABfPCKZSqWj5LQ6PTkGg3u8gJQqGgYUiELIrCcG+H7XgAuteQA)

### Binding attributes

Attributes can be bound using the `:` syntax.

Boolean attributes can be conditionally set using the `?` syntax. If the value is truthy, the attribute is added, otherwise it is removed.

You can also set properties directly using the `.` syntax. In this case you need to use the kebab-case name of the property.

```html
<ph-component tag="example-binding">
    <template>
        <ph-signal name="isDisabled" value="false"></ph-signal>
        <ph-signal name="url" value="'https://example.com'"></ph-signal>

        <a :href="url">Go to example.com</a>
        <input type="text" .value="url" @input="url = $e.target.value" />

        <button @click="isDisabled = !isDisabled">Toggle disabled</button>
        <input type="text" ?disabled="isDisabled" />

        <!-- this will set the textContent property -->
        <p .text-content="url"></p>
    </template>
</ph-component>
<example-binding></example-binding>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAsUADBgAjL1pUBCEVZEY8IRgeYQJfoGWoxAcEOQAFACUfgZpxmYWvhybkQC07CGc8LrWgtXOIPAAHsrCCEcARouDjT6zgQaUIUJKPs5nMDMdCBBqkpYJYlCpbkMACJDQSvBBQFyWYqCWDuRwuCQ44g+LbgyHQ4EggJguhHCFQnGw5T4kDuEywTHY3EspLkFKEdJpB5PBAYU4zEDeUm0+kUvw-KkGQSWJB0EzwCS3NkcyUAcTY1gNwoB8DFcS2gkpisWwncVls9lulHu5ExGC5eK17MxbRtdq9MIclgAJKbyIITE1yO6cXjMWl9gqQQZXnbyJxLG1SLAIKQANYIwjIwio9GWIMAQiRKLRVB8ABU2NVqghLIMS7WoFtU3zOFbk377XYWc7XSBLAB+dulqiF4szjHjhPy-xUywGCtHI7WOhDSwAd2kMOI9ro8GsD3IAGFOHoIrF7OEbJYt-3QcJLBhRydbxdyAGSVafstn+Z5BCBTZWlpU5QgqXR9gMY1nngN4PkWaopSFR4TVQjhPgwrRiDIcgIE4WQ1DQTokAAZhQEAAF88EUZkaCmLQdDvGgGKYkA4VUWhSEIWRWF-fQ1AYgBdeigA)

### Control flow

Control flow can be implemented using the `*if`, `*show` attributes or the `<ph-either>` component.

The `<ph-either>` component takes a `value` attribute and two child elements. The first child will be rendered if the value is truthy, the second if it is falsy.

```html
<ph-component tag="some-toggle">
    <template attributes="initial">
        <ph-signal name="state" value="initial"></ph-signal>

        <!-- you can use the <ph-either> component -->
        <ph-either value="state">
            <span>either:On</span>
            <span>either:Off</span>
        </ph-either>

        <!-- or you can use the *if attribute -->
        <span *if="state">if:On</span>
        <span *if="!state">if:Off</span>

        <!-- you can use *show if the elements should stay attached to the dom -->
        <!-- this will set the `style.display` property accordingly -->
        <span *show="state">show:On</span>
        <span *show="!state">show:Off</span>

        <script on-mount>
            self.on('click', () => (state = !state))
        </script>
    </template>
</ph-component>

<some-toggle initial="true"></some-toggle>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAsUADBgAjL1pUBCEVZEY8IRgeYQJfoGWoxAcEOQAFACUfgZpxmYWvhybkQC07CGc8LrWgtXORHHwR+Rs1dVeIPtzBpQhQpSWguRyGYAEbuSiEW6LZYQQSwHyzOaBAzHQgQapKWCWJQqW7DAHwFyWYqw9yOFxQ8gwuHvLYotEY-YIxGWAwAQiOR0sNjY7kspEE-ncxGsdHgLOO8GWopM3j5cVCFUuHI+zPFdCOkvI0qJJLJRHI+Ph-lVn0IwgF3k10qQAHkOFszRamSaWY6OJapfATLaJBIHeb3c7Pq11VavYzjcy2RzLGEuTy+QLLEKxVqxQAqCASf6AkFgsXKoNIt2WTMSXEGyg+LO2+3bAMqqMlsu3Vl4qvvGs233+p0HSOI6Oc7m8-mC4Xpwh0NgAdyC2bTlhI8BUukIlinPNgUA3BpsOYNpFFO6eIrFUDilkLA8+7M5WqGlhn0kxxCsi4ABsMbAgMIMzUINgfvMsT2OE+6CKQ7AmIMjSwPu14mkYAalpuM4Voa7xobWvaBjexYoZO07oS4baVgSWHET6fr1n2RYBEYpjmFYnBHGAPK6I2LrELAEgYJwKwJKQsAQKQADWCR4JY6yWA4sorO2YoOJYZH4msGz4Qx2xMXszpbN8wi-PA+y0uqpwKhc5ARkY9yPM8rxihSVK3ECpI+A6tlPC8CDeFoPHwBQECcLIagAMydEgAAsaAgAAvngijKKotD5FoOh6OQNBxQlIDYslGCkIQsisJwGVZbFAC6sVAA)

### Lists

Lists can be rendered using the `*each` attribute.

```html
<ph-component tag="item-list">
    <template>
        <ph-signal name="items" value="['Item 1', 'Item 2', 'Item 3']"></ph-signal>
        <ul>
            <template *each="item, index in items">
                <li :id="`item-${index}`">{{ item }}</li>
            </template>
        </ul>
        <button @click="items = [...items, 'Item ' + (items.length + 1)]">Add item</button>
    </template>
</ph-component>

<item-list></item-list>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAsUADBgAjL1pUBCEVZEY8IRgeYQJfoGWoxAcEOQAFACUfgZpxmYWvhybkQC07CGc8LrWgtXOIMvwYEewQ+Q+s4EGlCFClPtzcwZjoQINUlLBLEoVLd7mBCC5LMVBLB3I4XHIEgBJL6WHoJPCJLEPSxoPEE7EAZgSAF0fFsgSCwX9-gEDJ4mcyAV9hD94JYAFTwQSkOjQr74xaFAAeQX8MLhIHZHOZBmeliQ0FuAAMYUcACTACXwSUAX01PmAwCC2ONxq2z0VSq2XJ5Do+aTZ72VACN3ORyJxLG1SM9SABrUUPQiWByWOQYeNy-GY7EJSwAaksKzlGAQjXIUQzPTWNIVAEEYFaHlsfX7OIqnQ9uYJfptWnQTnFQhVdPtNjrnsNvFt+y9vFpiGRyBBOLI1D0cEhOiBjXhFMpVLR8lodHpyDRl6uQJCNxhSIRZKxOLv98aqcagA)

### Slots

Slots just work as in [standard web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots):

```html
<ph-component tag="slot-example">
    <template>
        <article>
            <header><slot name="header">HEADER</slot></header>
            <slot></slot>
            <footer><slot name="footer">FOOTER</slot></footer>
        </article>
    </template>
</ph-component>

<slot-example>
    <h1 slot="header">Some Heading</h1>
    <p>Some Content</p>
    <div>Some more Content</div>
    <i slot="footer">Some Footer</i>
</slot-example>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAsUADBgAjL1pUBCEVZEY8IRgeYQJfoGWoxAcEOQAFACUfgZpxmYWvhybkQC07CGc8LrWgtXORLBs5EfwAB7Kwl4g+3MGlCFClF85oEDIJwhBSAhAUCgQY6PBBIUTN4jPcrEoVLc4Qj4CYfAAJACiAEEACIEgBKW0IqORaSxiKh0OB1IetJZ5EZTMsBgkbAeOOR7Ms6McLl5-NxnwAYgB5GUAFQpVJpW3FlCRsyZW1B5HBkM1AS2v3eggBm1adBOcVCFV0+027Kerz+8EZsJ6lnZmPhiJ8AGU4vBLHifYtqls6D03cJvAGVJYAMKcPTkLYxg3cwbFWOByxgMJBpO6C6pgYlN0QT2o25qnH+3NSvnqrYQfbKh5Ot6QrTEMi6ziyNRoTpIHooEAAXzwimUqlo+S0OhTNEn05AIpoGFIhFkrGTJZXE4AuhOgA)

You can also access the assigned elements of slots using the `slots` object inside your component scripts. Unnamed slots are available as `slots.default`, named slots as `slots.<slot-name>`.

```html
<ph-component tag="slot-example">
    <template>
        <header><slot name="header"></slot></header>
        <slot *show="false"></slot>
        <table>
            <template *each="s, idx in slots.default">
                <tr>
                    <td>{{ idx }}</td>
                    <td>{{ s.dataset.foo }}</td>
                    <td>{{ s.dataset.name }}</td>
                </tr>
            </template>
        </table>
        <script on-mount>
            console.log(slots.default, slots.header)
        </script>
    </template>
</ph-component>

<slot-example>
    <h1 slot="header">Title</h1>
    <div data-foo="1" data-name="foo"></div>
    <div data-foo="2" data-name="bar"></div>
    <div data-foo="3" data-name="baz"></div>
</slot-example>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAsUADBgAjL1pUBCEVZEY8IRgeYQJfoGWoxAcEOQAFACUfgZpxmYWvhybkQC07CGc8LrWgtXORLBs5EfwAB7Kwl4g+3MGlCFClF85oEDHR4IJCiZvEZ7lYlCpbqDwfATD4toQYVC0oiIYCgZZoQ9LAAqQh0NgAd1uEkEsGIqO2GNmePx5EEACMELjmQEfvA-oJKMSwaQ6LdCHgglBnkF-OiHoQMIVqZ5yD4mdy8T9IeqNdyflBvMBgJLpQBfU1bcgGnW6zVWw3GhVQAWCYjkDASNhsSzmy3W-y2vX2o2WJ0ut3lZTwH0WtL2m22y3agO6y1894C+Bc75x9mchM8nbmKycI5gNjuXTZ5k6bgIDD3aorOXkJ3wZWwcgSlsK7HIjYpoFo0zFrlp-kAzatOgnOKhCpVvybFtPV5-LM6kE9UMwhFgiE+AAqywQWzoPTHg2KlmdrKOnrYtx6LhvLqOcMcLgf9Kvl5Kr7vB9bjQF9b0Ed8o1uNlBBRT4tl-TcrwA8CgJcABmUC3w-KDBAALx-Ep9jRGFVzeTktGIMhyAgThZDUNAAE4kB6FAQFNPBFCjGgpi0HQ9HIGg2I4kAP240hCFkVhOH4wTTQAXVNIA)

### Refs

You can reference elements inside your component using the `*ref` attribute.

```html
<ph-component tag="ref-example">
    <template>
        <input type="text" *ref="inputElement" />
        <button @click="alert(inputElement.value)">Show value</button>
    </template>
</ph-component>
<ref-example></ref-example>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAsUADBgAjL1pUBCEVZEY8IRgeYQJfoGWoxAcEOQAFACUfgZpxmYWvhybkQC07CGc8LrWgtXOICbwEkfwAB7Kwl4g+3MGlCFClF85oEDIthO4rLZ7LdKM9yC5LAAqe4SW6g8EAUQQKl08LSgKBlgMACNweROJY2qRYBBSABrW6CBDhFZo8iY+DY8gYYqM9zwDafADKdDYAHdLDzYHytiTyGSOPjCWlfu9BADNq06Cc4qEKrp9gZkU9Xn94N4tkaXm8EN4tMQyOQIJxZGoej0kGgAOwgAC+eEUylUtHyWh0enINF9-pAShUNAwpEIslYnHDkZ9AF0fUA)

### Lifecycle hooks and watchers

```html
<ph-component tag="lifecycle-example">
    <template>
        <ph-signal name="count" value="0"></ph-signal>
        <p>Count: {{ count }}</p>
        <button @click="count = count + 1">Increment</button>

        <!-- runs once when the component is added to the DOM -->
        <script on-mount>
            console.log('Component mounted')
            self.onRemove(() => {
                console.log('This will run when the component will be removed')
            })
        </script>

        <!-- runs if the component is removed from the DOM -->
        <script on-remove>
            console.log('Component removed')
        </script>

        <!-- runs on if one the referenced signals change -->
        <script watch>
            console.log('Count changed to', count)
        </script>
    </template>
</ph-component>
<lifecycle-example></lifecycle-example>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAsUADBgAjL1pUBCEVZEY8IRgeYQJfoGWoxAcEOQAFACUfgZpxmYWvhybkQC07CGc8LrWgtXOILAQEvCkNqQIR-AAHsrCXiD7cwZKCEhJR-nNAgZjoQINUlLBLEoVLd2O5dC5LMVBLB3I4XJ0fFsoTC4WDwZZId4AMJsVHkJCWYDASwoy4AX1ZhNJ4IMACN3ORyJxLG1XhBSABrZE0y4OZnSqwAaksPR8AEkOKZ4CpdFs+QLOPtZmTyQBCI5HSwmVGESycUjwSwAdzoF2sLrlZwqlyGlkEMCo1jYbodABEAPIAWUs5q5AJ25isnCOYHlseNOm4CAwsDY1RWCWpnouVhTtKoCQ2-mNc2IsAkGE4ACUtWxivAVutLA5vAyjdWyRmePBs7n8wAVOg+x3SeFW-zO13kd2nUJeqzTgSWHkOkwtttQCt9-usyvVrbxvZ+I8As0Wuc2h7Bj2r4tBG27lP76KxeJL0OR6MjjTAIjFMBNbQ4I4P1beBgPBQcsxzPMCziF9Lmg-dDyrMlzzAy8Dmw7lb0ta0IKCCQIIdP9LXgR5dw1ANoVhLEbVIOhBEaB0Y2vCEL3XQRyDYuC5gQ4ckPzalaWZdjOKgQMEjwOVaVPY1cN2cguS2IEfgE2DNlaOgTlQ85dH2Ax7keZ5Xngd4vmBWCtgsp4XjeT5vgQbwtFrJ5yAgThZDUABmTokECgBOEBWTwRRlFUWh8i0HQ9HIGhIuikBETijBSEIWRWE4ZLUtZABdVkgA)

## Store

You can use the <ph-store> component to declare a store that can be used in multiple components.

Inside a store, you can declare signals, computed properties, constants and methods.

To use a store inside a component, use the `use-stores` attribute on the `<template>` tag, providing a comma-separated list of store names.

```html
<ph-store name="counter">
    <template>
        <ph-signal name="count" value="0"></ph-signal>
        <ph-computed name="double" value="count * 2"></ph-computed>

        <ph-method name="increment">
            <script>
                count = count + 1
            </script>
        </ph-method>

        <ph-method name="decrement">
            <script>
                count = count - 1
            </script>
        </ph-method>

        <ph-method name="reset">
            <script>
                count = 0
            </script>
        </ph-method>
    </template>
</ph-store>

<ph-component tag="store-example">
    <template use-stores="counter">
        <div>{{ counter.count }}</div>
        <div>{{ counter.double }}</div>
        <button @click="counter.increment()">Increment</button>
        <button @click="counter.decrement()">Decrement</button>
        <button @click="counter.reset()">Reset</button>
    </template>
</ph-component>

<!-- both components will have the same state -->
<store-example></store-example>
<store-example></store-example>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAsUADBgAjL1pUBCEVZEY8IRgeYQJfoGWoxAcEOQAFACUfgZpxmYWvhybkQC0w2Hwlkoqztps7rrwJj6zgQaUIUKU+3NzBseEENUlLALspHC52HdyC5LMVBLB3GCQJ0fFs-gCgV9vgFfnQjuwQu5KFAQVcXFBbgAjLwgGFwhHXCG6SwAKksaBRrVx+OEhKo+2eWJxRxU5DobhJiMWpngKl0T38WO+RlM5nImMVisZVgcli1lgA1JYegKNZYtjtVeqlZzhZUxVB+QrBccRfaJddCtLZVCQFaNcrdmqTabAnqdXqjkbg4rzSq9tHsTbXW5Hf6XXbxZdESZxpV5SHsRb406CwEw5ZkSX-ds40Gqy8kxmHSatm9hB94PtUbjTjnHULuZx4EzyIJqtde-AjvAAB7KdvwfMvNsdyzuYgnchnQgM273R6+hNmwbFbzAYC6veUMp6gC+t62J79Lyf58vkIeGHJ7ip53vj5KZ9sQpQkt38NpSFgCBSAAa13D8yilHNvXWHwAEkOC9YdyC2EDyDAoCzTwsDLAgqDYPg-cv3gLDdFQ30ABEaOQ7DcNAzhCIMYjOFIyDoLg8Er0-HNiFWDZfQAJVzHC0m4jgrVbGV20ET5NhtQcKl0fsAEIjkjCk2FFS8QiHXRCEsAB3aRgToQRinOUVzkIUFLGGFTzj0rtJ2nOd3k7c0txzHz5wQLzAqnWcQv87ZwuCvzvC0YgyHICBOFkNQABY0CQABmHoQFvPBFFBGgpi0HQ9HIGgCqKkAs1K0hCFkVhOEq6rbwAXVvIA)

## JS Imports

You can import javascript modules using a `<import>` element inside of a component or store.
With the `src` attribute you specify the module url, with the `import` attribute you specify what to import like you would in a regular JavaScript import statement.

Imports can also be used in Stores.

```html
<ph-component tag="import-example">
    <template>
        <import src="https://esm.run/fireworks-js" import="_f, * as fworks, { Fireworks as f }"></import>

        <script on-mount>
            const fireworks = new f(container, { speed: 3, acceleration: 1.05, friction: 0.95, gravity: 1.5 })
            fireworks.start()
            self.onRemove(() => fireworks.stop())
        </script>

        <div *ref="container"></div>
    </template>
</ph-component>
<import-example></import-example>
```

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAsUADBgAjL1pUBCEVZEY8IRgeYQJfoGWoxAcEOQAFACUfgZpxmYWvhybkQC07CGc8LrWgtXOIMGh4UfwAB7Kwl4g+3MGlCFClF85oEDPcwlZCCZSLdkqkMuNJiZ3Bw0lITPAAO5hADWhCO+RcQTO4VuAH0JHhLAAqSyCQjRTEmHEU4CWABiEDRDJxNLpEksAF8fFtQeF9rMgQEjKZzFZOEcwGwkeRARK5jphtEORjsXSHJYKujoisdORBIt4CZmZZCPYqEhLABmCmCUikEgWwTkCCce19TooCkxCAUb0ce3dACcAcs1RMgmKyxsvowKAFG38qrmqO1jMIGGGgnC63FmYCxFgEgwnAASvAFcV4Ct1pYHN5NZydfnyGxhOt05mtjsZWKMxKDINilS0RJbiazRUTEKBiUVZYtr93p74PstsdTqEKrodyLyE9Xn9t8KiaeXm8EN4tOX4CHOLI1D0sEgHQ6QPy8IplFUWh8i0E0LnIGhf3-EAlBUGgMFIQhZFYTg9AgtRfwAXX5IA)

| Import Statement                                                             | `<import>` Element                                                                              |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `import DefaultExport from 'url'`                                            | `<import src="url" import="DefaultExport"></import>`                                            |
| `import * as Name from 'url'`                                                | `<import src="url" import="* as Name"></import>`                                                |
| `import { Export1, Export2 } from 'url'`                                     | `<import src="url" import="{ Export1, Export2 }"></import>`                                     |
| `import DefaultExport, { Export1, Export2 } from 'url'`                      | `<import src="url" import="DefaultExport, { Export1, Export2 }"></import>`                      |
| `import DefaultExport, * as Name from 'url'`                                 | `<import src="url" import="DefaultExport, * as Name"></import>`                                 |
| `import DefaultExport, * as Name, { Export1, Export2 as Alias2 } from 'url'` | `<import src="url" import="DefaultExport, * as Name, { Export1, Export2 as Alias2 }"></import>` |
