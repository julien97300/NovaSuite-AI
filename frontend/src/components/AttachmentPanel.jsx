import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Paperclip, 
  X, 
  Search, 
  Filter,
  Grid,
  List,
  Download,
  Eye,
  Trash2,
  Share,
  Star,
  StarOff,
  MoreVertical,
  Image,
  Video,
  Music,
  FileText,
  File,
  Presentation,
  Sheet,
  Archive,
  Calendar,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FileUploader from './FileUploader';
import toast from 'react-hot-toast';

const AttachmentPanel = ({ isOpen, onClose, documentId }) => {
  const [attachments, setAttachments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [showUploader, setShowUploader] = useState(false);

  // Données de démonstration
  const mockAttachments = [
    {
      id: 1,
      name: 'Présentation_Q4.pptx',
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      size: 2048000,
      uploadedAt: '2024-10-06T14:30:00Z',
      uploadedBy: 'Alice Martin',
      starred: true,
      thumbnail: null,
      category: 'presentation'
    },
    {
      id: 2,
      name: 'Logo_Entreprise.png',
      type: 'image/png',
      size: 512000,
      uploadedAt: '2024-10-05T09:15:00Z',
      uploadedBy: 'Bob Dupont',
      starred: false,
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzOTlmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TE9HTzwvdGV4dD48L3N2Zz4=',
      category: 'image'
    },
    {
      id: 3,
      name: 'Rapport_Financier.pdf',
      type: 'application/pdf',
      size: 1024000,
      uploadedAt: '2024-10-04T16:45:00Z',
      uploadedBy: 'Demo User',
      starred: false,
      thumbnail: null,
      category: 'document'
    },
    {
      id: 4,
      name: 'Video_Formation.mp4',
      type: 'video/mp4',
      size: 15728640,
      uploadedAt: '2024-10-03T11:20:00Z',
      uploadedBy: 'Alice Martin',
      starred: true,
      thumbnail: null,
      category: 'video'
    },
    {
      id: 5,
      name: 'Audio_Reunion.mp3',
      type: 'audio/mp3',
      size: 5242880,
      uploadedAt: '2024-10-02T13:10:00Z',
      uploadedBy: 'Bob Dupont',
      starred: false,
      thumbnail: null,
      category: 'audio'
    }
  ];

  useEffect(() => {
    // Simuler le chargement des pièces jointes
    setAttachments(mockAttachments);
  }, [documentId]);

  const getFileIcon = (type, category) => {
    const iconMap = {
      image: Image,
      video: Video,
      audio: Music,
      document: FileText,
      presentation: Presentation,
      spreadsheet: Sheet,
      archive: Archive,
      default: File
    };
    return iconMap[category] || iconMap.default;
  };

  const getFileColor = (category) => {
    const colorMap = {
      image: 'text-green-600 bg-green-100',
      video: 'text-red-600 bg-red-100',
      audio: 'text-purple-600 bg-purple-100',
      document: 'text-blue-600 bg-blue-100',
      presentation: 'text-orange-600 bg-orange-100',
      spreadsheet: 'text-green-600 bg-green-100',
      archive: 'text-yellow-600 bg-yellow-100',
      default: 'text-gray-600 bg-gray-100'
    };
    return colorMap[category] || colorMap.default;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAttachments = attachments.filter(attachment => {
    const matchesSearch = attachment.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || attachment.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const toggleStar = (attachmentId) => {
    setAttachments(prev => prev.map(att => 
      att.id === attachmentId ? { ...att, starred: !att.starred } : att
    ));
    toast.success('Favori mis à jour');
  };

  const deleteAttachment = (attachmentId) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
    toast.success('Pièce jointe supprimée');
  };

  const downloadAttachment = (attachment) => {
    // Simuler le téléchargement
    toast.success(`Téléchargement de ${attachment.name} démarré`);
  };

  const shareAttachment = (attachment) => {
    // Simuler le partage
    navigator.clipboard.writeText(`https://novasuite.ai/attachments/${attachment.id}`);
    toast.success('Lien de partage copié dans le presse-papiers');
  };

  const handleFilesUploaded = (newFiles) => {
    const newAttachments = newFiles.map(fileObj => ({
      id: Date.now() + Math.random(),
      name: fileObj.name,
      type: fileObj.type,
      size: fileObj.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Demo User',
      starred: false,
      thumbnail: fileObj.preview,
      category: fileObj.type.startsWith('image/') ? 'image' :
                fileObj.type.startsWith('video/') ? 'video' :
                fileObj.type.startsWith('audio/') ? 'audio' :
                fileObj.type.includes('presentation') ? 'presentation' :
                fileObj.type.includes('sheet') ? 'spreadsheet' :
                fileObj.type === 'application/pdf' ? 'document' : 'default'
    }));
    
    setAttachments(prev => [...newAttachments, ...prev]);
    setShowUploader(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Paperclip className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Pièces jointes</h2>
              <p className="text-sm text-gray-500">
                {filteredAttachments.length} fichier(s) attaché(s)
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowUploader(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Paperclip className="w-4 h-4 mr-2" />
              Ajouter des fichiers
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Uploader Modal */}
        <AnimatePresence>
          {showUploader && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-10 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Ajouter des pièces jointes</h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowUploader(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <FileUploader
                onFilesUploaded={handleFilesUploaded}
                maxFiles={20}
                maxSizePerFile={100 * 1024 * 1024} // 100MB
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher des fichiers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Filtre par type */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Vidéos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="presentation">Présentations</SelectItem>
                <SelectItem value="spreadsheet">Tableurs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mode d'affichage */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredAttachments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Paperclip className="w-16 h-16 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Aucune pièce jointe</h3>
              <p className="text-center mb-4">
                {searchQuery || filterType !== 'all' 
                  ? 'Aucun fichier ne correspond à vos critères de recherche'
                  : 'Commencez par ajouter des fichiers à ce document'
                }
              </p>
              {!searchQuery && filterType === 'all' && (
                <Button onClick={() => setShowUploader(true)}>
                  <Paperclip className="w-4 h-4 mr-2" />
                  Ajouter des fichiers
                </Button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-2'
            }>
              {filteredAttachments.map((attachment) => {
                const IconComponent = getFileIcon(attachment.type, attachment.category);
                const colorClasses = getFileColor(attachment.category);

                if (viewMode === 'grid') {
                  return (
                    <motion.div
                      key={attachment.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Aperçu */}
                      <div className={`w-full h-32 rounded-lg mb-3 flex items-center justify-center ${colorClasses.split(' ')[1]}`}>
                        {attachment.thumbnail ? (
                          <img
                            src={attachment.thumbnail}
                            alt={attachment.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <IconComponent className={`w-12 h-12 ${colorClasses.split(' ')[0]}`} />
                        )}
                      </div>

                      {/* Informations */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm text-gray-900 truncate pr-2">
                            {attachment.name}
                          </h4>
                          <button
                            onClick={() => toggleStar(attachment.id)}
                            className="text-gray-400 hover:text-yellow-500"
                          >
                            {attachment.starred ? (
                              <Star className="w-4 h-4 fill-current text-yellow-500" />
                            ) : (
                              <StarOff className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center text-xs text-gray-500 space-x-2">
                          <span>{formatFileSize(attachment.size)}</span>
                          <span>•</span>
                          <span>{formatDate(attachment.uploadedAt)}</span>
                        </div>

                        <div className="flex items-center text-xs text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          {attachment.uploadedBy}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadAttachment(attachment)}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => shareAttachment(attachment)}
                            >
                              <Share className="w-3 h-3" />
                            </Button>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Aperçu
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => shareAttachment(attachment)}>
                                <Share className="w-4 h-4 mr-2" />
                                Partager
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => deleteAttachment(attachment.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </motion.div>
                  );
                } else {
                  return (
                    <motion.div
                      key={attachment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Icône/Aperçu */}
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses.split(' ')[1]}`}>
                          {attachment.thumbnail ? (
                            <img
                              src={attachment.thumbnail}
                              alt={attachment.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <IconComponent className={`w-6 h-6 ${colorClasses.split(' ')[0]}`} />
                          )}
                        </div>

                        {/* Informations */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {attachment.name}
                            </h4>
                            {attachment.starred && (
                              <Star className="w-4 h-4 fill-current text-yellow-500" />
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span>{formatFileSize(attachment.size)}</span>
                            <span>{formatDate(attachment.uploadedAt)}</span>
                            <span>Par {attachment.uploadedBy}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStar(attachment.id)}
                          >
                            {attachment.starred ? (
                              <Star className="w-4 h-4 fill-current text-yellow-500" />
                            ) : (
                              <StarOff className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadAttachment(attachment)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => shareAttachment(attachment)}
                          >
                            <Share className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Aperçu
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => shareAttachment(attachment)}>
                                <Share className="w-4 h-4 mr-2" />
                                Partager
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => deleteAttachment(attachment.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </motion.div>
                  );
                }
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AttachmentPanel;
