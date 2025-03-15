import * as vscode from "vscode";
import { versionVersionGet } from "./gen/endpoints/vOICEVOXEngine";
import { logger } from "./logger";

export const checkVV = async () => {
  try {
    const version = await versionVersionGet();
    logger.info(`Connected to VoiceVox: ${version}`);
  } catch (e) {
    vscode.window.showErrorMessage("Failed to connect to VoiceVox");
  }
};
