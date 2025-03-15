import { extractText } from "./Speaker/extractText";
import { generateAudio } from "./Speaker/generateAudio";
import { playAudio } from "./Speaker/playAudio";
import { saveAsTmpFile } from "./Speaker/saveAudio";

export const launchSpeaker = async () => {
  playAudio(await saveAsTmpFile(await generateAudio(extractText())));
};
