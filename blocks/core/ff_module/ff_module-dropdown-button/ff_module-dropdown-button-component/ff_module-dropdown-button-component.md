## React Button Component
<div data-ff_module-dropdown-button-component=""></div>

See [ff-module-dropdown-button](/blocks/core/ff_module/ff_module-dropdown-button/ff_module-dropdown-button.html) for details on dropdown styling and modifiers.

This component just renders an html dropdown button, it doesn't replicate the dropdown functionality which already exists in the core 'vanilla' dropdown file 'ff_module-dropdown.js'.

**The core dropdown file is activated automatically once the component mounts.**

# Props 
- **text**: {String, required} The text rendered by the button
- **modifier**: {String}: Add additional css styling for different effects.
- **list**: {Array, required} An Array of Objects with { text: {String}, href: {String} } properties
- **isDisabled**: {Boolean} Whether or not the dropdown can be clicked.
- **isOpen**: {Boolean} If true, the list will be rendered in the open state.

