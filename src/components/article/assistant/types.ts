
export type MessageType = "agent" | "question" | "suggestion";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
  type?: MessageType;
  needsAction?: boolean;
}

export interface TranscriptionItem {
  text: string;
  time?: string;
  page?: string;
}

export interface TranscriptionBlock {
  id: string;
  type: "speaker" | "source" | "topic";
  title: string;
  items: TranscriptionItem[];
}

export interface ContextSuggestion {
  title: string;
  excerpt: string;
  source: string;
}
