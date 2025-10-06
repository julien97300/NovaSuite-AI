import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  Music, 
  FileText, 
  Presentation,
  Sheet,
  Archive,
  X,
  Paperclip,
  Check,
  AlertCircle,
  Download,
  Eye,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';

const FileUploader = ({ onFilesUploaded, maxFiles = 10, maxSizePerFile = 100 * 1024 * 1024 }) => {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  // Types de fichiers supportés avec leurs icônes et couleurs
  const fileTypes = {
    // Images
    'image/jpeg': { icon: Image, color: 'text-green-600', bg: 'bg-green-100', name: 'JPEG' },
    'image/jpg': { icon: Image, color: 'text-green-600', bg: 'bg-green-100', name: 'JPG' },
    'image/png': { icon: Image, color: 'text-green-600', bg: 'bg-green-100', name: 'PNG' },
    'image/gif': { icon: Image, color: 'text-green-600', bg: 'bg-green-100', name: 'GIF' },
    'image/webp': { icon: Image, color: 'text-green-600', bg: 'bg-green-100', name: 'WebP' },
    'image/svg+xml': { icon: Image, color: 'text-green-600', bg: 'bg-green-100', name: 'SVG' },
    
    // Vidéos
    'video/mp4': { icon: Video, color: 'text-red-600', bg: 'bg-red-100', name: 'MP4' },
    'video/avi': { icon: Video, color: 'text-red-600', bg: 'bg-red-100', name: 'AVI' },
    'video/mov': { icon: Video, color: 'text-red-600', bg: 'bg-red-100', name: 'MOV' },
    'video/wmv': { icon: Video, color: 'text-red-600', bg: 'bg-red-100', name: 'WMV' },
    'video/webm': { icon: Video, color: 'text-red-600', bg: 'bg-red-100', name: 'WebM' },
    
    // Audio
    'audio/mp3': { icon: Music, color: 'text-purple-600', bg: 'bg-purple-100', name: 'MP3' },
    'audio/wav': { icon: Music, color: 'text-purple-600', bg: 'bg-purple-100', name: 'WAV' },
    'audio/ogg': { icon: Music, color: 'text-purple-600', bg: 'bg-purple-100', name: 'OGG' },
    'audio/m4a': { icon: Music, color: 'text-purple-600', bg: 'bg-purple-100', name: 'M4A' },
    
    // Documents Office
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { 
      icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', name: 'DOCX' 
    },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { 
      icon: Sheet, color: 'text-green-600', bg: 'bg-green-100', name: 'XLSX' 
    },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { 
      icon: Presentation, color: 'text-orange-600', bg: 'bg-orange-100', name: 'PPTX' 
    },
    
    // Documents classiques
    'application/pdf': { icon: FileText, color: 'text-red-600', bg: 'bg-red-100', name: 'PDF' },
    'text/plain': { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100', name: 'TXT' },
    'text/csv': { icon: Sheet, color: 'text-green-600', bg: 'bg-green-100', name: 'CSV' },
    
    // Archives
    'application/zip': { icon: Archive, color: 'text-yellow-600', bg: 'bg-yellow-100', name: 'ZIP' },
    'application/x-rar-compressed': { icon: Archive, color: 'text-yellow-600', bg: 'bg-yellow-100', name: 'RAR' },
    'application/x-7z-compressed': { icon: Archive, color: 'text-yellow-600', bg: 'bg-yellow-100', name: '7Z' },
    
    // Défaut
    'default': { icon: File, color: 'text-gray-600', bg: 'bg-gray-100', name: 'Fichier' }
  };

  const getFileTypeInfo = (mimeType) => {
    return fileTypes[mimeType] || fileTypes.default;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    if (file.size > maxSizePerFile) {
      toast.error(`Le fichier "${file.name}" est trop volumineux. Taille maximale: ${formatFileSize(maxSizePerFile)}`);
      return false;
    }
    return true;
  };

  const handleFileSelect = useCallback((selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    
    if (files.length + fileArray.length > maxFiles) {
      toast.error(`Vous ne pouvez pas ajouter plus de ${maxFiles} fichiers`);
      return;
    }

    const validFiles = fileArray.filter(validateFile);
    
    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending', // pending, uploading, completed, error
      progress: 0,
      preview: null
    }));

    // Créer des aperçus pour les images
    newFiles.forEach(fileObj => {
      if (fileObj.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { ...f, preview: e.target.result } : f
          ));
        };
        reader.readAsDataURL(fileObj.file);
      }
    });

    setFiles(prev => [...prev, ...newFiles]);
    
    // Simuler l'upload
    newFiles.forEach(fileObj => {
      simulateUpload(fileObj.id);
    });

  }, [files.length, maxFiles, maxSizePerFile]);

  const simulateUpload = (fileId) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'uploading' } : f
    ));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'completed', progress: 100 } : f
        ));
        
        const completedFile = files.find(f => f.id === fileId);
        if (completedFile && onFilesUploaded) {
          onFilesUploaded([completedFile]);
        }
        
        toast.success('Fichier uploadé avec succès !');
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ));
      }
    }, 200);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearAllFiles = () => {
    setFiles([]);
    toast.success('Tous les fichiers ont été supprimés');
  };

  return (
    <div className="space-y-4">
      {/* Zone de drop */}
      <Card 
        className={`transition-all duration-200 cursor-pointer ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50 border-2 border-dashed' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-8 text-center">
          <motion.div
            animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
            className="space-y-4"
          >
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              isDragOver ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Paperclip className={`w-8 h-8 ${
                isDragOver ? 'text-blue-600' : 'text-gray-400'
              }`} />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ajouter des fichiers
              </h3>
              <p className="text-gray-600 mb-4">
                Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Badge variant="secondary">Images</Badge>
                <Badge variant="secondary">Vidéos</Badge>
                <Badge variant="secondary">Audio</Badge>
                <Badge variant="secondary">Documents</Badge>
                <Badge variant="secondary">Archives</Badge>
              </div>
              
              <p className="text-sm text-gray-500">
                Taille max: {formatFileSize(maxSizePerFile)} • Max {maxFiles} fichiers
              </p>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z"
      />

      {/* Liste des fichiers */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                Fichiers ({files.length}/{maxFiles})
              </h4>
              {files.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFiles}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Tout supprimer
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {files.map((fileObj) => {
                const typeInfo = getFileTypeInfo(fileObj.type);
                const IconComponent = typeInfo.icon;

                return (
                  <motion.div
                    key={fileObj.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Aperçu ou icône */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${typeInfo.bg}`}>
                        {fileObj.preview ? (
                          <img
                            src={fileObj.preview}
                            alt={fileObj.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <IconComponent className={`w-6 h-6 ${typeInfo.color}`} />
                        )}
                      </div>

                      {/* Informations du fichier */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {fileObj.name}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {typeInfo.name}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-500 mb-2">
                          {formatFileSize(fileObj.size)}
                        </p>

                        {/* Barre de progression */}
                        {fileObj.status === 'uploading' && (
                          <div className="space-y-1">
                            <Progress value={fileObj.progress} className="h-2" />
                            <p className="text-xs text-gray-500">
                              Upload en cours... {Math.round(fileObj.progress)}%
                            </p>
                          </div>
                        )}

                        {fileObj.status === 'completed' && (
                          <div className="flex items-center text-green-600 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Upload terminé
                          </div>
                        )}

                        {fileObj.status === 'error' && (
                          <div className="flex items-center text-red-600 text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Erreur d'upload
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {fileObj.status === 'completed' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Simuler l'aperçu
                                toast.success('Aperçu du fichier (fonctionnalité simulée)');
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Simuler le téléchargement
                                const url = URL.createObjectURL(fileObj.file);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = fileObj.name;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(fileObj.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
