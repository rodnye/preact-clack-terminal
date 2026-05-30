// demo/demo.mjs
import ClackTerminal from '../src';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

async function init() {
  const terminal = ClackTerminal.init('#clack-terminal-root');

  // ---- Intro ----
  terminal.intro('Preact Clack Terminal — Full API Demo');

  // ---- Log examples ----
  terminal.log.info('Starting interactive session...');
  terminal.log.step('Loading modules');
  await new Promise((r) => setTimeout(r, 300));
  terminal.log.success('Ready');
  terminal.log.message('◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆');
  terminal.log.message('  Welcome to the terminal playground');
  terminal.log.message('◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆');
  terminal.log.message('');

  // ---- 1. Text input (already used, but keep for context) ----
  const userName = await terminal.text({
    message: 'What should I call you?',
    placeholder: 'e.g., John el. Tranca',
    validate: (v) => {
      if (!v || v.trim().length < 2)
        return 'Name must be at least 2 characters';
      if (v.length > 24) return "That's a bit too long, don't you think?";
      return undefined;
    },
  });
  terminal.log.success(`Pleased to meet you, ${userName}.`);
  terminal.log.message('');

  // ---- 2. Password input (new) ----
  const secret = await terminal.password({
    message: 'Enter a secret password (visible as masked)',
    mask: '•',
    validate: (v) => {
      if (v.length < 4) return 'Password must be at least 4 characters';
      return undefined;
    },
  });
  terminal.log.success('Password accepted (not stored)');
  terminal.log.message('');

  // ---- 3. Number validation via text + parser (como int/float ya no existen) ----
  const ageStr = await terminal.text({
    message: 'How many years have you been around?',
    placeholder: '29',
    validate: (v) => {
      const num = parseInt(v, 10);
      if (isNaN(num)) return 'Please enter a number';
      if (num < 0) return 'Negative age? Really?';
      if (num < 12) return "You're a bit young for this terminal, kid.";
      if (num > 110) return "Okay... I don't think you're human.";
      if (num < 18) return "Almost there. Come back when you're 18.";
      return undefined;
    },
  });
  const age = parseInt(ageStr, 10);
  if (age >= 18 && age <= 110) {
    terminal.log.message(`${age} years. Respectable.`);
  }
  terminal.log.message('');

  // ---- 4. Confirm (already used) ----
  const likeTerminal = await terminal.confirm({
    message: 'Enjoying the geometric experience so far?',
    yesLabel: 'Absolutely',
    noLabel: 'Not really',
  });
  if (likeTerminal) {
    terminal.log.message('▲ Excellent. The rhombus approves.');
  } else {
    terminal.log.message("◀ Honest. I'll take that as constructive feedback.");
  }
  terminal.log.message('');

  // ---- 5. Select (already used) ----
  const framework = await terminal.select({
    message: 'Which frontend framework sparks joy?',
    options: [
      { label: '⚡ Preact', value: 'preact' },
      { label: '◈ React', value: 'react' },
      { label: '◆ Vue', value: 'vue' },
      { label: '▲ Svelte', value: 'svelte' },
      { label: '⬩ Solid', value: 'solid' },
    ],
  });
  terminal.log.message(`▶ You chose ${framework}. Great!`);
  terminal.log.message('');

  // ---- 6. Multiselect (new) ----
  const features = await terminal.multiselect({
    message: 'Select features you love (space to toggle, enter to submit):',
    options: [
      { label: 'Terminal UI', value: 'terminal' },
      { label: 'Reactive prompts', value: 'reactive' },
      { label: 'Customizable theme', value: 'theme' },
      { label: 'Debug tools', value: 'debug' },
      { label: 'Small bundle', value: 'size' },
    ],
    required: false,
  });
  terminal.log.success(`Selected: ${features.join(', ') || 'none'}`);
  terminal.log.message('');

  // ---- 7. Autocomplete (new) ----
  const color = await terminal.autocomplete({
    message: 'Pick a color (start typing):',
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Green', value: 'green' },
      { label: 'Blue', value: 'blue' },
      { label: 'Cyan', value: 'cyan' },
      { label: 'Magenta', value: 'magenta' },
      { label: 'Yellow', value: 'yellow' },
      { label: 'Black', value: 'black' },
      { label: 'White', value: 'white' },
    ],
    placeholder: 'e.g., green',
    maxItems: 4,
  });
  terminal.log.message(`◆ Nice choice: ${color}`);
  terminal.log.message('');

  // ---- 8. Group prompts (new) ----
  terminal.log.step(
    'Now a group of two quick prompts (cancel any to abort group)',
  );
  const groupResults = await terminal.group({
    pet: async () =>
      terminal.text({ message: 'Favorite pet?', placeholder: 'cat' }),
    hobby: async () =>
      terminal.select({
        message: 'Favorite hobby?',
        options: [
          { label: 'Coding', value: 'code' },
          { label: 'Gaming', value: 'game' },
          { label: 'Reading', value: 'read' },
        ],
      }),
  });
  terminal.log.success(
    `Pet: ${groupResults.pet}, Hobby: ${groupResults.hobby}`,
  );
  terminal.log.message('');

  // ---- 9. Spinner (new) ----
  terminal.log.step('Spinner demo: simulating async work...');

  const spinner = terminal.spinner();
  spinner.start('Connecting to hyperspace');
  await new Promise((r) => setTimeout(r, 1500));

  spinner.message('Still working...');
  await new Promise((r) => setTimeout(r, 1500));

  spinner.stop('Hyperdrive ready');
  terminal.log.message('');

  // ---- 10. Tasks (sequential, new) ----
  terminal.log.step('Tasks demo: running sequential tasks');
  await terminal.tasks([
    {
      title: 'Downloading assets',
      task: async (update) => {
        update('Fetching from CDN...');
        await new Promise((r) => setTimeout(r, 1000));
        update('Validating checksums...');
        await new Promise((r) => setTimeout(r, 500));
        return 'Downloaded 5 files';
      },
    },
    {
      title: 'Compiling styles',
      task: async (update) => {
        update('Processing CSS...');
        await new Promise((r) => setTimeout(r, 800));
        update('Optimizing...');
        await new Promise((r) => setTimeout(r, 700));
        return 'Compiled successfully';
      },
    },
    {
      title: 'Starting dev server',
      task: async (update) => {
        update('Spawning process...');
        await new Promise((r) => setTimeout(r, 600));
        return 'Server running on port 3000';
      },
    },
  ]);
  terminal.log.message('');

  // ---- 11. Final warnings and outro ----
  terminal.log.warn('Demo almost finished — all methods tested');
  terminal.log.error('(This is a fake error, just for demonstration)');
  terminal.log.message('');
  terminal.outro('Thanks for exploring the full API! Have fun building.');

  // ---- Optional: example of raw log.message with custom symbol ----
  terminal.log.message('You can also use custom symbols', {
    symbol: '★',
  });
}
