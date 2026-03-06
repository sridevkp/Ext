# Terminal Fail Sound

A VS Code extension that plays a small audio notification whenever a terminal command exits with a non-zero (failure) exit code.

## Features

- Automatically detects terminal command failures via VS Code's [shell integration](https://code.visualstudio.com/docs/terminal/shell-integration).
- Plays a built-in short beep sound on failure — no external dependencies required.
- Supports a custom audio file path so you can use your own sound.
- Works on **macOS**, **Linux**, and **Windows**.

## Requirements

- VS Code **1.93** or newer (required for `onDidEndTerminalShellExecution`).
- Shell integration must be enabled in your terminal (enabled by default for bash, zsh, fish, and PowerShell in recent VS Code versions).

## Extension Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| `terminalFailSound.enabled` | `boolean` | `true` | Enable or disable the sound notification. |
| `terminalFailSound.soundPath` | `string` | `""` | Path to a custom audio file. Leave empty to use the built-in sound. |
| `terminalFailSound.minExitCode` | `number` | `1` | Minimum exit code treated as a failure. |

## How It Works

The extension listens for the `onDidEndTerminalShellExecution` event emitted by VS Code when a shell command finishes. If the exit code is greater than or equal to `terminalFailSound.minExitCode`, the configured audio file is played using:

- **macOS**: `afplay`
- **Linux**: `paplay` (PulseAudio) with `aplay` (ALSA) as fallback
- **Windows**: PowerShell `Media.SoundPlayer`

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode
npm run watch

# Lint
npm run lint
```
