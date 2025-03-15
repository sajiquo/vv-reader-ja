import * as vscode from "vscode";
import { checkVV } from "./checkVV";
import { speakSelected, stopSpeaking } from "./speaker";

export function activate(context: vscode.ExtensionContext) {
  checkVV();

  context.subscriptions.push(
    vscode.commands.registerCommand("vv-reader-ja.checkVersion", async () => {
      await checkVV();
    }),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vv-reader-ja.speakSelected", async () => {
      await speakSelected();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vv-reader-ja.stopSpeaking", () => {
      stopSpeaking();
    }),
  );
}

export function deactivate() {
  stopSpeaking();
}
