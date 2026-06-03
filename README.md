# preact-clack-terminal

Terminal-style interactive prompt library for Preact. Inspired by [@clack/prompts](https://github.com/bombshell-dev/clack)

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

  terminal.log.message('Welcome!');

  (async () => {
    const name = await terminal.text({ message: 'What is your name?' });
    terminal.log.success(`Hello, ${name}!`);
  })();
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

### Core Methods

#### Terminal Initialization

```javascript
const terminal = ClackTerminal.init('#terminal', { header: true });
```

#### Intro & Outro

```javascript
terminal.intro('Starting setup...');
terminal.outro('Setup complete!');
```

### Logging Utilities

```javascript
terminal.log.info('Information message');
terminal.log.success('Operation successful');
terminal.log.step('Step 1 of 3');
terminal.log.warn('Warning message');
terminal.log.error('Error occurred');
terminal.log.message('Custom message');
terminal.log.message('With custom symbol', { symbol: '★' });
```

### Text Input

```javascript
// Simple text input
const name = await terminal.text({
  message: "What's your name?",
});

// With validation & placeholder
const email = await terminal.text({
  message: 'Email:',
  placeholder: 'user@example.com',
  validate: async (value) => {
    if (!value.includes('@')) return 'Invalid email';
    const exists = await checkEmailExists(value);
    return exists ? 'Email already registered' : undefined;
  },
});
```

### Password Input

```javascript
const password = await terminal.password({
  message: 'Enter your password:',
  mask: '•',
  validate: (v) => (v.length < 4 ? 'Too short' : undefined),
});
```

### Confirmation

```javascript
const confirmed = await terminal.confirm({
  message: 'Continue?',
  yesLabel: '✓ Yes',
  noLabel: '✗ No',
});
// Returns true or false
```

### Selection

```javascript
const framework = await terminal.select({
  message: 'Pick your favorite:',
  options: [
    { label: '⚡ Preact', value: 'preact' },
    { label: '◆ React', value: 'react' },
    { label: '▲ Vue', value: 'vue' },
    { label: '⬩ Solid', value: 'solid', disabled: true },
    { label: '◈ Svelte', value: 'svelte', hint: 'new!' },
  ],
});
// Returns "preact", "react", or "vue"
```

### Multi-Select

```javascript
const features = await terminal.multiselect({
  message: 'Select features:',
  options: [
    { label: 'Terminal UI', value: 'terminal' },
    { label: 'Themes', value: 'themes' },
    { label: 'Plugins', value: 'plugins' },
  ],
  required: false, // Set to true to force at least one selection
});
// Returns array of selected values
```

### Autocomplete

```javascript
const color = await terminal.autocomplete({
  message: 'Pick a color:',
  options: [
    { label: 'Red', value: 'red' },
    { label: 'Green', value: 'green' },
    { label: 'Blue', value: 'blue' },
  ],
  placeholder: 'Type to search...',
  maxItems: 5,
});
```

### Group Prompts

Group multiple prompts together. If any prompt is cancelled, the whole group is cancelled.

```javascript
const results = await terminal.group({
  name: () => terminal.text({ message: 'Name?' }),
  age: () => terminal.text({ message: 'Age?' }),
  framework: () =>
    terminal.select({
      message: 'Framework?',
      options: [
        { label: 'Preact', value: 'preact' },
        { label: 'React', value: 'react' },
      ],
    }),
});
// Returns { name, age, framework }
```

### Spinner

For async operations with visual feedback:

```javascript
const spinner = terminal.spinner();
spinner.start('Loading data...');

try {
  await someAsyncOperation();
  spinner.stop('Data loaded successfully');
} catch (error) {
  spinner.stop('Failed to load');
}
```

Update spinner message dynamically:

```javascript
spinner.start('Processing...');
await step1();
spinner.message('Almost there...');
await step2();
spinner.stop('Done!');
```

### Sequential Tasks

Run tasks in sequence with live status updates:

```javascript
await terminal.tasks([
  {
    title: 'Downloading assets',
    task: async (update) => {
      update('Fetching from CDN...');
      await delay(1000);
      update('Validating...');
      await delay(500);
      return '✓ Downloaded 5 files';
    },
  },
  {
    title: 'Compiling styles',
    task: async (update) => {
      update('Processing CSS...');
      await delay(800);
      return '✓ Compiled successfully';
    },
  },
]);
```

### Validation

All input methods support async/await validation:

```javascript
const email = await terminal.text({
  message: 'Email:',
  validate: async (value) => {
    if (!value.includes('@')) return 'Invalid email';
    const exists = await checkEmailExists(value);
    return exists ? 'Email already registered' : undefined;
  },
});
```

### Navigation

- **Arrow keys** ↑ ↓ ← → — navigate selects, confirms, and autocomplete
- **Space** ␣ — toggle multi-select options
- **Enter** ⏎ — submit
- **Escape** ⎋ — cancel
- **Mouse** — click any option or button

## Complete Example

```javascript
const terminal = ClackTerminal.init('#terminal');

terminal.intro('Setup Wizard');

const name = await terminal.text({
  message: 'What is your name?',
  placeholder: 'John Doe',
});

const age = await terminal.text({
  message: 'How old are you?',
  validate: (v) => {
    const num = parseInt(v, 10);
    if (isNaN(num)) return 'Please enter a number';
    if (num < 18) return 'Must be 18+';
    return undefined;
  },
});

const features = await terminal.multiselect({
  message: 'Select features to install:',
  options: [
    { label: 'Core', value: 'core' },
    { label: 'Themes', value: 'themes' },
    { label: 'Plugins', value: 'plugins' },
  ],
});

const spinner = terminal.spinner();
spinner.start('Installing...');
await new Promise((r) => setTimeout(r, 2000));
spinner.stop('Installation complete!');

terminal.outro(`Welcome, ${name}!`);
```

## License

MIT
