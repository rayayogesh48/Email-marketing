"use client";

import {
  ArrowLeft,
  CheckCheck,
  Image as ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/ui/menu";

type Product = {
  name: string;
  price: string;
  store: string;
};

type Message = {
  id: string;
  from: "customer" | "seller";
  kind: "text" | "image" | "product";
  text?: string;
  time: string;
  status?: "Delivered" | "Read";
  product?: Product;
};

type Conversation = {
  id: string;
  name: string;
  role: "Seller" | "Customer";
  initials: string;
  latest: string;
  timestamp: string;
  unread: number;
  online?: boolean;
  messages: Message[];
};

const initialConversations: Conversation[] = [
  {
    id: "kathmandu-electronics",
    name: "Kathmandu Electronics",
    role: "Seller",
    initials: "KE",
    latest: "Is this product still available?",
    timestamp: "10:42 AM",
    unread: 2,
    online: true,
    messages: [
      {
        id: "ke-1",
        from: "customer",
        kind: "text",
        text: "Hi, is this available?",
        time: "10:31 AM",
      },
      {
        id: "ke-2",
        from: "seller",
        kind: "text",
        text: "Yes, it’s currently available.",
        time: "10:33 AM",
        status: "Read",
      },
      {
        id: "ke-3",
        from: "seller",
        kind: "product",
        time: "10:34 AM",
        status: "Read",
        product: {
          name: "Wireless Headphones",
          price: "Rs. 2,499",
          store: "Kathmandu Electronics",
        },
      },
      {
        id: "ke-4",
        from: "customer",
        kind: "text",
        text: "Can you deliver to Baneshwor?",
        time: "10:38 AM",
      },
      {
        id: "ke-5",
        from: "customer",
        kind: "image",
        text: "This is the color I’m looking for.",
        time: "10:39 AM",
      },
      {
        id: "ke-6",
        from: "seller",
        kind: "text",
        text: "Yes. Delivery should take around 1–2 hours.",
        time: "10:42 AM",
        status: "Delivered",
      },
    ],
  },
  {
    id: "everest-fashion",
    name: "Everest Fashion Store",
    role: "Seller",
    initials: "EF",
    latest: "Yes, we can deliver tomorrow.",
    timestamp: "Yesterday",
    unread: 0,
    messages: [
      {
        id: "ef-1",
        from: "customer",
        kind: "text",
        text: "Do you have this jacket in medium?",
        time: "4:12 PM",
      },
      {
        id: "ef-2",
        from: "seller",
        kind: "text",
        text: "We do. Would you like it delivered?",
        time: "4:18 PM",
        status: "Read",
      },
      {
        id: "ef-3",
        from: "customer",
        kind: "text",
        text: "Yes, can it arrive tomorrow?",
        time: "4:20 PM",
      },
      {
        id: "ef-4",
        from: "seller",
        kind: "text",
        text: "Yes, we can deliver tomorrow.",
        time: "4:22 PM",
        status: "Read",
      },
    ],
  },
  {
    id: "ram-shrestha",
    name: "Ram Shrestha",
    role: "Customer",
    initials: "RS",
    latest: "Can you share the final price?",
    timestamp: "Sep 16",
    unread: 1,
    messages: [
      {
        id: "rs-1",
        from: "customer",
        kind: "text",
        text: "Hello, I’m interested in the dining table.",
        time: "2:04 PM",
      },
      {
        id: "rs-2",
        from: "seller",
        kind: "text",
        text: "Thanks, Ram. It’s still available.",
        time: "2:09 PM",
        status: "Read",
      },
      {
        id: "rs-3",
        from: "customer",
        kind: "text",
        text: "Can you share the final price?",
        time: "2:11 PM",
      },
    ],
  },
];

function ConversationAvatar({
  initials,
  online,
}: {
  initials: string;
  online?: boolean;
}) {
  return (
    <span className="conversation-avatar" aria-hidden="true">
      {initials}
      {online && <span className="conversation-online-dot" />}
    </span>
  );
}

function ConversationListItem({
  conversation,
  active,
  onSelect,
}: {
  conversation: Conversation;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`conversation-list-item ${active ? "is-active" : ""} ${
        conversation.unread ? "is-unread" : ""
      }`}
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
    >
      <ConversationAvatar
        initials={conversation.initials}
        online={conversation.online}
      />
      <span className="conversation-list-copy">
        <span className="conversation-list-name">{conversation.name}</span>
        <span className="conversation-list-preview">{conversation.latest}</span>
      </span>
      <span className="conversation-list-meta">
        <time>{conversation.timestamp}</time>
        {conversation.unread > 0 && (
          <span
            className="conversation-unread"
            aria-label={`${conversation.unread} unread messages`}
          >
            {conversation.unread}
          </span>
        )}
      </span>
    </button>
  );
}

function ConversationList({
  conversations,
  selectedId,
  search,
  onSearch,
  onSelect,
}: {
  conversations: Conversation[];
  selectedId: string | null;
  search: string;
  onSearch: (value: string) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <section
      className={`conversation-list ${selectedId ? "mobile-hidden" : ""}`}
      aria-label="Conversations"
    >
      <div className="conversation-list-header">
        <div>
          <h1>Conversations</h1>
          <p>{conversations.length} customer messages</p>
        </div>
      </div>
      <label className="conversation-search">
        <Search size={16} />
        <span className="sr-only">Search conversations</span>
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search conversations"
        />
      </label>
      <div className="conversation-list-scroll">
        {conversations.length ? (
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              active={conversation.id === selectedId}
              onSelect={() => onSelect(conversation.id)}
            />
          ))
        ) : (
          <div className="conversation-list-empty">
            <Search size={20} />
            <strong>No conversations found</strong>
            <span>Try a different name or message.</span>
          </div>
        )}
      </div>
    </section>
  );
}

function ConversationHeader({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  return (
    <header className="conversation-header">
      <button
        className="conversation-back"
        onClick={onBack}
        aria-label="Back to conversations"
      >
        <ArrowLeft size={19} />
      </button>
      <ConversationAvatar
        initials={conversation.initials}
        online={conversation.online}
      />
      <div className="conversation-contact">
        <strong>{conversation.name}</strong>
        <span>
          {conversation.role}
          {conversation.online && <> · Active now</>}
        </span>
      </div>
      <Menu
        label="Conversation options"
        trigger={<MoreHorizontal size={19} />}
        items={[
          { label: "View profile", action: () => undefined },
          { label: "Mark as unread", action: () => undefined },
          { label: "Report conversation", action: () => undefined },
        ]}
      />
    </header>
  );
}

function SafetyDisclaimer({ onDismiss }: { onDismiss: () => void }) {
  return (
    <aside className="conversation-safety">
      <span className="conversation-safety-icon">
        <ShieldCheck size={18} />
      </span>
      <div>
        <strong>Deal safely</strong>
        <p>
          Please communicate respectfully and confirm all details before making
          a deal. The customer and seller are solely responsible for their
          transactions.
        </p>
      </div>
      <button onClick={onDismiss} aria-label="Dismiss safety message">
        <X size={16} />
      </button>
    </aside>
  );
}

function ProductMessageCard({ product }: { product: Product }) {
  return (
    <div className="conversation-product">
      <span className="conversation-product-image">
        <ImageIcon size={24} />
      </span>
      <span className="conversation-product-copy">
        <strong>{product.name}</strong>
        <b>{product.price}</b>
        <small>{product.store}</small>
      </span>
      <button>View product</button>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const outgoing = message.from === "seller";
  return (
    <div className={`message-row ${outgoing ? "is-outgoing" : "is-incoming"}`}>
      <div className={`message-bubble message-${message.kind}`}>
        {message.kind === "product" && message.product ? (
          <ProductMessageCard product={message.product} />
        ) : message.kind === "image" ? (
          <>
            <div
              className="conversation-image-message"
              role="img"
              aria-label="Shared product photo"
            >
              <span className="conversation-image-sun" />
              <span className="conversation-image-hill one" />
              <span className="conversation-image-hill two" />
              <ImageIcon size={22} />
            </div>
            {message.text && <p>{message.text}</p>}
          </>
        ) : (
          <p>{message.text}</p>
        )}
        <span className="message-meta">
          <time>{message.time}</time>
          {outgoing && message.status && (
            <span aria-label={message.status} title={message.status}>
              <CheckCheck size={13} />
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

function MessageThread({
  conversation,
  showSafety,
  onDismissSafety,
  endRef,
}: {
  conversation: Conversation;
  showSafety: boolean;
  onDismissSafety: () => void;
  endRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="message-thread" aria-live="polite">
      <div className="date-separator">
        <span>Today</span>
      </div>
      {conversation.messages.slice(0, 2).map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {showSafety && <SafetyDisclaimer onDismiss={onDismissSafety} />}
      {conversation.messages.slice(2).map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={endRef} />
    </div>
  );
}

function MessageComposer({
  value,
  onChange,
  onSend,
  onImage,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onImage: () => void;
}) {
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };
  return (
    <div className="message-composer">
      <button
        className="composer-icon"
        aria-label="Attach a file"
        onClick={onImage}
      >
        <Paperclip size={19} />
      </button>
      <button
        className="composer-icon"
        aria-label="Add an image"
        onClick={onImage}
      >
        <ImageIcon size={19} />
      </button>
      <textarea
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type a message"
        aria-label="Message"
      />
      <Button
        size="icon"
        onClick={onSend}
        disabled={!value.trim()}
        aria-label="Send message"
      >
        <Send size={17} />
      </Button>
    </div>
  );
}

function EmptyConversation() {
  return (
    <div className="conversation-empty-panel">
      <span>
        <MessageCircle size={25} />
      </span>
      <h2>Select a conversation</h2>
      <p>Choose a conversation from the list to start messaging.</p>
    </div>
  );
}

export function ConversationPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = sessionStorage.getItem(
        "reloopin:conversation-safety-dismissed",
      );
      if (stored) {
        try {
          setDismissed(JSON.parse(stored));
        } catch {
          sessionStorage.removeItem("reloopin:conversation-safety-dismissed");
        }
      }
      if (window.matchMedia("(min-width: 701px)").matches) {
        setSelectedId(initialConversations[0].id);
      }
    });
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conversation) =>
      `${conversation.name} ${conversation.latest}`
        .toLowerCase()
        .includes(query),
    );
  }, [conversations, search]);
  const selected = conversations.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    if (selected) endRef.current?.scrollIntoView({ block: "end" });
  }, [selected, selected?.messages.length]);

  const selectConversation = (id: string) => {
    setSelectedId(id);
    setDraft("");
    setConversations((items) =>
      items.map((item) => (item.id === id ? { ...item, unread: 0 } : item)),
    );
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !selectedId) return;
    const now = new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());
    setConversations((items) =>
      items.map((item) =>
        item.id === selectedId
          ? {
              ...item,
              latest: text,
              timestamp: "Now",
              messages: [
                ...item.messages,
                {
                  id: `local-${Date.now()}`,
                  from: "seller" as const,
                  kind: "text" as const,
                  text,
                  time: now,
                  status: "Delivered" as const,
                },
              ],
            }
          : item,
      ),
    );
    setDraft("");
  };

  const addImage = () => {
    if (!selectedId) return;
    const now = new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());
    setConversations((items) =>
      items.map((item) =>
        item.id === selectedId
          ? {
              ...item,
              latest: "Photo",
              timestamp: "Now",
              messages: [
                ...item.messages,
                {
                  id: `image-${Date.now()}`,
                  from: "seller" as const,
                  kind: "image" as const,
                  text: "Shared a product photo",
                  time: now,
                  status: "Delivered" as const,
                },
              ],
            }
          : item,
      ),
    );
  };

  const dismissSafety = () => {
    if (!selectedId) return;
    const next = { ...dismissed, [selectedId]: true };
    setDismissed(next);
    sessionStorage.setItem(
      "reloopin:conversation-safety-dismissed",
      JSON.stringify(next),
    );
  };

  return (
    <div className={`conversation-layout ${selected ? "has-selection" : ""}`}>
      <ConversationList
        conversations={filtered}
        selectedId={selectedId}
        search={search}
        onSearch={setSearch}
        onSelect={selectConversation}
      />
      <section
        className={`conversation-panel ${selected ? "mobile-visible" : ""}`}
        aria-label="Active conversation"
      >
        {selected ? (
          <>
            <ConversationHeader
              conversation={selected}
              onBack={() => setSelectedId(null)}
            />
            <MessageThread
              conversation={selected}
              showSafety={!dismissed[selected.id]}
              onDismissSafety={dismissSafety}
              endRef={endRef}
            />
            <MessageComposer
              value={draft}
              onChange={setDraft}
              onSend={sendMessage}
              onImage={addImage}
            />
          </>
        ) : (
          <EmptyConversation />
        )}
      </section>
    </div>
  );
}
