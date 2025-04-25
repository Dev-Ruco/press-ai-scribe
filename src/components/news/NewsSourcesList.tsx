
  // Função para simular notícias
  const simulateNewsForSource = async (sourceId: string) => {
    if (!user) {
      handleRequireAuth(() => simulateNewsForSource(sourceId));
      return;
    }

    try {
      console.log('Simulando notícias para fonte:', sourceId);
      
      // Encontra a fonte na lista de fontes disponíveis
      const source = sources.find(s => s.id === sourceId);
      if (!source) {
        console.error('Fonte não encontrada na lista.');
        throw new Error('Fonte não encontrada');
      }
      
      const currentTime = new Date();
      const formattedTime = currentTime.toLocaleTimeString();
      
      // Simula uma notícia diretamente no banco
      const { data, error } = await supabase
        .from('raw_news')
        .insert([
          { 
            user_id: user.id,
            source_id: sourceId,
            title: `Notícia simulada de ${source.name} - ${formattedTime}`,
            content: `Esta é uma notícia simulada da fonte ${source.name} criada em ${currentTime.toLocaleString()}`,
            published_at: currentTime.toISOString()
          }
        ])
        .select();
      
      if (error) {
        console.error('Erro ao criar notícia simulada:', error);
        throw error;
      }
      
      console.log('Notícia simulada criada com sucesso:', data);
      toast({
        title: 'Simulação Concluída',
        description: 'Uma notícia simulada foi gerada com sucesso.',
      });

      // Atualiza a lista de notícias automaticamente
      const event = new CustomEvent('refreshNews');
      window.dispatchEvent(event);
    } catch (error: any) {
      console.error('Erro ao simular notícias:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível simular notícias para esta fonte.',
        variant: 'destructive',
      });
    }
  };
