import { ctx } from "./ctx";
import { extractText } from "./extractText";
import { generateAudio } from "./generateAudio";
import { playAudio, stopAudio } from "./playAudio";
import { deleteTmpFile, saveAsTmpFile } from "./saveAudio";

export const createSpeaker = () => {
  const isSpeaking = () => {
    return ctx.speakProcess !== null;
  };
  const speak = async () => {
    if (isSpeaking()) await stop();
    const hasAudioBeenGenerated = await saveAsTmpFile(
      ctx,
      await generateAudio(extractText()),
    );
    if (!hasAudioBeenGenerated) return;
    playAudio(ctx, () => deleteTmpFile(ctx));
  };

  const stop = async () => {
    if (!isSpeaking()) return;
    stopAudio(ctx);
  };
  return {
    isSpeaking,
    speak,
    stop,
  };
};
