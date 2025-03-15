import { type ChildProcess, spawn } from "node:child_process";

// NOTE: powershellでやるぶんにはjobを使ったほうがいいのではないか

const windowsPlayScript = (path: string) =>
  `Add-Type -assemblyName PresentationCore; $mediaPlayer = New-Object System.Windows.Media.MediaPlayer;$mediaPlayer.open('${path}'); $mediaPlayer.Play(); Start-Sleep 1; Start-Sleep -s $mediaPlayer.NaturalDuration.TimeSpan.TotalSeconds; $mediaPlayer.Close();`;

const createPlayProcess = (audioPath: string) =>
  spawn("powershell", ["-c", windowsPlayScript(audioPath)]);

const attachLog = (child: ChildProcess) => {
  console.debug("[playing] start", child?.pid);
  child.stdout?.on("data", (data) => {
    console.log(`[playing] stdout: ${data}`);
  });
  child.stderr?.on("data", (data) => {
    console.error(`[playing] stderr: ${data}`);
  });
  child.on("close", (code) => {
    console.log(`[playing] child process exited with code ${code}`);
  });
};

export const generatePlayer = () => {
  let playerProcess: ChildProcess | null = null;

  const handleClose = (child: ChildProcess) => {
    child.on("close", () => {
      playerProcess = null;
    });
    child.unref();
  };

  const isPlaying = () => !!playerProcess?.pid;
  const play = async (audioPath?: string) => {
    if (!audioPath) return;
    if (isPlaying()) stop();
    playerProcess = createPlayProcess(audioPath);
    attachLog(playerProcess);
    handleClose(playerProcess);
  };
  const stop = () => {
    if (!playerProcess?.pid) return;
    console.debug("[playing] stop", playerProcess?.pid);
    playerProcess.kill("SIGTERM");
    playerProcess = null;
  };

  return {
    isPlaying,
    play,
    stop,
  };
};
