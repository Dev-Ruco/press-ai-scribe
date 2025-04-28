
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
    image: "/lovable-uploads/206886bf-f31d-4473-b8a3-8d0f94fa4053.png"
  },
  {
    name: "Adriana Victor",
    role: "Directora de Marketing",
    image: "/lovable-uploads/d8eacc65-d63b-4f96-b540-c0794bd2322c.png"
  },
  {
    name: "Lito Malanzelo",
    role: "Director Operacional",
    image: "/lovable-uploads/1d0ef951-adaa-4412-b67b-811febbc95ed.png"
  }
];

export function TeamSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-playfair font-bold text-center mb-16 text-black">A Nossa Equipa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
      <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-6 border-2 border-gray-200">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-2xl font-bold text-black">{name}</h3>
      <div className="text-gray-600">{role}</div>
    </div>
  );
}
