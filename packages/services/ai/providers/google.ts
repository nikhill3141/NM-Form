import { google } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

import type { AIModelConfig, AIProvider } from "./model";

export class GoogleProvider implements AIProvider {
  readonly name = "google" as const;

  getModel(config: AIModelConfig): LanguageModel {
    return google(config.model) as LanguageModel;
  }
}
