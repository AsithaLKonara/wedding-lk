
interface VendorPortfolioProps {
  portfolio: string[];
}

export default function VendorPortfolio({ portfolio }: VendorPortfolioProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {portfolio.map((image, index) => (
        <div key={index} className="aspect-square bg-gray-200 rounded">
          <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover rounded" />
        </div>
      ))}
    </div>
  );
}