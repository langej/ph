# pH - the plain html UI framework

- plain html powered by web components
- no build step required
- only ~5kb in size
- the browser console is your dev tool

# How to use

## Load from cdn

```html
<head>
    <script src="https://cdn.jsdelivr.net/gh/langej/ph@v0.1.0/dist/ph.js"></script>
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
        import ph from 'https://cdn.jsdelivr.net/gh/langej/ph@v0.1.0/dist/ph.esm.js'
        ph.init()
    </script>
</head>
```

## Component declaration

```html
<ph-component tag="your-component">
    <template>
        <h1>Hello from your component</h1>
    </template>
</ph-component>

<your-component></your-component>
```

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

### Using signals, computed properties, constants and methods

Signals, computed properties, constants and methods can be declared using the respective `<ph-signal>`, `<ph-computed>`, `<ph-const>` and `<ph-method>` components.

For Methods you can define parameters with the `args` attribute. You can also use type hints like `String`, `Number`, `Boolean`, `Array` and `Object` but these are for readability only, yet.

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
            <input type="number" :value="a" @input="a = $e.target.value" />
            <span>*</span>
            <input type="number" :value="b" @input="b = $e.target.value" />
            <span>=</span>
            <span>{{ result }}</span>
        </p>
        <button @click="reset()">Reset</button>
    </template>
</ph-component>

<example-counter></example-counter>
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
        <input type="text" :value="url" @input="url = $e.target.value" />

        <button @click="isDisabled = !isDisabled">Toggle disabled</button>
        <input type="text" ?disabled="isDisabled" />

        <!-- this will set the textContent property -->
        <p .text-content="url"></p>
    </template>
</ph-component>
<example-binding></example-binding>
```

### Control flow

```html
<ph-component tag="some-toggle">
    <template attributes="initial">
        <ph-signal name="state" value="initial"></ph-signal>

        <!-- you can use the <ph-either> component -->
        <ph-either value="state">
            <span>On</span>
            <span>Off</span>
        </ph-either>

        <!-- or you can use the *if attribute -->
        <span *if="state">On</span>
        <span *if="!state">Off</span>

        <!-- you can use *show if the elements should stay attached to the dom -->
        <!-- this will set the `style.display` property accordingly -->
        <span *show="state">On</span>
        <span *show="!state">Off</span>

        <script on-mount>
            self.on('click', () => (state = !state))
        </script>
    </template>
</ph-component>

<some-toggle initial="true"></some-toggle>
```

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

### refs

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
