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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWAHAOgGwGYA0IAzvAgMYAu8UyIGAFuWLCAQGYQKHIDaoAdgEMwiJLQZMWIUgHs+lOTQA8hUgCcIAB3IACcgE8N8ALwAdcNKgBXBGYB8JvtqfaIYDdNU6Ndba1XSwbQByBnINQiQAekjSKD4MACtCKBIIADdVDD54ckiAczpI2AE+PPgEyO8AAWLKQlyoCHrKukTCIIdnbW8MCD4IcgAKAEoHRUiVdS1bSWIycghZLlEARiQsABYQAF88fiERWiTJGTl4BVEdvZBBYRoMUkIuAlP5chodgF1toA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWAHAOgGwGYA0IAzvAgMYAu8UyIGAFuWLCAQGYQKHIDaoAdgEMwiJLQZMWIUgHs+lOTQA8hUgCcIAB3IACcgE8N8ALwAdcNKgBXBGYB8JvtqfaIYDdNU6Ndba1XSwbQByBnINQiQAekjSKD4MACtCKBIIADdVDD54ckiAczpI2AE+PPgEyO8AAWLKQlyoCHrKukTCIIdnbW8MCD4IcgAKAEoHRUiVdS17PjHvAFoZN1l4OV0BPNMQPWlLVUWA92y5O07nRUo3WvgZrq7FOgBGWwAJElhpX39Anb3tJaOq3I4yet3OkUuGmuM3GCwBKzkMzGv328OO5Fs4xRB2W6NskmIZHIEFkXFEjyQWAALCAAL54fhCES0JKSGRyIE0OkMkCCYQ0DCkQhcAjs+TkLm0gC6tKAA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWAHAOgGwGYA0IAzvAgMYAu8UyIGAFuWLCAQGYQKHIDaoAdgEMwiJLQZMWIUgHs+lOTQA8hUgCcIAB3IACcgE8N8ALwAdcNKgBXBGYB8JvtqfaIYDdNU6Ndba1XSwbQByBnINQiQAekjSKD4MACtCKBIIADdVDD54ckiAczpI2AE+PPgEyO8AAWLKQlyoCHrKukTCIIdnbW8MCD4IcgAKAEoHRUiVdS17PjHvAFoZN1l4OV0BPNMQPWlLVUWA92y5O07nRUo3WvhtAXJydQAjSzqtvNV4HL68vG1BYVOji65zoAEZbMBgNp3p9yN9tABfBG+fyBSF-IQ3JHjMEzLrjS4aa4zcYLJZHVbkGZjHZ7A7LY46GFfUpbAASJFg0jMGOEW1pqm05JWJxAtnGAvpFLk1L4igAhPN5kK6CUyoRtAB3DiwbSPG4fVhkShQFx8QjQG7kOg3YWM7RKkmTTRUs5OGTmnR2ynaIzaKDSUiWYRyDAAR0s8FUegAyiR4BQPIMgpLvXIgqMgU5iOQACqueC7IYjX22bTAN3AtPkDA5gCC9yeL3gyeZcNKQV+QTZEAzla61drOQbDwgz0oyf+8E7wWtN0sGigdyoQsOIvIfaziN+oIADPvM+NndNJMRjRBZFxRKCkFgACwgBF4fiYmhtSQe+TkGiP58gKdvqQhBcAQn6Uj+CIALoIkAA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAQGYQKHIDaoAdgEMwiJLQZMWIUgHs+lOTQA8hUgCcIAB3IACcgE8N8ALwAdcNKgBXBGYB8JvtqfaIYDdNU6Ndba1XSwbQByBnINQiQAekjSKD4MACtCKBIIADdVDD54ckiAczpI2AE+PPgEyO8AAWLKQlyoCHrKukTCIIdnbW8MCD4IcgAKAEoHRUiVdS17PjHvAFoZN1l4OV0BPNMQeAAPIQ0ERYFYUmsBcg87TudFSjda+BmursUFwgg8wVhtQWEtgTM2jSx0sxjMAEY7OM3h8vk9nk5XnR5u9PscfkIwSAAEaA4GwUFbNBQloo2HHeEIpGLAIaSyUKAYv5mVTwQjWch4kFYgTaABU2lxIFs0ORSzpDMpz2pMj49SZWPIAxsICB3K2AAMAMquA7wbQAWQ5mlgEHgqg1JIWsvqM2uVIWwnIdAsCq2rOInOF9oRN0mmh0AlUeUIW2yAHcAIJIbQAOUsYGx5rwP3g4YAQjH44nzVdHL6C7yjKmo9oAPxl7SQ-MFhHY7TFiPp8uV4k12vjf3TH0vUlOl1QO3tl50cG2YDAXTK-UAXxn41HUpeGiXvsUfQlugMWL4CaTqkBGHxhLMANVVQ39P+De0ABJ4BhyEGyuQj9zAZFV1TCBoSrY+Z2v58F+0qXjo+iGGGe65qqb4EliQraBefASls9bFvej7PjkcGgh+IEvD+f5GIBf49muRHARO2gehy2hzqRwHkYilQgYo2L0hcjhVKQpqkAA1u6bI5CMdgAErCeQ4wceQXFSuMdwHOcjxjKS4orHIQ6KLs+yHKQxynLUHgipEOn3PARwnGcFyqLYkjEGQSqyFwojgkgOAACwgDOeD8JiNBtJIsryOQNDeb5IC-CItCkIQXAEMFqyhaI3kALozkAA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAQGYQKHIDaoAdgEMwiJLQZMWIUgHs+lOTQA8hUgCcIAB3IACcgE8N8ALwAdcNKgBXBGYB8JvtqfaIYDdNU6Ndba1XSwbQByBnINQiQAekjSKD4MACtCKBIIADdVDD54ckiAczpI2AE+PPgEyO8AAWLKQlyoCHrKukTCIIdnbW8MCD4IcgAKAEoHRUiVdS17PjHvAFoZN1l4OV0BPNMQeAAPIQ0Eefg01fJCO07nRUo3WvgZrq7FACNLcnJZbSrSWAhSAGstgIEJ5BkEfn9-gBCIKjEC2ADCvwB2mE41e71kD0eTkUfQ0by+pDoJTKQJBQwAJPAMOQBKoyuQMGlgZZ4HDtJFsbjIjcDgJKDNxgslu5snIZmNdvtDsdToRbONpbd4EcTnIFZJiGRyBBZFxRABGJA4AAsIAAvnh+EIRLQkpIZHJTjRLdaQIJhDQMKRCFwCE75ORXRaALoWoA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAkKUhFVQEN2tdHmECX6BlpEYEBwQ5AAUAJR+BmnGZha+HEuRALTsIZzwutaC1c4g8AAeysII22BuEFLwJoQ+o4EGlCGd8BtjYwYJGF4m1CO4AEaQcgYYQmeDFQ7kM46bgIDCwNjVWYJIEmeJgyEzShQACECUWID+-2pBimwncVls9jOlAu5BcljSVOpAPBDPInGsdkcLgJUJ8AGUIVDlnzyAKONz-stcWAlbz+YK2qRYBBSABrDCFcFsdwcUjwJAARgADHbkZxUfB0ZjscbTeaqJYdXr9WSKd4ACLwE1mi1QSwAYV1BtlmsV7xpcoVlm1McN5DosXlCGtdptDq4PGdGKxCUz2fICAjPoN-p8ABUs2wc17o764-LOOqPsmtbXDRQTLAMIJYNDCHRHkiXCjiy6y0PYABqMfkZeT6fLgf1ymR8jDywAQXHlglU4kVnbsbSfYT-g+aS+N0ElA2yx2e1CFV078u11ue5eieF5vGWf9vngO4HhAwhvC0YgyHICBHRoK0kBwAAWEAAF88EUZRVFofItB0PRyBoXD8JAJQVBoDBSEIWRWE4cjKJwgBdHCgA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAkKUhFVQEN2tdHmECX6BlpEYEBwQ5AAUAJR+BmnGZha+HEuRALTsIZzwutaC1c4g8AAeysII2-CQ5JQmPqOBBpQhnfAbY2MGAEbuR6cSxtUiwCCkADWZ2IsAkGHuM1mCXBkKhVASixA3gAMn09NEwpZ4MVDuRloDgRwfr8AgCgeQQWCIdDYSQEUi5qj3N04ncyboEnhEtwVJYoIJyIIsT4AKIPEmCilpKlMmmvelpD43KXfJYDXZxUIVXQbJYAQm22yV5PGghssDYgighEsghM8HdxUE0kE-wQ7rdABJ4BhCtLpJZrRsDJdrrcuU9QWjoVQzoIEOEUWqQamMVBbUdPaR4CVMdiU7ymWABeSM1nuaRq-zSXaS2WyYWAO4zKIR32wJCJSwAaksofDlUH2O8y3jn3gdweT28Wjh8AoEE4sjUAEYkDgACwgAC+eEUylUtHyWh0enINDPF5AShUNAwpEIslYnAfT9PABdU8gA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAkKUhFVQEN2tdHmECX6BlpEYEBwQ5AAUAJR+BmnGZha+HEuRALTsIZzwutaC1c4g8AAeysII2wBGU72NPqOBBpQhnfAbY2MGO4QINUlLBLEoVGc+gARPqCO4IKAuSzFQSwdyOFwSVHEHzLAFAkE-X4Bf50baA4GosHKDEgdwmWBIlFo2lJcgpQjpNKXa4IDB7EYgbx4skUwl+V7EgyCSxIOgmeASM70xlCgDibGsmp5n3g-Liy0ERKlU2E7istnsZ0oF3ISIwzPRyoZSLapvNztBDksABI9eRBCYmuQHaj0Ui0htJb8DHdzeROJY2qRYBBSABrSGEGGEOEIyzegCE0Nh8KoPgAKmxqtUEJZermy1BlnH2ZxjTH3Ra7LSbXaQJYAPwNvNULM50eIgeRiX+YmWAyF7bbax0PqWADu0lBxAtdHg1ku5AAwpw9BFYvZwjZLMuO39hJYMH3dmfDuRPbjWh3lh8boJKA2EVX32CpdCAnUbnge5HimaphW5K5dRgjgnngrRiDIcgIE4WQ1AARiQHAABYQAAXzwRQaRoIYtB0c8aHIyiQHBVRaFIQhZFYN99DUciAF0yKAA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAkKUhFVQEN2tdHmECX6BlpEYEBwQ5AAUAJR+BmnGZha+HEuRALTsIZzwutaC1c5EcfDb5GzV1V4gG2MGlCGd8JaC5ORmAEbuXWcpjMIIJYD5RmNAgYdoQINUlLBLEoVGdup94C5LMVQe5HC4geQQWCHssYXCERsIZDLAYAITbbaWGxsdyWUiCfzuYjWOjvaF0bbwGa8kzeNlxUIVI4Mx7Umk7IXkEVYnF4ojkdHg-xyp6EYQc7yKkVIADyHGWeoNVJ1NMtHENwvgJlNEgkFv19utTwGgsdor8Xqh9MZYSZLLZHMsXPeSveACoIBIPl9fv93jLAwEjB7LAmJKiNZQfInTeaVh7ZdTs5G82daWiiw8SybXe6rZttVXg2HWezOdy44Q6GwAO5BJOxywkeAqXSESxDlmwKALjU2ZMa0i8lfXHnvKBxSwZzuQukMnl9Swj6SI4hWScAA26NgQGF6eqENgf41i9nC68EUh2BMXpGlgddjx1at-EHYcRwLTUHkXEdSzbT0T11HNYNHOsGwxJC4JdN1y3bTNbVMcwrE4bYwBZXRKxtYhYAkDBOFmBJSFgCBSAAawSPBLAWSwHDFWY8OEyx60LeB5kWDCoRWCj1mtZYXmEN4NlJAU9klQ5yEpc1uBUK4bjud4CSJM5vlxHwLQuEzbgQbwtCY+AKAgThZDUABGJAcAAFhAABfPBFGUVRaHyLQdD0cgaGC0KQGRCKMFIQhZFYThYvioKAF0gqAA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAkKUhFVQEN2tdHmECX6BlpEYEBwQ5AAUAJR+BmnGZha+HEuRALTsIZzwutaC1c4gM-Bg27B95D6jgQaUIZ3wG2NjBjuEENVKsJYlCozhcwIQXJZioJYO5HC45AkAJLPSwARgSeESyMuljQGKxKIAzAkALo+ZbfX7-d4fAIGTw02mfZ7CV6WABU8EEpDoIOemKmhQAHkF-KDwSBGUzaQYbpYkNAzgADUHbAAkwEF8CFAF8lT5gMAgiidTrljcpdLlizXpbHmkGQ8ZQAjdzkcicSxtUg3UgAaz5l0IlgcljkGAj4sxSJRCUsAGpLLNxRgEI1yFFE6j5mTJQBBGDGy7LV3uzhS62XVmCSgbCl0XZxUIVXQbJaqm7dbzLDu3bxaYhkcgQTiyNSopA4AAsIB1eEUylUtHyWh0enINFn85AQKXGFIhFkrE4683OpJOqAA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAkKUhFVQEN2tdHmECX6BlpEYEBwQ5AAUAJR+BmnGZha+HEuRALTsIZzwutaC1c5EsGzk2-AAHsrCXiAbYwaUIZ3wz2OBBoLhEKQEF9vt8DHR4IJCiZvEYLlYlCozuDIfATD4ABIAUQAggARTEAJWWhDhMLSyKhwJBPxJlzJtPIVOplgMEjYl1RMIZlgRjhcbI5aKeADEAPKigAqhOJpOWAso0NG1OWf3IAKBSoCyzeD0ElA2yx2e1CFV0GyWDOud3en01LLoAEZLAykRCoT4AMpxeCWdFuqbVZaOqkGYTeL0qSwAYU4enIhpDvWK4e9ljAYR9Md0h3jaSTIYgzrhZ3lqM9qeF7IVywgBpWcKt9yBWmIZDVnFkagdSBwABYQABfPCKZSqWj5LQ6OM0QfDkC8mgYUiEWSsWM5mcDgC6A6AA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAkKUhFVQEN2tdHmECX6BlpEYEBwQ5AAUAJR+BmnGZha+HEuRALTsIZzwutaC1c5EsGzk2-AAHsrCXiAbYwaUIZ3wz2OBBnTwgoUTN4jBcrEoVGc-gD4CYfMtCKDgWkoYCvt9LCDLpYAFSEOhsADuZwkglgxDhK0Ro3RGPIggARgg0TSAq94O9BJQcf9SHQzoQ8EEoDcgv4EZdCBhCiTPOQfNSWejXkCFYqWa8oN5gMAhSKAL565bkTWqtVK41anWSqCcwTEcgYCRsNiWA1Gk3+M3qi3ayzW2328rKeCuw1pC2ms1GlWetVG9kPTmfSOs8MMpkpjGrcxWTjbMBsdy6ZksnTcBAYC7VWbi8jW+Ay2DkQW1yUomGLWPfeGmHPM+McygbZY7PahCrFvxLWvXO7vZNd34ARj9oMh-0BPgAKjMEMs6Ev+71ipYbXTtk62Gcly5T7btuDHC5LxTj0eSnfz5ezmhb2fBA+wZnPSgiwk8yxvqqBjHp+AHfi4ADMf73o+wGCAAXq+JTDpSlyzvcTJaMQZDkBAnCyGoS5IDgAAsIB6ngijBjQQxaDoejkDQ9GMSAj4saQhCyKwnAcVxeoALp6kAA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAkKUhFVQEN2tdHmECX6BlpEYEBwQ5AAUAJR+BmnGZha+HEuRALTsIZzwutaC1c4gJvAS2-AAHsrCXiAbYwaUIZ3wz2OBBlPC7lZbPYzpQbuQXJYAFQXCRnP4AgCiCBUughaS+30sBgARgDyJxLG1SLAIKQANZnQQIcKzeHkJHwFHkDDFKnueCLJ4AZTobAA7pZWbB2ctceR8RwMVi0m8HoJKBtljs9qEKrpFTDrnd3p9lprbvcEN4tMQyOQIJxZGoAIxIHAAFhAAF88IplKpaPktDo9OQaM7XSAlCoaBhSIRZKxOL7-U6ALpOoA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAkKUhFVQEN2tdHmECX6BlpEYEBwQ5AAUAJR+BmnGZha+HEuRALTsIZzwutaC1c4gsBAS8KQ2pAjb8AAeysJeIBtjBpQhnfAfY4EDDtCBBqkpYJYlCozux3LoXJZioJYO5HC4AAw+ZbA0Hg-4AyxA7wAYTYcPISEswGAllhRwAvvTsfiAQYAEbucjkTiWNp3CCkADWMLJRwctNFVgA1JYAIw+ACSHFM8BUumWHK5nA2owJhIAhNttpYTHDCJZOKR4JYAO50Q7We0S-YVI59SyCGBUaxsR3WgAiAHkALKWI0sz6rcxWTjbMCSiN6nTcBAYWBsaqzBKkl2HKzx8lUBKLfx6sbEWASDCcABKqrYxXgswWlgc3ipurLBOTPHgaYzWYAKnR3TbpBDTf47Q7yE69qFXVYxwJLGzrSZ642oMXO136SWy8so+s-LvPobjZPzZc-c6F3mguaN-Gt9FYvFZwGQ2HtomAkZTGjC0OG2Z8Gz+M8k04FM+3TTNszie8jjArcd1LAkj0Ak9NnQ1kLxNM1gKCCRgOtT8TXgK4N2Vb0QTBZFzVIOhBEaa1w0g-9jyXQRyCYv8AR7VM4KzUlyVpZjWKgH0EjwCVyQPPVMLWcgWWWb5Xh4iCOGxOhdkQg5dA2AwLiuG47ngB5nh+P5lhM65bnuJ4XgQbwtAra5yAgaCaFlJAAHYAGYQHpPBFGUVRaHyLQdD0cgaGC0KQChCKMFIQhZFYThYvi+kAF16SAA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAkKUhFVQEN2tdHmECX6BlpEYEBwQ5AAUAJR+BmnGZha+HEuRALTdYfCWSirO2mzuuvAmPqOBBpQhnfAbY2MGO4QQ1Uqwh8qOLuxzuQXJZioJYO5-iAAAw+ZbvT7fZ4vAJvOjbdghdyUKC-Y4uKBnABGXhAoPBkJOgN0lgAVJY0HCBhi4sJsVQNjcUWjtipyHQ3HioVNTPAVLprv4US8jKZzORkdLpdSrA5LCrLABqSwARi5Sssy1W8sVMuZfIFUE5Uu5OwtgqOUMKovFwJApqVsrWCv1BsCGrVGu2ut90qNcvWodR5sqlutnrtsYdfxOJngxDdHrDxsjNr9-rONLVsLznpWEZ9pduMf5blNy3uwkeG3h6L2aetPMxoQqNPIgmqJ3b8G28AAHsom-BJa9G49LO5iLtyPtCFTC5Qru6o4besVvMBgOqN5cMBqAL7n5Z7rOom+H49A0+E9wkg6X68lW+GonYlf+NpSFgCBSAAa3XJ8yhFNNXQWHwAEkOBdeBdGWX9yH-b8DHQ-9LEA4CwIgi4ymdGCULmRZ3QAEXgZDULSHDOCwxiAKAkDwIBE8yjTDM4PdAAldNKjQv8mP1BsxSbQRKBbZlu04cjOwAQm2YMiTYfljxCBTdEISwAHdpB+OhBGKA5+QOQg-ksbppIOVSW2HUcJweJ4jRXNNnMnBBHI8kdx28tyVj8rzXO8LRiDIcgIE4WQ1B1JAcAAFhAc88EUP4aCGLQdD0cgaFS9KQEdLLSEIWRWE4PKCvPABdc8gA)

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

[▶ flems](https://flems.io/#0=N4IgtglgJlA2CmIBcBWATAOgBwDYA0IAzvAgMYAu8UyIGAFuWLCAaQPYB2hbCN7ssAIYAHYtQIAzCAkLIA2qA6CwiJLQZMWIdh0q6aAHkKkAThGHkABOQCew+AF4AOuDZQArghcA+Jx0sBlhBgwmwmVsJ0lhImbGCWAOQM5KJIAPRppFAcGABWhFAkEABuJhgc8ORpAOZ0aUIc1fC5aZEAAkKUhFVQEN2tdHmECX6BlpEYEBwQ5AAUAJR+BmnGZha+HEuRALTsIZzwutaC1c4gwaHh2-AAHsrCXiAbYwaUIZ3wz2OBBhdhVoQTKQzslUhl4IQwBgTO4OGkpCZ4AB3MIAa0I23yLiC+3CZwA+hI8JYAFSWQSEaIokzo4nASwAMQgiOp6PJlIklgAvj5ln9whtRt8AkZTOYrJxtmA2LDyF9hWMdN1oszkWjKQ5LBUkdFZjpyIIpvATHTLIR7FQkJYAMzEwSkUgkY2CcgQThWgCMGAADChiTEIBQ3Rwrd6MABOP2WaomQTFGY2T0YFDcxb+BVjBFqmmEDDdQThBZCjMBYiwCQYTgAJXg0uK8FmC0sDm8KpZ6rz5DYwgWaYzy1W4sF6eFBl6xVJiIkZ31hoqJl5aXH8ssyzeDxdnyWA12cVCFV0G1+uPI1zu70+fJPZ-uCG8WjL8CDnFkag9SBwABYQFy8IplKotD5Fo+qHOQNA-n+IBKCoNAYKQhCyKwnB6OBag-gAulyQA)

| Import Statement                                                             | `<import>` Element                                                                              |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `import DefaultExport from 'url'`                                            | `<import src="url" import="DefaultExport"></import>`                                            |
| `import * as Name from 'url'`                                                | `<import src="url" import="* as Name"></import>`                                                |
| `import { Export1, Export2 } from 'url'`                                     | `<import src="url" import="{ Export1, Export2 }"></import>`                                     |
| `import DefaultExport, { Export1, Export2 } from 'url'`                      | `<import src="url" import="DefaultExport, { Export1, Export2 }"></import>`                      |
| `import DefaultExport, * as Name from 'url'`                                 | `<import src="url" import="DefaultExport, * as Name"></import>`                                 |
| `import DefaultExport, * as Name, { Export1, Export2 as Alias2 } from 'url'` | `<import src="url" import="DefaultExport, * as Name, { Export1, Export2 as Alias2 }"></import>` |
