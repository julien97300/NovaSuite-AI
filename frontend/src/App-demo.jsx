import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Composants
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';

// Stores et services de démo
import { useAuthStore, useUIStore } from './lib/store-demo';
import socketService from './lib/socket-demo';

// Styles
import './App.css';

// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [authMode, setAuthMode] = useState('login'); // login | register
  const [isLoading, setIsLoading] = useState(true);
  
  const { isAuthenticated, token, user, logout } = useAuthStore();
  const { currentView, setCurrentView, sidebarOpen } = useUIStore();

  // Vérification de l'authentification au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      // En mode démo, on simule une vérification rapide
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Connexion Socket.IO quand l'utilisateur est authentifié
  useEffect(() => {
    if (isAuthenticated && user) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, user]);

  // Gestion des vues
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleCreateDocument = (type) => {
    console.log('Créer document de type:', type);
    // En mode démo, on simule la création
    const documentTypes = {
      document: 'Nouveau Document',
      spreadsheet: 'Nouveau Tableur',
      presentation: 'Nouvelle Présentation'
    };
    
    // Simuler la création d'un document
    setTimeout(() => {
      console.log(`${documentTypes[type]} créé avec succès !`);
    }, 500);
  };

  const handleOpenDocument = (document) => {
    console.log('Ouvrir document:', document);
    // En mode démo, on simule l'ouverture
    setTimeout(() => {
      console.log(`Document "${document.title}" ouvert !`);
    }, 300);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  // Écran de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">NovaSuite AI</h2>
          <p className="text-gray-600">Chargement de votre suite bureautique...</p>
          <div className="mt-4 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-sm text-yellow-800">
              🎯 <strong>Mode Démonstration</strong> - Interface fonctionnelle sans backend
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Interface d'authentification
  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen">
          {/* Bannière de démonstration */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 text-center">
            <p className="text-sm">
              🎯 <strong>Mode Démonstration NovaSuite AI</strong> - Testez l'interface sans backend • 
              Utilisez n'importe quel email pour vous connecter
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              <Login key="login" onToggleMode={toggleAuthMode} />
            ) : (
              <Register key="register" onToggleMode={toggleAuthMode} />
            )}
          </AnimatePresence>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </QueryClientProvider>
    );
  }

  // Interface principale de l'application
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Bannière de démonstration */}
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-blue-600 text-white p-2 text-center z-50">
          <p className="text-sm">
            ✨ <strong>NovaSuite AI - Démonstration Interactive</strong> • 
            Interface complète fonctionnelle • 
            Toutes les fonctionnalités sont simulées
          </p>
        </div>

        {/* Sidebar */}
        <Sidebar 
          currentView={currentView}
          onViewChange={handleViewChange}
          onCreateDocument={handleCreateDocument}
        />

        {/* Contenu principal */}
        <div className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-0' : 'ml-0'
        } pt-10`}>
          <main className="h-screen overflow-y-auto">
            <AnimatePresence mode="wait">
              {currentView === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard 
                    onOpenDocument={handleOpenDocument}
                    onCreateDocument={handleCreateDocument}
                  />
                </motion.div>
              )}
              
              {currentView === 'documents' && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Documents</h1>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        📄 <strong>Vue Documents</strong> - En mode production, cette section afficherait tous vos documents 
                        avec des options de tri, filtrage et recherche avancée.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            📄
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Document {i}</h3>
                            <p className="text-sm text-gray-500">Modifié il y a {i} jour(s)</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Document de démonstration #{i}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {currentView === 'spreadsheets' && (
                <motion.div
                  key="spreadsheets"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Tableurs</h1>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        📊 <strong>Vue Tableurs</strong> - Gestion complète des fichiers Excel/Calc avec 
                        l'assistant IA pour générer des formules automatiquement.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            📊
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Tableur {i}</h3>
                            <p className="text-sm text-gray-500">Modifié il y a {i} jour(s)</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Feuille de calcul de démonstration #{i}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {currentView === 'presentations' && (
                <motion.div
                  key="presentations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Présentations</h1>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-purple-800 text-sm">
                        🎯 <strong>Vue Présentations</strong> - Créez des diaporamas professionnels avec 
                        l'aide de NovaCopilot pour générer le contenu automatiquement.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            🎯
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Présentation {i}</h3>
                            <p className="text-sm text-gray-500">Modifié il y a {i} jour(s)</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Diaporama de démonstration #{i}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {currentView === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h1>
                  <div className="max-w-2xl">
                    <div className="bg-white rounded-lg shadow p-6">
                      <h2 className="text-lg font-semibold mb-4">Profil utilisateur</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom complet
                          </label>
                          <p className="text-gray-900">{user?.firstName} {user?.lastName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <p className="text-gray-900">{user?.email}</p>
                        </div>
                        <div className="pt-4 border-t">
                          <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Se déconnecter
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h3 className="font-medium text-amber-800 mb-2">Mode Démonstration</h3>
                      <p className="text-sm text-amber-700">
                        Vous utilisez actuellement NovaSuite AI en mode démonstration. 
                        Toutes les fonctionnalités sont simulées pour vous permettre de tester l'interface.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* Panel de chat IA */}
        <ChatPanel />
      </div>

      {/* Notifications Toast */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
