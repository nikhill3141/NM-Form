import { GoogleProvider } from "./google";

import type { AIProvider, AIProviderName } from "./model";

const providers: Record<AIProviderName, AIProvider> = {
  google: new GoogleProvider(),
};

export function getAIProvider(provider: AIProviderName): AIProvider {
  const selectedProvider = providers[provider];

  if (!selectedProvider) {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  return selectedProvider;
}
