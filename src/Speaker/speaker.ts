import { ctx } from "./ctx";
import { extractText } from "./extractText";
import { generateAudio } from "./generateAudio";
import { playAudio, stopAudio } from "./playAudio";
import { saveAsTmpFile } from "./saveAudio";

export const createSpeaker = () => {
  const isSpeaking = () => {
    return ctx.speakProcess !== null;
  };
  const speak = async () => {
    if (isSpeaking()) {
      stop();
    }
    ctx.tmpfile =
      (await saveAsTmpFile(await generateAudio(extractText()))) ?? null;
    playAudio(ctx);
  };
  const stop = () => {
    if (!isSpeaking()) return;
    stopAudio(ctx);
  };
  return {
    isSpeaking,
    speak,
    stop,
  };
};
