process.stdin.resume();
process.stdin.setEncoding('utf8');

const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const lines = [];

reader.on('line', line => {
  lines.push(line);
});

reader.on('close', () => {
  console.log(
    lines[0]
      .split(' ')
      .map(Number)
      .map(n => n * 2)
      .join(' '),
  );
});
