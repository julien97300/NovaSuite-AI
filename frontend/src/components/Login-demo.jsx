import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '../lib/store-demo';
import toast from 'react-hot-toast';

const Login = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    
    try {
      // En mode démo, on accepte n'importe quel email/mot de passe
      await login(formData);
      toast.success('Connexion réussie ! Bienvenue dans NovaSuite AI');
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@novasuite.ai',
      password: 'demo123'
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Côté gauche - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NovaSuite AI
            </h1>
            <p className="text-gray-600 mt-2">
              Votre suite bureautique intelligente
            </p>
          </div>

          {/* Bannière de démonstration */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Mode Démonstration</h3>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              Testez NovaSuite AI sans inscription ! Utilisez n'importe quel email et mot de passe.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoLogin}
              className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Remplir avec des données de démo
            </Button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                  />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          {/* Lien vers l'inscription */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <button
                onClick={onToggleMode}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                S'inscrire
              </button>
            </p>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>En vous connectant, vous acceptez nos</p>
            <p>
              <a href="#" className="text-blue-600 hover:underline">Conditions d'utilisation</a>
              {' et notre '}
              <a href="#" className="text-blue-600 hover:underline">Politique de confidentialité</a>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Côté droit - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-white max-w-md"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8"
          >
            <Sparkles className="w-16 h-16 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold mb-4">
            Bienvenue dans l'avenir de la bureautique
          </h2>
          
          <p className="text-lg text-white/90 mb-8">
            Découvrez une suite bureautique révolutionnaire alimentée par l'intelligence artificielle. 
            Créez, collaborez et innovez comme jamais auparavant.
          </p>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center text-white/90"
            >
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>Assistant IA intégré (NovaCopilot)</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center text-white/90"
            >
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>Collaboration en temps réel</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center text-white/90"
            >
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>Compatible avec tous vos formats</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
