import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Crown, User, CheckCheck, Clock } from 'lucide-react';
import { Order, OrderMessage } from '../../types/order';
import { useAuth } from '../../context/AuthContext';
import { sendOrderMessage, markOrderMessagesAsRead } from '../../services/orderService';

interface OrderChatModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export const OrderChatModal: React.FC<OrderChatModalProps> = ({
  isOpen,
  order,
  onClose
}) => {
  const { user, appUser, isAdmin } = useAuth();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = order?.messages || [];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages.length]);

  // Mark messages as read on open
  useEffect(() => {
    if (isOpen && order) {
      const role = isAdmin ? 'admin' : 'user';
      markOrderMessagesAsRead(order.id, role);
    }
  }, [isOpen, order?.id, isAdmin]);

  if (!isOpen || !order || !user) return null;

  const currentRole = isAdmin ? 'admin' : 'user';
  const currentSenderName = appUser?.displayName || user.displayName || (isAdmin ? 'Admin 3D Studio' : 'Cliente');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    const messageText = text.trim();
    setText('');
    setSending(true);
    try {
      await sendOrderMessage(
        order.id,
        user.uid,
        currentSenderName,
        currentRole,
        messageText
      );
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg h-[85vh] glass-card rounded-3xl border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-cyan-300 px-2 py-0.2 rounded bg-cyan-500/20 border border-cyan-500/30">
                  {order.orderNumber}
                </span>
                <h3 className="font-bold text-white text-xs sm:text-sm truncate max-w-[150px]">
                  {order.userName}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400">Consultas y mensajes en tiempo real</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/40">
          {messages.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                <MessageSquare className="w-7 h-7 text-slate-500" />
              </div>
              <p className="text-xs font-bold text-slate-300">No hay mensajes en este pedido</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Escribe tu consulta sobre plazos, diseño, cambios de color o entrega y el equipo te responderá.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === user.uid || (isAdmin && msg.senderRole === 'admin');
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400 font-medium">
                    {msg.senderRole === 'admin' ? (
                      <span className="text-purple-300 font-bold flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" /> Admin 3D Studio
                      </span>
                    ) : (
                      <span className="text-cyan-300 font-bold flex items-center gap-0.5">
                        <User className="w-2.5 h-2.5" /> {msg.senderName}
                      </span>
                    )}
                    <span>·</span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-md ${
                      isMine
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none'
                        : 'bg-slate-900 border border-white/10 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-slate-900/80 flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isAdmin ? 'Responder al cliente...' : 'Escribe tu duda sobre este pedido...'}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold disabled:opacity-40 transition-transform active:scale-95 shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
