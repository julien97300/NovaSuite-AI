import { useState, useRef, useEffect } from 'react';

// Fonction pour les réponses IA simulées
const getDemoAIResponse = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('hello')) {
    return '👋 Bonjour ! Je suis NovaCopilot en mode démonstration. Comment puis-je vous aider avec vos documents aujourd\'hui ?';
  }
  
  if (msg.includes('document') || msg.includes('rédiger') || msg.includes('écrire')) {
    return '📄 Je peux vous aider à créer et améliorer vos documents ! En mode production avec OpenRouter, je peux générer du contenu, corriger des textes, et structurer vos documents professionnels.';
  }
  
  if (msg.includes('excel') || msg.includes('formule') || msg.includes('tableur')) {
    return '📊 Pour les tableurs, je peux créer des formules Excel complexes ! Par exemple, pour calculer une moyenne : `=MOYENNE(A1:A10)`. En production, je génère des formules personnalisées selon vos besoins.';
  }
  
  if (msg.includes('présentation') || msg.includes('powerpoint') || msg.includes('slide')) {
    return '🎯 Je peux créer des plans de présentation structurés ! En mode production, je génère du contenu pour chaque slide avec des suggestions visuelles adaptées à votre sujet.';
  }
  
  if (msg.includes('corriger') || msg.includes('correction') || msg.includes('orthographe')) {
    return '✅ Je corrige l\'orthographe, la grammaire et améliore le style de vos textes. Partagez-moi votre contenu et je vous proposerai une version améliorée !';
  }
  
  if (msg.includes('aide') || msg.includes('help') || msg.includes('comment')) {
    return '💡 Je suis spécialisé dans les tâches bureautiques :\n• 📄 Rédaction et correction de documents\n• 📊 Formules Excel et analyses\n• 🎯 Création de présentations\n• ✉️ Emails professionnels\n\nQue voulez-vous accomplir ?';
  }
  
  return `🤖 Merci pour votre message ! En mode démonstration, je simule les réponses. En production avec OpenRouter, je fournis des réponses IA réelles et personnalisées pour vous aider avec "${message}". \n\n💡 Configurez une clé OpenRouter pour activer l'IA complète !`;
};

const ChatPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: '👋 Bonjour ! Je suis NovaCopilot, votre assistant IA. Comment puis-je vous aider avec vos documents aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus sur l'input quand le chat s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    // Ajouter le message utilisateur
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // Préparer l'historique des messages pour l'API
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Utiliser le service API au lieu d'un appel fetch direct
      const data = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: userMessage.content,
          messages: conversationHistory.slice(-10)
        })
      }).then(async (response) => {
        if (!response.ok) {
          // Si l'API n'est pas disponible, utiliser le mode démo
          if (response.status === 404 || response.status === 0) {
            return {
              success: true,
              data: {
                response: getDemoAIResponse(userMessage.content),
                model: 'demo-fallback',
                usage: { total_tokens: 50 }
              }
            };
          }
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        return response.json();
      }).catch(() => {
        // Fallback complet en cas d'erreur réseau
        return {
          success: true,
          data: {
            response: getDemoAIResponse(userMessage.content),
            model: 'demo-fallback',
            usage: { total_tokens: 50 }
          }
        };
      });

      if (data.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.data.response,
          timestamp: new Date(),
          model: data.data.model
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || 'Erreur lors de la communication avec l\'IA');
      }

    } catch (error) {
      console.error('Chat error:', error);
      setError(error.message);
      
      // Message d'erreur de fallback
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `❌ Désolé, je rencontre une difficulté technique. ${error.message.includes('401') ? 'Veuillez vous reconnecter.' : 'Veuillez réessayer dans quelques instants.'}`,
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: '👋 Chat réinitialisé ! Comment puis-je vous aider ?',
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      right: '20px', 
      bottom: '20px', 
      width: '400px', 
      height: '600px', 
      background: 'white', 
      borderRadius: '12px', 
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', 
      border: '1px solid #e5e7eb', 
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #e5e7eb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px 12px 0 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', marginRight: '8px' }}>🤖</span>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>NovaCopilot</h3>
            <p style={{ fontSize: '12px', margin: 0, opacity: 0.9 }}>
              {isLoading ? 'En train d\'écrire...' : 'Assistant IA'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={clearChat}
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              borderRadius: '6px',
              padding: '6px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            title="Effacer la conversation"
          >
            🗑️
          </button>
          <button
            onClick={onClose}
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              borderRadius: '6px',
              padding: '6px 10px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ 
        flex: 1, 
        padding: '16px', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: message.role === 'user' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : message.isError 
                  ? '#ef4444'
                  : 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: 'white',
              flexShrink: 0
            }}>
              {message.role === 'user' ? '👤' : message.isError ? '❌' : '🤖'}
            </div>

            {/* Message bubble */}
            <div style={{
              maxWidth: '280px',
              padding: '12px 16px',
              borderRadius: '18px',
              background: message.role === 'user' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : message.isError
                  ? '#fee2e2'
                  : '#f3f4f6',
              color: message.role === 'user' ? 'white' : message.isError ? '#dc2626' : '#111827',
              fontSize: '14px',
              lineHeight: '1.5',
              wordWrap: 'break-word'
            }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </div>
              <div style={{
                fontSize: '11px',
                opacity: 0.7,
                marginTop: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{formatTime(message.timestamp)}</span>
                {message.model && (
                  <span style={{ fontSize: '10px' }}>
                    {message.model.split('/').pop()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: 'white'
            }}>
              🤖
            </div>
            <div style={{
              padding: '12px 16px',
              borderRadius: '18px',
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#6b7280',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#6b7280',
                animation: 'pulse 1.5s ease-in-out infinite 0.2s'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#6b7280',
                animation: 'pulse 1.5s ease-in-out infinite 0.4s'
              }}></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && (
        <div style={{
          padding: '8px 16px',
          background: '#fee2e2',
          borderTop: '1px solid #fecaca',
          color: '#dc2626',
          fontSize: '12px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Input */}
      <div style={{ 
        padding: '16px', 
        borderTop: '1px solid #e5e7eb',
        background: '#f9fafb',
        borderRadius: '0 0 12px 12px'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message... (Entrée pour envoyer)"
            disabled={isLoading}
            style={{ 
              flex: 1, 
              padding: '12px', 
              border: '1px solid #d1d5db', 
              borderRadius: '8px', 
              fontSize: '14px',
              resize: 'none',
              minHeight: '20px',
              maxHeight: '100px',
              fontFamily: 'inherit',
              outline: 'none'
            }}
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{ 
              background: (!inputMessage.trim() || isLoading) 
                ? '#d1d5db' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              padding: '12px 16px', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: (!inputMessage.trim() || isLoading) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              minWidth: '60px'
            }}
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
        
        {/* Quick actions */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginTop: '8px',
          flexWrap: 'wrap'
        }}>
          {[
            'Aide-moi à rédiger un document',
            'Corrige ce texte',
            'Crée une présentation',
            'Formule Excel'
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(suggestion)}
              disabled={isLoading}
              style={{
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '16px',
                padding: '4px 12px',
                fontSize: '12px',
                color: '#6b7280',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.color = '#374151';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.background = 'white';
                  e.target.style.color = '#6b7280';
                }
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* CSS pour l'animation de chargement */}
      <style>
        {`
          @keyframes pulse {
            0%, 80%, 100% {
              opacity: 0.3;
            }
            40% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ChatPanel;
