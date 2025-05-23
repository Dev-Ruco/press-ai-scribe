
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export function TeamSection() {
  const { t } = useLanguage();
  
  const teamMembers: TeamMember[] = [
    {
      name: "Felisberto Ruco",
      role: t('executiveDirector'),
      image: "/lovable-uploads/180bfe11-73e2-4279-84aa-9f20d8ea1307.png"
    },
    {
      name: "Adriana Victor",
      role: t('commercialDirector'),
      image: "/lovable-uploads/1ff1d7aa-25da-4e1c-b84c-ea8cf5609e77.png"
    },
    {
      name: "Lito Malanzelo",
      role: t('marketingDirector'),
      image: "/lovable-uploads/7a5a4cf3-53ba-4fe2-ba09-a5230b2641df.png"
    },
    {
      name: "Sofia Santos",
      role: t('aiSpecialist'),
      image: "/lovable-uploads/f1bd6c95-19ff-4adf-b032-6a7c654a5d8c.png"
    },
    {
      name: "Gabriela Lima",
      role: t('journalist'),
      image: "/lovable-uploads/ff7defbf-c8b1-4857-930c-7bad524f6a70.png"
    },
    {
      name: "Carlos Oliveira",
      role: t('systemsProgrammer'),
      image: "/lovable-uploads/de2b4e47-d9f5-47ce-aa88-a1565b976eaf.png"
    }
  ];

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-playfair font-bold text-center mb-8 text-black">{t('ourTeam')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.name} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamMemberCard({ name, role, image }: TeamMember) {
  return (
    <div className="flex items-center gap-3 p-2">
      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" 
        />
      </div>
      <div>
        <h3 className="text-base font-bold text-black">{name}</h3>
        <div className="text-gray-600 text-xs capitalize">{role.replace(/([A-Z])/g, ' $1').trim()}</div>
      </div>
    </div>
  );
}
