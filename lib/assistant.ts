/**
 * AI assistant interface.
 *
 * The terminal's ASK command calls `askAssistant`. Today it is a stub; to
 * enable a real RAG pipeline later, swap the implementation for a fetch to an
 * API route (e.g. /api/ask) that embeds the question, retrieves matching
 * chunks from the content folder, and calls an LLM. The terminal UI needs no
 * changes — it only consumes this function's return shape.
 */

interface AssistantReply {
  ok: boolean;
  lines: string[];
}

export async function askAssistant(question: string): Promise<AssistantReply> {
  void question;
  return {
    ok: false,
    lines: [
      "ASSISTANT STATUS: OFFLINE",
      "The department's automated advisor has not yet been",
      "cleared for duty. Please direct questions to the",
      "usual channels — try CONTACT.",
    ],
  };
}
