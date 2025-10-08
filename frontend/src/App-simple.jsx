import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [files, setFiles] = useState([]);

  // Données de démonstration
  const mockDocuments = [
    { id: 1, title: 'Rapport Mensuel - Octobre 2024', type: 'document', size: '245 KB', date: '06/10/2024' },
    { id: 2, title: 'Budget Prévisionnel 2025', type: 'spreadsheet', size: '512 KB', date: '05/10/2024' },
    { id: 3, title: 'Présentation Stratégie Q4', type: 'presentation', size: '1.2 MB', date: '04/10/2024' }
  ];

  const mockAttachments = [
    { id: 1, name: 'Présentation_Q4.pptx', type: 'presentation', size: '2.1 MB', icon: '🎯' },
    { id: 2, name: 'Logo_Entreprise.png', type: 'image', size: '512 KB', icon: '🖼️' },
    { id: 3, name: 'Rapport_Financier.pdf', type: 'document', size: '1.2 MB', icon: '📄' },
    { id: 4, name: 'Video_Formation.mp4', type: 'video', size: '15.3 MB', icon: '🎬' },
    { id: 5, name: 'Audio_Reunion.mp3', type: 'audio', size: '5.1 MB', icon: '🎵' },
    { id: 6, name: 'Archive_Projet.zip', type: 'archive', size: '8.7 MB', icon: '📦' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      setUser({
        firstName: 'Demo',
        lastName: 'User',
        email: formData.email
      });
      setIsAuthenticated(true);
      alert('Connexion réussie ! Bienvenue dans NovaSuite AI');
    } else {
      alert('Veuillez remplir tous les champs');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.email && formData.password && formData.firstName && formData.lastName) {
      setUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      });
      setIsAuthenticated(true);
      alert('Inscription réussie ! Bienvenue dans NovaSuite AI');
    } else {
      alert('Veuillez remplir tous les champs');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('dashboard');
    alert('Déconnexion réussie');
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    const newFiles = uploadedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type.includes('image') ? 'image' : 
            file.type.includes('video') ? 'video' :
            file.type.includes('audio') ? 'audio' : 'document',
      icon: file.type.includes('image') ? '🖼️' : 
            file.type.includes('video') ? '🎬' :
            file.type.includes('audio') ? '🎵' : '📄'
    }));
    setFiles([...files, ...newFiles]);
    alert(`${uploadedFiles.length} fichier(s) ajouté(s) avec succès !`);
  };

  const deleteFile = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
    alert('Fichier supprimé');
  };

  // Interface de connexion/inscription
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        {/* Bannière de démonstration */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#2563eb', color: 'white', padding: '10px', textAlign: 'center', zIndex: 1000 }}>
          🎯 <strong>Mode Démonstration NovaSuite AI</strong> - Utilisez n'importe quel email pour vous connecter
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', marginTop: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' }}>
              ✨
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              NovaSuite AI
            </h1>
            <p style={{ color: '#6b7280', marginTop: '8px' }}>
              Suite bureautique intelligente
            </p>
          </div>

          {/* Bannière de démonstration */}
          <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', border: '1px solid #93c5fd', borderRadius: '8px', padding: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ marginRight: '8px' }}>✨</span>
              <strong style={{ color: '#1e40af', fontSize: '14px' }}>Mode Démonstration</strong>
            </div>
            <p style={{ fontSize: '12px', color: '#1e40af', margin: 0 }}>
              Utilisez n'importe quel email et mot de passe pour tester l'interface !
            </p>
          </div>

          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} style={{ marginBottom: '20px' }}>
            {authMode === 'register' && (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                    placeholder="Votre prénom"
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                    placeholder="Votre nom"
                  />
                </div>
              </>
            )}
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                placeholder="votre@email.com"
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              style={{ width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}
            >
              {authMode === 'login' ? 'Se connecter' : 'S\'inscrire'}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              {authMode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                style={{ color: '#667eea', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
              >
                {authMode === 'login' ? 'S\'inscrire' : 'Se connecter'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Interface principale
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex' }}>
      {/* Bannière de démonstration */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', color: 'white', padding: '8px', textAlign: 'center', zIndex: 1000, fontSize: '14px' }}>
        ✨ <strong>NovaSuite AI - Démonstration Interactive</strong> • Interface complète fonctionnelle • Toutes les fonctionnalités sont simulées
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{ width: '280px', background: 'white', borderRight: '1px solid #e5e7eb', height: '100vh', position: 'fixed', left: 0, top: 0, paddingTop: '50px', zIndex: 100 }}>
          {/* Header */}
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '18px' }}>
                  ✨
                </div>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>NovaSuite AI</h2>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Suite bureautique</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
              >
                ←
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ padding: '20px' }}>
            <button
              style={{ width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', marginBottom: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
              onClick={() => alert('Fonctionnalité de création simulée')}
            >
              ➕ Créer
            </button>

            <nav>
              {[
                { id: 'dashboard', label: 'Tableau de bord', icon: '🏠' },
                { id: 'documents', label: 'Documents', icon: '📄' },
                { id: 'spreadsheets', label: 'Tableurs', icon: '📊' },
                { id: 'presentations', label: 'Présentations', icon: '🎯' },
                { id: 'attachments', label: 'Pièces jointes', icon: '📎' },
                { id: 'settings', label: 'Paramètres', icon: '⚙️' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    marginBottom: '4px',
                    background: currentView === item.id ? '#f3f4f6' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ marginRight: '12px', fontSize: '16px' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* User Profile */}
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '500', margin: 0 }}>{user?.firstName} {user?.lastName}</p>
                  <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
                title="Se déconnecter"
              >
                🚪
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? '280px' : '0', paddingTop: '50px', transition: 'margin-left 0.3s' }}>
        {/* Toggle Sidebar Button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ position: 'fixed', left: '20px', top: '70px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px', cursor: 'pointer', zIndex: 100 }}
          >
            →
          </button>
        )}

        <div style={{ padding: '20px' }}>
          {/* Dashboard */}
          {currentView === 'dashboard' && (
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Tableau de bord</h1>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>📄 Documents récents</h3>
                  {mockDocuments.slice(0, 3).map(doc => (
                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ marginRight: '8px' }}>
                        {doc.type === 'document' ? '📄' : doc.type === 'spreadsheet' ? '📊' : '🎯'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>{doc.title}</p>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{doc.size} • {doc.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>🤖 Assistant IA</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
                    NovaCopilot est prêt à vous aider avec vos documents
                  </p>
                  <button
                    onClick={() => setChatOpen(true)}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    💬 Ouvrir le chat
                  </button>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', border: '1px solid #93c5fd', borderRadius: '8px', padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af', marginBottom: '10px' }}>
                  🎯 Mode Démonstration Actif
                </h3>
                <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                  Vous utilisez NovaSuite AI en mode démonstration. Toutes les fonctionnalités sont simulées pour vous permettre de tester l'interface complète.
                </p>
              </div>
            </div>
          )}

          {/* Documents */}
          {currentView === 'documents' && (
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Documents</h1>
              <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', border: '1px solid #93c5fd', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                  📄 <strong>Gestion des Documents</strong> - Créez, modifiez et organisez vos documents texte avec l'assistant IA intégré.
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {mockDocuments.filter(d => d.type === 'document').map(doc => (
                  <div key={doc.id} style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb', cursor: 'pointer' }} onClick={() => alert(`Ouverture du document: ${doc.title}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px', marginRight: '10px' }}>📄</span>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>{doc.title}</h3>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{doc.size} • {doc.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spreadsheets */}
          {currentView === 'spreadsheets' && (
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Tableurs</h1>
              <div style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #dcfce7 100%)', border: '1px solid #86efac', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#166534', margin: 0 }}>
                  📊 <strong>Tableurs Intelligents</strong> - Créez des feuilles de calcul avec l'aide de l'IA pour générer des formules automatiquement.
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {mockDocuments.filter(d => d.type === 'spreadsheet').map(doc => (
                  <div key={doc.id} style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb', cursor: 'pointer' }} onClick={() => alert(`Ouverture du tableur: ${doc.title}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px', marginRight: '10px' }}>📊</span>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>{doc.title}</h3>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{doc.size} • {doc.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Presentations */}
          {currentView === 'presentations' && (
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Présentations</h1>
              <div style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fde68a 100%)', border: '1px solid #fbbf24', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
                  🎯 <strong>Présentations Dynamiques</strong> - Créez des diaporamas professionnels avec l'aide de NovaCopilot pour générer le contenu.
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {mockDocuments.filter(d => d.type === 'presentation').map(doc => (
                  <div key={doc.id} style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb', cursor: 'pointer' }} onClick={() => alert(`Ouverture de la présentation: ${doc.title}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px', marginRight: '10px' }}>🎯</span>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>{doc.title}</h3>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{doc.size} • {doc.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {currentView === 'attachments' && (
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Pièces jointes</h1>
              <div style={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #f3e8ff 100%)', border: '1px solid #c084fc', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#7c3aed', margin: 0 }}>
                  📎 <strong>Gestionnaire de Fichiers</strong> - Uploadez et gérez tous types de fichiers : images, vidéos, audio, documents, présentations, archives.
                </p>
              </div>

              {/* Upload Zone */}
              <div style={{ background: 'white', border: '2px dashed #d1d5db', borderRadius: '8px', padding: '40px', textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📎</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Ajouter des fichiers</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
                  Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="fileInput"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z"
                />
                <label
                  htmlFor="fileInput"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', display: 'inline-block', fontSize: '14px', fontWeight: '500' }}
                >
                  📎 Sélectionner des fichiers
                </label>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '10px' }}>
                  Taille max: 100MB • Formats supportés: Images, Vidéos, Audio, Documents, Archives
                </p>
              </div>

              {/* Files List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {[...mockAttachments, ...files].map(file => (
                  <div key={file.id} style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '24px', marginRight: '10px' }}>{file.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</h3>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{file.size}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>{file.type}</span>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => alert(`Aperçu de ${file.name}`)}
                          style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', padding: '4px' }}
                          title="Aperçu"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => alert(`Téléchargement de ${file.name}`)}
                          style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', padding: '4px' }}
                          title="Télécharger"
                        >
                          📥
                        </button>
                        {files.some(f => f.id === file.id) && (
                          <button
                            onClick={() => deleteFile(file.id)}
                            style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', padding: '4px', color: '#ef4444' }}
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {currentView === 'settings' && (
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Paramètres</h1>
              <div style={{ maxWidth: '600px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Profil utilisateur</h2>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                      Nom complet
                    </label>
                    <p style={{ fontSize: '14px', color: '#111827' }}>{user?.firstName} {user?.lastName}</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                      Email
                    </label>
                    <p style={{ fontSize: '14px', color: '#111827' }}>{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{ background: '#ef4444', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                  >
                    Se déconnecter
                  </button>
                </div>
                
                <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '1px solid #f59e0b', borderRadius: '8px', padding: '15px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>Mode Démonstration</h3>
                  <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
                    Vous utilisez actuellement NovaSuite AI en mode démonstration. Toutes les fonctionnalités sont simulées pour vous permettre de tester l'interface.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Panel */}
      {chatOpen && (
        <div style={{ position: 'fixed', right: '20px', bottom: '20px', width: '350px', height: '500px', background: 'white', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', zIndex: 1000 }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>🤖</span>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>NovaCopilot</h3>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
          
          <div style={{ padding: '15px', height: '380px', overflowY: 'auto' }}>
            <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
              <p style={{ fontSize: '14px', margin: 0 }}>
                👋 Bonjour ! Je suis NovaCopilot, votre assistant IA. Comment puis-je vous aider aujourd'hui ?
              </p>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
              <p style={{ fontSize: '14px', margin: 0, color: '#1e40af' }}>
                🎯 <strong>Mode Démonstration</strong><br/>
                En mode production, je peux vous aider à :
                <br/>• Générer du contenu pour vos documents
                <br/>• Corriger et améliorer vos textes
                <br/>• Créer des formules de tableur
                <br/>• Résumer des documents
                <br/>• Générer des présentations
              </p>
            </div>
          </div>
          
          <div style={{ padding: '15px', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Tapez votre message..."
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    alert('Fonctionnalité de chat simulée - En mode production, NovaCopilot répondrait à votre question !');
                    e.target.value = '';
                  }
                }}
              />
              <button
                onClick={() => alert('Fonctionnalité de chat simulée - En mode production, NovaCopilot répondrait à votre question !')}
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          style={{ position: 'fixed', right: '20px', bottom: '20px', width: '60px', height: '60px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 1000 }}
        >
          🤖
        </button>
      )}
    </div>
  );
}

export default App;
