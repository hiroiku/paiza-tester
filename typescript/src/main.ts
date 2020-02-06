import readline from 'readline';

process.stdin.resume();
process.stdin.setEncoding('utf8');

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const lines: string[] = [];

reader.on('line', line => {
  lines.push(line);
});

reader.on('close', () => {
  const result = lines[0]
    .split(' ')
    .map(Number)
    .reduce((accumulator, current) => accumulator + current);
  console.log(result);
});
