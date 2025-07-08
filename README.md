# Challenge: Emotion-Aware Response Generator Pipeline

Luís Viegas

## Disclaimers

This project is a prototype. Although the challenge was really interesting and gave me lots of cool ideas to implement (some of them described on the last chapter) the time constraints did not allow me to fully explore all the possibilities. I made the choice of having a functional prototype that can actually be used, for that I had to sacrifice some advanced features and some aspects like AirFlow or MLflow integration. I will try to describe how I would approach those topics in the last chapter.

## Project Overview

This project implements a prototype for an Emotion-Aware Response generator, as requested by the challenge. The solution goes beyond the provided baseline by architecting a modular pipeline. Here the empathetic response generation was treated as a multi-stage process consisting in:

- Classifying the user's emotional tone.
- Aggregating the recent emotions of the conversation.
- Strategize on the best response approach based on the prevalent emotions and context.
- Use MCP tools to gather context specific information using an agentic approach.
- Generate a natural, empathetic response using an LLM.


This approach is designed to be scalable, maintainable, and directly addresses the core mission of creating hyper-personalized digital journeys.


### Component Breakdown

- Frontend: A simple web interface that allows users to input text and view the AI's responses.

- API Gateway: The main entry point. It receives user requests and orchestrates the entire workflow.

- Emotion Classifier: A transformer model (SamLowe/roberta-base-go_emotions) that analyzes the user's text and returns a probability distribution of emotions. For the sake of this prototype, a hosted model is used instead of running it locally.

- Previous emotion aggregator: This component aggregates the emotional tones of the last few messages in the conversation, and combines them into a single emotion array with a cumulative decaying step for previous emotions.

- Response Strategist: The "brain" of the operation. It takes the emotional analysis and conversation history to build a detailed system prompt that instructs the LLM how to behave. This component is designed to be modular, allowing for easy updates to the instructions for each emotion. It incorporates in the final prompt the top 3 aggregated emotions with a threshold so that irrelevant emotions are not included. Then, based on the score of each emotion, it selects a strong, medium or weak response instruction.

- Tools and agentic behavior: The model has tools that allow it to display an agentic behavior and do all sorts of actions. Unfortunately, I only had time to correctly implement 2 tools. One for getting all 20 products in the database and another one for querying a specific product from the database. However, I made the architecture modular so that adding new tools is as easy as declaring the function and adding it to the tools list in the tools file. I had plans for tools that displayed custom UI elements, like a product carousel or a purchase button, but I didn't have time to implement them.

- LLM Generator: A hosted LLM that takes the carefully crafted prompt and generates the final answer and streams it to the user. It is extremely easy to swap out the LLM for another hosted model or even a local one, as long as it supports the Ollama API. This would allow for, for example, having a fallback model in case the default one is down.


## Technology Stack

I chose to do everything in TypeScript so that I could move faster. I also built everything as a monolithic full-stack app. For a production app, I would try to split the components into microservices and consider using python for AI work, but for the sake of this prototype, I wanted to keep it simple and fast.

- React for the frontend.
- Tanstack Start for the full-stack framework: This new framework is still in beta but I wanted to try it out. I would not choose this for a production app.

## Other Design Decisions & Improvements

This implementation makes several key improvements over the baseline script:

- Instead of mapping one emotion to one static
strategy, this pipeline sends an emotion score array (e.g.['anger': 0.6, 'confusion': 0.3, 'joy': 0.1])
to the Response Strategist. This allows for a much more nuanced prompt that guides the LLM
to address multiple feelings simultaneously.

- The original script was just a message generator. Now it is actually a conversational agent.
Integrating past messages allows the model to develop an actual conversational context and aggregating emotions over time allows the model to have a constant awareness of the user's emotional state for the recent messages instead of displaying a swingy mood.

- Each component (classifier, strategist, etc.) is logically separated as best as possible. This means we can swap out the emotion model or the LLM generator without rewriting the entire application, making the system more maintainable and scalable.

## Future Improvements & Production Considerations

- MLOps: I would integrate MLflow to track experiments. This would involve logging different prompt templates, comparing the performance of various emotion classifiers and LLMs, and
versioning models to ensure reproducibility.

- More tools, a proper MCP server and deeper agentic behavior: The current "Strategist" is a precursor to a more advanced agentic system. The next step would be to send the emotion instructions to a middle LLM that would match them in a single cohesive behavior instruction that would be given to the actual final LLM. Also, the current tools are very basic. I would implement more tools that allow the LLM to interact with the user in a more agentic way, for example, displaying a product carousel or making an actual purchase.
I would also create a proper MCP server that would be a more advanced version of the current tools, allowing for more complex interactions and data retrieval and serve other MCP clients, not just this one.

- Data Pipelines for ETL: To improve the system over time, we need to fine-tune our models on real-world conversation data. I would set up a pipeline using Apache Airflow to periodically ETL anonymized conversation logs, label them for emotion and intent, and use this data to fine-tune both the classifier and the generator LLM.

- Continuous Monitoring and Evaluation: I would implement structured logging to Prometheus and create dashboards in Grafana to monitor system health (latency, error rates, token usage). For performance evaluation, I would track metrics like user sentiment shift, conversation completion rates, and implement a simple user feedback mechanism (thumbs up/down) to create a human-feedback loop (RLHF).
