import type { ChildProcess } from "node:child_process";
import { logger } from "../logger";
import { type Maybe, nothing } from "../maybe";

export type SpeakerContext = {
  temporaryFilePath: Maybe<string>;
  speakProcess: Maybe<ChildProcess>;
};

const _ctx: SpeakerContext = {
  temporaryFilePath: nothing(),
  speakProcess: nothing(),
};

export const ctx = new Proxy(_ctx, {
  set: (target, prop, value) => {
    target[prop as keyof SpeakerContext] = value;
    logger.trace(`set ${String(prop)} to ${value}`);
    return true;
  },
});
