
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRequireAuthForAction } from "@/hooks/useRequireAuthForAction";
import { AuthPrompt } from "@/components/auth/AuthPrompt";
import { ArticleChatMessages } from "./chat/ArticleChatMessages";
import { ArticleFilePreviewSection } from "./file-upload/ArticleFilePreviewSection";
import { ArticleTextInput } from "./input/ArticleTextInput";
import { ArticleSaveOptions } from "./save/ArticleSaveOptions";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";

export function CreateArticleInput({ onWorkflowUpdate }) {
  const [content, setContent] = useState("");
  const [expandedInput, setExpandedInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showArticleOptions, setShowArticleOptions] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { gate, promptOpen, setPromptOpen } = useRequireAuthForAction();

  const addMessage = (content: string, isUser: boolean, isTyping = false) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
      isTyping
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  // Scroll para o fim da área de chat quando novas mensagens são adicionadas
  useEffect(() => {
    if (chatAreaRef.current && messages.length > 0) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLinkSubmit = (url: string) => {
    if (!url.trim()) return;
    
    setIsProcessing(true);
    addMessage(`Analisando conteúdo do link: ${url}`, true);
    const typingId = addMessage("Processando link...", false, true);
    
    // Simular processamento de link
    setTimeout(() => {
      setIsProcessing(false);
      setMessages(prev => prev.filter(m => m.id !== typingId));
      addMessage(`O link ${url} foi analisado com sucesso. O conteúdo será incorporado ao seu artigo.`, false);
      
      toast({
        title: "Link processado",
        description: "Conteúdo do link analisado com sucesso"
      });
      
      setShowArticleOptions(true);
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!content && files.length === 0) {
      toast({
        variant: "destructive",
        title: "Entrada necessária",
        description: "Digite algo ou anexe arquivos."
      });
      return;
    }

    setIsProcessing(true);
    
    if (content) {
      addMessage(content, true);
    }
    
    if (files.length > 0) {
      const fileNames = files.map(f => f.name).join(", ");
      addMessage(`Arquivos enviados: ${fileNames}`, true);
    }
    
    const typingId = addMessage("Processando sua solicitação...", false, true);

    // Simular processamento de conteúdo
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== typingId));
      
      if (files.length > 0) {
        addMessage("Arquivos processados com sucesso. Gerando rascunho do artigo...", false);
      }
      
      // Gerar artigo simulado após um breve delay para mostrar progresso ao usuário
      setTimeout(() => {
        const simulatedArticle = generateSimulatedArticle(content, files);
        addMessage(simulatedArticle, false);
        setIsProcessing(false);
        setContent("");
        setShowArticleOptions(true);
      }, 1500);
      
    }, 2000);
  };

  // Função para gerar um artigo simulado com base no conteúdo e arquivos
  const generateSimulatedArticle = (content: string, files: File[]) => {
    const topics = [
      "Tecnologia", "Saúde", "Esportes", "Política", "Economia", "Cultura"
    ];
    
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const filesText = files.length > 0 ? `com base nos ${files.length} arquivos fornecidos` : "";
    
    return `# Artigo sobre ${randomTopic}

## Introdução
Este é um rascunho de artigo gerado ${filesText} ${content ? "com base no seguinte prompt: " + content : ""}.

## Desenvolvimento
A inteligência artificial analisou o conteúdo e identificou os principais pontos a serem abordados neste artigo.

## Conclusão
O artigo foi gerado com sucesso e está pronto para revisão. Você pode editar diretamente nesta visualização ou salvar como rascunho para posterior edição.
`;
  };

  const handleFileUpload = (files: FileList) => {
    if (files && files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(files)]);
      
      toast({
        title: "Arquivos anexados",
        description: `${files.length} arquivo(s) adicionado(s) com sucesso`
      });
    }
  };

  const handleGenerateTest = () => {
    gate(async () => {
      setIsProcessing(true);
      
      addMessage("Gerando artigo de teste...", true);
      const typingId = addMessage("Processando solicitação de artigo de teste...", false, true);

      try {
        // Chamar a função simulada no Supabase
        const { data, error } = await supabase.rpc('simulate_article', {
          for_user_id: user.id
        });

        if (error) throw error;

        setMessages(prev => prev.filter(m => m.id !== typingId));
        addMessage("Artigo de teste gerado com sucesso! Você pode encontrá-lo na seção 'Meus Artigos'.", false);
        
        toast({
          title: "Sucesso",
          description: "Artigo de teste gerado e salvo como rascunho"
        });
        
        setShowArticleOptions(true);
      } catch (error) {
        console.error("Erro ao gerar artigo de teste:", error);
        setMessages(prev => prev.filter(m => m.id !== typingId));
        addMessage("Desculpe, não foi possível gerar o artigo de teste.", false);
        
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível gerar o artigo de teste"
        });
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleSave = async (status: 'Rascunho' | 'Pendente' | 'Publicado') => {
    gate(async () => {
      if (messages.length === 0 && !content) {
        toast({
          variant: "destructive",
          title: "Conteúdo necessário",
          description: "Não há conteúdo para salvar."
        });
        return;
      }

      setIsProcessing(true);
      
      try {
        // Compilar conteúdo do artigo das mensagens
        let articleContent = "";
        let articleTitle = "";
        
        if (messages.length > 0) {
          const userMessages = messages.filter(m => m.isUser).map(m => m.content);
          const aiMessages = messages.filter(m => !m.isUser && !m.isTyping).map(m => m.content);
          
          // Usar a última mensagem da IA como conteúdo principal
          if (aiMessages.length > 0) {
            articleContent = aiMessages[aiMessages.length - 1];
            
            // Tentar extrair um título do conteúdo
            const lines = articleContent.split('\n');
            if (lines.length > 0) {
              const potentialTitle = lines[0].replace(/^#\s*/, '');
              if (potentialTitle.length > 0 && potentialTitle.length <= 100) {
                articleTitle = potentialTitle;
              }
            }
          }
        } else if (content) {
          articleContent = content;
        }
        
        // Se não encontramos um título, usar um padrão
        if (!articleTitle) {
          articleTitle = "Novo artigo " + new Date().toLocaleDateString('pt-BR');
        }
        
        // Salvar no Supabase
        const { data, error } = await supabase
          .from('articles')
          .insert([{
            user_id: user.id,
            title: articleTitle,
            content: articleContent,
            status
          }])
          .select();

        if (error) throw error;

        toast({
          title: "Artigo salvo",
          description: `Artigo salvo como "${status}"`
        });
        
        addMessage(`Artigo salvo com sucesso como "${status}"`, false);
        
        if (status === 'Publicado') {
          // Resetar o estado após publicar
          setContent("");
          setFiles([]);
          setMessages([]);
          setShowArticleOptions(false);
        }
        
      } catch (error: any) {
        console.error("Erro ao salvar artigo:", error);
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: error.message || "Não foi possível salvar o artigo"
        });
      } finally {
        setIsProcessing(false);
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <AuthPrompt isOpen={promptOpen} onClose={() => setPromptOpen(false)} />
      
      <div ref={chatAreaRef}>
        <ArticleChatMessages messages={messages} />
      </div>
      
      <ArticleFilePreviewSection 
        files={files}
        onRemoveFile={(index) => {
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles.splice(index, 1);
            return newFiles;
          });
        }}
      />

      <ArticleTextInput
        content={content}
        onChange={setContent}
        onSubmit={handleSubmit}
        expandedInput={expandedInput}
        setExpandedInput={setExpandedInput}
        isProcessing={isProcessing}
        files={files}
        onFileUpload={handleFileUpload}
        setFiles={setFiles}
        onLinkSubmit={handleLinkSubmit}
        onGenerateTest={handleGenerateTest}
      />
      
      <ArticleSaveOptions 
        showOptions={showArticleOptions}
        hasMessages={messages.length > 0}
        isProcessing={isProcessing}
        onSave={handleSave}
      />
    </div>
  );
}
