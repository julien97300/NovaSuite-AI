import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Download, 
  Share2, 
  Users, 
  MessageCircle, 
  Sparkles,
  ArrowLeft,
  MoreVertical,
  Eye,
  Edit3,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useDocumentStore, useCollaborationStore, useUIStore } from '../lib/store';
import { documentsAPI, downloadFile } from '../lib/api';
import socketService from '../lib/socket';
import toast from 'react-hot-toast';

const DocumentEditor = ({ document, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [editorMode, setEditorMode] = useState('edit'); // edit | view
  const editorRef = useRef(null);
  const docApiRef = useRef(null);
  
  const { updateDocument } = useDocumentStore();
  const { activeUsers, isConnected } = useCollaborationStore();
  const { toggleChatPanel } = useUIStore();

  useEffect(() => {
    if (document) {
      initializeEditor();
      joinDocumentRoom();
    }

    return () => {
      if (document) {
        leaveDocumentRoom();
      }
    };
  }, [document]);

  const initializeEditor = () => {
    if (!document || !document.canEdit()) {
      setEditorMode('view');
    }

    // Configuration OnlyOffice
    const config = {
      document: {
        fileType: document.getFileExtension(),
        key: `${document.id}_${document.version}`,
        title: document.title,
        url: `${import.meta.env.VITE_API_URL}/documents/${document.id}/download`,
        permissions: {
          edit: editorMode === 'edit' && document.canEdit(),
          download: true,
          print: true,
          review: true,
          comment: true
        }
      },
      documentType: getOnlyOfficeType(document.documentType),
      editorConfig: {
        mode: editorMode,
        lang: 'fr',
        callbackUrl: `${import.meta.env.VITE_API_URL}/documents/${document.id}/callback`,
        user: {
          id: document.owner.id,
          name: `${document.owner.firstName} ${document.owner.lastName}`
        },
        customization: {
          autosave: true,
          chat: false,
          comments: true,
          help: true,
          hideRightMenu: false,
          logo: {
            image: '',
            imageEmbedded: '',
            url: ''
          },
          reviewDisplay: 'original',
          showReviewChanges: true,
          toolbarNoTabs: false,
          zoom: 100
        },
        plugins: {
          autostart: ['asc.{FFE1F462-1EA2-4391-990D-4CC84940B754}'],
          pluginsData: []
        }
      },
      events: {
        onAppReady: onEditorReady,
        onDocumentStateChange: onDocumentStateChange,
        onRequestSaveAs: onRequestSaveAs,
        onRequestInsertImage: onRequestInsertImage,
        onRequestMailMergeRecipients: onRequestMailMergeRecipients,
        onRequestCompareFile: onRequestCompareFile,
        onRequestEditRights: onRequestEditRights,
        onRequestHistory: onRequestHistory,
        onRequestHistoryClose: onRequestHistoryClose,
        onRequestHistoryData: onRequestHistoryData,
        onRequestRestore: onRequestRestore,
        onError: onError
      },
      width: '100%',
      height: '100%'
    };

    // Initialiser OnlyOffice
    if (window.DocsAPI) {
      docApiRef.current = new window.DocsAPI.DocEditor('onlyoffice-editor', config);
    } else {
      // Charger le script OnlyOffice si pas encore chargé
      loadOnlyOfficeScript().then(() => {
        docApiRef.current = new window.DocsAPI.DocEditor('onlyoffice-editor', config);
      });
    }
  };

  const loadOnlyOfficeScript = () => {
    return new Promise((resolve, reject) => {
      if (window.DocsAPI) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `${import.meta.env.VITE_ONLYOFFICE_URL}/web-apps/apps/api/documents/api.js`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const getOnlyOfficeType = (documentType) => {
    switch (documentType) {
      case 'document': return 'word';
      case 'spreadsheet': return 'cell';
      case 'presentation': return 'slide';
      default: return 'word';
    }
  };

  const joinDocumentRoom = () => {
    if (socketService.getConnectionStatus()) {
      socketService.joinDocument(document.id);
    }
  };

  const leaveDocumentRoom = () => {
    if (socketService.getConnectionStatus()) {
      socketService.leaveDocument(document.id);
    }
  };

  // Événements OnlyOffice
  const onEditorReady = () => {
    setIsLoading(false);
    console.log('Éditeur OnlyOffice prêt');
  };

  const onDocumentStateChange = (event) => {
    if (event.data) {
      // Document modifié
      setLastSaved(null);
      
      // Envoyer les changements via Socket.IO
      if (socketService.getConnectionStatus()) {
        socketService.sendDocumentChanges(document.id, {
          type: 'content_change',
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const onRequestSaveAs = (event) => {
    // Gérer la sauvegarde sous un nouveau nom
    console.log('Demande de sauvegarde sous:', event);
  };

  const onRequestInsertImage = (event) => {
    // Gérer l'insertion d'images
    console.log('Demande d\'insertion d\'image:', event);
  };

  const onRequestMailMergeRecipients = (event) => {
    // Gérer le publipostage
    console.log('Demande de publipostage:', event);
  };

  const onRequestCompareFile = (event) => {
    // Gérer la comparaison de fichiers
    console.log('Demande de comparaison:', event);
  };

  const onRequestEditRights = () => {
    // Demander les droits d'édition
    console.log('Demande de droits d\'édition');
    setEditorMode('edit');
    // Réinitialiser l'éditeur avec les nouveaux droits
    initializeEditor();
  };

  const onRequestHistory = (event) => {
    // Afficher l'historique des versions
    console.log('Demande d\'historique:', event);
  };

  const onRequestHistoryClose = () => {
    // Fermer l'historique
    console.log('Fermeture de l\'historique');
  };

  const onRequestHistoryData = (event) => {
    // Récupérer les données d'historique
    console.log('Demande de données d\'historique:', event);
  };

  const onRequestRestore = (event) => {
    // Restaurer une version
    console.log('Demande de restauration:', event);
  };

  const onError = (event) => {
    console.error('Erreur OnlyOffice:', event);
    toast.error('Erreur lors du chargement de l\'éditeur');
  };

  // Actions
  const handleSave = async () => {
    if (!docApiRef.current) return;

    setIsSaving(true);
    try {
      // Déclencher la sauvegarde OnlyOffice
      docApiRef.current.downloadAs();
      
      // Mettre à jour les métadonnées du document
      await updateDocument(document.id, {
        lastEditedAt: new Date().toISOString()
      });
      
      setLastSaved(new Date());
      toast.success('Document sauvegardé');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    downloadFile(document.id, document.originalName);
  };

  const handleShare = () => {
    // TODO: Implémenter le partage
    toast.info('Fonctionnalité de partage en cours de développement');
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'document': return <FileText className="w-5 h-5" />;
      case 'spreadsheet': return <FileText className="w-5 h-5" />;
      case 'presentation': return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Barre d'outils */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {getDocumentIcon(document.documentType)}
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">{document.title}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>v{document.version}</span>
                {lastSaved && (
                  <span>• Sauvegardé à {lastSaved.toLocaleTimeString()}</span>
                )}
                {!lastSaved && document.lastEditedAt && (
                  <span>• Modifié le {new Date(document.lastEditedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Utilisateurs actifs */}
          {activeUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {activeUsers.slice(0, 3).map((user, index) => (
                  <div
                    key={user.userId}
                    className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                    title={user.userName}
                  >
                    {user.userName.split(' ').map(n => n[0]).join('')}
                  </div>
                ))}
              </div>
              {activeUsers.length > 3 && (
                <Badge variant="secondary">+{activeUsers.length - 3}</Badge>
              )}
            </div>
          )}

          {/* Statut de connexion */}
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-xs text-gray-600">
              {isConnected ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChatPanel}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditorMode(editorMode === 'edit' ? 'view' : 'edit')}
            >
              {editorMode === 'edit' ? (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Éditer
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSaving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                  />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Zone d'édition */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chargement de l'éditeur
              </h3>
              <p className="text-gray-600">
                Préparation de votre document...
              </p>
            </motion.div>
          </div>
        )}

        {/* Conteneur OnlyOffice */}
        <div 
          id="onlyoffice-editor" 
          className="w-full h-full"
          style={{ minHeight: '600px' }}
        />
      </div>

      {/* Barre d'état */}
      <div className="flex items-center justify-between p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <span>Mode: {editorMode === 'edit' ? 'Édition' : 'Lecture'}</span>
          <span>Taille: {Math.round(document.fileSize / 1024)} KB</span>
          <span>Type: {document.mimeType}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {activeUsers.length > 0 && (
            <span>{activeUsers.length} utilisateur(s) connecté(s)</span>
          )}
          <span>NovaSuite AI • OnlyOffice</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
