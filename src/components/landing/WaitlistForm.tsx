
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WaitlistFormProps {
  onSuccess?: () => void;
}

type FormValues = {
  fullName: string;
  email: string;
  whatsapp: string;
  company: string;
};

export function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { language } = useLanguage();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Form submitted with data:", data);
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center max-w-md mx-auto">
        <div className="bg-black rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <Check className="text-white w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2">
          {language === 'pt' ? 'Inscrição confirmada!' : 'Registration confirmed!'}
        </h3>
        <p className="text-gray-600 mb-4">
          {language === 'pt' ? 
            'Você está na fila para acesso antecipado ao PRESS AI. Entraremos em contato em breve.' : 
            'You are on the waiting list for early access to PRESS AI. We will contact you soon.'}
        </p>
        <p className="text-sm text-gray-500">
          {language === 'pt' ? 
            'Confira seu email para mais informações.' : 
            'Check your email for more information.'}
        </p>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm max-w-md w-full mx-auto"
      id="waitlist"
    >
      <h3 className="text-xl font-bold mb-6 text-center">
        {language === 'pt' ? 'Junte-se à lista de espera' : 'Join the waitlist'}
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            {language === 'pt' ? 'Nome completo' : 'Full name'}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder={language === 'pt' ? 'Digite seu nome' : 'Enter your name'}
            className="w-full"
            {...register('fullName', { 
              required: language === 'pt' ? 'Nome é obrigatório' : 'Name is required' 
            })}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">
            {language === 'pt' ? 'E-mail profissional' : 'Professional email'}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={language === 'pt' ? 'seu@email.com' : 'your@email.com'}
            className="w-full"
            {...register('email', { 
              required: language === 'pt' ? 'Email é obrigatório' : 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: language === 'pt' ? 'Email inválido' : 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="whatsapp">
            {language === 'pt' ? 'WhatsApp' : 'WhatsApp'}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="whatsapp"
            placeholder={language === 'pt' ? '+55 (00) 00000-0000' : '+1 (000) 000-0000'}
            className="w-full"
            {...register('whatsapp', { 
              required: language === 'pt' ? 'WhatsApp é obrigatório' : 'WhatsApp is required' 
            })}
          />
          {errors.whatsapp && (
            <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">
            {language === 'pt' ? 'Empresa/Organização' : 'Company/Organization'}
            <span className="text-red-500">*</span>
          </Label>
          <Select 
            onValueChange={(value) => setValue('company', value)}
            defaultValue=""
          >
            <SelectTrigger id="company" className="w-full">
              <SelectValue placeholder={language === 'pt' ? 'Selecione uma opção' : 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="journalist">
                {language === 'pt' ? 'Jornalista Autônomo' : 'Freelance Journalist'}
              </SelectItem>
              <SelectItem value="newspaper">
                {language === 'pt' ? 'Jornal/Revista' : 'Newspaper/Magazine'}
              </SelectItem>
              <SelectItem value="content">
                {language === 'pt' ? 'Agência de Conteúdo' : 'Content Agency'}
              </SelectItem>
              <SelectItem value="tv">
                {language === 'pt' ? 'TV/Rádio' : 'TV/Radio'}
              </SelectItem>
              <SelectItem value="other">
                {language === 'pt' ? 'Outro' : 'Other'}
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.company && (
            <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          type="submit" 
          className="w-full bg-black hover:bg-gray-800 text-white py-6 rounded-md flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {language === 'pt' ? 'Enviando...' : 'Submitting...'}
            </>
          ) : (
            <>
              {language === 'pt' ? 'Garantir meu lugar na fila' : 'Secure my spot in line'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        {language === 'pt' 
          ? 'Estamos selecionando profissionais para a versão beta. Vagas limitadas!' 
          : 'We are selecting professionals for the beta version. Limited spots available!'}
      </p>
    </form>
  );
}
