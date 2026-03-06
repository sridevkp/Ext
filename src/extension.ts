import * as vscode from 'vscode';
import * as path from 'path';
import { playSound } from './player';

export function activate(context: vscode.ExtensionContext): void {
  const builtInSoundPath = context.asAbsolutePath(path.join('audio', 'fail.wav'));

  const disposable = vscode.window.onDidEndTerminalShellExecution(
    (event: vscode.TerminalShellExecutionEndEvent) => {
      const config = vscode.workspace.getConfiguration('terminalFailSound');

      if (!config.get<boolean>('enabled', true)) {
        return;
      }

      const minExitCode = config.get<number>('minExitCode', 1);
      const exitCode = event.exitCode;

      if (exitCode === undefined || exitCode < minExitCode) {
        return;
      }

      const customPath = config.get<string>('soundPath', '').trim();
      const soundFile = customPath !== '' ? customPath : builtInSoundPath;

      playSound(soundFile);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate(): void {}
