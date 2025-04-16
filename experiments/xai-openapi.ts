export const xai = {
  openapi: "3.1.0",
  info: {
    title: "xAI's REST API",
    description: "REST API for xAI compatible with other providers.",
    license: { name: "" },
    version: "1.0.0",
  },
  paths: {
    "/v1/api-key": {
      get: {
        tags: ["v1"],
        summary:
          "Get information about an API key, including name, status, permissions and users who created or modified this key.",
        operationId: "handle_get_api_key_info_request",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiKey" },
                example: {
                  redacted_api_key: "xai-...b14o",
                  user_id: "59fbe5f2-040b-46d5-8325-868bb8f23eb2",
                  name: "My API Key",
                  create_time: "2024-01-01T12:55:18.139305Z",
                  modify_time: "2024-08-28T17:20:12.343321Z",
                  modified_by: "3d38b4dc-4eb7-4785-ae26-c3fa8997ffc7",
                  team_id: "5ea6f6bd-7815-4b8a-9135-28b2d7ba6722",
                  acls: ["api-key:model:*", "api-key:endpoint:*"],
                  api_key_id: "ae1e1841-4326-4b36-a8a9-8a1a7237db11",
                  team_blocked: false,
                  api_key_blocked: false,
                  api_key_disabled: false,
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/chat/completions": {
      post: {
        tags: ["v1"],
        summary:
          "Create a chat response from text/image chat prompts. This is the endpoint for making requests to chat and image understanding models.",
        operationId: "handle_generic_completion_request",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ChatRequest" },
              example:
                "{\n            \"messages\": [\n                {\n                \"role\": \"system\",\n                \"content\": \"You are a helpful assistant that can answer questions and help with tasks.\"\n                },\n                {\n                \"role\": \"user\",\n                \"content\": \"What is 101*3?\"\n                }\n            ],\n            \"reasoning_effort\": \"low\",\n            \"model\": \"grok-3-mini-fast-latest\"\n            }",
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChatResponse" },
                example: {
                  id: "a733959b-03c4-4944-b53a-af900075ba57",
                  object: "chat.completion",
                  created: 1743770302,
                  model: "grok-3-mini-fast-beta",
                  choices: [
                    {
                      index: 0,
                      message: {
                        role: "assistant",
                        content: "101 multiplied by 3 equals 303.",
                        reasoning_content:
                          "First, the user asked: \"What is 101*3?\" This is a simple multiplication question.\n\nI need to calculate 101 multiplied by 3. Let me do that mentally: 101 times 3 is 303.\n\nTo double-check: 100 times 3 is 300, and 1 times 3 is 3, so 300 + 3 = 303. Yes, that's correct.\n\nAs a helpful assistant, I should respond clearly and directly. Since this is straightforward, I don't need to add extra fluff unless it's necessary.\n\nThe system prompt says: \"You are a helpful assistant that can answer questions and help with tasks.\" So, answering directly fits.\n\nI should ensure my response is polite and engaging, but keep it concise.\n\nPossible response: \"101 multiplied by 3 equals 303.\"\n\nI could make it a bit more conversational: \"Sure, let me calculate that for you. 101 times 3 is 303.\"\n\nSince the user might be testing basic math, I could explain briefly, but that might be overkill for such a simple operation.\n\nFinally, structure the response: Start with the answer, and if needed, add any follow-up.\n\nResponse: \"The result of 101 multiplied by 3 is 303.\"",
                        refusal: null,
                      },
                      finish_reason: "stop",
                    },
                  ],
                  usage: {
                    prompt_tokens: 32,
                    completion_tokens: 10,
                    total_tokens: 299,
                    prompt_tokens_details: {
                      text_tokens: 32,
                      audio_tokens: 0,
                      image_tokens: 0,
                      cached_tokens: 0,
                    },
                    completion_tokens_details: {
                      reasoning_tokens: 257,
                      audio_tokens: 0,
                      accepted_prediction_tokens: 0,
                      rejected_prediction_tokens: 0,
                    },
                  },
                  system_fingerprint: "fp_11dc627712",
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
          "422": {
            description: "Unprocessable Entity. There are missing fields in the request body.",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/chat/deferred-completion/{request_id}": {
      get: {
        tags: ["v1"],
        summary: "Tries to fetch a result for a previously-started deferred completion.",
        operationId: "handle_get_deferred_completion_request",
        parameters: [
          {
            name: "request_id",
            in: "path",
            description: "The deferred request id returned by a previous deferred chat request.",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChatResponse" },
                example: {
                  id: "335b92e4-afa5-48e7-b99c-b9a4eabc1c8e",
                  object: "chat.completion",
                  created: 1743770624,
                  model: "grok-3-fast-beta",
                  choices: [
                    {
                      index: 0,
                      message: {
                        role: "assistant",
                        content: "101 multiplied by 3 is 303.",
                        refusal: null,
                      },
                      finish_reason: "stop",
                    },
                  ],
                  usage: {
                    prompt_tokens: 31,
                    completion_tokens: 11,
                    total_tokens: 42,
                    prompt_tokens_details: {
                      text_tokens: 31,
                      audio_tokens: 0,
                      image_tokens: 0,
                      cached_tokens: 0,
                    },
                    completion_tokens_details: {
                      reasoning_tokens: 0,
                      audio_tokens: 0,
                      accepted_prediction_tokens: 0,
                      rejected_prediction_tokens: 0,
                    },
                  },
                  system_fingerprint: "fp_156d35dcaa",
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
          "404": {
            description: "Not found. No deferred completion could be found with the given request_id.",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/complete": {
      post: {
        tags: ["v1"],
        summary: "(Legacy) Create a text completion response. This endpoint is compatible with the Anthropic API.",
        operationId: "handle_generic_complete_request",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CompleteRequest" },
              example:
                "{\n          \"model\": \"grok-3-fast-beta\",\n          \"max_tokens_to_sample\": 8,\n          \"temperature\": 0.1,\n          \"prompt\": \"\\n\\nHuman: Hello, how are you?\\n\\nAssistant:\"\n        }",
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CompleteResponse" },
                example: {
                  type: "completion",
                  id: "982044c5-760c-4c8d-8936-f906b5cedc26",
                  completion: " Hey there! I'm doing great, thanks",
                  stop_reason: "max_tokens",
                  model: "grok-3-fast-beta",
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
          "422": {
            description: "Unprocessable Entity. There are missing fields in the request body.",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/completions": {
      post: {
        tags: ["v1"],
        summary: "(Legacy) Create a text completion response for a given prompt. Replaced by /v1/chat/completions",
        operationId: "handle_sample_request",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SampleRequest" },
              example:
                "{\n          \"prompt\": \"1, 2, 3, 4, \",\n          \"model\": \"grok-3-fast-latest\",\n          \"max_tokens\": 3\n        }",
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SampleResponse" },
                example: {
                  id: "873492b3-6144-4279-ac2e-2c45242c5ce6",
                  object: "text_completion",
                  created: 1743771779,
                  model: "grok-3-fast-beta",
                  choices: [{ index: 0, text: "5, ", finish_reason: "length" }],
                  usage: {
                    prompt_tokens: 12,
                    completion_tokens: 3,
                    total_tokens: 15,
                    prompt_tokens_details: {
                      text_tokens: 12,
                      audio_tokens: 0,
                      image_tokens: 0,
                      cached_tokens: 0,
                    },
                    completion_tokens_details: {
                      reasoning_tokens: 0,
                      audio_tokens: 0,
                      accepted_prediction_tokens: 0,
                      rejected_prediction_tokens: 0,
                    },
                  },
                  system_fingerprint: "fp_156d35dcaa",
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
          "422": {
            description: "Unprocessable Entity. There are missing fields in the request body.",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/embedding-models": {
      get: {
        tags: ["v1"],
        summary:
          "List all embedding models available to the authenticating API key with full information. Additional information compared to /v1/models includes modalities, pricing, fingerprint and alias(es).",
        operationId: "handle_embedding_models_list_request",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ListEmbeddingModelsResponse" },
                example: {
                  models: [
                    {
                      id: "v1",
                      fingerprint: "fp_df37966059",
                      created: 1725148800,
                      object: "model",
                      owned_by: "xai",
                      version: "0.1.0",
                      input_modalities: ["text"],
                      prompt_text_token_price: 100,
                      prompt_image_token_price: 0,
                      aliases: [],
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/embedding-models/{model_id}": {
      get: {
        tags: ["v1"],
        summary: "Get full information about an embedding model with its model_id.",
        operationId: "handle_embedding_model_get_request",
        parameters: [
          {
            name: "model_id",
            in: "path",
            description: "ID of the model to get.",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EmbeddingModel" },
                example: {
                  id: "v1",
                  created: 1725148800,
                  object: "model",
                  owned_by: "xai",
                  version: "0.1.0",
                  input_modalities: ["text"],
                  prompt_text_token_price: 10,
                  prompt_image_token_price: 0,
                  aliases: [],
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
          "404": { description: "Model not found" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/embeddings": {
      post: {
        tags: ["v1"],
        summary:
          "Create an embedding vector representation corresponding to the input text. This is the endpoint for making requests to embedding models.",
        operationId: "handle_embedding_request",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EmbeddingRequest" },
              example:
                "{\n            \"input\": [\"This is an example content to embed...\"],\n            \"model\": \"v1\",\n            \"encoding_format\": \"float\"\n        }",
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EmbeddingResponse" },
                example: {
                  object: "list",
                  model: "v1",
                  data: [
                    {
                      index: 0,
                      embedding: [0.01567895, 0.063257694, 0.045925662],
                      object: "embedding",
                    },
                  ],
                  usage: { prompt_tokens: 1, total_tokens: 1 },
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
          "422": {
            description: "Unprocessable Entity. There are missing fields in the request body.",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/image-generation-models": {
      get: {
        tags: ["v1"],
        summary:
          "List all image generation models available to the authenticating API key with full information. Additional information compared to /v1/models includes modalities, pricing, fingerprint and alias(es).",
        operationId: "handle_image_generation_models_list_request",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ListImageGenerationModelsResponse" },
                example: {
                  models: [
                    {
                      id: "grok-2-image",
                      fingerprint: "fp_ca78641a52",
                      max_prompt_length: 1024,
                      created: 1738961600,
                      object: "model",
                      owned_by: "xai",
                      version: "1.0.0",
                      prompt_text_token_price: 100000,
                      prompt_image_token_price: 100000,
                      generated_image_token_price: 100000,
                      aliases: [],
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/image-generation-models/{model_id}": {
      get: {
        tags: ["v1"],
        summary: "Get full information about an image generation model with its model_id.",
        operationId: "handle_image_generation_model_get_request",
        parameters: [
          {
            name: "model_id",
            in: "path",
            description: "ID of the model to get.",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ImageGenerationModel" },
                example: {
                  id: "grok-2-image",
                  fingerprint: "fp_ca78641a52",
                  max_prompt_length: 1024,
                  created: 1737961600,
                  object: "model",
                  owned_by: "xai",
                  version: "1.0.0",
                  prompt_text_token_price: 100000,
                  prompt_image_token_price: 100000,
                  generated_image_token_price: 100000,
                  aliases: [],
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
          "404": { description: "Model not found" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/images/generations": {
      post: {
        tags: ["v1"],
        summary:
          "Generate an image based on a prompt. This is the endpoint for making generation requests to image generation models.",
        operationId: "handle_generate_image_request",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/GenerateImageRequest" },
              example:
                "{\n            \"prompt\": \"A cat in a tree\",\n            \"model\": \"grok-2-image\",\n            \"response_format\": \"url\",\n            \"n\": 2\n          }",
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GeneratedImageResponse" },
                example: {
                  data: [
                    {
                      url: "...",
                      revised_prompt:
                        "A high-resolution photograph of a cat perched on a branch in a lush, green tree during the daytime. The cat, possibly a tabby with distinctive fur patterns, is the central focus of the image, looking curiously forward with its fur slightly ruffled. The background features a serene park setting with other trees and a clear sky, ensuring no distractions from the main subject. The lighting is soft and natural, enhancing the realistic and calm atmosphere of the scene.<|separator|><|eos|>",
                    },
                    {
                      url: "...",
                      revised_prompt:
                        "1. A high-resolution photograph of a gray tabby cat perched on a branch of a lush, green tree in a suburban backyard during the day. The cat is facing forward, with its fur slightly ruffled by a gentle breeze. The background features other trees and a distant house, all slightly out of focus to emphasize the cat. The lighting is natural, with sunlight filtering through the leaves, creating a serene and realistic setting. The composition focuses primarily on the cat, ensuring it remains the central subject of the image.<|separator|><|eos|>",
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
          "422": {
            description: "Unprocessable Entity. There are missing fields in the request body.",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/language-models": {
      get: {
        tags: ["v1"],
        summary:
          "List all chat and image understanding models available to the authenticating API key with full information. Additional information compared to /v1/models includes modalities, pricing, fingerprint and alias(es).",
        operationId: "handle_language_models_list_request",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ListLanguageModelsResponse" },
                example: {
                  models: [
                    {
                      id: "grok-3-beta",
                      fingerprint: "fp_fcf5abc12d",
                      created: 1743724800,
                      object: "model",
                      owned_by: "xai",
                      version: "1.0.0",
                      input_modalities: ["text"],
                      output_modalities: ["text"],
                      prompt_text_token_price: 20000,
                      cached_prompt_text_token_price: 0,
                      prompt_image_token_price: 0,
                      completion_text_token_price: 100000,
                      aliases: ["grok-3", "grok-3-latest"],
                    },
                    {
                      id: "grok-3-fast-beta",
                      fingerprint: "fp_156d35dcaa",
                      created: 1743724800,
                      object: "model",
                      owned_by: "xai",
                      version: "1.0.0",
                      input_modalities: ["text"],
                      output_modalities: ["text"],
                      prompt_text_token_price: 20000,
                      cached_prompt_text_token_price: 0,
                      prompt_image_token_price: 0,
                      completion_text_token_price: 100000,
                      aliases: ["grok-3-fast", "grok-3-fast-latest"],
                    },
                    {
                      id: "grok-3-mini-beta",
                      fingerprint: "fp_f6d3cc7ca1",
                      created: 1743724800,
                      object: "model",
                      owned_by: "xai",
                      version: "1.0.0",
                      input_modalities: ["text"],
                      output_modalities: ["text"],
                      prompt_text_token_price: 20000,
                      cached_prompt_text_token_price: 0,
                      prompt_image_token_price: 0,
                      completion_text_token_price: 100000,
                      aliases: ["grok-3-mini", "grok-3-mini-latest"],
                    },
                    {
                      id: "grok-3-mini-fast-beta",
                      fingerprint: "fp_11dc627712",
                      created: 1743724800,
                      object: "model",
                      owned_by: "xai",
                      version: "1.0.0",
                      input_modalities: ["text"],
                      output_modalities: ["text"],
                      prompt_text_token_price: 20000,
                      cached_prompt_text_token_price: 0,
                      prompt_image_token_price: 0,
                      completion_text_token_price: 100000,
                      aliases: ["grok-3-mini-fast", "grok-3-mini-fast-latest"],
                    },
                    {
                      id: "grok-2-1212",
                      fingerprint: "fp_1a5ab39b2d",
                      created: 1733961600,
                      object: "model",
                      owned_by: "xai",
                      version: "1.0.0",
                      input_modalities: ["text"],
                      output_modalities: ["text"],
                      prompt_text_token_price: 20000,
                      prompt_image_token_price: 0,
                      completion_text_token_price: 100000,
                      aliases: ["grok-2", "grok-2-latest"],
                    },
                    {
                      id: "grok-2-vision-1212",
                      fingerprint: "fp_daba7546e5",
                      created: 1733961600,
                      object: "model",
                      owned_by: "xai",
                      version: "0.1.0",
                      input_modalities: ["text", "image"],
                      output_modalities: ["text"],
                      prompt_text_token_price: 20000,
                      prompt_image_token_price: 20000,
                      completion_text_token_price: 100000,
                      aliases: [],
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/language-models/{model_id}": {
      get: {
        tags: ["v1"],
        summary: "Get full information about a chat or image understanding model with its model_id.",
        operationId: "handle_language_model_get_request",
        parameters: [
          {
            name: "model_id",
            in: "path",
            description: "ID of the model to get.",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LanguageModel" },
                example: {
                  id: "grok-3-fast-beta",
                  fingerprint: "fp_156d35dcaa",
                  created: 1743724800,
                  object: "model",
                  owned_by: "xai",
                  version: "1.0.0",
                  input_modalities: ["text"],
                  output_modalities: ["text"],
                  prompt_text_token_price: 20000,
                  cached_prompt_text_token_price: 0,
                  prompt_image_token_price: 0,
                  completion_text_token_price: 100000,
                  aliases: ["grok-3-fast", "grok-3-fast-latest"],
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
          "404": { description: "Model not found" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/messages": {
      post: {
        tags: ["v1"],
        summary: "Create a messages response. This endpoint is compatible with the Anthropic API.",
        operationId: "handle_generic_messages_request",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessageRequest" },
              example:
                "{\n          \"model\": \"grok-3-fast-latest\",\n          \"max_tokens\": 32,\n          \"messages\": [\n            {\"role\": \"user\", \"content\": \"Hello, world\"}\n          ]\n        }",
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
                example: {
                  id: "4f224bfb-9d53-4c82-b40a-b7cd80831ec2",
                  type: "message",
                  role: "assistant",
                  content: [
                    {
                      type: "text",
                      text:
                        "Hello there! \"Hello, world\" is a classic, isn't it? Whether you're just saying hi or channeling your inner coder, I'm happy to greet you back",
                    },
                  ],
                  model: "grok-3-fast-beta",
                  stop_reason: "max_tokens",
                  stop_sequence: null,
                  usage: {
                    input_tokens: 9,
                    cache_creation_input_tokens: 0,
                    cache_read_input_tokens: 0,
                    output_tokens: 32,
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
          "422": {
            description: "Unprocessable Entity. There are missing fields in the request body.",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/models": {
      get: {
        tags: ["v1"],
        summary:
          "List all models available to the authenticating API key with minimalized information, including model names (ID), creation times, etc.",
        operationId: "handle_models_list_request",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ListModelsResponse" },
                example: {
                  data: [
                    {
                      id: "grok-3-beta",
                      created: 1743724800,
                      object: "model",
                      owned_by: "xai",
                    },
                    {
                      id: "grok-3-fast-beta",
                      created: 1743724800,
                      object: "model",
                      owned_by: "xai",
                    },
                    {
                      id: "grok-3-mini-beta",
                      created: 1743724800,
                      object: "model",
                      owned_by: "xai",
                    },
                    {
                      id: "grok-3-mini-fast-beta",
                      created: 1743724800,
                      object: "model",
                      owned_by: "xai",
                    },
                    {
                      id: "grok-2-image-1212",
                      created: 1736726400,
                      object: "model",
                      owned_by: "xai",
                    },
                    {
                      id: "grok-2-1212",
                      created: 1733961600,
                      object: "model",
                      owned_by: "xai",
                    },
                    {
                      id: "grok-2-vision-1212",
                      created: 1733961600,
                      object: "model",
                      owned_by: "xai",
                    },
                  ],
                  object: "list",
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/models/{model_id}": {
      get: {
        tags: ["v1"],
        summary: "Get minimalized information about a model with its model_id.",
        operationId: "handle_model_get_request",
        parameters: [
          {
            name: "model_id",
            in: "path",
            description: "ID of the model to get.",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Model" },
                example: {
                  id: "grok-3-fast-beta",
                  created: 1743724800,
                  object: "model",
                  owned_by: "xai",
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
          "404": { description: "Model not found" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/v1/tokenize-text": {
      post: {
        tags: ["v1"],
        summary: "Tokenize text with the specified model",
        operationId: "handle_tokenize_text_request",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TokenizeRequest" },
              example:
                "{\n          \"text\": \"Hello world!\",\n          \"model\": \"grok-3-fast-latest\"\n        }",
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TokenizeResponse" },
                example: {
                  token_ids: [
                    {
                      token_id: 13902,
                      string_token: "Hello",
                      token_bytes: [72, 101, 108, 108, 111],
                    },
                    {
                      token_id: 1749,
                      string_token: " world",
                      token_bytes: [32, 119, 111, 114, 108, 100],
                    },
                    { token_id: 161, string_token: "!", token_bytes: [33] },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Bad request. The request is invalid or an invalid API key is provided.",
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
  },
  components: {
    schemas: {
      ApiKey: {
        type: "object",
        required: [
          "redacted_api_key",
          "user_id",
          "name",
          "create_time",
          "modify_time",
          "modified_by",
          "team_id",
          "acls",
          "api_key_id",
          "team_blocked",
          "api_key_blocked",
          "api_key_disabled",
        ],
        properties: {
          acls: {
            type: "array",
            items: { type: "string" },
            description:
              "A list of ACLs authorized with the API key, e.g. `\"api-key:endpoint:*\"`, `\"api-key:model:*\"`.",
          },
          api_key_blocked: {
            type: "boolean",
            description: "Indicates whether the API key is blocked.",
          },
          api_key_disabled: {
            type: "boolean",
            description: "Indicates whether the API key is disabled.",
          },
          api_key_id: { type: "string", description: "ID of the API key." },
          create_time: {
            type: "string",
            description: "Creation time of the API key in Unix timestamp.",
          },
          modified_by: {
            type: "string",
            description: "User ID of the user who last modified the API key.",
          },
          modify_time: {
            type: "string",
            description: "Last modification time of the API key in Unix timestamp.",
          },
          name: { type: "string", description: "The name of the API key specified by user." },
          redacted_api_key: { type: "string", description: "The redacted API key." },
          team_blocked: {
            type: "boolean",
            description: "Indicates whether the team that owns the API key.",
          },
          team_id: {
            type: "string",
            description: "The team ID of the team that owns the API key.",
          },
          user_id: { type: "string", description: "User ID the API key belongs to." },
        },
      },
      ChatRequest: {
        type: "object",
        description: "The chat request body for `/v1/chat/completions` endpoint.",
        required: ["model", "messages"],
        properties: {
          deferred: {
            type: ["boolean", "null"],
            description:
              "If set to `true`, the request returns a `request_id`. You can then get the deferred response by GET `/v1/chat/deferred-completion/{request_id}`.",
            default: false,
          },
          frequency_penalty: {
            type: ["number", "null"],
            format: "float",
            description:
              "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.",
            default: 0,
            example: 0.5,
            maximum: 2,
            minimum: -2,
          },
          logit_bias: {
            type: ["object", "null"],
            description:
              "(Unsupported) A JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.",
            additionalProperties: { type: "number", format: "float" },
            propertyNames: { type: "integer", format: "int32" },
          },
          logprobs: {
            type: ["boolean", "null"],
            description:
              "Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the content of message.",
            default: false,
          },
          max_completion_tokens: {
            type: ["integer", "null"],
            format: "int32",
            description: "The maximum number of completion tokens returned to the user.",
            example: 8192,
          },
          max_tokens: {
            type: ["integer", "null"],
            format: "int32",
            description:
              "The maximum number of tokens that can be generated in the chat completion. This value can be used to control costs for text generated via API. The default value will be 131,072 if not specified.",
            example: 8192,
          },
          messages: {
            type: "array",
            items: { $ref: "#/components/schemas/Message" },
            description:
              "A list of messages that make up the the chat conversation. Different models support different message types, such as image and text.",
          },
          model: {
            type: "string",
            description:
              "Model name for the model to use. Obtainable from https://console.x.ai/team/default/models or https://docs.x.ai/docs/models.",
            example: "grok-3-latest",
          },
          n: {
            type: ["integer", "null"],
            format: "int32",
            description:
              "How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep n as 1 to minimize costs.",
            default: 1,
            example: 1,
            minimum: 1,
          },
          presence_penalty: {
            type: ["number", "null"],
            format: "float",
            description:
              "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.",
            default: 0,
            example: 0.1,
            maximum: 2,
            minimum: -2,
          },
          reasoning_effort: {
            type: ["string", "null"],
            description:
              "Constrains effort on reasoning for reasoning models. Possible values are `low`, `medium` and\n`high`. Default to `low`. The model natively offers `low` and `high`. For compatibility, `medium` redirects to `high`.",
            default: "low",
            example: "low",
          },
          response_format: {
            oneOf: [
              { type: "null" },
              {
                $ref: "#/components/schemas/ResponseFormat",
                description:
                  "An object specifying the format that the model must output. Specify `{ \"type\": \"json_object\" }` for JSON output, or `{ \"type\": \"json_schema\", \"json_schema\": {...} }` for structured outputs.",
              },
            ],
          },
          seed: {
            type: ["integer", "null"],
            format: "int32",
            description:
              "If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same `seed` and parameters should return the same result. Determinism is not guaranteed, and you should refer to the `system_fingerprint` response parameter to monitor changes in the backend.",
          },
          stop: {
            type: ["array", "null"],
            items: { type: "string" },
            description: "Up to 4 sequences where the API will stop generating further tokens.",
          },
          stream: {
            type: ["boolean", "null"],
            description:
              "If set, partial message deltas will be sent. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a `data: [DONE]` message.",
            default: false,
            example: true,
          },
          stream_options: {
            oneOf: [
              { type: "null" },
              {
                $ref: "#/components/schemas/StreamOptions",
                description: "Options for streaming response. Only set this when you set `stream: true`.",
              },
            ],
          },
          temperature: {
            type: ["number", "null"],
            format: "float",
            description:
              "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.",
            default: 1,
            example: 0.2,
            maximum: 2,
            minimum: 0,
          },
          tool_choice: {
            oneOf: [
              { type: "null" },
              {
                $ref: "#/components/schemas/ToolChoice",
                description:
                  "Controls which (if any) tool is called by the model. `none` means the model will not call any tool and instead generates a message. auto means the model can pick between generating a message or calling one or more tools. required means the model must call one or more tools. Specifying a particular tool via `{\"type\": \"function\", \"function\": {\"name\": \"my_function\"}}` forces the model to call that tool. `none` is the default when no tools are present. `auto` is the default if tools are present.",
              },
            ],
          },
          tools: {
            type: ["array", "null"],
            items: { $ref: "#/components/schemas/Tool" },
            description:
              "A list of tools the model may call in JSON-schema. Currently, only functions are supported as a tool. Use this to provide a list of functions the model may generate JSON inputs for. A max of 128 functions are supported.",
            maxItems: 128,
          },
          top_logprobs: {
            type: ["integer", "null"],
            format: "int32",
            description:
              "An integer between 0 and 8 specifying the number of most likely tokens to return at each token position, each with an associated log probability. logprobs must be set to true if this parameter is used.",
            maximum: 8,
            minimum: 0,
          },
          top_p: {
            type: ["number", "null"],
            format: "float",
            description:
              "An alternative to sampling with `temperature`, called nucleus sampling, where the model considers the results of the tokens with `top_p` probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. It is generally recommended to alter this or `temperature` but not both.",
            default: 1,
            maximum: 1,
            exclusiveMinimum: 0,
          },
          user: {
            type: ["string", "null"],
            description:
              "A unique identifier representing your end-user, which can help xAI to monitor and detect abuse.",
          },
        },
      },
      ChatResponse: {
        type: "object",
        description: "The chat response body for `/v1/chat/completions` endpoint.",
        required: ["id", "object", "created", "model", "choices"],
        properties: {
          choices: {
            type: "array",
            items: { $ref: "#/components/schemas/Choice" },
            description:
              "A list of response choices from the model. The length corresponds to the `n` in request body (default to 1).",
          },
          created: {
            type: "integer",
            format: "int64",
            description: "The chat completion creation time in Unix timestamp.",
          },
          id: { type: "string", description: "A unique ID for the chat response." },
          model: { type: "string", description: "Model ID used to create chat completion." },
          object: {
            type: "string",
            description: "The object type, which is always `\"chat.response\"`.",
          },
          system_fingerprint: {
            type: ["string", "null"],
            description: "System fingerprint, used to indicate xAI system configuration changes.",
          },
          usage: {
            oneOf: [
              { type: "null" },
              { $ref: "#/components/schemas/Usage", description: "Token usage information." },
            ],
          },
        },
      },
      ChatResponseChunk: {
        type: "object",
        required: ["id", "object", "created", "model", "choices"],
        properties: {
          choices: {
            type: "array",
            items: { $ref: "#/components/schemas/ChoiceChunk" },
            description:
              "A list of response choices from the model. The length corresponds to the `n` in request body (default to 1).",
          },
          created: {
            type: "integer",
            format: "int64",
            description: "The chat completion creation time in Unix timestamp.",
          },
          id: { type: "string", description: "A unique ID for the chat response chunk." },
          model: {
            type: "string",
            description: "The model ID used to create chat completion.",
          },
          object: {
            type: "string",
            description: "The object type, which is always `\"chat.completion.chunk\"`.",
          },
          system_fingerprint: {
            type: ["string", "null"],
            description: "System fingerprint, used to indicate xAI system configuration changes.",
          },
          usage: {
            oneOf: [
              { type: "null" },
              { $ref: "#/components/schemas/Usage", description: "Token usage information." },
            ],
          },
        },
      },
      Choice: {
        type: "object",
        required: ["index", "message"],
        properties: {
          finish_reason: {
            type: ["string", "null"],
            description:
              "Finish reason. `\"stop\"` means the inference has reached a model-defined or user-supplied stop sequence in `stop`. `\"length\"` means the inference result has reached models' maximum allowed token length or user defined value in `max_tokens`. `\"end_turn\"` or `null` in streaming mode when the chunk is not the last.",
          },
          index: {
            type: "integer",
            format: "int32",
            description: "Index of the choice within the response choices, starting from 0.",
          },
          logprobs: {
            oneOf: [
              { type: "null" },
              {
                $ref: "#/components/schemas/LogProbs",
                description: "The log probabilities of each output token returned in the content of message.",
              },
            ],
          },
          message: {
            $ref: "#/components/schemas/ChoiceMessage",
            description: "The generated chat completion message.",
          },
        },
      },
      ChoiceChunk: {
        type: "object",
        required: ["index", "delta"],
        properties: {
          delta: {
            $ref: "#/components/schemas/Delta",
            description: "Additional difference (delta) of the result.",
          },
          finish_reason: {
            type: ["string", "null"],
            description:
              "Finish reason. `\"stop\"` means the inference has reached a model-defined or user-supplied stop sequence in `stop`. `\"length\"` means the inference result has reached models' maximum allowed token length or user defined value in `max_tokens`. `\"end_turn\"` or `null` in streaming mode when the chunk is not the last.",
          },
          index: { type: "integer", format: "int32", description: "Index of the choice." },
          logprobs: {
            oneOf: [
              { type: "null" },
              {
                $ref: "#/components/schemas/LogProbs",
                description: "The log probabilities of each output token returned in the content of message.",
              },
            ],
          },
        },
      },
      ChoiceMessage: {
        type: "object",
        required: ["role"],
        properties: {
          content: { type: ["string", "null"], description: "The content of the message." },
          reasoning_content: {
            type: ["string", "null"],
            description: "The reasoning trace generated by the model.",
          },
          refusal: {
            type: ["string", "null"],
            description:
              "The reason given by model if the model is unable to generate a response. null if model is able to generate.",
          },
          role: {
            type: "string",
            description: "The role that the message belongs to, the response from model is always `\"assistant\"`.",
          },
          tool_calls: {
            type: ["array", "null"],
            items: { $ref: "#/components/schemas/ToolCall" },
            description: "A list of tool calls asked by model for user to perform.",
          },
        },
      },
      CompleteRequest: {
        type: "object",
        description: "(Legacy) Anthropic compatible complete request on `/v1/complete` endpoint.",
        required: ["model", "prompt", "max_tokens_to_sample"],
        properties: {
          max_tokens_to_sample: {
            type: "integer",
            format: "int32",
            description: "The maximum number of tokens to generate before stopping.",
          },
          metadata: {
            oneOf: [
              { type: "null" },
              {
                $ref: "#/components/schemas/MessageMetadata",
                description: "An object describing metadata about the request.",
              },
            ],
          },
          model: { type: "string", description: "Model to use for completion." },
          prompt: {
            type: "string",
            description: "Prompt for the model to perform completion on.",
          },
          stop_sequences: {
            type: ["array", "null"],
            items: { type: "string" },
            description: "Up to 4 sequences where the API will stop generating further tokens.",
          },
          stream: {
            type: ["boolean", "null"],
            description:
              "(Unsupported) If set, partial message deltas will be sent. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a `data: [DONE]` message.",
          },
          temperature: {
            type: ["number", "null"],
            format: "float",
            description:
              "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.",
            default: 1,
            example: 0.2,
            maximum: 2,
            minimum: 0,
          },
          top_k: {
            type: ["integer", "null"],
            format: "int32",
            description:
              "(Unsupported) When generating next tokens, randomly selecting the next token from the k most likely options.",
          },
          top_p: {
            type: ["number", "null"],
            format: "float",
            description:
              "An alternative to sampling with `temperature`, called nucleus sampling, where the model considers the results of the tokens with `top_p` probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. It is generally recommended to alter this or `temperature` but not both.",
            default: 1,
            maximum: 1,
            exclusiveMinimum: 0,
          },
        },
      },
      CompleteResponse: {
        type: "object",
        description: "(Legacy) Anthropic compatible complete response on `/v1/complete` endpoint.",
        required: ["type", "id", "completion", "model"],
        properties: {
          completion: {
            type: "string",
            description: "The completion content up to and excluding stop sequences.",
          },
          id: { type: "string", description: "ID of the completion response." },
          model: { type: "string", description: "The model that handled the request." },
          stop_reason: {
            type: ["string", "null"],
            description:
              "The reason to stop completion. `\"stop_sequence\"` means the inference has reached a model-defined or user-supplied stop sequence in `stop`. `\"length\"` means the inference result has reached models' maximum allowed token length or user defined value in `max_tokens`. `\"end_turn\"` or `null` in streaming mode when the chunk is not the last.",
          },
          type: {
            type: "string",
            description: "Completion response object type. This is always `\"completion\"`.",
          },
        },
      },
      CompletionUsageDetail: {
        type: "object",
        description: "Details of completion usage.",
        required: [
          "reasoning_tokens",
          "audio_tokens",
          "accepted_prediction_tokens",
          "rejected_prediction_tokens",
        ],
        properties: {
          accepted_prediction_tokens: {
            type: "integer",
            format: "int32",
            description: "The number of tokens in the prediction that appeared in the completion.",
          },
          audio_tokens: {
            type: "integer",
            format: "int32",
            description: "Audio input tokens generated by the model.",
          },
          reasoning_tokens: {
            type: "integer",
            format: "int32",
            description: "Tokens generated by the model for reasoning.",
          },
          rejected_prediction_tokens: {
            type: "integer",
            format: "int32",
            description: "The number of tokens in the prediction that did not appear in the completion.",
          },
        },
      },
      Content: {
        oneOf: [
          { type: "string", description: "Text prompt." },
          {
            type: "array",
            items: { $ref: "#/components/schemas/ContentPart" },
            description: "An array of content parts of different types, such as image, text or text file.",
          },
        ],
        description: "Content of each chat message.",
      },
      ContentPart: {
        type: "object",
        required: ["type"],
        properties: {
          detail: {
            type: ["string", "null"],
            description: "Specifies the detail level of the image.",
          },
          image_url: {
            oneOf: [
              { type: "null" },
              {
                $ref: "#/components/schemas/ImageUrl",
                description: "A public URL of image prompt, only available for vision models.",
              },
            ],
          },
          text: { type: ["string", "null"], description: "Text prompt." },
          text_file: {
            type: ["string", "null"],
            description: "File path to a text file to be used as prompt.",
          },
          type: { type: "string", description: "The type of the content part." },
        },
      },
      Delta: {
        type: "object",
        required: ["role"],
        properties: {
          content: { type: ["string", "null"] },
          reasoning_content: { type: ["string", "null"] },
          role: { type: "string" },
          tool_calls: {
            type: ["array", "null"],
            items: { $ref: "#/components/schemas/ToolCall" },
          },
        },
      },
      EditImageRequest: {
        type: "object",
        description: "Request for editing image",
        required: ["prompt", "image"],
        properties: {
          image: {
            $ref: "#/components/schemas/ImageUrl",
            description: "Input image to perform edit on.",
          },
          mask: { oneOf: [{ type: "null" }, { $ref: "#/components/schemas/ImageUrl" }] },
          model: { type: ["string", "null"], description: "Model to be used." },
          n: {
            type: ["integer", "null"],
            format: "int32",
            description: "Number of image edits to be generated.",
          },
          prompt: { type: "string", description: "Prompt for image editing." },
          response_format: {
            type: ["string", "null"],
            description:
              "Response format to return the image in. Can be `url` or `b64_json`. If `b64_json` is specified, the image will be returned as a base64-encoded string instead of a url to the generated image file.",
            default: "url",
          },
          size: {
            type: ["string", "null"],
            description: "(Not supported) Size of the image.",
          },
          style: {
            type: ["string", "null"],
            description: "(Not supported) Style of the image.",
          },
          user: {
            type: ["string", "null"],
            description:
              "A unique identifier representing your end-user, which can help xAI to monitor and detect abuse.",
          },
        },
      },
      Embedding: {
        type: "object",
        required: ["index", "embedding", "object"],
        properties: {
          embedding: {
            $ref: "#/components/schemas/EmbeddingContent",
            description: "Embedding content.",
          },
          index: {
            type: "integer",
            format: "int32",
            description: "Index of the embedding object in the data list.",
          },
          object: {
            type: "string",
            description: "The object type, which is always `\"embedding\"`.",
          },
        },
      },
      EmbeddingContent: {
        oneOf: [
          { type: "string", description: "Embedding in base64 string." },
          {
            type: "array",
            items: { type: "number", format: "float" },
            description: "Embedding as an array of floats.",
          },
        ],
      },
      EmbeddingInput: {
        oneOf: [
          {
            type: "object",
            description:
              "A strings to be embedded. For best performance, prepend \"query: \" in front of query content and prepend \"passage: \" in front of passage/text",
            required: ["String"],
            properties: {
              String: {
                type: "string",
                description:
                  "A strings to be embedded. For best performance, prepend \"query: \" in front of query content and prepend \"passage: \" in front of passage/text",
              },
            },
          },
          {
            type: "object",
            description: "An array of strings to be embedded",
            required: ["StringArray"],
            properties: {
              StringArray: {
                type: "array",
                items: { type: "string" },
                description: "An array of strings to be embedded",
              },
            },
          },
          {
            type: "object",
            description: "A token in integer to be embedded",
            required: ["Ints"],
            properties: {
              Ints: {
                type: "array",
                items: { type: "integer", format: "int32" },
                description: "A token in integer to be embedded",
              },
            },
          },
          {
            type: "object",
            description: "An array of tokens in integers to be embedded",
            required: ["IntsArray"],
            properties: {
              IntsArray: {
                type: "array",
                items: { type: "array", items: { type: "integer", format: "int32" } },
                description: "An array of tokens in integers to be embedded",
              },
            },
          },
        ],
      },
      EmbeddingModel: {
        type: "object",
        description: "Details of an embedding model",
        required: [
          "id",
          "fingerprint",
          "created",
          "object",
          "owned_by",
          "version",
          "input_modalities",
          "output_modalities",
          "prompt_text_token_price",
          "prompt_image_token_price",
          "aliases",
        ],
        properties: {
          aliases: {
            type: "array",
            items: { type: "string" },
            description: "Alias ID(s) of the model that user can use in a request's model field.",
          },
          created: {
            type: "integer",
            format: "int64",
            description: "Model creation time in Unix timestamp.",
          },
          fingerprint: {
            type: "string",
            description: "Fingerprint of the xAI system configuration hosting the model.",
          },
          id: {
            type: "string",
            description:
              "Model ID. Obtainable from https://console.x.ai/team/default/models or https://docs.x.ai/docs/models.",
          },
          input_modalities: {
            type: "array",
            items: { type: "string" },
            description: "The input modalities supported by the model.",
          },
          object: { type: "string", description: "Object type, should be model." },
          output_modalities: {
            type: "array",
            items: { type: "string" },
            description: "The output modalities supported by the model.",
          },
          owned_by: { type: "string", description: "Owner of the model." },
          prompt_image_token_price: {
            type: "integer",
            format: "int64",
            description: "Price of the prompt image token in USD cents per million token.",
          },
          prompt_text_token_price: {
            type: "integer",
            format: "int64",
            description: "Price of the prompt text token in USD cents per million token.",
          },
          version: { type: "string", description: "Version of the model." },
        },
      },
      EmbeddingRequest: {
        type: "object",
        required: ["input", "model"],
        properties: {
          dimensions: {
            type: ["integer", "null"],
            format: "int32",
            description: "The number of dimensions the resulting output embeddings should have.",
          },
          encoding_format: {
            type: ["string", "null"],
            description: "The format to return the embeddings in. Can be either `float` or `base64`.",
          },
          input: {
            $ref: "#/components/schemas/EmbeddingInput",
            description:
              "Input text to embed, encoded as a string or list of tokens. To embed multiple inputs in a single request, pass a list of strings or list of token lists. The total tokens in the input must not exceed the context window for the model and cannot be an empty string. If the input is a list, the maximum length of the list is 128.",
          },
          model: { type: "string", description: "ID of the model to use." },
          preview: {
            type: ["boolean", "null"],
            description: "Flag to use the new format of the API.",
          },
          user: {
            type: ["string", "null"],
            description:
              "A unique identifier representing your end-user, which can help xAI to monitor and detect abuse.",
          },
        },
      },
      EmbeddingResponse: {
        type: "object",
        required: ["object", "model", "data"],
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Embedding" },
            description: "A list of embedding objects.",
          },
          model: { type: "string", description: "Model ID used to create embedding." },
          object: {
            type: "string",
            description: "The object type of `data` field, which is always `\"list\"`.",
          },
          usage: {
            oneOf: [
              { type: "null" },
              {
                $ref: "#/components/schemas/EmbeddingUsage",
                description: "Token usage information.",
              },
            ],
          },
        },
      },
      EmbeddingUsage: {
        type: "object",
        required: ["prompt_tokens", "total_tokens"],
        properties: {
          prompt_tokens: {
            type: "integer",
            format: "int32",
            description: "Prompt token used.",
          },
          total_tokens: {
            type: "integer",
            format: "int32",
            description: "Total token used.",
          },
        },
      },
      Function: {
        type: "object",
        required: ["name", "arguments"],
        properties: { arguments: { type: "string" }, name: { type: "string" } },
      },
      FunctionCall: {
        type: "object",
        required: ["name", "arguments"],
        properties: {
          arguments: { type: "string", description: "Arguments available to the function." },
          name: { type: "string", description: "Name of the function." },
        },
      },
      FunctionChoice: {
        type: "object",
        description: "Function name.",
        required: ["name"],
        properties: { name: { type: "string" } },
      },
      FunctionDefinition: {
        type: "object",
        description: "Definition of the tool call made available to the model.",
        required: ["name", "parameters"],
        properties: {
          description: {
            type: ["string", "null"],
            description: "A description of the function to indicate to the model when to call it.",
          },
          name: {
            type: "string",
            description:
              "The name of the function. If the model calls the function, this name is used in the\nresponse.",
          },
          parameters: {
            description:
              "A JSON schema describing the function parameters. The model _should_ follow the schema,\nhowever, this is not enforced at the moment.",
          },
          strict: {
            type: ["boolean", "null"],
            description: "Not supported. Only maintained for compatibility reasons.",
          },
        },
      },
      GenerateImageRequest: {
        type: "object",
        description: "Request to generate image for `/v1/image/generations` endpoint",
        required: ["prompt"],
        properties: {
          model: { type: ["string", "null"], description: "Model to be used." },
          n: {
            type: ["integer", "null"],
            format: "int32",
            description: "Number of images to be generated",
            default: 1,
            maximum: 10,
            minimum: 1,
          },
          prompt: { type: "string", description: "Prompt for image generation." },
          quality: {
            type: ["string", "null"],
            description: "(Not supported) Quality of the image.",
          },
          response_format: {
            type: ["string", "null"],
            description:
              "Response format to return the image in. Can be url or b64_json. If b64_json is specified, the image will be returned as a base64-encoded string instead of a url to the generated image file.",
            default: "url",
          },
          size: {
            type: ["string", "null"],
            description: "(Not supported) Size of the image.",
          },
          style: {
            type: ["string", "null"],
            description: "(Not supported) Style of the image.",
          },
          user: {
            type: ["string", "null"],
            description:
              "A unique identifier representing your end-user, which can help xAI to monitor and detect abuse.",
          },
        },
      },
      GeneratedImage: {
        type: "object",
        description: "Generated images",
        required: ["revised_prompt"],
        properties: {
          b64_json: {
            type: ["string", "null"],
            description:
              "A base64-encoded string representation of the generated image in `jpeg` encoding, if `b64_json` is specified as `response_format` in the request.",
          },
          revised_prompt: {
            type: "string",
            description:
              "The revised prompt generated by a chat model from the original prompt. This prompt is used in the final image generation.",
          },
          url: {
            type: ["string", "null"],
            description:
              "A url to the generated image, if `response_format` is not specified or with `url` in the request.",
          },
        },
      },
      GeneratedImageResponse: {
        type: "object",
        description: "Image generation response for `/v1/image/generations` endpoint",
        required: ["data"],
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/GeneratedImage" },
            description: "A list of generated image objects.",
          },
        },
      },
      ImageGenerationModel: {
        type: "object",
        description: "Details of an image generation model",
        required: [
          "id",
          "fingerprint",
          "max_prompt_length",
          "created",
          "object",
          "owned_by",
          "version",
          "input_modalities",
          "output_modalities",
          "image_price",
          "aliases",
        ],
        properties: {
          aliases: {
            type: "array",
            items: { type: "string" },
            description: "Alias ID(s) of the model that user can use in a request's model field.",
          },
          created: {
            type: "integer",
            format: "int64",
            description: "Model creation time in Unix timestamp.",
          },
          fingerprint: {
            type: "string",
            description: "Fingerprint of the xAI system configuration hosting the model.",
          },
          id: { type: "string", description: "Model ID." },
          image_price: {
            type: "integer",
            format: "int64",
            description: "Price of a single image in USD cents.",
          },
          input_modalities: {
            type: "array",
            items: { type: "string" },
            description: "The input modalities supported by the model.",
          },
          max_prompt_length: { type: "integer", format: "int64" },
          object: {
            type: "string",
            description: "The object type, which is always `\"model\"`.",
          },
          output_modalities: {
            type: "array",
            items: { type: "string" },
            description: "The output modalities supported by the model.",
          },
          owned_by: { type: "string", description: "Owner of the model." },
          version: { type: "string", description: "Version of the model." },
        },
      },
      ImageUrl: {
        type: "object",
        description: "Image URL object of Image prompt",
        required: ["url"],
        properties: {
          detail: {
            type: ["string", "null"],
            description: "Specifies the detail level of the image.",
          },
          url: { type: "string", description: "URL of the image." },
        },
      },
      LanguageModel: {
        type: "object",
        description: "Details of a language model",
        required: [
          "id",
          "fingerprint",
          "created",
          "object",
          "owned_by",
          "version",
          "input_modalities",
          "output_modalities",
          "prompt_text_token_price",
          "cached_prompt_text_token_price",
          "prompt_image_token_price",
          "completion_text_token_price",
          "aliases",
        ],
        properties: {
          aliases: {
            type: "array",
            items: { type: "string" },
            description: "Alias ID(s) of the model that user can use in a request's model field.",
          },
          cached_prompt_text_token_price: {
            type: "integer",
            format: "int64",
            description: "Price of a prompt text token (in USD cents per million tokens) that was cached previously.",
          },
          completion_text_token_price: {
            type: "integer",
            format: "int64",
            description: "Price of the completion text token in USD cents per million token.",
          },
          created: {
            type: "integer",
            format: "int64",
            description: "Creation time of the model in Unix timestamp.",
          },
          fingerprint: {
            type: "string",
            description: "Fingerprint of the xAI system configuration hosting the model.",
          },
          id: {
            type: "string",
            description:
              "Model ID. Obtainable from https://console.x.ai/team/default/models or https://docs.x.ai/docs/models.",
          },
          input_modalities: {
            type: "array",
            items: { type: "string" },
            description: "The input modalities supported by the model, e.g. `\"text\"`, `\"image\"`.",
          },
          object: {
            type: "string",
            description: "The object type, which is always `\"model\"`.",
          },
          output_modalities: {
            type: "array",
            items: { type: "string" },
            description: "The output modalities supported by the model, e.g. `\"text\"`, `\"image\"`.",
          },
          owned_by: { type: "string", description: "Owner of the model." },
          prompt_image_token_price: {
            type: "integer",
            format: "int64",
            description: "Price of the prompt image token in USD cents per million token.",
          },
          prompt_text_token_price: {
            type: "integer",
            format: "int64",
            description: "Price of the prompt text token in USD cents per million token.",
          },
          version: { type: "string", description: "Version of the model." },
        },
      },
      ListEmbeddingModelsResponse: {
        type: "object",
        required: ["models"],
        properties: {
          models: {
            type: "array",
            items: { $ref: "#/components/schemas/EmbeddingModel" },
            description: "Array of available embedding models.",
          },
        },
      },
      ListImageGenerationModelsResponse: {
        type: "object",
        required: ["models"],
        properties: {
          models: {
            type: "array",
            items: { $ref: "#/components/schemas/ImageGenerationModel" },
            description: "Array of available image generation models.",
          },
        },
      },
      ListLanguageModelsResponse: {
        type: "object",
        required: ["models"],
        properties: {
          models: {
            type: "array",
            items: { $ref: "#/components/schemas/LanguageModel" },
            description: "Array of available language models.",
          },
        },
      },
      ListModelsResponse: {
        type: "object",
        required: ["data", "object"],
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Model" },
            description: "A list of models with with minimalized information.",
          },
          object: {
            type: "string",
            description: "The object type of `data` field, which is always `\"list\"`.",
          },
        },
      },
      LogProbs: {
        type: "object",
        properties: {
          content: {
            type: ["array", "null"],
            items: { $ref: "#/components/schemas/TokenLogProb" },
            description: "An array the log probabilities of each output token returned.",
          },
        },
      },
      Message: {
        oneOf: [
          {
            type: "object",
            description: "System message, usually instructions for the model to respond in a certain way.",
            required: ["content", "role"],
            properties: {
              content: {
                $ref: "#/components/schemas/Content",
                description: "System prompt content.",
              },
              name: {
                type: ["string", "null"],
                description:
                  "A unique identifier representing your end-user, which can help xAI to monitor and detect abuse.",
              },
              role: { type: "string", enum: ["system"] },
            },
          },
          {
            type: "object",
            description: "User message, typically request from user for the model to answer.",
            required: ["content", "role"],
            properties: {
              content: {
                $ref: "#/components/schemas/Content",
                description: "System prompt content.",
              },
              name: {
                type: ["string", "null"],
                description:
                  "A unique identifier representing your end-user, which can help xAI to monitor and detect abuse.",
              },
              role: { type: "string", enum: ["user"] },
            },
          },
          {
            type: "object",
            description: "Assistant role message, previous chat messages from the model.",
            required: ["role"],
            properties: {
              content: {
                oneOf: [
                  { type: "null" },
                  {
                    $ref: "#/components/schemas/Content",
                    description: "Assistant prompt content.",
                  },
                ],
              },
              name: {
                type: ["string", "null"],
                description:
                  "A unique identifier representing your end-user, which can help xAI to monitor and detect abuse.",
              },
              role: { type: "string", enum: ["assistant"] },
              tool_calls: {
                type: ["array", "null"],
                items: { $ref: "#/components/schemas/ToolCall" },
                description: "An array of tool calls available to the model on your machine.",
              },
            },
          },
          {
            type: "object",
            description: "Tool call role message, used to return function call result to the model.",
            required: ["content", "role"],
            properties: {
              content: {
                $ref: "#/components/schemas/Content",
                description: "Content of the tool call result.",
              },
              role: { type: "string", enum: ["tool"] },
              tool_call_id: {
                type: ["string", "null"],
                description: "The ID of the tool call received from assistant message response.",
              },
            },
          },
          {
            type: "object",
            description: "Function call role message. Deprecated in favor of `{\"role\": \"tool\"}`.",
            required: ["content", "role"],
            properties: {
              content: {
                $ref: "#/components/schemas/Content",
                description: "Content of the tool call result.",
              },
              name: {
                type: ["string", "null"],
                description:
                  "A unique identifier representing your end-user, which can help xAI to monitor and detect abuse.",
              },
              role: { type: "string", enum: ["function"] },
            },
          },
        ],
        description: "Chat message objects.",
      },
      MessageBody: {
        type: "object",
        description: "Anthropic compatible message body",
        required: ["role", "content"],
        properties: {
          content: {
            $ref: "#/components/schemas/MessageContent",
            description: "The content message.",
          },
          role: {
            type: "string",
            description:
              "The role that the message belongs to, `\"system\"` for system prompt, `\"user\"` for user prompt, and `\"assistant\"` for response from the model.",
          },
        },
      },
      MessageContent: {
        oneOf: [
          { type: "string", description: "Text prompt." },
          {
            type: "array",
            items: { $ref: "#/components/schemas/MessageContentPart" },
            description: "An array of message content parts.",
          },
        ],
      },
      MessageContentPart: {
        oneOf: [
          {
            type: "object",
            description: "Text prompt message content part.",
            required: ["text", "type"],
            properties: {
              cache_control: {
                type: ["string", "null"],
                description: "(Unsupported) Cache control.",
              },
              text: { type: "string", description: "Text prompt." },
              type: { type: "string", enum: ["text"] },
            },
          },
          {
            type: "object",
            description: "Image prompt message content part.",
            required: ["source", "type"],
            properties: {
              cache_control: {
                type: ["string", "null"],
                description: "(Unsupported) Cache control.",
              },
              source: {
                $ref: "#/components/schemas/MessageImageContent",
                description: "Image source.",
              },
              type: { type: "string", enum: ["image"] },
            },
          },
          {
            type: "object",
            description: "Tool call message content part. Received from model.",
            required: ["id", "name", "input", "type"],
            properties: {
              cache_control: {
                type: ["string", "null"],
                description: "(Unsupported) Cache control.",
              },
              id: { type: "string", description: "ID of the tool call." },
              input: { description: "Input for tool call." },
              name: { type: "string", description: "Name of the tool call." },
              type: { type: "string", enum: ["tool_use"] },
            },
          },
          {
            type: "object",
            description: "Tool call result.",
            required: ["tool_use_id", "content", "type"],
            properties: {
              cache_control: {
                type: ["string", "null"],
                description: "(Unsupported) Cache control.",
              },
              content: { type: "string", description: "Result content of the tool call." },
              is_error: {
                type: ["boolean", "null"],
                description: "Whether the tool call returns an error.",
              },
              tool_use_id: {
                type: "string",
                description: "ID of the tool call given by the model.",
              },
              type: { type: "string", enum: ["tool_result"] },
            },
          },
        ],
      },
      MessageImageContent: {
        type: "object",
        required: ["type", "media_type", "data"],
        properties: {
          data: { type: "string", description: "Base64 encoded image string." },
          media_type: {
            type: "string",
            description: "Media type of the image source. Available options: `image/jpeg`, `image/png`.",
          },
          type: {
            type: "string",
            description: "Type of image source. Only `\"base64\"` is supported.",
          },
        },
      },
      MessageMetadata: {
        type: "object",
        properties: {
          user_id: {
            type: ["string", "null"],
            description:
              "A unique identifier representing your end-user, which can help xAI to monitor and detect abuse.",
          },
        },
      },
      MessageRequest: {
        type: "object",
        description: "Request message for `/v1/messages`",
        required: ["model", "messages", "max_tokens"],
        properties: {
          max_tokens: {
            type: "integer",
            format: "int32",
            description:
              "The maximum number of tokens to generate before stopping. The model may stop before the max_tokens when it reaches the stop sequence.",
          },
          messages: {
            type: "array",
            items: { $ref: "#/components/schemas/MessageBody" },
            description: "Input messages.",
          },
          metadata: {
            oneOf: [
              { type: "null" },
              {
                $ref: "#/components/schemas/MessageMetadata",
                description: "An object describing metadata about the request.",
              },
            ],
          },
          model: {
            type: "string",
            description: "Model name for the model to use.",
            example: "grok-3-latest",
          },
          stop_sequences: {
            type: ["array", "null"],
            items: { type: "string" },
            description: "Up to 4 sequences where the API will stop generating further tokens.",
          },
          stream: {
            type: ["boolean", "null"],
            description:
              "If set, partial message deltas will be sent. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a `data: [DONE]` message.",
          },
          system: {
            oneOf: [
              { type: "null" },
              {
                $ref: "#/components/schemas/SystemMessageContent",
                description:
                  "System prompt message for the model, defining how the model should behave to user messages.",
              },
            ],
          },
          temperature: {
            type: ["number", "null"],
            format: "float",
            description:
              "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.",
            default: 1,
            example: 0.2,
            maximum: 2,
            minimum: 0,
          },
          tool_choice: {
            oneOf: [
              { type: "null" },
              {
                $ref: "#/components/schemas/MessageToolChoice",
                description:
                  "Controls which (if any) tool is called by the model. `\"none\"` means the model will not call any tool and instead generates a message. `\"auto\"` means the model can pick between generating a message or calling one or more tools. `\"any\"` means the model must call one or more tools. Specifying a particular tool via `{\"type\": \"tool\", \"function\": {\"name\": \"get_weather\"}}` forces the model to call that tool. `\"none\"` is the default when no tools are provided. `\"auto\"` is the default if tools are provided.",
              },
            ],
          },
          tools: {
            type: ["array", "null"],
            items: { $ref: "#/components/schemas/MessageTools" },
            description:
              "A list of tools the model may call in JSON-schema. Currently, only functions are supported as a tool. Use this to provide a list of functions the model may generate JSON inputs for. A max of 128 functions are supported.",
          },
          top_k: {
            type: ["integer", "null"],
            format: "int32",
            description:
              "(Unsupported) When generating next tokens, randomly selecting the next token from the k most likely options.",
          },
          top_p: {
            type: ["number", "null"],
            format: "float",
            description:
              "An alternative to sampling with `temperature`, called nucleus sampling, where the model considers the results of the tokens with `top_p` probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. It is generally recommended to alter this or `temperature` but not both.",
            default: 1,
            maximum: 1,
            exclusiveMinimum: 0,
          },
        },
      },
      MessageResponse: {
        type: "object",
        description: "Response message for `/v1/messages`",
        required: ["id", "type", "role", "content", "model", "usage"],
        properties: {
          content: {
            type: "array",
            items: { $ref: "#/components/schemas/MessageResponseContent" },
            description: "Response message content.",
          },
          id: { type: "string", description: "Unique object identifier." },
          model: { type: "string", description: "Model name that handled the request." },
          role: {
            type: "string",
            description: "Role of the generated message. Always `\"assistant\"`",
          },
          stop_reason: {
            type: ["string", "null"],
            description:
              "Reason to stop. `\"stop_sequence\"` means the inference has reached a model-defined or user-supplied stop sequence in `stop`. `\"max_tokens\"` means the inference result has reached models' maximum allowed token length or user defined value in `max_tokens`. `\"end_turn\"` or `null` in streaming mode when the chunk is not the last. `\"tool_use\"` means the model has called a tool and is waiting for the tool response.",
          },
          stop_sequence: {
            type: ["string", "null"],
            description: "Custom stop sequence used to stop the generation.",
          },
          type: {
            type: "string",
            description: "Object type. This is always `\"message\"` for message types.",
            example: "message",
          },
          usage: {
            $ref: "#/components/schemas/MessageUsage",
            description: "Token usage information.",
          },
        },
      },
      MessageResponseContent: {
        oneOf: [
          {
            type: "object",
            description: "Text response from the model.",
            required: ["text", "type"],
            properties: {
              text: { type: "string" },
              type: { type: "string", enum: ["text"] },
            },
          },
          {
            type: "object",
            description: "Thinking response for the model",
            required: ["signature", "thinking", "type"],
            properties: {
              signature: { type: "string", description: "Signature of the content" },
              thinking: { type: "string", description: "Thinking content" },
              type: { type: "string", enum: ["thinking"] },
            },
          },
          {
            type: "object",
            description: "Redacted thinking response for the model",
            required: ["data", "type"],
            properties: {
              data: { type: "string", description: "Signature of the content" },
              type: { type: "string", enum: ["redacted_thinking"] },
            },
          },
          {
            type: "object",
            description: "Request by the model to invoke a tool call.",
            required: ["id", "name", "input", "type"],
            properties: {
              id: { type: "string", description: "Tool call ID." },
              input: { description: "Input to the tool call follwing the `input_schema`." },
              name: { type: "string", description: "Name of the tool call to be used." },
              type: { type: "string", enum: ["tool_use"] },
            },
          },
        ],
      },
      MessageToolChoice: {
        oneOf: [
          {
            type: "object",
            description: "Allows the model to automatically decide whether to call the tool",
            required: ["type"],
            properties: { type: { type: "string", enum: ["auto"] } },
          },
          {
            type: "object",
            description: "Forces the model to use at least one tool, without specifying the tool.",
            required: ["type"],
            properties: { type: { type: "string", enum: ["any"] } },
          },
          {
            type: "object",
            description: "Forces the model to use the named tool",
            required: ["name", "type"],
            properties: {
              name: { type: "string", description: "Name of the tool to use." },
              type: { type: "string", enum: ["tool"] },
            },
          },
        ],
        description: "Tool choice option.",
      },
      MessageToolInputSchema: {
        type: "object",
        required: ["type", "properties"],
        properties: {
          properties: { description: "JSON-object of the tool input schema." },
          required: {
            type: ["array", "null"],
            items: { type: "string" },
            description: "Required properties of the tool input schema, if any.",
          },
          type: {
            type: "string",
            description: "Type of the schema. This is always `\"object\"`.",
          },
        },
      },
      MessageTools: {
        type: "object",
        required: ["name", "description", "input_schema"],
        properties: {
          cache_control: {
            type: ["string", "null"],
            description: "(Unsupported) Cache control.",
          },
          description: { type: "string", description: "Description of the tool." },
          input_schema: {
            $ref: "#/components/schemas/MessageToolInputSchema",
            description: "Input schema allowed by the tool.",
          },
          name: { type: "string", description: "Name of the tool." },
        },
      },
      MessageUsage: {
        type: "object",
        required: [
          "input_tokens",
          "cache_creation_input_tokens",
          "cache_read_input_tokens",
          "output_tokens",
        ],
        properties: {
          cache_creation_input_tokens: {
            type: "integer",
            format: "int32",
            description: "(Unsupported) Number of tokens written to the cache when creating a new entry.",
          },
          cache_read_input_tokens: {
            type: "integer",
            format: "int32",
            description: "Number of tokens retrieved from the cache for this request.",
          },
          input_tokens: {
            type: "integer",
            format: "int32",
            description: "Number of input tokens used",
          },
          output_tokens: {
            type: "integer",
            format: "int32",
            description: "Number of output tokens used",
          },
        },
      },
      Model: {
        type: "object",
        description: "Same as `LanguageModel` but fully compliant with the OpenAI API.",
        required: ["id", "created", "object", "owned_by"],
        properties: {
          created: {
            type: "integer",
            format: "int64",
            description: "Model creation time in Unix timestamp.",
          },
          id: {
            type: "string",
            description:
              "Model ID. Obtainable from https://console.x.ai/team/default/models or https://docs.x.ai/docs/models.",
          },
          object: {
            type: "string",
            description: "The object type, which is always `\"model\"`.",
          },
          owned_by: { type: "string", description: "Owner of the model." },
        },
      },
      PromptUsageDetail: {
        type: "object",
        description: "Details of prompt usage.",
        required: ["text_tokens", "audio_tokens", "image_tokens", "cached_tokens"],
        properties: {
          audio_tokens: {
            type: "integer",
            format: "int32",
            description: "Audio prompt token used.",
          },
          cached_tokens: {
            type: "integer",
            format: "int32",
            description: "Token cached by xAI from previous requests and reused for this request.",
          },
          image_tokens: {
            type: "integer",
            format: "int32",
            description: "Image prompt token used.",
          },
          text_tokens: {
            type: "integer",
            format: "int32",
            description: "Text prompt token used.",
          },
        },
      },
      ResponseFormat: {
        oneOf: [
          {
            type: "object",
            description: "Specify text response format, always `\"text\"`.",
            required: ["type"],
            properties: { type: { type: "string", enum: ["text"] } },
          },
          {
            type: "object",
            description:
              "Specify json_object response format, always `json_object`. Used for backward compatibility. Prefer to use `\"json_schema\"` instead of this.",
            required: ["type"],
            properties: { type: { type: "string", enum: ["json_object"] } },
          },
          {
            type: "object",
            description: "Specify json_schema response format with a given schema. Type is always `\"json_schema\"`.",
            required: ["json_schema", "type"],
            properties: {
              json_schema: {
                description: "A json schema representing the desired response schema.",
              },
              type: { type: "string", enum: ["json_schema"] },
            },
          },
        ],
        description: "Response format parameter for structured outputs.",
      },
      SampleChoice: {
        type: "object",
        required: ["index", "text", "finish_reason"],
        properties: {
          finish_reason: {
            type: "string",
            description:
              "Finish reason. `\"stop\"` means the inference has reached a model-defined or user-supplied stop sequence in `stop`. `\"length\"` means the inference result has reached models' maximum allowed token length or user defined value in `max_tokens`. `\"end_turn\"` or `null` in streaming mode when the chunk is not the last.",
          },
          index: { type: "integer", format: "int32", description: "Index of the choice." },
          text: { type: "string", description: "Text response." },
        },
      },
      SampleContent: {
        oneOf: [
          { type: "string", description: "Text prompt." },
          {
            type: "array",
            items: { type: "string" },
            description: "An array of strings, a token list, or an array of token lists.",
          },
        ],
      },
      SampleRequest: {
        type: "object",
        description: "(Legacy) Request for `/v1/completions` endpoint",
        required: ["prompt", "model"],
        properties: {
          best_of: {
            type: ["integer", "null"],
            format: "int32",
            description:
              "(Unsupported) Generates multiple completions internally and returns the top-scoring one. Not functional yet.",
          },
          echo: {
            type: ["boolean", "null"],
            description: "Option to include the original prompt in the response along with the generated completion.",
          },
          frequency_penalty: {
            type: ["number", "null"],
            format: "float",
            description:
              "(Unsupported) Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.",
          },
          logit_bias: {
            type: ["object", "null"],
            description:
              "(Unsupported) Accepts a JSON object that maps tokens to an associated bias value from -100 to 100. You can use this tokenizer tool to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.",
            additionalProperties: { type: "number", format: "float" },
            propertyNames: { type: "integer", format: "int32" },
          },
          logprobs: {
            type: ["boolean", "null"],
            description:
              "Include the log probabilities on the `logprobs` most likely output tokens, as well the chosen tokens. For example, if `logprobs` is 5, the API will return a list of the 5 most likely tokens. The API will always return the logprob of the sampled token, so there may be up to `logprobs+1` elements in the response.",
          },
          max_tokens: {
            type: ["integer", "null"],
            format: "int32",
            description:
              "Limits the number of tokens that can be produced in the output. Ensure the sum of prompt tokens and `max_tokens` does not exceed the model's context limit.",
          },
          model: {
            type: "string",
            description: "Specifies the model to be used for the request.",
          },
          n: {
            type: ["integer", "null"],
            format: "int32",
            description:
              "Determines how many completion sequences to produce for each prompt. Be cautious with its use due to high token consumption; adjust `max_tokens` and stop sequences accordingly.",
          },
          presence_penalty: {
            type: ["number", "null"],
            format: "float",
            description:
              "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.",
          },
          prompt: {
            $ref: "#/components/schemas/SampleContent",
            description:
              "Input for generating completions, which can be a string, list of strings, token list, or list of token lists. `<|endoftext|>` is used as a document separator, implying a new context start if omitted.",
          },
          seed: {
            type: ["integer", "null"],
            format: "int32",
            description:
              "If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same seed and parameters should return the same result. Determinism is not guaranteed, and you should refer to the system_fingerprint response parameter to monitor changes in the backend.",
          },
          stop: {
            type: ["array", "null"],
            items: { type: "string" },
            description:
              "Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.",
          },
          stream: {
            type: ["boolean", "null"],
            description:
              "Whether to stream back partial progress. If set, tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a `data: [DONE]` message.",
          },
          stream_options: {
            oneOf: [
              { type: "null" },
              {
                $ref: "#/components/schemas/StreamOptions",
                description: "Options for streaming response. Only set this when you set `stream: true`.",
              },
            ],
          },
          suffix: {
            type: ["string", "null"],
            description: "(Unsupported) Optional string to append after the generated text.",
          },
          temperature: {
            type: ["number", "null"],
            format: "float",
            description:
              "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or `top_p` but not both.",
            default: 1,
            example: 0.2,
            maximum: 2,
            minimum: 0,
          },
          top_p: {
            type: ["number", "null"],
            format: "float",
            description:
              "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with `top_p` probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.",
          },
          user: {
            type: ["string", "null"],
            description:
              "A unique identifier representing your end-user, which can help xAI to monitor and detect abuse.",
          },
        },
      },
      SampleResponse: {
        type: "object",
        description: "(Legacy) Response for `/v1/completions` endpoint",
        required: ["id", "object", "created", "model", "choices"],
        properties: {
          choices: {
            type: "array",
            items: { $ref: "#/components/schemas/SampleChoice" },
            description:
              "A list of response choices from the model. The length corresponds to the `n` in request body (default to 1).",
          },
          created: {
            type: "integer",
            format: "int64",
            description: "The chat completion creation time in Unix timestamp.",
          },
          id: { type: "string", description: "ID of the request." },
          model: { type: "string", description: "Model to be used." },
          object: {
            type: "string",
            description: "Object type of the response. This is always `\"text_completion\"`.",
          },
          system_fingerprint: {
            type: ["string", "null"],
            description: "System fingerprint, used to indicate xAI system configuration changes.",
          },
          usage: {
            oneOf: [
              { type: "null" },
              { $ref: "#/components/schemas/Usage", description: "Token usage information." },
            ],
          },
        },
      },
      StartDeferredChatResponse: {
        type: "object",
        required: ["request_id"],
        properties: {
          request_id: {
            type: "string",
            description: "A unique request ID for the chat response.",
          },
        },
      },
      StreamOptions: {
        type: "object",
        description: "Options available when using streaming response.",
        required: ["include_usage"],
        properties: {
          include_usage: {
            type: "boolean",
            description:
              "Set an additional chunk to be streamed before the `data: [DONE]` message. The other chunks will return `null` in `usage` field.",
          },
        },
      },
      SystemMessageContent: {
        oneOf: [
          { type: "string", description: "Text content of system prompt." },
          {
            type: "array",
            items: { $ref: "#/components/schemas/SystemMessagePart" },
            description: "An array of system prompt parts.",
          },
        ],
      },
      SystemMessagePart: {
        type: "object",
        required: ["type", "text"],
        properties: {
          cache_control: {
            type: ["string", "null"],
            description: "(Unsupported) Cache control.",
          },
          text: { type: "string", description: "System prompt text." },
          type: {
            type: "string",
            description: "Type of the object. This is always `\"text\"`.",
          },
        },
      },
      TokenLogProb: {
        type: "object",
        required: ["token", "logprob", "top_logprobs"],
        properties: {
          bytes: {
            type: ["array", "null"],
            items: { type: "integer", format: "int32", minimum: 0 },
            description: "The ASCII encoding of the output character.",
          },
          logprob: {
            type: "number",
            format: "float",
            description: "The log probability of returning this token.",
          },
          token: { type: "string", description: "The token." },
          top_logprobs: {
            type: "array",
            items: { $ref: "#/components/schemas/TopLogProb" },
            description: "An array of the most likely tokens to return at this token position.",
          },
        },
      },
      TokenizeRequest: {
        type: "object",
        required: ["text", "model"],
        properties: {
          model: { type: "string", description: "The model to tokenize with." },
          text: { type: "string", description: "The text content to be tokenized." },
          user: { type: ["string", "null"], description: "Optional user identifier." },
        },
      },
      TokenizeResponse: {
        type: "object",
        required: ["token_ids"],
        properties: {
          token_ids: {
            type: "array",
            items: { $ref: "#/components/schemas/TokenizeResponseToken" },
            description: "A list of tokens.",
          },
        },
      },
      TokenizeResponseToken: {
        type: "object",
        required: ["token_id", "string_token", "token_bytes"],
        properties: {
          string_token: { type: "string", description: "The string of the token." },
          token_bytes: {
            type: "array",
            items: { type: "integer", format: "int32", minimum: 0 },
            description: "The bytes that constituted the token.",
          },
          token_id: {
            type: "integer",
            format: "int32",
            description: "The integer representation of the token for the model.",
            minimum: 0,
          },
        },
      },
      Tool: {
        type: "object",
        description: "Definition of one tool that the model can call.",
        required: ["type", "function"],
        properties: {
          function: {
            $ref: "#/components/schemas/FunctionDefinition",
            description: "Definition of tool call available to the model.",
          },
          type: {
            type: "string",
            description: "The type of tool the model can use. For now, the only supported type is \"function\".",
          },
        },
      },
      ToolCall: {
        type: "object",
        required: ["id", "function"],
        properties: {
          function: {
            $ref: "#/components/schemas/Function",
            description: "Function to call for the tool call.",
          },
          id: {
            type: "string",
            description:
              "A unique ID of the tool call generated by xAI. After performing tool call's function, user provides this ID with tool call's result in the subsequent request to xAI. xAI can then match the tool call result sent with tool call request.",
          },
          index: {
            type: ["integer", "null"],
            format: "int32",
            description: "Index of the tool call.",
          },
          type: {
            type: ["string", "null"],
            description: "Type of tool call, should always be `\"function\"`",
          },
        },
      },
      ToolChoice: {
        oneOf: [
          {
            type: "string",
            description:
              "Controls tool access by the model. `\"none\"` makes model ignore tools, `\"auto\"` let the model automatically decide whether to call a tool, `\"required\"` forces model to pick a tool to call.",
          },
          {
            type: "object",
            required: ["type"],
            properties: {
              function: {
                oneOf: [
                  { type: "null" },
                  {
                    $ref: "#/components/schemas/FunctionChoice",
                    description: "Name of the function to use.",
                  },
                ],
              },
              type: { type: "string", description: "Type is always `\"function\"`." },
            },
          },
        ],
        description: "Parameter to control how model chooses the tools.",
      },
      TopLogProb: {
        type: "object",
        required: ["token", "logprob"],
        properties: {
          bytes: {
            type: ["array", "null"],
            items: { type: "integer", format: "int32", minimum: 0 },
            description: "The ASCII encoding of the output character.",
          },
          logprob: {
            type: "number",
            format: "float",
            description: "The log probability of returning this token.",
          },
          token: { type: "string", description: "The token." },
        },
      },
      Usage: {
        type: "object",
        required: [
          "prompt_tokens",
          "completion_tokens",
          "total_tokens",
          "prompt_tokens_details",
          "completion_tokens_details",
        ],
        properties: {
          completion_tokens: {
            type: "integer",
            format: "int32",
            description: "Total completion token used.",
          },
          completion_tokens_details: {
            $ref: "#/components/schemas/CompletionUsageDetail",
            description: "Breakdown of completion token usage of different types.",
          },
          prompt_tokens: {
            type: "integer",
            format: "int32",
            description: "Total prompt token used.",
          },
          prompt_tokens_details: {
            $ref: "#/components/schemas/PromptUsageDetail",
            description: "Breakdown of prompt token usage of different types.",
          },
          total_tokens: {
            type: "integer",
            format: "int32",
            description: "Total token used, the sum of prompt token and completion token amount.",
          },
        },
      },
    },
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer" } },
  },
}
