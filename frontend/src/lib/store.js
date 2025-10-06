import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store d'authentification
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
        localStorage.setItem('token', token);
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);

// Store des documents
export const useDocumentStore = create((set, get) => ({
  documents: [],
  currentDocument: null,
  folders: [],
  currentFolder: null,
  isLoading: false,
  
  setDocuments: (documents) => set({ documents }),
  
  addDocument: (document) => set((state) => ({
    documents: [document, ...state.documents]
  })),
  
  updateDocument: (documentId, updates) => set((state) => ({
    documents: state.documents.map(doc => 
      doc.id === documentId ? { ...doc, ...updates } : doc
    ),
    currentDocument: state.currentDocument?.id === documentId 
      ? { ...state.currentDocument, ...updates } 
      : state.currentDocument
  })),
  
  removeDocument: (documentId) => set((state) => ({
    documents: state.documents.filter(doc => doc.id !== documentId),
    currentDocument: state.currentDocument?.id === documentId 
      ? null 
      : state.currentDocument
  })),
  
  setCurrentDocument: (document) => set({ currentDocument: document }),
  
  setFolders: (folders) => set({ folders }),
  
  setCurrentFolder: (folder) => set({ currentFolder: folder }),
  
  setLoading: (isLoading) => set({ isLoading })
}));

// Store de l'interface utilisateur
export const useUIStore = create((set) => ({
  theme: 'light',
  sidebarOpen: true,
  chatPanelOpen: false,
  currentView: 'dashboard', // dashboard, documents, editor
  
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
  
  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen
  })),
  
  toggleChatPanel: () => set((state) => ({
    chatPanelOpen: !state.chatPanelOpen
  })),
  
  setCurrentView: (view) => set({ currentView: view }),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setChatPanelOpen: (open) => set({ chatPanelOpen: open })
}));

// Store de collaboration
export const useCollaborationStore = create((set, get) => ({
  activeUsers: [],
  documentChanges: [],
  isConnected: false,
  socket: null,
  
  setSocket: (socket) => set({ socket }),
  
  setConnected: (isConnected) => set({ isConnected }),
  
  setActiveUsers: (users) => set({ activeUsers: users }),
  
  addUser: (user) => set((state) => ({
    activeUsers: [...state.activeUsers.filter(u => u.userId !== user.userId), user]
  })),
  
  removeUser: (userId) => set((state) => ({
    activeUsers: state.activeUsers.filter(u => u.userId !== userId)
  })),
  
  addDocumentChange: (change) => set((state) => ({
    documentChanges: [...state.documentChanges, change]
  })),
  
  clearDocumentChanges: () => set({ documentChanges: [] })
}));

// Store de l'IA
export const useAIStore = create((set, get) => ({
  chatHistory: [],
  isProcessing: false,
  suggestions: [],
  
  addChatMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, message]
  })),
  
  clearChatHistory: () => set({ chatHistory: [] }),
  
  setProcessing: (isProcessing) => set({ isProcessing }),
  
  setSuggestions: (suggestions) => set({ suggestions }),
  
  addSuggestion: (suggestion) => set((state) => ({
    suggestions: [...state.suggestions, suggestion]
  })),
  
  removeSuggestion: (suggestionId) => set((state) => ({
    suggestions: state.suggestions.filter(s => s.id !== suggestionId)
  }))
}));
