import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store d'authentification pour la démo
export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      
      login: async (credentials) => {
        // Simulation d'une connexion réussie
        const mockUser = {
          id: 1,
          firstName: 'Demo',
          lastName: 'User',
          email: credentials.email,
          createdAt: new Date().toISOString()
        };
        
        const mockToken = 'demo_jwt_token_' + Date.now();
        
        set({
          isAuthenticated: true,
          token: mockToken,
          user: mockUser
        });
        
        return { success: true, user: mockUser, token: mockToken };
      },
      
      register: async (userData) => {
        // Simulation d'une inscription réussie
        const mockUser = {
          id: 1,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          createdAt: new Date().toISOString()
        };
        
        const mockToken = 'demo_jwt_token_' + Date.now();
        
        set({
          isAuthenticated: true,
          token: mockToken,
          user: mockUser
        });
        
        return { success: true, user: mockUser, token: mockToken };
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null
        });
      },
      
      updateProfile: async (profileData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...profileData };
        set({ user: updatedUser });
        return { success: true, user: updatedUser };
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user
      })
    }
  )
);

// Store UI pour la démo
export const useUIStore = create((set) => ({
  currentView: 'dashboard',
  sidebarOpen: true,
  chatPanelOpen: false,
  
  setCurrentView: (view) => set({ currentView: view }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleChatPanel: () => set((state) => ({ chatPanelOpen: !state.chatPanelOpen }))
}));

// Store de documents pour la démo
export const useDocumentStore = create((set, get) => ({
  documents: [
    {
      id: 1,
      title: 'Rapport Mensuel - Octobre 2024',
      documentType: 'document',
      fileName: 'rapport-octobre.docx',
      fileSize: 245760,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      createdAt: '2024-10-01T10:30:00Z',
      lastEditedAt: '2024-10-06T14:20:00Z',
      version: 3,
      owner: {
        id: 1,
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@novasuite.ai'
      }
    },
    {
      id: 2,
      title: 'Budget Prévisionnel 2025',
      documentType: 'spreadsheet',
      fileName: 'budget-2025.xlsx',
      fileSize: 512000,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      createdAt: '2024-09-28T09:15:00Z',
      lastEditedAt: '2024-10-05T16:45:00Z',
      version: 7,
      owner: {
        id: 1,
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@novasuite.ai'
      }
    },
    {
      id: 3,
      title: 'Présentation Stratégie Q4',
      documentType: 'presentation',
      fileName: 'strategie-q4.pptx',
      fileSize: 1024000,
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      createdAt: '2024-10-03T11:00:00Z',
      lastEditedAt: '2024-10-06T13:30:00Z',
      version: 2,
      owner: {
        id: 1,
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@novasuite.ai'
      }
    }
  ],
  
  folders: [
    {
      id: 1,
      name: 'Projets 2024',
      parentId: null,
      createdAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 2,
      name: 'Rapports',
      parentId: null,
      createdAt: '2024-02-01T09:00:00Z'
    }
  ],
  
  recentDocuments: [],
  
  getDocuments: async () => {
    const documents = get().documents;
    return { success: true, data: { documents, total: documents.length } };
  },
  
  createDocument: async (documentData) => {
    const newDocument = {
      id: Date.now(),
      ...documentData,
      createdAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString(),
      version: 1,
      owner: get().user || { id: 1, firstName: 'Demo', lastName: 'User', email: 'demo@novasuite.ai' }
    };
    
    set((state) => ({
      documents: [newDocument, ...state.documents]
    }));
    
    return { success: true, data: { document: newDocument } };
  },
  
  updateDocument: async (id, updates) => {
    set((state) => ({
      documents: state.documents.map(doc => 
        doc.id === id 
          ? { ...doc, ...updates, lastEditedAt: new Date().toISOString() }
          : doc
      )
    }));
    
    return { success: true };
  },
  
  deleteDocument: async (id) => {
    set((state) => ({
      documents: state.documents.filter(doc => doc.id !== id)
    }));
    
    return { success: true };
  }
}));

// Store de collaboration pour la démo
export const useCollaborationStore = create((set) => ({
  activeUsers: [
    {
      userId: 2,
      userName: 'Alice Martin',
      userEmail: 'alice@example.com',
      cursor: { x: 150, y: 200 },
      lastActivity: new Date().toISOString()
    },
    {
      userId: 3,
      userName: 'Bob Dupont',
      userEmail: 'bob@example.com',
      cursor: { x: 300, y: 150 },
      lastActivity: new Date().toISOString()
    }
  ],
  
  isConnected: true,
  
  joinDocument: (documentId) => {
    console.log('Joined document:', documentId);
  },
  
  leaveDocument: (documentId) => {
    console.log('Left document:', documentId);
  },
  
  updateCursor: (position) => {
    console.log('Cursor updated:', position);
  }
}));
