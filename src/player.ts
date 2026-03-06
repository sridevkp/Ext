import { spawn } from 'child_process';

/**
 * Plays the audio file at the given path using a platform-appropriate command.
 * Errors are silently ignored so that a missing or unsupported player never
 * interrupts the user's workflow.
 */
export function playSound(filePath: string): void {
  switch (process.platform) {
    case 'darwin':
      spawnPlayer('afplay', [filePath]);
      break;

    case 'win32':
      // Use PowerShell's SoundPlayer – no extra dependencies needed.
      // Pass the file path as a separate argument to -File so it is never
      // interpreted as part of a shell command string.
      spawnPlayer('powershell.exe', [
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        '[System.Reflection.Assembly]::LoadWithPartialName("System.Media") | Out-Null; ' +
          '(New-Object System.Media.SoundPlayer $args[0]).PlaySync()',
        filePath,
      ]);
      break;

    default:
      // Linux / other – try paplay (PulseAudio) first, fall back to aplay (ALSA).
      // Both commands receive the path as a direct argument, avoiding any shell
      // interpolation and the associated injection / escaping risks.
      spawnPlayerWithFallback('paplay', 'aplay', filePath);
      break;
  }
}

function spawnPlayer(command: string, args: string[]): void {
  const child = spawn(command, args, { detached: true, stdio: 'ignore' });
  child.on('error', (err) => {
    console.debug(`[terminal-fail-sound] Could not play sound with '${command}': ${err.message}`);
  });
  child.unref();
}

function spawnPlayerWithFallback(primary: string, fallback: string, filePath: string): void {
  const child = spawn(primary, [filePath], { detached: true, stdio: 'ignore' });
  child.on('error', () => {
    // Primary player not available – try the fallback.
    spawnPlayer(fallback, [filePath]);
  });
  child.unref();
}

