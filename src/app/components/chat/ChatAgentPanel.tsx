import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X, Send } from 'lucide-react';
import type { ChatMessage } from '../../../services/chatAgent.service';
import {
  createAgentGreeting,
  createAgentStubReply,
  createUserMessage,
  loadChatHistory,
  saveChatHistory,
} from '../../../services/chatAgent.service';

interface ChatAgentPanelProps {
  open: boolean;
  onClose: () => void;
}

export function ChatAgentPanel({ open, onClose }: ChatAgentPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatHistory());
  const [draft, setDraft] = useState('');
  const [responding, setResponding] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    if (messages.length > 0) return;

    setMessages([createAgentGreeting()]);
  }, [open, messages.length]);

  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages, responding]);

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text || responding) return;

    const userMsg = createUserMessage(text);

    setDraft('');
    setResponding(true);
    setMessages((prev) => [...prev, userMsg]);

    window.setTimeout(() => {
      const agentMsg = createAgentStubReply();
      setMessages((prev) => [...prev, agentMsg]);
      setResponding(false);
    }, 700);
  }, [draft, responding]);

  const title = useMemo(() => 'Agente', []);

  if (!open) return null;

  return (
    <aside
      className="fixed right-0 top-[52px] z-[1300] h-[calc(100vh-52px)] w-[380px] bg-white border-l border-[#d9d9d9] shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
      aria-label="Agente institucional"
    >
      <div className="h-[52px] px-4 flex items-center justify-between border-b border-[#e5e5e5]">
        <h2 className="font-['72:Bold',sans-serif] text-[14px] text-[#131e29] m-0">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-[8px] hover:bg-[#eff1f2] transition-colors border-0 bg-transparent"
          aria-label="Fechar"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="h-[calc(100%-52px-64px)] overflow-auto" ref={listRef}>
        <div className="p-4 flex flex-col gap-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] rounded-[10px] px-3 py-2 text-[13px] font-['72:Regular',sans-serif] leading-[1.35] ${
                m.role === 'user'
                  ? 'self-end bg-[#0064d9] text-white'
                  : 'self-start bg-[#f5f6f7] text-[#131e29]'
              }`}
            >
              {m.content}
            </div>
          ))}

          {responding ? (
            <div className="max-w-[85%] self-start rounded-[10px] px-3 py-2 text-[13px] font-['72:Regular',sans-serif] bg-[#f5f6f7] text-[#556b82]">
              Respondendo…
            </div>
          ) : null}
        </div>
      </div>

      <div className="h-[64px] border-t border-[#e5e5e5] px-3 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send();
          }}
          className="flex-1 h-[36px] px-3 text-[13px] font-['72:Regular',sans-serif] bg-white border border-[#d9d9d9] rounded-[8px] outline-none focus:border-[#0064d9]"
          placeholder="Mensagem"
          aria-label="Mensagem"
          title="Mensagem"
        />
        <button
          type="button"
          onClick={send}
          disabled={responding || !draft.trim()}
          className="h-[36px] w-[36px] flex items-center justify-center rounded-[8px] border-0 bg-[#0064d9] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Enviar"
          title="Enviar"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
