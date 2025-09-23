
interface PlanningTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function PlanningTabs({ activeTab, onTabChange }: PlanningTabsProps) {
  return (
    <div className="flex space-x-4">
      <button 
        className={`px-4 py-2 rounded ${activeTab === 'budget' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => onTabChange('budget')}
      >
        Budget
      </button>
      <button 
        className={`px-4 py-2 rounded ${activeTab === 'timeline' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => onTabChange('timeline')}
      >
        Timeline
      </button>
    </div>
  );
}