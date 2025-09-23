
interface VendorCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function VendorCategories({ selectedCategory, onCategoryChange }: VendorCategoriesProps) {
  const categories = ['All', 'Photography', 'Catering', 'Decoration', 'Music', 'Transport'];
  
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <button
          key={category}
          className={`px-4 py-2 rounded ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}