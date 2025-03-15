import type { ChildProcess } from "node:child_process";
import { logger } from "../logger";

export type SpeakerContext = {
  tmpfile: string | null;
  speakProcess: ChildProcess | null;
};

const _ctx: SpeakerContext = {
  tmpfile: null,
  speakProcess: null,
};

export const ctx = new Proxy(_ctx, {
  set: (target, prop, value) => {
    target[prop as keyof SpeakerContext] = value;
    logger.trace(`set ${String(prop)} to ${value}`);
    return true;
  },
});
