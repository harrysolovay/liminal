export class ModelConfig {
  static make(config?: ModelConfig) {
    if (config) {
      return Object.assign(new ModelConfig(), {
        ...this,
        logitBias: { ...config.logitBias },
        sampling: {
          ...config.sampling,
          stopSequences: [...(config.sampling?.stopSequences ?? [])],
          penalty: { ...config.sampling?.penalty },
        },
      })
    }
    return new ModelConfig()
  }

  /** Seed used for deterministic sampling. */
  declare seed?: number
  /** Logit bias modifies the likelihood of specific tokens appearing. */
  declare logitBias?: Record<string, number>
  /** Sampling configuration. */
  declare sampling?: SamplerConfig
}

export interface SamplerConfig {
  /** The maximum number of tokens to generate. */
  maxTokens?: number
  /** Temperature controls randomness in generation (0.0-2.0). */
  temperature?: number
  /** Cumulative probability cutoff for nucleus sampling (0.0-1.0). */
  topP?: number
  /** The number of tokens to consider in top-k sampling. */
  topk?: number
  /** Stop sequences is the list of sequences to stop generation. */
  stopSequences?: Array<string>
  /** Penalty configuration. */
  penalty?: PenaltyConfig
}

export interface PenaltyConfig {
  /** Presence penalty adjusts the likelihood of token repetition (-2.0 to 2.0). */
  presence?: number
  /** Frequency penalty penalizes tokens based on their frequency (-2.0 to 2.0). */
  frequency?: number
  /** Repetition penalty range defines how many tokens back repetition penalties apply. */
  repetitionRange?: number
}
