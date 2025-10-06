import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Table, 
  Presentation, 
  Folder, 
  Users, 
  Settings, 
  Sparkles,
  Plus,
  Search,
  Star,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIStore, useDocumentStore, useAuthStore } from '../lib/store-demo';

const Sidebar = ({ currentView, onViewChange, onCreateDocument }) => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { documents } = useDocumentStore();
  const { user } = useAuthStore();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: Home,
      count: null
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      count: documents.filter(d => d.documentType === 'document').length
    },
    {
      id: 'spreadsheets',
      label: 'Tableurs',
      icon: Table,
      count: documents.filter(d => d.documentType === 'spreadsheet').length
    },
    {
      id: 'presentations',
      label: 'Présentations',
      icon: Presentation,
      count: documents.filter(d => d.documentType === 'presentation').length
    },
    {
      id: 'folders',
      label: 'Dossiers',
      icon: Folder,
      count: null
    },
    {
      id: 'attachments',
      label: 'Pièces jointes',
      icon: Paperclip,
      count: 5 // Nombre de pièces jointes en démo
    }
  ];

  const quickActions = [
    {
      id: 'recent',
      label: 'Récents',
      icon: Clock,
      count: documents.filter(doc => {
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 7);
        return new Date(doc.lastEditedAt) > dayAgo;
      }).length
    },
    {
      id: 'starred',
      label: 'Favoris',
      icon: Star,
      count: 0
    },
    {
      id: 'shared',
      label: 'Partagés',
      icon: Users,
      count: 0
    },
    {
      id: 'trash',
      label: 'Corbeille',
      icon: Trash2,
      count: 0
    }
  ];

  const createOptions = [
    {
      type: 'document',
      label: 'Document',
      icon: FileText,
      description: 'Créer un nouveau document texte'
    },
    {
      type: 'spreadsheet',
      label: 'Tableur',
      icon: Table,
      description: 'Créer une nouvelle feuille de calcul'
    },
    {
      type: 'presentation',
      label: 'Présentation',
      icon: Presentation,
      description: 'Créer une nouvelle présentation'
    }
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : -320,
          width: sidebarOpen ? 320 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 lg:relative lg:z-auto overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* En-tête */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">NovaSuite AI</h2>
                  <p className="text-xs text-gray-600">Suite bureautique</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bouton de création */}
          <div className="p-4">
            <div className="relative group">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => onCreateDocument('document')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer
              </Button>
              
              {/* Menu déroulant de création */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {createOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => onCreateDocument(option.type)}
                    className="w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-start space-x-3"
                  >
                    <option.icon className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{option.label}</p>
                      <p className="text-xs text-gray-600">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation principale */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && item.count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {item.count}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>

            {/* Actions rapides */}
            <div className="mt-6 px-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Accès rapide
              </h3>
              <nav className="space-y-1">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => onViewChange(action.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView === action.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="w-4 h-4" />
                      <span>{action.label}</span>
                    </div>
                    {action.count > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {action.count}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Profil utilisateur */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange('settings')}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bouton toggle pour desktop */}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-40 lg:block hidden"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </>
  );
};

export default Sidebar;
