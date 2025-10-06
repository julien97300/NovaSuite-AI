import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Table, 
  Presentation, 
  Upload, 
  Search, 
  Filter,
  Grid3X3,
  List,
  Plus,
  Sparkles,
  Clock,
  Users,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDocumentStore, useAuthStore } from '../lib/store';
import { documentsAPI, uploadFile } from '../lib/api';
import toast from 'react-hot-toast';

const Dashboard = ({ onOpenDocument, onCreateDocument }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [filterType, setFilterType] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  
  const { documents, isLoading, setDocuments, setLoading, addDocument } = useDocumentStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await documentsAPI.getAll();
      setDocuments(response.data.data.documents);
    } catch (error) {
      console.error('Erreur chargement documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(file, (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });
      
      addDocument(response.data.data.document);
      toast.success('Document uploadé avec succès');
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.documentType === filterType;
    return matchesSearch && matchesFilter;
  });

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'document': return <FileText className="w-5 h-5" />;
      case 'spreadsheet': return <Table className="w-5 h-5" />;
      case 'presentation': return <Presentation className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getDocumentColor = (type) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-700';
      case 'spreadsheet': return 'bg-green-100 text-green-700';
      case 'presentation': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user?.firstName} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos documents et collaborez avec votre équipe
          </p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.rtf,.odt,.ods,.odp"
          />
          <Button
            onClick={() => document.getElementById('file-upload').click()}
            disabled={isUploading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Upload...' : 'Importer'}
          </Button>
          
          <Button
            onClick={() => onCreateDocument('document')}
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Modifiés récemment</p>
                <p className="text-2xl font-bold">
                  {documents.filter(doc => {
                    const dayAgo = new Date();
                    dayAgo.setDate(dayAgo.getDate() - 1);
                    return new Date(doc.lastEditedAt) > dayAgo;
                  }).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Collaborations</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Favoris</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher des documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Tous les types</option>
            <option value="document">Documents</option>
            <option value="spreadsheet">Tableurs</option>
            <option value="presentation">Présentations</option>
            <option value="pdf">PDF</option>
          </select>
          
          <div className="flex border border-gray-300 rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Liste des documents */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Aucun document trouvé' : 'Aucun document'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Essayez de modifier votre recherche'
              : 'Commencez par créer ou importer votre premier document'
            }
          </p>
          {!searchTerm && (
            <Button
              onClick={() => onCreateDocument('document')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer un document
            </Button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-2'
        }>
          {filteredDocuments.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {viewMode === 'grid' ? (
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => onOpenDocument(document)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${getDocumentColor(document.documentType)}`}>
                        {getDocumentIcon(document.documentType)}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {document.documentType}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1 truncate">
                      {document.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      Modifié le {formatDate(document.lastEditedAt)}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(document.fileSize)}</span>
                      <span>v{document.version}</span>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => onOpenDocument(document)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getDocumentColor(document.documentType)}`}>
                          {getDocumentIcon(document.documentType)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {document.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatFileSize(document.fileSize)} • Modifié le {formatDate(document.lastEditedAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {document.documentType}
                        </Badge>
                        <span className="text-xs text-gray-500">v{document.version}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
