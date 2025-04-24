
import { useState } from "react";
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

  const handleLinkSubmit = (url: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Link processado",
        description: "Conteúdo do link sendo analisado..."
      });
      
      addMessage(`Analisando conteúdo do link: ${url}`, true);
      const typingId = addMessage("Processando link...", false, true);
      
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== typingId));
        addMessage(`O link ${url} foi analisado com sucesso. O conteúdo será incorporado ao seu artigo.`, false);
      }, 2000);
    }, 1500);
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
    addMessage(content, true);
    const typingId = addMessage("Analisando sua solicitação...", false, true);

    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== typingId));
      addMessage("Compreendi sua solicitação. Como posso ajudar a desenvolver este tópico?", false);
      setIsProcessing(false);
      setContent("");
      
      if (messages.length > 0) {
        setShowArticleOptions(true);
      }
    }, 2000);
  };

  const handleFileUpload = (files: FileList) => {
    setFiles(prev => [...prev, ...Array.from(files)]);
  };

  const handleGenerateTest = () => {
    gate(async () => {
      setIsProcessing(true);
      const typingId = addMessage("Gerando artigo de teste...", false, true);

      try {
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
      } catch (error) {
        console.error("Error generating test article:", error);
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
      if (!content && messages.length === 0) {
        toast({
          variant: "destructive",
          title: "Conteúdo necessário",
          description: "Digite algo antes de salvar."
        });
        return;
      }

      setIsProcessing(true);
      
      try {
        const compiledContent = messages
          .filter(m => !m.isTyping && m.isUser)
          .map(m => m.content)
          .join("\n\n");
        
        const title = compiledContent.split('\n')[0].substring(0, 100) || 
                     content.split('\n')[0].substring(0, 100) || 
                     "Novo artigo";
        
        const { data, error } = await supabase
          .from('articles')
          .insert([{
            user_id: user.id,
            title,
            content: compiledContent || content,
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
          setContent("");
          setFiles([]);
          setShowArticleOptions(false);
        }
        
      } catch (error: any) {
        console.error("Error saving article:", error);
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
      
      <ArticleChatMessages messages={messages} />
      
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
        hasMessages={messages.length > 1}
        isProcessing={isProcessing}
        onSave={handleSave}
      />
    </div>
  );
}
