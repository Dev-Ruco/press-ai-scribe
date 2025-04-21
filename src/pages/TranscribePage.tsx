import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ArrowLeft, Upload, Link2, ClipboardCopy, Download, Play, Pause, Volume2, FastForward, Rewind, Clock, Headphones, Mic, FileAudio, Settings, History, LanguagesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TranscriptionHistory } from "@/components/transcription/TranscriptionHistory";
const TranscribePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionComplete, setTranscriptionComplete] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("pt-MZ");
  const [transcriptionMode, setTranscriptionMode] = useState("balanced");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [advancedSettings, setAdvancedSettings] = useState({
    multiSpeaker: false,
    autoPunctuation: true,
    highlightKeywords: false
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setTranscriptionComplete(false);
      setTranscriptionText("");
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setTranscriptionComplete(false);
      setTranscriptionText("");
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const startTranscription = (source: 'file' | 'link') => {
    if (source === 'file' && !selectedFile || source === 'link' && !videoLink) {
      toast.error(source === 'file' ? "Por favor, selecione um arquivo para transcrever." : "Por favor, insira um link de vídeo válido.");
      return;
    }
    setIsTranscribing(true);

    // Simulate transcription process
    setTimeout(() => {
      setIsTranscribing(false);
      setTranscriptionComplete(true);
      setTranscriptionText(`Esta é uma transcrição simulada ${source === 'file' ? 'do arquivo ' + selectedFile?.name : 'do vídeo ' + videoLink}.\n\n[00:00:01] Olá, bem-vindo ao Press AI.\n\n[00:00:05] Nosso sistema de transcrição utiliza tecnologia avançada para converter áudio em texto com alta precisão.\n\n[00:00:12] Você pode fazer upload de arquivos de áudio ou vídeo, ou fornecer um link para um vídeo online.\n\n[00:00:18] A transcrição será gerada automaticamente e você poderá baixá-la ou copiá-la para uso em seus projetos editoriais.`);
      toast.success(source === 'file' ? "Transcrição do arquivo concluída com sucesso!" : "Transcrição do vídeo concluída com sucesso!");
    }, 3000);
  };
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const handleCopyText = () => {
    navigator.clipboard.writeText(transcriptionText);
    toast.success("Texto copiado para a área de transferência");
  };
  const handleDownload = () => {
    const blob = new Blob([transcriptionText], {
      type: "text/plain"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcricao-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Transcrição baixada com sucesso");
  };
  const recentTranscriptions = [{
    id: '1',
    name: 'entrevista-ministro.mp3',
    date: '18/04/2025',
    duration: '14:32',
    status: 'completed' as const
  }, {
    id: '2',
    name: 'reuniao-editorial.mp4',
    date: '17/04/2025',
    duration: '48:15',
    status: 'completed' as const
  }, {
    id: '3',
    name: 'podcast-economia.mp3',
    date: '15/04/2025',
    duration: '27:04',
    status: 'completed' as const
  }, {
    id: '4',
    name: 'coletiva-imprensa.wav',
    date: '15/04/2025',
    duration: '35:22',
    status: 'processing' as const
  }, {
    id: '5',
    name: 'declaracao-presidente.mp3',
    date: '14/04/2025',
    duration: '05:17',
    status: 'failed' as const
  }];
  return <MainLayout>
      <div className="mb-6">
        
      </div>
      
      <div className="mb-6">
        <h1 className="title-main text-primary-dark flex items-center gap-2 text-3xl font-bold">
          <Headphones className="h-8 w-8" />
          Transcrever Arquivo
        </h1>
        <p className="text-text-secondary mt-2">
          Converta arquivos de áudio ou vídeo em texto de forma rápida e precisa.
        </p>
      </div>

      <Tabs defaultValue="file" className="w-full space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History size={16} />
            <span>Histórico</span>
          </TabsTrigger>
          <TabsTrigger value="file" className="flex items-center gap-2">
            <Upload size={16} />
            <span>Upload de Arquivo</span>
          </TabsTrigger>
          <TabsTrigger value="link" className="flex items-center gap-2">
            <Link2 size={16} />
            <span>Link de Vídeo</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TabsContent value="history" className="lg:col-span-3 m-0">
            <TranscriptionHistory transcriptions={recentTranscriptions} />
          </TabsContent>
          
          <TabsContent value="file" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Upload de Arquivo</CardTitle>
                <CardDescription>
                  Carregue um arquivo de áudio ou vídeo para transcrição.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`border-2 border-dashed ${selectedFile ? 'border-primary' : 'border-border'} rounded-xl p-8 text-center transition-colors`} onDrop={handleDrop} onDragOver={handleDragOver}>
                  <Input type="file" id="file-upload" accept="audio/*,video/*" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    {selectedFile ? <FileAudio className="h-10 w-10 text-primary mb-4" /> : <Upload className="h-10 w-10 text-primary mb-4" />}
                    <p className="text-text-primary font-medium mb-1">
                      {selectedFile ? selectedFile.name : "Arraste ou clique para fazer upload"}
                    </p>
                    <p className="text-text-secondary text-sm">
                      {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "Formatos suportados: MP3, MP4, WAV (máx. 500MB)"}
                    </p>
                  </label>
                </div>
                
                <div className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <LanguagesIcon size={16} />
                      Idioma Principal
                    </h3>
                    <Select defaultValue={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-MZ">Português (🇲🇿)</SelectItem>
                        <SelectItem value="pt-BR">Português (🇧🇷)</SelectItem>
                        <SelectItem value="en">Inglês (🇬🇧)</SelectItem>
                        <SelectItem value="fr">Francês (🇫🇷)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Settings size={16} />
                      Modo de Transcrição
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant={transcriptionMode === "fast" ? "default" : "outline"} className="flex flex-col h-auto py-3 gap-1" onClick={() => setTranscriptionMode("fast")}>
                        <span className="text-lg">🐆</span>
                        <span className="text-xs font-medium">Cheetah</span>
                        <span className="text-xs opacity-70">Mais Rápido</span>
                      </Button>
                      <Button variant={transcriptionMode === "balanced" ? "default" : "outline"} className="flex flex-col h-auto py-3 gap-1" onClick={() => setTranscriptionMode("balanced")}>
                        <span className="text-lg">🐬</span>
                        <span className="text-xs font-medium">Dolphin</span>
                        <span className="text-xs opacity-70">Equilibrado</span>
                      </Button>
                      <Button variant={transcriptionMode === "accurate" ? "default" : "outline"} className="flex flex-col h-auto py-3 gap-1" onClick={() => setTranscriptionMode("accurate")}>
                        <span className="text-lg">🐋</span>
                        <span className="text-xs font-medium">Whale</span>
                        <span className="text-xs opacity-70">Mais Preciso</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-sm flex items-center gap-2">
                        <Settings size={16} />
                        Configurações Avançadas
                      </h3>
                    </div>
                    <div className="space-y-3 p-4 bg-bg-gray rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <Label htmlFor="multi-speaker" className="text-sm">Múltiplos interlocutores</Label>
                          <p className="text-xs text-muted-foreground">Identifica diferentes falantes</p>
                        </div>
                        <Switch id="multi-speaker" checked={advancedSettings.multiSpeaker} onCheckedChange={checked => setAdvancedSettings({
                        ...advancedSettings,
                        multiSpeaker: checked
                      })} />
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-punctuation" className="text-sm">Pontuação automática</Label>
                          <p className="text-xs text-muted-foreground">Adiciona pontuação de forma inteligente</p>
                        </div>
                        <Switch id="auto-punctuation" checked={advancedSettings.autoPunctuation} onCheckedChange={checked => setAdvancedSettings({
                        ...advancedSettings,
                        autoPunctuation: checked
                      })} />
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <Label htmlFor="highlight-keywords" className="text-sm">Realce de palavras-chave</Label>
                          <p className="text-xs text-muted-foreground">Destaca termos importantes</p>
                        </div>
                        <Switch id="highlight-keywords" checked={advancedSettings.highlightKeywords} onCheckedChange={checked => setAdvancedSettings({
                        ...advancedSettings,
                        highlightKeywords: checked
                      })} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary-dark gap-2" onClick={() => startTranscription('file')} disabled={!selectedFile || isTranscribing}>
                  {isTranscribing ? <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processando...</span>
                    </> : <>
                      <Mic size={16} />
                      <span>Iniciar Transcrição</span>
                    </>}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="link" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Link de Vídeo</CardTitle>
                <CardDescription>
                  Cole o link de um vídeo online para transcrever seu áudio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="video-link">URL do vídeo</Label>
                    <Input id="video-link" placeholder="Cole o link do vídeo aqui (YouTube, Vimeo, etc)" value={videoLink} onChange={e => setVideoLink(e.target.value)} />
                    <p className="text-xs text-muted-foreground">
                      Exemplo: https://www.youtube.com/watch?v=exemplo
                    </p>
                  </div>
                  
                  {/* Repetimos as mesmas configurações da aba de arquivo */}
                  <div>
                    <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <LanguagesIcon size={16} />
                      Idioma Principal
                    </h3>
                    <Select defaultValue={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-MZ">Português (🇲🇿)</SelectItem>
                        <SelectItem value="pt-BR">Português (🇧🇷)</SelectItem>
                        <SelectItem value="en">Inglês (🇬🇧)</SelectItem>
                        <SelectItem value="fr">Francês (🇫🇷)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Settings size={16} />
                      Modo de Transcrição
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant={transcriptionMode === "fast" ? "default" : "outline"} className="flex flex-col h-auto py-3 gap-1" onClick={() => setTranscriptionMode("fast")}>
                        <span className="text-lg">🐆</span>
                        <span className="text-xs font-medium">Cheetah</span>
                        <span className="text-xs opacity-70">Mais Rápido</span>
                      </Button>
                      <Button variant={transcriptionMode === "balanced" ? "default" : "outline"} className="flex flex-col h-auto py-3 gap-1" onClick={() => setTranscriptionMode("balanced")}>
                        <span className="text-lg">🐬</span>
                        <span className="text-xs font-medium">Dolphin</span>
                        <span className="text-xs opacity-70">Equilibrado</span>
                      </Button>
                      <Button variant={transcriptionMode === "accurate" ? "default" : "outline"} className="flex flex-col h-auto py-3 gap-1" onClick={() => setTranscriptionMode("accurate")}>
                        <span className="text-lg">🐋</span>
                        <span className="text-xs font-medium">Whale</span>
                        <span className="text-xs opacity-70">Mais Preciso</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary-dark gap-2" onClick={() => startTranscription('link')} disabled={!videoLink || isTranscribing}>
                  {isTranscribing ? <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processando...</span>
                    </> : <>
                      <Link2 size={16} />
                      <span>Iniciar Transcrição</span>
                    </>}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Preview de transcrição - visível em todas as abas */}
          <div className={`lg:col-span-2 ${transcriptionComplete ? 'block' : 'hidden lg:block'}`}>
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileAudio size={18} />
                    Preview da Transcrição
                  </CardTitle>
                  {selectedFile && <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline">{selectedFile.name}</Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock size={12} />
                        {transcriptionComplete ? "00:14:32" : "--:--:--"}
                      </Badge>
                    </CardDescription>}
                  {videoLink && !selectedFile && <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline" className="truncate max-w-[200px]">{videoLink}</Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock size={12} />
                        {transcriptionComplete ? "00:08:45" : "--:--:--"}
                      </Badge>
                    </CardDescription>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={handleCopyText} disabled={!transcriptionComplete}>
                    <ClipboardCopy size={14} />
                    <span>Copiar</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1" onClick={handleDownload} disabled={!transcriptionComplete}>
                    <Download size={14} />
                    <span>Baixar</span>
                  </Button>
                </div>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="pt-4 flex-grow overflow-auto">
                {transcriptionComplete ? <div className="space-y-4 whitespace-pre-line">
                    {transcriptionText}
                  </div> : <Textarea placeholder="A transcrição do seu arquivo aparecerá aqui quando o processamento estiver concluído." className="min-h-[400px] resize-none" readOnly />}
              </CardContent>
              
              {transcriptionComplete && <>
                  <Separator />
                  <div className="p-4 bg-bg-gray flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" onClick={handlePlayPause}>
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </Button>
                      <div className="flex-1">
                        <Slider value={[currentTime]} max={duration} step={1} onValueChange={value => setCurrentTime(value[0])} />
                      </div>
                      <span className="text-xs text-muted-foreground min-w-[60px] text-right">
                        {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Volume2 size={16} className="text-muted-foreground" />
                        <Slider className="w-24" value={[volume]} max={100} onValueChange={value => setVolume(value[0])} />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Velocidade:</span>
                        <Select defaultValue="1" onValueChange={value => setPlaybackSpeed(parseFloat(value))}>
                          <SelectTrigger className="w-14 h-7 text-xs">
                            <SelectValue placeholder="1x" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.5">0.5x</SelectItem>
                            <SelectItem value="0.75">0.75x</SelectItem>
                            <SelectItem value="1">1x</SelectItem>
                            <SelectItem value="1.25">1.25x</SelectItem>
                            <SelectItem value="1.5">1.5x</SelectItem>
                            <SelectItem value="2">2x</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </>}
            </Card>
          </div>
        </div>
      </Tabs>
    </MainLayout>;
};
export default TranscribePage;