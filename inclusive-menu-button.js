/* global define */

(function (global) {
  'use strict'

  // Constructor
  function MenuButton(button, options) {
    options = options || {}

    // The default settings
    this.settings = {
      checkable: 'none'
    }

    // Overwrite defaults where they are provided in options
    for (var setting in options) {
      if (options.hasOwnProperty(setting)) {
        this.settings[setting] = options[setting]
      }
    }

    // Save a reference to the element
    this.button = button

    // Add (initial) button semantics
    this.button.setAttribute('aria-haspopup', true)
    this.button.setAttribute('aria-expanded', false)

    // Get the menu
    this.menuId = this.button.getAttribute('data-inclusive-menu-opens')
    this.menu = document.getElementById(this.menuId)

    // If the menu doesn't exist
    // exit with an error referencing the missing
    // menu's id
    if (!this.menu) {
      throw new Error('Element `#' + this.menuId + '` not found.')
    }

    // Add menu semantics
    this.menu.setAttribute('role', 'menu')

    // Hide menu initially
    this.menu.hidden = true

    // Get the menu item buttons
    this.menuItems = this.menu.querySelectorAll('button')

    if (this.menuItems.length < 1) {
      throw new Error('The #' + this.menuId + ' menu has no menu items')
    }

    this.firstItem = this.menuItems[0]
    this.lastItem = this.menuItems[this.menuItems.length - 1]

    var focusNext = function (currentItem, startItem) {
      // Determine which item is the startItem (first or last)
      var goingDown = startItem === this.firstItem

      // helper function for getting next legitimate element
      function move(elem) {
        return (goingDown ? elem.nextElementSibling : elem.previousElementSibling) || startItem
      }

      // make first move
      var nextItem = move(currentItem)

      // if the menuitem is disabled move on
      while (nextItem.disabled) {
        nextItem = move(nextItem)
      }

      // focus the first one that's not disabled
      nextItem.focus()
    }.bind(this)

    Array.prototype.forEach.call(this.menuItems, function (menuItem) {
      // Disable menu button if all menu items are disabled
      var active = Array.prototype.filter.call(this.menuItems, function (item) {
        return !item.disabled
      })
      if (active.length < 1) {
        this.button.disabled = true
        return
      }

      // Add menu item semantics
      if (this.settings.checkable === 'one') {
        menuItem.setAttribute('role', 'menuitemradio')
      } else if (this.settings.checkable === 'many') {
        menuItem.setAttribute('role', 'menuitemcheckbox')
      } else {
        menuItem.setAttribute('role', 'menuitem')
      }

      // Prevent tab focus on menu items
      menuItem.setAttribute('tabindex', '-1')

      // Handle key presses for menuItem
      menuItem.addEventListener('keydown', function (e) {
        // Go to next/previous item if it exists
        // or loop around

        if (e.keyCode === 40) {
          e.preventDefault()
          focusNext(menuItem, this.firstItem)
        }

        if (e.keyCode === 38) {
          e.preventDefault()
          focusNext(menuItem, this.lastItem)
        }

        // Close on escape or tab
        if (e.keyCode === 27 || e.keyCode === 9) {
          this.toggle()
        }

        // If escape, refocus menu button
        if (e.keyCode === 27) {
          e.preventDefault()
          this.button.focus()
        }
      }.bind(this))

      menuItem.addEventListener('click', function (e) {
        // pass menu item node to select method
        this.choose(menuItem)

        // close menu and focus menu button
        this.close()
        this.button.focus()
      }.bind(this))
    }.bind(this))

    // Handle button click
    this.button.addEventListener('click', this.toggle.bind(this))

    // Also toggle on down arrow
    this.button.addEventListener('keydown', function (e) {
      if (e.keyCode === 40) {
        if (this.menu.hidden) {
          this.open()
        } else {
          this.menu.querySelector(':not([disabled])').focus()
        }
      }

      // close menu on up arrow
      if (e.keyCode === 38) {
        this.close()
      }
    }.bind(this))

    // initiate listeners object for public events
    this._listeners = {}
  }

  // Open method
  MenuButton.prototype.open = function () {
    this.button.setAttribute('aria-expanded', true)
    this.menu.hidden = false

    if (this.settings.checkable === 'one') {
      var checked = this.menu.querySelector('[aria-checked="true"]')
    }
    // Check the checked item if using menuitemradio
    if (checked) {
      checked.focus()
    } else {
      this.menu.querySelector('[role^="menuitem"]:not([disabled])').focus()
    }

    this.outsideClick = function (e) {
      if (!this.menu.contains(e.target) && !this.button.contains(e.target)) {
        this.close()
        document.removeEventListener('click', this.outsideClick.bind(this))
      }
    }.bind(this)

    document.addEventListener('click', this.outsideClick.bind(this))

    // fire open event
    this._fire('open')

    return this
  }

  // Close method
  MenuButton.prototype.close = function () {
    this.button.setAttribute('aria-expanded', false)
    this.menu.hidden = true

    // fire open event
    this._fire('close')

    return this
  }

  // Toggle method
  MenuButton.prototype.toggle = function () {
    var expanded = this.button.getAttribute('aria-expanded') === 'true'
    return expanded ? this.close() : this.open()
  }

  MenuButton.prototype.choose = function (choice) {
    if (this.settings.checkable === 'one') {
      // Remove aria-checked from whichever item it's on
      Array.prototype.forEach.call(this.menuItems, function (menuItem) {
        menuItem.removeAttribute('aria-checked');
      })

      // Set aria-checked="true" on the chosen item
      choice.setAttribute('aria-checked', 'true')
    }

    if (this.settings.checkable === 'many') {
      // check or uncheck item
      var checked = choice.getAttribute('aria-checked') === 'true' || false
      choice.setAttribute('aria-checked', !checked)
    }

    // fire open event
    this._fire('choose', choice)

    return this
  }

  MenuButton.prototype._fire = function (type, data) {
    var listeners = this._listeners[type] || []

    listeners.forEach(function (listener) {
      listener(data)
    })
  }

  MenuButton.prototype.on = function (type, handler) {
    if (typeof this._listeners[type] === 'undefined') {
      this._listeners[type] = []
    }

    this._listeners[type].push(handler)

    return this
  }

  MenuButton.prototype.off = function (type, handler) {
    var index = this._listeners[type].indexOf(handler)

    if (index > -1) {
      this._listeners[type].splice(index, 1)
    }

    return this
  }

  // Export MenuButton
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = MenuButton
  } else if (typeof define === 'function' && define.amd) {
    define('MenuButton', [], function () {
      return MenuButton
    })
  } else if (typeof global === 'object') {
    // attach to window
    global.MenuButton = MenuButton
  }
}(this))
