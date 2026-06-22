import { useEffect, useState, useRef } from 'react'
import { messageService } from '../../services/message.service'
import { Spinner } from '../../components/ui/Spinner'
import { BuyerTabs } from '../../components/layout/BuyerTabs'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messageService.getConversations()
      .then(r => setConversations(r.data.data || r.data || []))
      .catch(() => toast.error('Impossible de charger les conversations'))
      .finally(() => setLoadingConvs(false))
  }, [])

  useEffect(() => {
    if (!selectedConv) return
    setLoadingMsgs(true)
    messageService.getMessages(selectedConv.id)
      .then(r => setMessages(r.data.data || r.data || []))
      .catch(() => toast.error('Erreur chargement messages'))
      .finally(() => setLoadingMsgs(false))
  }, [selectedConv])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConv) return
    setSending(true)
    try {
      await messageService.sendMessage(selectedConv.id, newMessage.trim())
      setNewMessage('')
      const r = await messageService.getMessages(selectedConv.id)
      setMessages(r.data.data || r.data || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur envoi')
    } finally { setSending(false) }
  }

  const formatTime = (date) => new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh' }}>
      <BuyerTabs />
      <div style={{ padding: '24px 16px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 20 }}>💬 Messagerie</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, height: '70vh' }}>

          {/* Liste conversations */}
          <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #e2e8f0' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>Conversations</p>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loadingConvs ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spinner /></div>
              ) : conversations.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center' }}>
                  <p style={{ fontSize: 28, marginBottom: 8 }}>💬</p>
                  <p style={{ fontSize: 12, color: '#718096' }}>Aucune conversation</p>
                </div>
              ) : (
                conversations.map(conv => {
                  const other = conv.other_user || conv
                  const isSelected = selectedConv?.id === other.id
                  return (
                    <div key={conv.id || other.id}
                      onClick={() => setSelectedConv(other)}
                      style={{ padding: '12px 16px', cursor: 'pointer', background: isSelected ? '#fff8e6' : 'transparent', borderLeft: isSelected ? '3px solid #f0b429' : '3px solid transparent', transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0b429', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                          {(other.name || 'U')[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e', marginBottom: 2 }}>{other.name}</p>
                          <p style={{ fontSize: 11, color: '#718096', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {conv.last_message?.content || 'Démarrer une conversation'}
                          </p>
                        </div>
                        {conv.last_message && (
                          <span style={{ fontSize: 10, color: '#a0aec0', flexShrink: 0 }}>{formatDate(conv.last_message.created_at)}</span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Zone messages */}
          <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!selectedConv ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#718096' }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>💬</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#4a5568', marginBottom: 6 }}>Sélectionnez une conversation</p>
                <p style={{ fontSize: 12 }}>Cliquez sur un contact pour voir les messages</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ padding: '14px 20px', borderBottom: '0.5px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#f0b429', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e', fontWeight: 700, fontSize: 14 }}>
                    {(selectedConv.name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{selectedConv.name}</p>
                    <p style={{ fontSize: 11, color: '#48bb78' }}>● En ligne</p>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {loadingMsgs ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spinner /></div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#718096' }}>
                      <p style={{ fontSize: 12 }}>Aucun message. Commencez la conversation !</p>
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isMine = msg.sender_id === user?.id
                      return (
                        <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            maxWidth: '68%', background: isMine ? '#f0b429' : '#f7f8fa',
                            color: isMine ? '#1a1a2e' : '#2d3748',
                            borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            padding: '10px 14px'
                          }}>
                            <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 4 }}>{msg.content}</p>
                            {msg.product && (
                              <p style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>📦 {msg.product.title}</p>
                            )}
                            <p style={{ fontSize: 10, opacity: 0.6, textAlign: 'right' }}>{formatTime(msg.created_at)}</p>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '0.5px solid #e2e8f0', display: 'flex', gap: 10 }}>
                  <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
                    placeholder="Écrire un message..."
                    style={{ flex: 1, border: '0.5px solid #e2e8f0', borderRadius: 24, padding: '10px 16px', fontSize: 13, outline: 'none', background: '#f7f8fa' }} />
                  <button type="submit" disabled={sending || !newMessage.trim()}
                    style={{ background: '#f0b429', color: '#1a1a2e', border: 'none', borderRadius: '50%', width: 42, height: 42, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: (!newMessage.trim() || sending) ? 0.5 : 1 }}>
                    {sending ? '⏳' : '➤'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
  //Valider ensemble le diagramme UML avant de coder massivement.
}
