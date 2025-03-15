import * as vscode from "vscode";
import { checkVV } from "./checkVV";
import { createSpeaker } from "./speaker/speaker";

const speaker = createSpeaker();

export function activate(context: vscode.ExtensionContext) {
  checkVV();

  context.subscriptions.push(
    vscode.commands.registerCommand("vv-reader-ja.checkVersion", checkVV),
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "vv-reader-ja.speakSelected",
      speaker.speak,
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vv-reader-ja.stopSpeaking", () => {
      stopSpeaking();
    }),
  );
}

export function deactivate() {
  speaker.stop();
}
