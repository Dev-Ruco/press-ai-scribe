
import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Felisberto Ruco",
    role: "Director Executivo",
    image: "/lovable-uploads/abb0c56c-9d9a-411f-8379-a6301b7a5875.png"
  },
  {
    name: "Adriana Victor",
    role: "Directora de Marketing",
    image: "/lovable-uploads/e209ee54-61c1-4e9f-b662-38ddfaf866f8.png"
  },
  {
    name: "Lito Malanzelo",
    role: "Director Operacional",
    image: "/lovable-uploads/1d0ef951-adaa-4412-b67b-811febbc95ed.png"
  }
];

export function TeamSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-playfair font-bold text-center mb-12 text-black">Nossa Equipa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
    <div className="text-center">
      <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border border-gray-200">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" 
        />
      </div>
      <h3 className="text-lg font-bold text-black">{name}</h3>
      <div className="text-gray-600 text-sm">{role}</div>
    </div>
  );
}
