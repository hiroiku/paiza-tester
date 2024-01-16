import fs from 'fs';
import path from 'path';
import colors from 'colors';
import { glob } from 'glob';
import bytes from 'bytes';
import { program } from 'commander';
import { TSNodeProcess } from '@/Process/TSNodeProcess';
import { NodeProcess } from '@/Process/NodeProcess';
import { ProcessManager } from '@/Process';

// 拡張子に応じたプロセスを管理する
const manager = new ProcessManager({
  '.ts': TSNodeProcess,
  '.js': NodeProcess,
});

program.argument('<file>', 'Execution file').action(async file => {
  // テストケースを ./tests/*.txt から読み込む
  const projectDirectory = path.resolve(__dirname, '..');
  const testCasePaths = glob.sync(path.resolve(projectDirectory, 'tests', '**/*.txt')).sort();

  for (const testCasePath of testCasePaths) {
    // 実行ファイルのパスを取得する
    const executionFile = path.resolve(projectDirectory, file);

    // 実行ファイルが存在しなければエラーを投げる
    if (!fs.existsSync(executionFile)) {
      console.error(colors.bgRed(' ERROR '), colors.bold('Execution file is not found.'));
      console.error(colors.red(executionFile));

      return;
    }

    // ファイルの拡張子を取得する
    const extension = path.extname(executionFile);

    // 拡張子が対応していなければエラーを投げる
    if (!manager.isProcessKey(extension)) {
      console.error(colors.bgRed(' ERROR '), colors.bold(`Invalid file extension. (${extension})`));
      console.error('Please see README.md.');

      return;
    }

    // テストケースファイルを読み込む
    const testCase = fs.readFileSync(testCasePath, 'utf-8');
    const [input, output] = testCase
      .trim()
      .split(/入力例.*?\n|出力例.*?\n/)
      .map(text => text.trim())
      .slice(1);

    // 拡張子に応じたプロセスを実行する
    const processConstructor = manager.get(extension);
    const process = new processConstructor(executionFile);
    const result = await process.execute(input);
    const stdout = result.stdout.trim();

    // テストケースの判定結果を表示する
    const testCaseName = path.relative(projectDirectory, testCasePath);

    if (stdout === output) {
      console.info(colors.bgGreen(' PASS '), colors.bold(testCaseName));
    } else {
      console.error(colors.bgRed(' FAIL '), colors.bold(testCaseName));
    }
    console.log('');

    // メモリ使用量と実行時間を表示する
    const [size, unit] = bytes(result.memoryUsage, { unitSeparator: ' ' }).split(' ');
    console.info(colors.blue('Memory Usage:'), colors.yellow(size), unit);
    console.info(colors.blue('Elapsed Time:'), colors.yellow(result.elapsedTime.toString()), 'sec');
    console.log('');

    // 標準出力を表示する
    if (stdout) {
      console.log(stdout);
      console.log('');
    }

    // エラーがあれば表示する
    if (result.stderr) {
      console.log(colors.red(result.stderr));
    }
  }
});

program.parse(process.argv);
