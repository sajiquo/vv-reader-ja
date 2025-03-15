import * as vscode from "vscode";
import { versionVersionGet } from "./gen/endpoints/vOICEVOXEngine";

export const checkVV = async () => {
  try {
    const version = await versionVersionGet();
    vscode.window.showInformationMessage("VoiceVox version: ", version.data);
  } catch (e) {
    vscode.window.showErrorMessage("Failed to connect to VoiceVox");
  }
};
