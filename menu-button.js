(function (global) {
  'use strict';
  
  // Constructor
  function MenuButton (button) {
    // Save a reference to the element
    this.button = button;
    
    // Add (initial) button semantics
    this.button.setAttribute('aria-haspopup', true);
    this.button.setAttribute('aria-expanded', false);
    
    // Get the menu
    this.menuId = this.button.getAttribute('data-opens-menu');
    this.menu = document.getElementById(this.menuId);
    
    // If the menu doesn't exist
    // exit with an error referencing the missing
    // menu's id
    if (!this.menu) {
      console.error(`#${this.menuId} menu missing`);
      return;
    }
    
    // Add menu semantics
    this.menu.setAttribute('role', 'menu');
    
    // Hide menu initially
    this.menu.hidden = true;
    
    // Get the menu items
    this.menuItems = this.menu.querySelectorAll('button');
    this.firstItem = this.menuItems[0];
    this.lastItem = this.menuItems[this.menuItems.length - 1];
    
    [].forEach.call(this.menuItems, menuItem => {
      // Add menu item semantics
      menuItem.setAttribute('role', 'menuitem');
      
      // Prevent tab focus on menu items
      menuItem.setAttribute('tabindex', '-1');
      
      // Handle key presses for menuItem
      menuItem.addEventListener('keydown', e => {
        // Go to next/previous item if it exists
        // or loop around
        let adjacent;
        if (e.keyCode == 40) {
          e.preventDefault();
          adjacent = menuItem.nextElementSibling 
                     || this.firstItem;
          adjacent.focus();
        }
        if (e.keyCode == 38) {
          e.preventDefault();
          adjacent = menuItem.previousElementSibling 
                     || this.lastItem;
          adjacent.focus();
        }
        
        // Close on escape or tab
        if (e.keyCode == 27 || e.keyCode == 9) {
          this.toggle();
        }
        // If escape, refocus menu button
        if (e.keyCode == 27) {
          this.button.focus();
        }
      });
      
      menuItem.addEventListener('click', () => {
        this.close();
        this.button.focus();
      });
    });
    
    // Handle button click
    this.button.addEventListener('click', () => {
      this.toggle();
    });
    
    // Also toggle on keydown
    this.button.addEventListener('keydown', e => {
      if (e.keyCode == 40) {
        if (this.menu.hidden) {
          this.toggle();
        } else {
          this.firstItem.focus();
        }
      }
    });  
  }
  
  // Open method
  MenuButton.prototype.open = function () {
    this.button.setAttribute('aria-expanded', true);
    this.menu.hidden = false;
    this.menuItems[0].focus();
    
    return this;
  };
  
  // Close method
  MenuButton.prototype.close = function () {
    this.button.setAttribute('aria-expanded', false);
    this.menu.hidden = true;

    return this;
  };
  
  // Toggle method
  MenuButton.prototype.toggle = function () {
    let expanded = this.button.getAttribute('aria-expanded') === 'true';

    return expanded ? this.close() : this.open();
  };
  
  // Export MenuButton
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = MenuButton;
  } else if (typeof define === 'function' && define.amd) {
    define('MenuButton', [], function () {
      return MenuButton;
    });
  } else if (typeof global === 'object') {
    // attach to window
    global.MenuButton = MenuButton;
  }
}(this));
