import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { Process } from '@/Process';

export class TSNodeProcess extends Process {
  protected readonly childProcess: ChildProcessWithoutNullStreams;

  public constructor(path: string) {
    super();

    this.childProcess = spawn('ts-node', [path]);
  }
}
