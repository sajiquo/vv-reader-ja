import * as vscode from "vscode";
import { checkVV } from "./checkVV";
import { launchSpeaker } from "./launchSpeaker";

export function activate(context: vscode.ExtensionContext) {
  checkVV();

  context.subscriptions.push(
    vscode.commands.registerCommand("vv-reader-ja.checkVersion", async () => {
      await checkVV();
    }),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vv-reader-ja.speakSelected", async () => {
      await launchSpeaker();
    }),
  );
}

export function deactivate() {}
