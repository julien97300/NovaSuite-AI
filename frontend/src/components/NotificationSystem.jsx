import { useState, useEffect } from 'react';

const NotificationSystem = ({ store }) => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!store) return;

    const unsubscribe = store.subscribe((data) => {
      setNotifications(data.notifications || []);
    });

    // Initialiser avec les données actuelles
    const currentData = store.getData();
    setNotifications(currentData.notifications || []);

    return unsubscribe;
  }, [store]);

  // Marquer une notification comme lue
  const markAsRead = (id) => {
    if (store) {
      store.markNotificationRead(id);
    }
  };

  // Compter les notifications non lues
  const unreadCount = notifications.filter(n => !n.read).length;

  // Obtenir l'icône selon le type
  const getIcon = (type) => {
    const icons = {
      info: '💡',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      collaboration: '👥',
      file: '📁',
      ai: '🤖'
    };
    return icons[type] || '📢';
  };

  // Formater le temps relatif
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  return (
    <>
      {/* Bouton de notifications */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsVisible(!isVisible)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            position: 'relative',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#f3f4f6';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'none';
          }}
        >
          🔔
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Panel des notifications */}
        {isVisible && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            width: '350px',
            maxHeight: '400px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            zIndex: 1000,
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                  Notifications
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {unreadCount > 0 && (
                    <span style={{
                      background: 'rgba(255,255,255,0.2)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {unreadCount} nouvelles
                    </span>
                  )}
                  <button
                    onClick={() => setIsVisible(false)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des notifications */}
            <div style={{
              maxHeight: '320px',
              overflowY: 'auto'
            }}>
              {notifications.length === 0 ? (
                <div style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔕</div>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    Aucune notification pour le moment
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      background: notification.read ? 'white' : '#f0f9ff',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = notification.read ? '#f9fafb' : '#e0f2fe';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = notification.read ? 'white' : '#f0f9ff';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      {/* Icône */}
                      <div style={{
                        fontSize: '20px',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        {getIcon(notification.type)}
                      </div>

                      {/* Contenu */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '4px'
                        }}>
                          <h4 style={{
                            margin: 0,
                            fontSize: '14px',
                            fontWeight: notification.read ? '500' : '600',
                            color: '#111827'
                          }}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              background: '#3b82f6',
                              borderRadius: '50%',
                              flexShrink: 0
                            }} />
                          )}
                        </div>

                        <p style={{
                          margin: 0,
                          fontSize: '13px',
                          color: '#6b7280',
                          lineHeight: '1.4',
                          wordWrap: 'break-word'
                        }}>
                          {notification.message}
                        </p>

                        <div style={{
                          marginTop: '6px',
                          fontSize: '11px',
                          color: '#9ca3af'
                        }}>
                          {getRelativeTime(notification.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid #e5e7eb',
                background: '#f9fafb',
                textAlign: 'center'
              }}>
                <button
                  onClick={() => {
                    notifications.forEach(n => {
                      if (!n.read) markAsRead(n.id);
                    });
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6366f1',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Marquer tout comme lu
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay pour fermer */}
      {isVisible && (
        <div
          onClick={() => setIsVisible(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
        />
      )}
    </>
  );
};

export default NotificationSystem;
