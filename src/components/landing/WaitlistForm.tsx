import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { ArrowRight, Check, Loader2, Shield, UserCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WaitlistFormProps {
  onSuccess?: () => void;
}

type FormValues = {
  fullName: string;
  email: string;
  whatsapp: string;
  company: string;
  role?: string;
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
    watch,
  } = useForm<FormValues>();

  const companyValue = watch('company');

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

  const getBenefits = () => {
    if (language === 'pt-MZ') {
      return [
        'Acesso antecipado à plataforma',
        'Desconto especial no lançamento',
        'Suporte prioritário',
        'Treinamento exclusivo'
      ];
    }
    
    return [
      'Early access to the platform',
      'Special discount at launch',
      'Priority support',
      'Exclusive training'
    ];
  };

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center max-w-md mx-auto">
        <div className="bg-black rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <Check className="text-white w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2">
          {language === 'pt-MZ' ? 'Inscrição confirmada!' : 'Registration confirmed!'}
        </h3>
        <p className="text-gray-600 mb-4">
          {language === 'pt-MZ' 
            ? 'Você está na fila para acesso antecipado ao PRESS AI. Entraremos em contato em breve.' 
            : 'You are on the waiting list for early access to PRESS AI. We will contact you soon.'}
        </p>
        <p className="text-sm text-gray-500">
          {language === 'pt-MZ' 
            ? 'Confira seu email para mais informações.' 
            : 'Check your email for more information.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 max-w-4xl mx-auto" id="waitlist">
      <div className="md:w-2/5">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">
            {language === 'pt-MZ' ? 'Junte-se à lista de espera' : 'Join the waitlist'}
          </h3>
          <p className="text-gray-600 text-sm">
            {language === 'pt-MZ' 
              ? 'Estamos selecionando um grupo exclusivo de profissionais para testar a versão beta do PRESS AI.' 
              : 'We are selecting an exclusive group of professionals to test the beta version of PRESS AI.'}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 rounded-full p-2 mt-0.5">
              <UserCheck className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <h4 className="font-medium text-black">
                {language === 'pt-MZ' ? 'Vagas limitadas' : 'Limited spots'}
              </h4>
              <p className="text-sm text-gray-600">
                {language === 'pt-MZ' 
                  ? 'Apenas 200 profissionais serão aceitos nesta fase.'
                  : 'Only 200 professionals will be accepted in this phase.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 rounded-full p-2 mt-0.5">
              <Shield className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <h4 className="font-medium text-black">
                {language === 'pt-MZ' ? 'Benefícios exclusivos' : 'Exclusive benefits'}
              </h4>
              <ul className="text-sm text-gray-600 list-disc pl-4 mt-1 space-y-1">
                {getBenefits().map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="md:w-3/5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              {language === 'pt-MZ' ? 'Nome completo' : 'Full name'}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder={language === 'pt-MZ' ? 'Digite seu nome' : 'Enter your name'}
              className="w-full"
              {...register('fullName', { 
                required: language === 'pt-MZ' ? 'Nome é obrigatório' : 'Name is required' 
              })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">
              {language === 'pt-MZ' ? 'E-mail profissional' : 'Professional email'}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={language === 'pt-MZ' ? 'seu@email.com' : 'your@email.com'}
              className="w-full"
              {...register('email', { 
                required: language === 'pt-MZ' ? 'Email é obrigatório' : 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: language === 'pt-MZ' ? 'Email inválido' : 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp">
              {language === 'pt-MZ' ? 'WhatsApp' : 'WhatsApp'}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="whatsapp"
              placeholder={language === 'pt-MZ' ? '+55 (00) 00000-0000' : '+1 (000) 000-0000'}
              className="w-full"
              {...register('whatsapp', { 
                required: language === 'pt-MZ' ? 'WhatsApp é obrigatório' : 'WhatsApp is required' 
              })}
            />
            {errors.whatsapp && (
              <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">
                {language === 'pt-MZ' ? 'Tipo de organização' : 'Organization type'}
                <span className="text-red-500">*</span>
              </Label>
              <Select 
                onValueChange={(value) => setValue('company', value)}
                defaultValue=""
              >
                <SelectTrigger id="company" className="w-full">
                  <SelectValue placeholder={language === 'pt-MZ' ? 'Selecione uma opção' : 'Select an option'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="journalist">
                    {language === 'pt-MZ' ? 'Jornalista Autônomo' : 'Freelance Journalist'}
                  </SelectItem>
                  <SelectItem value="newspaper">
                    {language === 'pt-MZ' ? 'Jornal/Revista' : 'Newspaper/Magazine'}
                  </SelectItem>
                  <SelectItem value="content">
                    {language === 'pt-MZ' ? 'Agência de Conteúdo' : 'Content Agency'}
                  </SelectItem>
                  <SelectItem value="tv">
                    {language === 'pt-MZ' ? 'TV/Rádio' : 'TV/Radio'}
                  </SelectItem>
                  <SelectItem value="other">
                    {language === 'pt-MZ' ? 'Outro' : 'Other'}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.company && (
                <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">
                {language === 'pt-MZ' ? 'Seu cargo' : 'Your role'}
              </Label>
              <Input
                id="role"
                placeholder={language === 'pt-MZ' ? 'Ex: Editor, Repórter...' : 'E.g. Editor, Reporter...'}
                className="w-full"
                {...register('role')}
              />
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800 text-white py-6 rounded-md flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === 'pt-MZ' ? 'Enviando...' : 'Submitting...'}
                </>
              ) : (
                <>
                  {language === 'pt-MZ' ? 'Garantir meu lugar na fila' : 'Secure my spot in line'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            {language === 'pt-MZ' 
              ? 'Ao se inscrever, você concorda em receber atualizações sobre o lançamento do PRESS AI.' 
              : 'By signing up, you agree to receive updates about the launch of PRESS AI.'}
          </p>
        </form>
      </div>
    </div>
  );
}
