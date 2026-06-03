import ClackTerminal from '../src';
import {
  S_ACTIVE,
  S_SUCCESS,
  S_WARN,
} from '../src/common';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

async function init() {
  const terminal = ClackTerminal.init('#clack-terminal-root');

  // ---- Intro ----
  terminal.intro('Preact Clack Terminal — API Demo');

  // ---- Log examples ----
  terminal.log.info('Starting session.');
  terminal.log.step('Loading modules');
  await new Promise((r) => setTimeout(r, 1000));
  terminal.log.success('Ready');
  terminal.log.message('◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆');
  terminal.log.message('  Welcome to the terminal playground');
  terminal.log.message('◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆');
  terminal.log.message('');

  // ---- 1. Text input ----
  const userName = await terminal.text({
    message: 'Name?',
    placeholder: 'something original please',
    validate: (v) => {
      if (!v || v.trim().length < 2) return 'Too short. Try harder.';
      if (v.length > 20) return "That's a sentence, not a name.";
      if (v.toLowerCase() === 'admin') return 'How original. No.';
      if (v.toLowerCase() === 'root') return 'Ha. No.';
      return undefined;
    },
  });
  terminal.log.success(`Fine. ${userName} it is. Don't disappoint me.`);
  terminal.log('');

  // ---- 2. Password input ----
  const secret = await terminal.password({
    message: 'Password?',
    mask: '•',
    validate: (v) => {
      if (!v || v.length === 0) return 'Empty? Seriously?';
      if (v.length < 4) return 'Four characters. Minimum. Not hard.';
      if (v.length > 64) return "You're trying too hard.";
      if (v.toLowerCase() === 'password')
        return 'You did NOT just type password.';
      if (v === '123456')
        return 'Thats the kind of password I expect from a toddler.';
      return undefined;
    },
  });
  terminal.log.success('Accepted. Whatever.');
  terminal.log('');

  // ---- 3. Number validation ----
  const ageStr = await terminal.text({
    message: 'Age?',
    placeholder: 'number please',
    validate: (v) => {
      const num = parseInt(v, 10);
      if (isNaN(num)) return 'Numbers exist for a reason. Use them.';
      if (num < 0) return 'Negative age. Impressively wrong.';
      if (num === 0) return 'Zero. Sure. Next.';
      if (num < 13) return "Come back when you're older. Much older.";
      if (num > 100) return "I'll pretend I believe you.";
      if (num < 18) return 'Not old enough. Rules are rules.';
      return undefined;
    },
  });
  const age = parseInt(ageStr, 10);
  if (age >= 18 && age <= 100) {
    if (age < 25) terminal.log(`${age}. Still wet behind the ears.`);
    else if (age < 40) terminal.log(`${age}. Acceptable.`);
    else terminal.log(`${age}. Old guard. Respect.`);
  }
  terminal.log('');

  // ---- 4. Confirm ----
  const likeTerminal = await terminal.confirm({
    message: 'This terminal decent?',
    yesLabel: 'Yeah',
    noLabel: 'Nope',
  });
  if (likeTerminal) {
    terminal.log.success('Correct. You pass.', { symbol: S_SUCCESS });
  } else {
    terminal.log.warn("Wrong answer. But I'll allow it.", { symbol: S_WARN });
  }
  terminal.log('');

  // ---- 5. Select with hints and opinions ----
  const framework = await terminal.select({
    message: 'Framework of choice?',
    options: [
      { label: 'Preact', value: 'preact', hint: 'small' },
      { label: 'JQuery', value: 'jquery', hint: 'oh no' },
      { label: 'React', value: 'react', hint: 'boring but works' },
      { label: 'Vue', value: 'vue', hint: 'friendly' },
      { label: 'Solid', value: 'solid', hint: 'hipster pick', disabled: true },
      { label: 'Svelte', value: 'svelte', hint: 'magic' },
    ],
  });

  if (framework === 'preact') {
    terminal.log.success('Preact. Smart. Lightweight. I approve.', {
      symbol: S_ACTIVE,
    });
  } else if (framework === 'jquery') {
    terminal.log.success('jQuery? Well, we have to make a living somehow.', {
      symbol: S_ACTIVE,
    });
  } else if (framework === 'react') {
    terminal.log.success('React. Safe choice. Boring but reliable.', {
      symbol: S_ACTIVE,
    });
  } else if (framework === 'vue') {
    terminal.log.success('Vue. Elegant. You have taste.', { symbol: S_ACTIVE });
  } else if (framework === 'svelte') {
    terminal.log.success('Svelte. Bold. I like it.', { symbol: S_ACTIVE });
  }
  terminal.log('');

  // ---- 6. Multiselect ----
  const features = await terminal.multiselect({
    message: 'Pick features (space to toggle, enter when done):',
    options: [
      { label: 'CLI vibes', value: 'cli', hint: 'obvious' },
      { label: 'Pretty colors', value: 'colors', hint: 'eye candy' },
      { label: 'Fast prompts', value: 'fast', hint: 'obviously' },
      { label: 'Small bundle', value: 'size', hint: 'the point' },
      { label: 'Documentation', value: 'docs', hint: 'you should read it' },
    ],
    required: false,
  });

  if (features.length === 0) {
    terminal.log.warn('Nothing? Bold move. Wrong, but bold.', {
      symbol: S_WARN,
    });
  } else {
    terminal.log.success(`Selected: ${features.join(', ')}. Decent choices.`);
  }
  terminal.log('');

  // ---- 7. Autocomplete ----
  const color = await terminal.autocomplete({
    message: 'Favorite color? (type to filter)',
    options: [
      { label: 'Red', value: 'red', hint: 'angry' },
      { label: 'Green', value: 'green', hint: 'envy' },
      { label: 'Blue', value: 'blue', hint: 'sad' },
      { label: 'Black', value: 'black', hint: 'classy' },
      { label: 'White', value: 'white', hint: 'boring' },
      { label: 'Purple', value: 'purple', hint: 'royal' },
      { label: 'Orange', value: 'orange', hint: 'loud' },
    ],
    placeholder: 'type something',
    maxItems: 4,
  });

  if (color === 'black')
    terminal.log.success(`${color}. Classic. Minimalist. Good.`);
  else if (color === 'white')
    terminal.log.success(`${color}. Clean. Boring but clean.`);
  else terminal.log.success(`${color}. Not what I'd pick, but you do you.`);
  terminal.log('');

  // ---- 8. Group prompts ----
  terminal.log.step('Quick group. Cancel any and the whole thing dies.');
  const groupResults = await terminal.group({
    pet: async () =>
      terminal.text({
        message: 'Pet?',
        placeholder: 'cat/dog/iguana',
        validate: (v) => (!v ? 'Empty? Really?' : undefined),
      }),
    hobby: async () =>
      terminal.select({
        message: 'Hobby?',
        options: [
          { label: 'Coding', value: 'code', hint: 'nerd' },
          { label: 'Gaming', value: 'game', hint: 'nerd' },
          { label: 'Reading', value: 'read', hint: 'also nerd' },
        ],
      }),
  });
  terminal.log.success(
    `Fine. ${groupResults.pet} and ${groupResults.hobby}. Makes sense.`,
  );
  terminal.log('');

  // ---- 9. Spinner ----
  terminal.log.step('Spinner. Watch it spin. Thrilling.');
  const spinner = terminal.spinner();
  spinner.start('Doing things...');
  await new Promise((r) => setTimeout(r, 1500));
  spinner.message('Still going...');
  await new Promise((r) => setTimeout(r, 1500));
  spinner.stop('Done. Finally.');
  terminal.log('');

  // ---- 10. Tasks ----
  terminal.log.step('Tasks. Sequential. No skipping.');
  await terminal.tasks([
    {
      title: 'Download stuff',
      task: async (update) => {
        update('Fetching...');
        await new Promise((r) => setTimeout(r, 1000));
        update('Almost...');
        await new Promise((r) => setTimeout(r, 500));
        return 'Got 5 files.';
      },
    },
    {
      title: 'Process data',
      task: async (update) => {
        update('Crunching numbers...');
        await new Promise((r) => setTimeout(r, 800));
        update('Optimizing...');
        await new Promise((r) => setTimeout(r, 700));
        return 'Processed.';
      },
    },
    {
      title: 'Start server',
      task: async (update) => {
        update('Booting...');
        await new Promise((r) => setTimeout(r, 600));
        return 'Running on port 3000.';
      },
    },
  ]);
  terminal.log('');

  // ---- 11. Outro ----
  terminal.log.warn('Demo ending. You survived.');
  terminal.log.error('(Fake error. Relax.)');
  terminal.log('');
  terminal.outro('Done. Go build something useful.');
}
