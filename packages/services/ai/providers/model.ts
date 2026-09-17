import type { LanguageModel } from "ai";

export type AIProviderName = "google";

export interface AIModelConfig {
  provider: AIProviderName;
  model: string;
}

export interface AIProvider {
  readonly name: AIProviderName;

  getModel(config: AIModelConfig): LanguageModel;
}
