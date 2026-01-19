export type ChatRole = 'user' | 'agent';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  ts: string;
}

const STORAGE_KEY_CHAT = 'alcast.chat.agent.v1';

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function loadChatHistory(): ChatMessage[] {
  return safeParseJson<ChatMessage[]>(localStorage.getItem(STORAGE_KEY_CHAT)) ?? [];
}

export function saveChatHistory(messages: ChatMessage[]): void {
  localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(messages));
}

export function clearChatAgentState(): void {
  localStorage.removeItem(STORAGE_KEY_CHAT);
}

export function createAgentGreeting(): ChatMessage {
  return {
    id: `m-${Date.now()}-init`,
    role: 'agent',
    content: 'Agente institucional disponível.',
    ts: new Date().toISOString(),
  };
}

export function createUserMessage(content: string): ChatMessage {
  return {
    id: `m-${Date.now()}-u`,
    role: 'user',
    content,
    ts: new Date().toISOString(),
  };
}

export function createAgentStubReply(): ChatMessage {
  return {
    id: `m-${Date.now()}-a`,
    role: 'agent',
    content: 'Resposta indisponível no momento.',
    ts: new Date().toISOString(),
  };
}
