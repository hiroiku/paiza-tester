import fs from 'fs';
import path from 'path';
import colors from 'colors';
import { glob } from 'glob';
import bytes from 'bytes';
import { program } from 'commander';
import { TSNodeProcess } from '@/Process/TSNodeProcess';
import { NodeProcess } from '@/Process/NodeProcess';
import { ProcessManager } from '@/Process';
import { PythonProcess } from '@/Process/PythonProcess';
import { PHPProcess } from '@/Process/PHPProcess';

// 拡張子に応じたプロセスを管理する
const manager = new ProcessManager({
  '.js': NodeProcess,
  '.php': PHPProcess,
  '.py': PythonProcess,
  '.ts': TSNodeProcess,
});

program
  .argument('<file>', 'Execution file')
  .option('-t, --test <dir>', 'Test cases directory')
  .option('-c, --case <case>', 'Specific test case')
  .action(async (file, options) => {
    // プロジェクトのルートディレクトリを取得する
    const projectDirectory = path.resolve(__dirname, '..');

    // 実行ファイルのパスを取得する
    const executionFilePath = path.resolve(file);

    // テストケースを ./tests/*.txt から読み込む
    const testCaseDirectory = (() => {
      if (options.test) {
        return path.resolve(options.test);
      }

      // options.test がなければ実行ファイルと同じディレクトリの ./tests/ を対象とする
      return path.resolve(path.dirname(executionFilePath), 'tests');
    })();

    const testCasePaths = (() => {
      const allTestCasePaths = glob.sync(path.resolve(testCaseDirectory, '**/*.txt')).sort();

      // options.caseが存在する場合はそのテストケースだけを実行
      if (options.case) {
        return allTestCasePaths.filter(casePath => path.basename(casePath) === options.case);
      }

      // options.caseが存在しない場合は全てのテストケースを実行
      return allTestCasePaths;
    })();

    for (const testCasePath of testCasePaths) {
      // 実行ファイルが存在しなければエラーを投げる
      if (!fs.existsSync(executionFilePath)) {
        console.error(colors.bgRed(' ERROR '), colors.bold('Execution file is not found.'));
        console.error(colors.red(executionFilePath));

        return;
      }

      // ファイルの拡張子を取得する
      const extension = path.extname(executionFilePath);
      const testCaseName = path.relative(projectDirectory, testCasePath);

      // 拡張子が対応していなければエラーを投げる
      if (!manager.isProcessKey(extension)) {
        console.error(colors.bgRed(' ERROR '), colors.bold(`Invalid file extension. (${extension})`));
        console.error('Please see README.md.');

        return;
      }

      // テストケースファイルを読み込む
      const testCase = fs.readFileSync(testCasePath, 'utf-8');
      const [input, output] = (testCase.trim() + '\n')
        .split(/入力例.*?\n|出力例.*?\n/)
        .map(text => text.trim())
        .slice(1) as [string | undefined, string | undefined];

      if (!input || !output) {
        console.error(colors.bgRed(' ERROR '), colors.bold('Invalid test case.'));
        console.error(colors.red(testCaseName) + '\n');

        continue;
      }

      // 拡張子に応じたプロセスを実行する
      const processConstructor = manager.get(extension);
      const process = new processConstructor(executionFilePath);
      const result = await process.execute(input);
      const stdout = result.stdout.trim();

      // テストケースの判定結果を表示する

      if (stdout === output) {
        console.info(colors.bgGreen(' PASS '), colors.bold(testCaseName) + '\n');
      } else {
        console.error(colors.bgRed(' FAIL '), colors.bold(testCaseName) + '\n');
      }

      // メモリ使用量と実行時間を表示する
      const [size, unit] = bytes(result.memoryUsage, { unitSeparator: ' ' }).split(' ');
      console.info(colors.blue('Memory Usage:'), colors.yellow(size), unit);
      console.info(colors.blue('Elapsed Time:'), colors.yellow(result.elapsedTime.toString()), 'sec');
      console.log();

      // テストケースの入力例を表示する
      console.log(colors.blue('stdin:'));
      console.log(colors.gray(input) + '\n');

      // テストケースの出力例を表示する
      console.log(colors.blue('stdout:'));
      console.log(colors.gray(output) + '\n');

      // 標準出力を表示する
      console.log(colors.blue('Result:'));
      console.log(stdout + '\n');

      // エラーがあれば表示する
      if (result.stderr) {
        console.log(colors.red(result.stderr));
      }
    }
  });

program.parse(process.argv);
