import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  FileText, 
  CheckCircle, 
  BarChart3, 
  Presentation,
  Wand2,
  Copy,
  Download,
  RefreshCw,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { aiAPI } from '../lib/api';
import toast from 'react-hot-toast';

const AIAssistant = ({ documentType = 'document', documentContent = '' }) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState({});

  // États pour chaque fonctionnalité
  const [generateForm, setGenerateForm] = useState({
    prompt: '',
    type: documentType,
    length: 'medium'
  });

  const [correctForm, setCorrectForm] = useState({
    text: documentContent,
    language: 'fr'
  });

  const [summarizeForm, setSummarizeForm] = useState({
    text: documentContent,
    length: 'medium'
  });

  const [presentationForm, setPresentationForm] = useState({
    topic: '',
    slideCount: 10
  });

  const [formulaForm, setFormulaForm] = useState({
    description: '',
    context: ''
  });

  // Génération de contenu
  const handleGenerate = async () => {
    if (!generateForm.prompt.trim()) {
      toast.error('Veuillez saisir un prompt');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await aiAPI.generateContent({
        prompt: generateForm.prompt,
        type: generateForm.type,
        options: {
          maxTokens: generateForm.length === 'short' ? 500 : generateForm.length === 'long' ? 3000 : 1500
        }
      });

      setResults({
        ...results,
        generate: {
          content: response.data.data.content,
          usage: response.data.data.usage
        }
      });

      toast.success('Contenu généré avec succès');
    } catch (error) {
      console.error('Erreur génération:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Correction de texte
  const handleCorrect = async () => {
    if (!correctForm.text.trim()) {
      toast.error('Veuillez saisir du texte à corriger');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await aiAPI.correctText({
        text: correctForm.text,
        language: correctForm.language
      });

      setResults({
        ...results,
        correct: {
          correctedText: response.data.data.correctedText,
          corrections: response.data.data.corrections,
          usage: response.data.data.usage
        }
      });

      toast.success('Texte corrigé avec succès');
    } catch (error) {
      console.error('Erreur correction:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Résumé de texte
  const handleSummarize = async () => {
    if (!summarizeForm.text.trim()) {
      toast.error('Veuillez saisir du texte à résumer');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await aiAPI.summarizeText({
        text: summarizeForm.text,
        length: summarizeForm.length
      });

      setResults({
        ...results,
        summarize: {
          summary: response.data.data.summary,
          usage: response.data.data.usage
        }
      });

      toast.success('Résumé généré avec succès');
    } catch (error) {
      console.error('Erreur résumé:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Génération de présentation
  const handleGeneratePresentation = async () => {
    if (!presentationForm.topic.trim()) {
      toast.error('Veuillez saisir un sujet de présentation');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await aiAPI.generatePresentation({
        topic: presentationForm.topic,
        slideCount: presentationForm.slideCount
      });

      setResults({
        ...results,
        presentation: {
          presentation: response.data.data.presentation,
          usage: response.data.data.usage
        }
      });

      toast.success('Présentation générée avec succès');
    } catch (error) {
      console.error('Erreur génération présentation:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Génération de formule
  const handleGenerateFormula = async () => {
    if (!formulaForm.description.trim()) {
      toast.error('Veuillez décrire la formule souhaitée');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await aiAPI.generateFormula({
        description: formulaForm.description,
        context: formulaForm.context
      });

      setResults({
        ...results,
        formula: {
          formula: response.data.data.formula,
          explanation: response.data.data.explanation,
          example: response.data.data.example,
          alternatives: response.data.data.alternatives,
          usage: response.data.data.usage
        }
      });

      toast.success('Formule générée avec succès');
    } catch (error) {
      console.error('Erreur génération formule:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          NovaCopilot Assistant
        </h1>
        <p className="text-gray-600 mt-2">
          Votre assistant IA pour la création, correction et amélioration de contenu
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Générer
          </TabsTrigger>
          <TabsTrigger value="correct" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Corriger
          </TabsTrigger>
          <TabsTrigger value="summarize" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Résumer
          </TabsTrigger>
          <TabsTrigger value="presentation" className="flex items-center gap-2">
            <Presentation className="w-4 h-4" />
            Présentation
          </TabsTrigger>
          <TabsTrigger value="formula" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Formule
          </TabsTrigger>
        </TabsList>

        {/* Génération de contenu */}
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Génération de contenu
              </CardTitle>
              <CardDescription>
                Créez du contenu original à partir d'un prompt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Décrivez ce que vous voulez créer</Label>
                <Textarea
                  id="prompt"
                  placeholder="Ex: Rédigez un article sur les avantages de l'intelligence artificielle dans l'éducation..."
                  value={generateForm.prompt}
                  onChange={(e) => setGenerateForm({...generateForm, prompt: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de contenu</Label>
                  <Select 
                    value={generateForm.type} 
                    onValueChange={(value) => setGenerateForm({...generateForm, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="presentation">Présentation</SelectItem>
                      <SelectItem value="spreadsheet">Tableur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Longueur</Label>
                  <Select 
                    value={generateForm.length} 
                    onValueChange={(value) => setGenerateForm({...generateForm, length: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Court</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handleGenerate} 
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Générer le contenu
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Résultat de génération */}
          {results.generate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      Contenu généré
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(results.generate.content)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-900">
                      {results.generate.content}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Correction de texte */}
        <TabsContent value="correct" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Correction de texte
              </CardTitle>
              <CardDescription>
                Corrigez l'orthographe, la grammaire et améliorez le style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-to-correct">Texte à corriger</Label>
                <Textarea
                  id="text-to-correct"
                  placeholder="Collez ici le texte que vous souhaitez corriger..."
                  value={correctForm.text}
                  onChange={(e) => setCorrectForm({...correctForm, text: e.target.value})}
                  rows={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Langue</Label>
                <Select 
                  value={correctForm.language} 
                  onValueChange={(value) => setCorrectForm({...correctForm, language: value})}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">Anglais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleCorrect} 
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Correction en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Corriger le texte
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Résultat de correction */}
          {results.correct && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Texte corrigé
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(results.correct.correctedText)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-900">
                      {results.correct.correctedText}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {results.correct.corrections.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      Corrections apportées ({results.correct.corrections.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.correct.corrections.map((correction, index) => (
                        <div key={index} className="border-l-4 border-orange-400 pl-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{correction.type}</Badge>
                          </div>
                          <p className="text-sm">
                            <span className="line-through text-red-600">{correction.original}</span>
                            {' → '}
                            <span className="text-green-600 font-medium">{correction.corrected}</span>
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{correction.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </TabsContent>

        {/* Résumé de texte */}
        <TabsContent value="summarize" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Résumé de texte
              </CardTitle>
              <CardDescription>
                Créez un résumé concis de votre document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-to-summarize">Texte à résumer</Label>
                <Textarea
                  id="text-to-summarize"
                  placeholder="Collez ici le texte que vous souhaitez résumer..."
                  value={summarizeForm.text}
                  onChange={(e) => setSummarizeForm({...summarizeForm, text: e.target.value})}
                  rows={8}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Longueur du résumé</Label>
                <Select 
                  value={summarizeForm.length} 
                  onValueChange={(value) => setSummarizeForm({...summarizeForm, length: value})}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Court (2-3 phrases)</SelectItem>
                    <SelectItem value="medium">Moyen (1 paragraphe)</SelectItem>
                    <SelectItem value="long">Long (2-3 paragraphes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleSummarize} 
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Résumé en cours...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Créer le résumé
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Résultat du résumé */}
          {results.summarize && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      Résumé généré
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(results.summarize.summary)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-900">
                      {results.summarize.summary}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Génération de présentation */}
        <TabsContent value="presentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Presentation className="w-5 h-5" />
                Génération de présentation
              </CardTitle>
              <CardDescription>
                Créez une présentation complète à partir d'un sujet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="presentation-topic">Sujet de la présentation</Label>
                <Input
                  id="presentation-topic"
                  placeholder="Ex: Les enjeux de la transformation digitale en entreprise"
                  value={presentationForm.topic}
                  onChange={(e) => setPresentationForm({...presentationForm, topic: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slide-count">Nombre de diapositives</Label>
                <Input
                  id="slide-count"
                  type="number"
                  min="5"
                  max="20"
                  value={presentationForm.slideCount}
                  onChange={(e) => setPresentationForm({...presentationForm, slideCount: parseInt(e.target.value)})}
                  className="w-32"
                />
              </div>
              
              <Button 
                onClick={handleGeneratePresentation} 
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Presentation className="w-4 h-4 mr-2" />
                    Générer la présentation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Résultat de la présentation */}
          {results.presentation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Presentation className="w-5 h-5 text-orange-600" />
                      {results.presentation.presentation.title}
                    </CardTitle>
                    <Badge variant="secondary">
                      {results.presentation.presentation.slides.length} diapositives
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.presentation.presentation.slides.map((slide, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            Diapositive {slide.slideNumber}: {slide.title}
                          </h4>
                        </div>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <pre className="whitespace-pre-wrap">{slide.content}</pre>
                        </div>
                        {slide.notes && (
                          <div className="mt-2 text-xs text-gray-600">
                            <strong>Notes:</strong> {slide.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Génération de formule */}
        <TabsContent value="formula" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Génération de formule
              </CardTitle>
              <CardDescription>
                Créez des formules Excel/Calc à partir d'une description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="formula-description">Description de la formule</Label>
                <Textarea
                  id="formula-description"
                  placeholder="Ex: Calculer la moyenne des ventes du trimestre en excluant les valeurs nulles"
                  value={formulaForm.description}
                  onChange={(e) => setFormulaForm({...formulaForm, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="formula-context">Contexte (optionnel)</Label>
                <Textarea
                  id="formula-context"
                  placeholder="Ex: Les données sont dans les colonnes A1:A12, certaines cellules peuvent être vides"
                  value={formulaForm.context}
                  onChange={(e) => setFormulaForm({...formulaForm, context: e.target.value})}
                  rows={2}
                />
              </div>
              
              <Button 
                onClick={handleGenerateFormula} 
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Générer la formule
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Résultat de la formule */}
          {results.formula && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      Formule générée
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(results.formula.formula)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Formule</Label>
                    <div className="bg-green-50 p-3 rounded-lg font-mono text-sm mt-1">
                      {results.formula.formula}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Explication</Label>
                    <p className="text-sm text-gray-700 mt-1">
                      {results.formula.explanation}
                    </p>
                  </div>
                  
                  {results.formula.example && (
                    <div>
                      <Label className="text-sm font-medium">Exemple d'utilisation</Label>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm mt-1">
                        {results.formula.example}
                      </div>
                    </div>
                  )}
                  
                  {results.formula.alternatives && results.formula.alternatives.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Alternatives</Label>
                      <div className="space-y-2 mt-1">
                        {results.formula.alternatives.map((alt, index) => (
                          <div key={index} className="bg-blue-50 p-2 rounded text-sm font-mono">
                            {alt}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAssistant;
