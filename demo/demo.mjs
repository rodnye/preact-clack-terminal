import ClackTerminal from '../src';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

async function init() {
  const terminal = ClackTerminal.init('#clack-terminal-root');

  await new Promise((r) => setTimeout(r, 50));

  // header
  terminal.println('◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆');
  terminal.print('  Preact Clack Terminal  ');
  terminal.println('  v1.0  ');
  terminal.println('◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆');
  terminal.println('◈ interactive prompt ui ◈');
  terminal.println('');

  // ---- identity ----
  const userName = await terminal.read('What should I call you?', {
    placeholder: 'e.g., John el. Tranca',
    validate: (v) => {
      if (!v || v.trim().length < 2)
        return 'Name must be at least 2 characters';
      if (v.length > 24) return "That's a bit too long, don't you think?";
      return undefined;
    },
  });
  terminal.println(`◇ Pleasure to meet you, ${userName}.`);
  terminal.println('');

  // ---- mature age check ----
  const age = await terminal.int('How many years have you been around?', {
    placeholder: '29',
    validate: (v) => {
      if (v < 0) return 'Negative age? Really?';
      if (v < 12) return "You're a bit young for this terminal, kid.";
      if (v > 110) return "Okay... I don't think you're human.";
      if (v < 18) return "Almost there. Come back when you're 18.";
      return undefined;
    },
  });

  if (age >= 18 && age <= 110) {
    terminal.println(`◆ ${age} years. Respectable.`);
  }
  terminal.println('');

  // ---- height with dry wit ----
  const heightCm = await terminal.float('Your height in centimeters?', {
    placeholder: '175.5',
    validate: (v) => {
      if (v < 50) return 'Are we measuring an ant?';
      if (v > 250) return "That's either a typo or you're a giant.";
      if (v > 220) return 'You might need to duck through doorways.';
      return undefined;
    },
  });

  if (heightCm < 140) {
    terminal.println('▲ Good things come in small packages.');
  } else if (heightCm > 200) {
    terminal.println("▲ Hope you don't hit your head often.");
  } else {
    terminal.println('◇ Average. Solid. Reliable.');
  }
  terminal.println('');

  // ---- philosophical framework pick ----
  const framework = await terminal.select(
    [
      { label: '⚡ Preact', value: 'preact' },
      { label: '◈ React', value: 'react' },
      { label: '◆ Vue', value: 'vue' },
      { label: '▲ Svelte', value: 'svelte' },
      { label: '⬩ Solid', value: 'solid' },
    ],
    'Which frontend framework sparks joy?',
  );

  let frameworkReaction = '';
  if (framework === 'preact')
    frameworkReaction = 'Wise choice. Small, fast, honest.';
  else if (framework === 'react')
    frameworkReaction = 'Solid. A bit heavy, but we forgive you.';
  else if (framework === 'vue') frameworkReaction = 'Elegant. You have taste.';
  else if (framework === 'svelte')
    frameworkReaction = 'The compiler whisperer. Nice.';
  else frameworkReaction = 'Bold. I respect that.';

  terminal.println(`▶ ${frameworkReaction}`);
  terminal.println('');

  // ---- random character assessment ----
  const vibes = await terminal.select(
    [
      { label: '◀ Pragmatic', value: 'pragmatic' },
      { label: '◆ Idealistic', value: 'idealistic' },
      { label: '▲ Chaotic', value: 'chaotic' },
    ],
    'Describe your coding philosophy:',
  );

  const vibeMessages = {
    pragmatic: 'Get things done. I like that.',
    idealistic: 'Dreamer with a keyboard. The world needs you.',
    chaotic: "You're either brilliant or insane. Maybe both.",
  };
  terminal.println(`◈ ${vibeMessages[vibes]} ◈`);
  terminal.println('');

  // ---- confirm with personality ----
  const likeTerminal = await terminal.confirm(
    'Enjoying the geometric experience?',
    {
      yesLabel: '◆ Absolutely ◆',
      noLabel: '◈ Not really ◈',
    },
  );

  if (likeTerminal) {
    terminal.println('▲ Excellent. The rhombus approves.');
  } else {
    terminal.println("◀ Honest. I'll take that as constructive feedback.");
  }
  terminal.println('');

  // ---- optional deep dive ----
  const goDeeper = await terminal.confirm('Run an advanced validation demo?', {
    yesLabel: '✓ Show me',
    noLabel: '✗ Skip',
  });

  if (goDeeper) {
    terminal.println("◆ Let's test your patience... ◆");

    const lucky = await terminal.int('Pick a number between 1 and 1000:', {
      placeholder: '42',
      validate: (n) => {
        if (n < 1) return "Below 1? That's not how numbers work.";
        if (n > 1000) return "Above 1000? You're testing my limits.";
        if (n === 666) return 'Ominous choice. But acceptable.';
        if (n === 7 || n === 42) return 'Classic. Well played.';
        return undefined;
      },
    });

    if (lucky === 666) terminal.println('◇ ...courageous.');
    else if (lucky === 42)
      terminal.println('◇ The answer to everything. Respect.');
    else if (lucky === 7) terminal.println("◇ Lucky seven. Can't go wrong.");
    else terminal.println(`◇ ${lucky} sealed into the logs.`);
    terminal.println('');
  } else {
    terminal.println('◆ Skipping. Efficiency is its own virtue.');
    terminal.println('');
  }

  // ---- final wisdom ----
  terminal.println('◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆');
  terminal.print('  Terminal ready · ');
  terminal.print('.read .int .float .select .confirm');
  terminal.println('◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆');
}
