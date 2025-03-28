import { spawn } from "node:child_process";
import { logger } from "../logger";
import type { SpeakerContext } from "./ctx";

// NOTE: powershellでやるぶんにはjobを使ったほうがいいのではないか

const windowsPlayScript = (path: string) =>
  `Add-Type -assemblyName PresentationCore; $mediaPlayer = New-Object System.Windows.Media.MediaPlayer;$mediaPlayer.open('${path}'); $mediaPlayer.Play(); Start-Sleep 1; Start-Sleep -s $mediaPlayer.NaturalDuration.TimeSpan.TotalSeconds; $mediaPlayer.Close();`;

const createPlayProcess = (audioPath: string) =>
  spawn("powershell", ["-c", windowsPlayScript(audioPath)]);

const attachLog = (ctx: SpeakerContext) => {
  ctx.speakProcess?.stdout?.on("data", (data) => {
    logger.trace(`[playing] stdout: ${data}`);
  });
  ctx.speakProcess?.stderr?.on("data", (data) => {
    logger.trace(`[playing] stderr: ${data}`);
  });
  ctx.speakProcess?.on("close", (code) => {
    logger.trace(`[playing] child process exited with code ${code}`);
  });
};

const handleClose = (ctx: SpeakerContext, onStop?: () => void) => {
  ctx.speakProcess?.on("close", () => {
    onStop?.();
    ctx.speakProcess = null;
  });
  ctx.speakProcess?.unref();
};

export const playAudio = (ctx: SpeakerContext, onStop?: () => void) => {
  if (!ctx.temporaryFilePath) return;
  if (ctx.speakProcess) stopAudio(ctx);
  const process = createPlayProcess(ctx.temporaryFilePath);
  ctx.speakProcess = process;
  handleClose(ctx, onStop);
  attachLog(ctx);
};

export const stopAudio = (ctx: SpeakerContext) => {
  if (!ctx.speakProcess) return;
  ctx.speakProcess.kill("SIGTERM");
};
