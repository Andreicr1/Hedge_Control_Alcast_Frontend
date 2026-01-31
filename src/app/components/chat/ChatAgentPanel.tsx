import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bar,
  Button,
  Dialog,
  FlexBox,
  FlexBoxDirection,
  Input,
  Text,
} from '@ui5/webcomponents-react';
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

  return (
    <Dialog
      open={open}
      headerText={title}
      onClose={onClose}
      style={{ width: 420, maxWidth: 'calc(100vw - 2rem)' }}
      footer={
        <Bar
          endContent={
            <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.5rem', alignItems: 'center', width: '100%' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Input
                  value={draft}
                  placeholder="Mensagem"
                  disabled={responding}
                  onInput={(e: any) => setDraft(String(e?.target?.value ?? ''))}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter') send();
                  }}
                  style={{ width: '100%' }}
                />
              </div>
              <Button
                design="Emphasized"
                icon="paper-plane"
                disabled={responding || !draft.trim()}
                onClick={send}
                tooltip="Enviar"
              />
              <Button design="Transparent" icon="decline" onClick={onClose} tooltip="Fechar" />
            </FlexBox>
          }
        />
      }
    >
      <div
        ref={listRef}
        style={{
          height: 'min(60vh, 520px)',
          overflow: 'auto',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          background: 'var(--sapBackgroundColor)',
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              maxWidth: '85%',
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              borderRadius: 10,
              padding: '0.5rem 0.75rem',
              background:
                m.role === 'user'
                  ? 'var(--sapButton_Emphasized_Background)'
                  : 'var(--sapField_Background)',
              color:
                m.role === 'user'
                  ? 'var(--sapButton_Emphasized_TextColor)'
                  : 'var(--sapTextColor)',
              border: '1px solid var(--sapGroup_ContentBorderColor)',
              whiteSpace: 'pre-wrap',
            }}
          >
            <Text>{m.content}</Text>
          </div>
        ))}

        {responding ? (
          <div
            style={{
              maxWidth: '85%',
              alignSelf: 'flex-start',
              borderRadius: 10,
              padding: '0.5rem 0.75rem',
              background: 'var(--sapField_Background)',
              color: 'var(--sapContent_LabelColor)',
              border: '1px solid var(--sapGroup_ContentBorderColor)',
            }}
          >
            <Text>Respondendo…</Text>
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}
