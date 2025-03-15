import { exec } from "node:child_process";
import type * as vscode from "vscode";

const windowsPlayScript = (path: string) => ` \
Add-Type -assemblyName PresentationCore; \
$mediaPlayer = New-Object System.Windows.Media.MediaPlayer; \
$mediaPlayer.open('${path}'); \
$mediaPlayer.Play(); \
Start-Sleep 1; Start-Sleep -s $mediaPlayer.NaturalDuration.TimeSpan.TotalSeconds; Exit;
`;

const windowsPlayCommand = (path: string) =>
  `powershell -c ${windowsPlayScript(path)}`;

export const playAudio = (uri?: vscode.Uri) => {
  if (!uri) return;
  const audioPath = uri.fsPath;
  console.log("playing audio", audioPath);
  exec(windowsPlayCommand(audioPath), (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
};
