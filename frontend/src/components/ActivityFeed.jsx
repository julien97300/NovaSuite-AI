import { useState, useEffect } from 'react';

const ActivityFeed = ({ store, isVisible, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!store) return;

    const unsubscribe = store.subscribe((data) => {
      setActivities(data.activities || []);
      setStats(data.stats || {});
    });

    // Initialiser avec les données actuelles
    const currentData = store.getData();
    setActivities(currentData.activities || []);
    setStats(currentData.stats || {});

    return unsubscribe;
  }, [store]);

  // Obtenir l'icône selon le type d'activité
  const getActivityIcon = (type) => {
    const icons = {
      document_created: '📄',
      document_updated: '✏️',
      document_deleted: '🗑️',
      file_uploaded: '📁',
      file_deleted: '🗑️',
      file_view: '👁️',
      collaboration: '👥',
      ai_interaction: '🤖',
      user_login: '🔐',
      user_logout: '👋'
    };
    return icons[type] || '📌';
  };

  // Obtenir la couleur selon le type
  const getActivityColor = (type) => {
    const colors = {
      document_created: '#10b981',
      document_updated: '#3b82f6',
      document_deleted: '#ef4444',
      file_uploaded: '#8b5cf6',
      file_deleted: '#ef4444',
      file_view: '#6b7280',
      collaboration: '#f59e0b',
      ai_interaction: '#ec4899',
      user_login: '#10b981',
      user_logout: '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  // Formater le temps relatif
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (seconds < 60) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return new Date(timestamp).toLocaleDateString('fr-FR');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000
        }}
      />

      {/* Panel d'activité */}
      <div style={{
        position: 'fixed',
        right: '20px',
        top: '20px',
        bottom: '20px',
        width: '400px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              📊 Activité en Temps Réel
            </h2>
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

          {/* Statistiques rapides */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '8px 12px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>
                {stats.documentsCreated || 0}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>
                Documents
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '8px 12px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>
                {stats.aiInteractions || 0}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>
                IA Interactions
              </div>
            </div>
          </div>
        </div>

        {/* Flux d'activité */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px'
        }}>
          {activities.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
              <p style={{ margin: 0, fontSize: '14px' }}>
                Aucune activité récente
              </p>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              {/* Ligne de temps */}
              <div style={{
                position: 'absolute',
                left: '20px',
                top: '0',
                bottom: '0',
                width: '2px',
                background: 'linear-gradient(to bottom, #e5e7eb, transparent)',
                zIndex: 0
              }} />

              {/* Activités */}
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  style={{
                    position: 'relative',
                    marginBottom: '16px',
                    paddingLeft: '50px'
                  }}
                >
                  {/* Point sur la timeline */}
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: getActivityColor(activity.type),
                    border: '3px solid white',
                    boxShadow: '0 0 0 1px #e5e7eb',
                    zIndex: 1
                  }} />

                  {/* Contenu de l'activité */}
                  <div style={{
                    background: index === 0 ? '#f0f9ff' : 'white',
                    border: `1px solid ${index === 0 ? '#bae6fd' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    padding: '12px',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '16px' }}>
                        {getActivityIcon(activity.type)}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#111827',
                          marginBottom: '2px'
                        }}>
                          {activity.message}
                        </div>
                        {activity.details && (
                          <div style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginBottom: '4px'
                          }}>
                            {activity.details}
                          </div>
                        )}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '11px',
                          color: '#9ca3af'
                        }}>
                          <span>{activity.user}</span>
                          <span>{getRelativeTime(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer avec indicateur de mise à jour */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #e5e7eb',
          background: '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{
            fontSize: '12px',
            color: '#6b7280'
          }}>
            Mise à jour en temps réel
          </span>
        </div>
      </div>

      {/* CSS pour l'animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>
    </>
  );
};

export default ActivityFeed;
