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

### After initialization

Once you've initialized the menu button, this will be the resulting markup, including all of the necessary ARIA attribution:

```html
<div data-inclusive-menu>
 <button data-inclusive-menu-opens="difficulty" aria-haspopup="true" aria-expanded="false">
   Difficulty
   <span aria-hidden="true">&#x25be;</span>
 </button>
 <div id="difficulty" data-inclusive-menu-from="left" role="menu" hidden>
   <button role="menuitem" tabindex="-1">Easy</button>
   <button role="menuitem" tabindex="-1">Medium</button>
   <button role="menuitem" tabindex="-1">Incredibly Hard</button>
 </div>
</div>
```

## CSS

The following functional styling is provided for the basic layout of an archetypal "dropdown" menu appearance. You can either override and add to these styles in the cascade or remove them altogether and start from scratch.

```css
[data-inclusive-menu] {
  position: relative;
  display: inline-block;
}

[data-inclusive-menu-opens],
[data-inclusive-menu] [role^="menuitem"] {
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

[data-inclusive-menu] [role^="menuitem"] {
  display: block;
  min-width: 100%;
  white-space: nowrap;
}

[data-inclusive-menu] [role^="menuitem"][aria-checked="true"]::before {
  content: '\2713\0020';
}
```

## Initialization

Initialize the menu button / menu like so:

```js
// get a menu button
const exampleButton = document.querySelector('[data-inclusive-menu-opens]')

// Make it a menu button
const exampleMenuButton = new MenuButton(exampleButton)
```

### Checked items

Sometimes you'd like to persist the selected menu item, using a checked state. WAI-ARIA provides `menuitemradio` (allowing the checking of just one item) and `menuitemcheckbox` (allowing the checking of multiple items). Checked items are marked with `aria-checked="true"`.

You can supply the constructor with a `checkable` value of 'none' (default), 'one', or 'many'. In the following example, 'one' is chosen, implementing `menuitemradio`. See the examples folder for working demonstrations.

```js
// Make it a menu button with menuitemradio buttons
const exampleMenuButton = new MenuButton(exampleButton, { checkable: 'one' })
```

If you want to set default checked items, just do that in the HTML:

```html
<div id="difficulty" data-inclusive-menu-from="left">
 <button>Easy</button>
 <button aria-checked="true">Medium</button>
 <button>Incredibly Hard</button>
</div>
```

The basic CSS (see above) prefixes the checked item with a check mark. This declaration can be removed safely and replaced with a different form of indication.

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
  // Do something with `choice` DOM node
})
```

### Unsubscribing

There is an `off` method included for terminating event listeners.

```js
exampleMenuButton.off('choose', exampleHandler)
```
