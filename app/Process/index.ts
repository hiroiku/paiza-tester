import { ChildProcessWithoutNullStreams } from 'child_process';

export interface ProcessResult {
  code: number;
  memoryUsage: number;
  elapsedTime: number;
  stdout: string;
  stderr: string;
}

export abstract class Process {
  protected abstract readonly childProcess: ChildProcessWithoutNullStreams;

  public execute(stdin: string) {
    const startTime = process.hrtime();

    return new Promise<ProcessResult>(resolve => {
      // 子プロセスの標準出力を取得する
      let stdout = '';

      this.childProcess.stdout.on('data', data => {
        stdout += data;
      });

      let stderr = '';

      this.childProcess.stderr.on('data', data => {
        stderr += data;
      });

      this.childProcess.on('close', code => {
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const elapsedTime = seconds + nanoseconds / 1e9;
        const memoryUsage = process.memoryUsage();

        resolve({
          code: code ?? -1,
          memoryUsage: memoryUsage.heapUsed,
          elapsedTime,
          stdout,
          stderr,
        });
      });

      const lines = stdin.split('\n');

      for (const line of lines) {
        this.childProcess.stdin.write(line + '\n');
      }

      this.childProcess.stdin.end();
    });
  }
}

export class ProcessManager<T extends { [K in keyof T]: T[K] }> {
  public isProcessKey(key: any): key is keyof T {
    return key in this.processes;
  }

  private readonly processes: T;

  public constructor(processes: T) {
    this.processes = processes;
  }

  public get<K extends keyof T>(key: K) {
    return this.processes[key];
  }
}
