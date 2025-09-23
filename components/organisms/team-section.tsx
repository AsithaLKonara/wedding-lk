export default function TeamSection() {
  const team = [
    { name: "Sarah Johnson", role: "CEO & Founder", image: "/placeholder.svg" },
    { name: "Michael Chen", role: "CTO", image: "/placeholder.svg" },
    { name: "Priya Fernando", role: "Head of Operations", image: "/placeholder.svg" },
    { name: "David Kumar", role: "Lead Developer", image: "/placeholder.svg" }
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden">
                <img 
                  src={member.image} 
                      alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}