# Inclusive Menu Button

A **menu button** module that implements the correct ARIA semantics and keyboard behavior.

## Expected markup

In the following example, three menu items are provided.

```html
<div data-inclusive-menu>
  <button data-opens-menu="difficulty">
    Difficulty
    <span aria-hidden="true">&#x25be;</span>
  </button>
  <div id="difficulty" data-menu-origin="left">
    <button>Easy</button>
    <button>Medium</button>
    <button>Incredibly Hard</button>
  </div>
</div>
```

* The parent element must take `data-inclusive-menu`
* `data-opens-menu` takes a value that must match the menu element's `id`. In this case, it is `difficulty`
* `data-menu-origin` defines from which side of the button the menu will grow. Any value but "right" will mean it grows from the left.
* The menu items must be sibling buttons. The script adds the `menuitem` role (as well as the `menu` role to the parent menu element)

## CSS

You must include this CSS for the menu system to work. You may, however, tweak it at your discretion.

```css
[data-inclusive-menu] {
  position: relative;
  display: inline-block;
}

[data-opens-menu], 
[data-inclusive-menu] [role="menuitem"] {
  line-height: 1;
  text-align: left;
  background: black;
  border: 0;
  color: #fff;
  padding: 0.33rem 0.5rem;
}

[data-opens-menu]:focus, 
[data-inclusive-menu] [role="menuitem"]:focus {
  outline: 0.25rem solid yellow;
}

[data-inclusive-menu] [role="menu"] {
  position: absolute;
  left: 0;
}

[data-inclusive-menu] [data-menu-origin="right"] {
  left: auto;
  right: 0;
}

[data-inclusive-menu] [role="menuitem"] {
  display: block;
  min-width: 100%;
  margin-top: 0.125rem;
  white-space: nowrap;
}
```

## Usage

Initialize the menu button / menu like so:

```js
// get a menu button 
const exampleBtn = document.querySelector('[data-opens-menu]');

// Make it a menu button
const exampleMenuBtn = new MenuButton(exampleBtn);
```

### Opening and closing by script

You can open and close the menu programmatically.

```js
// Open
exampleMenuBtn.open();

// Close
exampleMenuBtn.close();

// Toggle
exampleMenuBtn.toggle();
```
