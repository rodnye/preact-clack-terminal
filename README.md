# preact-clack-terminal

Terminal-style interactive prompt library for Preact.

## Usage

Add the library via jsDelivr CDN:

```html
<link
  href="https://cdn.jsdelivr.net/gh/rodnye/preact-clack-terminal@dist/preact-clack-terminal.css"
  rel="stylesheet"
/>

<script src="https://cdn.jsdelivr.net/gh/rodnye/preact-clack-terminal@dist/preact-clack-terminal.js"></script>
```

Initialize the terminal:

```html
<div id="terminal"></div>

<script>
  const terminal = ClackTerminal.init('#terminal');

  terminal.println('Welcome!');
  terminal.read('What is your name?').then((name) => {
    terminal.println(`Hello, ${name}!`);
  });
</script>
```

## Development

```bash
pnpm install
pnpm dev
pnpm build
```

## API

Simple, intuitive, and powerful. Every method returns a `Promise` with built-in validation.

### Text Input

```javascript
// Simple text input
const name = await terminal.read("What's your name?");

// With validation & placeholder
const age = await terminal.int('Enter your age:', {
  placeholder: '18',
  validate: (val) => (val < 0 ? "Age can't be negative" : undefined),
});

// Decimal numbers
const height = await terminal.float('Height (cm):', {
  validate: (val) => (val < 50 ? 'Too short' : undefined),
});
```

### Selection

```javascript
const framework = await terminal.select(
  [
    { label: '⚡ Preact', value: 'preact' },
    { label: '◆ React', value: 'react' },
    { label: '▲ Vue', value: 'vue' },
  ],
  'Pick your favorite:',
);

// Returns "preact", "react", or "vue"
```

### Confirmation

```javascript
const confirmed = await terminal.confirm('Continue?', {
  yesLabel: '✓ Yes',
  noLabel: '✗ No',
});

// Returns true or false
```

### Output

```javascript
terminal.print('Inline text ');
terminal.println('with newline');
```

### Validation

All input methods support async/await validation:

```javascript
const email = await terminal.read('Email:', {
  validate: async (value) => {
    if (!value.includes('@')) return 'Invalid email';
    const exists = await checkEmailExists(value);
    return exists ? 'Email already registered' : undefined;
  },
});
```

### Navigation

- **Arrow keys** ↑ ↓ ← → — navigate selects & confirms
- **Enter** ⏎ — submit
- **Escape** ⎋ — cancel
- **Mouse** — click any option

## License

MIT
