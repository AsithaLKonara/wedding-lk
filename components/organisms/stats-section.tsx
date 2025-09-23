export default function StatsSection() {
  const stats = [
    { number: "500+", label: "Happy Couples" },
    { number: "1000+", label: "Weddings Planned" },
    { number: "50+", label: "Cities Covered" },
    { number: "4.9/5", label: "Average Rating" }
  ];

  return (
    <div className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}