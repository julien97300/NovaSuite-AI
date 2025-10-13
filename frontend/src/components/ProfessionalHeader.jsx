import NotificationSystem from './NotificationSystem';

const ProfessionalHeader = ({ 
  user, 
  onLogout, 
  sidebarOpen, 
  setSidebarOpen, 
  dynamicStore, 
  setActivityOpen 
}) => {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: sidebarOpen ? '280px' : '0',
      right: 0,
      height: '60px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 200,
      transition: 'left 0.3s ease'
    }}>
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#f9fafb';
              e.target.style.borderColor = '#d1d5db';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'none';
              e.target.style.borderColor = '#e5e7eb';
            }}
          >
            <span style={{ fontSize: '16px' }}>☰</span>
            Menu
          </button>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: 'white'
          }}>
            ✨
          </div>
          <div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              NovaSuite AI
            </h1>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', display: 'none' }}>
          <input
            type="text"
            placeholder="Rechercher..."
            style={{
              width: '200px',
              padding: '8px 12px 8px 36px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              background: '#f9fafb',
              outline: 'none'
            }}
          />
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            fontSize: '14px'
          }}>
            🔍
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Notifications */}
          <NotificationSystem store={dynamicStore} />
          
          {/* Activity Button */}
          <button
            onClick={() => setActivityOpen(true)}
            style={{
              background: 'none',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              transition: 'all 0.2s'
            }}
            title="Activité en temps réel"
            onMouseOver={(e) => {
              e.target.style.background = '#f9fafb';
              e.target.style.borderColor = '#d1d5db';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'none';
              e.target.style.borderColor = '#e5e7eb';
            }}
          >
            📊
          </button>
        </div>

        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingLeft: '12px',
          borderLeft: '1px solid #e5e7eb'
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#1f2937'
            }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#6b7280'
            }}>
              {user?.email}
            </div>
          </div>
          
          <div style={{ position: 'relative' }}>
            <button
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onClick={(e) => {
                e.preventDefault();
                const menu = e.target.nextElementSibling;
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </button>
            
            {/* Dropdown Menu */}
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              minWidth: '180px',
              display: 'none',
              zIndex: 1000
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {user?.firstName} {user?.lastName}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {user?.email}
                </div>
              </div>
              
              <div style={{ padding: '8px 0' }}>
                <button
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#f9fafb';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'none';
                  }}
                >
                  <span>👤</span>
                  Mon profil
                </button>
                
                <button
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#f9fafb';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'none';
                  }}
                >
                  <span>⚙️</span>
                  Paramètres
                </button>
                
                <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }} />
                
                <button
                  onClick={onLogout}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#fef2f2';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'none';
                  }}
                >
                  <span>🚪</span>
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfessionalHeader;
