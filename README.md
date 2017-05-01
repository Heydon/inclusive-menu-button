# Inclusive Menu Button

A **menu button** module that implements the correct ARIA semantics and keyboard behavior.

## Installation

```
npm i inclusive-menu-button --save
```

## Expected markup

In the following example, three menu items are provided.

```html
<div data-inclusive-menu>
 <button data-inclusive-menu-opens="difficulty">
   Difficulty
   <span aria-hidden="true">&#x25be;</span>
 </button>
 <div id="difficulty" data-inclusive-menu-from="left">
   <button>Easy</button>
   <button>Medium</button>
   <button>Incredibly Hard</button>
 </div>
</div>
```

* The parent element must take `data-inclusive-menu`.
* `data-inclusive-menu-opens` takes a value that must match the menu element's `id`. In this case, it is `difficulty`.
* `data-inclusive-menu-from` defines from which side of the button the menu will grow. Any value but "right" will mean it grows from the left.
* The menu items must be sibling buttons. The script adds the `menuitem` role (as well as the `menu` role to the parent menu element).

## CSS

You must include this CSS for the menu system to work. It is just the bare minimum functional styling. It's recommended you override these in the cascade to customize the appearance to your liking.

```css
[data-inclusive-menu] {
  position: relative;
  display: inline-block;
}

[data-inclusive-menu-opens],
[data-inclusive-menu] [role="menuitem"] {
  text-align: left;
  border: 0;
}

[data-inclusive-menu] [role="menu"] {
  position: absolute;
  left: 0;
}

[data-inclusive-menu] [data-inclusive-menu-from="right"] {
  left: auto;
  right: 0;
}

[data-inclusive-menu] [role="menuitem"] {
  display: block;
  min-width: 100%;
  white-space: nowrap;
}
```

## Usage

Initialize the menu button / menu like so:

```js
// get a menu button
const exampleButton = document.querySelector('[data-opens-menu]')

// Make it a menu button
const exampleMenuButton = new MenuButton(exampleButton)
```

### API methods

You can open and close the menu programmatically.

```js
// Open
exampleMenuBtn.open()

// Close
exampleMenuBtn.close()

// Toggle
exampleMenuBtn.toggle()
```

### Event subscription

You can subscribe to emitted `open`, `close`, and `choose` events.

#### `open` and `close` examples

```js
exampleMenuButton.on('open', function () {
  // Do something when the menu gets open
})

exampleMenuButton.on('close', function () {
  // Do something when the menu gets closed
})
```

#### `choose` example

The `choose` event is passed the chosen item’s DOM node.

```js
exampleMenuButton.on('choose', function (choice) {
  // Do something with `choice`
})
```

### Unsubscribing

There is an `off` method included for terminating event listeners.

```js
exampleMenuButton.off('choose', exampleHandler)
```
