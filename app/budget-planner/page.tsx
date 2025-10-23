'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Calculator, 
  Plus, 
  Minus, 
  Edit, 
  Trash2, 
  Target, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  spent: number;
  percentage: number;
  color: string;
}

interface BudgetItem {
  id: string;
  categoryId: string;
  name: string;
  amount: number;
  date: string;
  vendor?: string;
  status: 'planned' | 'paid' | 'pending';
}

export default function BudgetPlannerPage() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [totalBudget, setTotalBudget] = useState(500000);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newItem, setNewItem] = useState({ name: '', amount: 0, categoryId: '', vendor: '' });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);

  const defaultCategories = [
    { id: '1', name: 'Venue', planned: 150000, spent: 0, percentage: 30, color: 'bg-blue-500' },
    { id: '2', name: 'Catering', planned: 100000, spent: 0, percentage: 20, color: 'bg-green-500' },
    { id: '3', name: 'Photography', planned: 75000, spent: 0, percentage: 15, color: 'bg-purple-500' },
    { id: '4', name: 'Decoration', planned: 50000, spent: 0, percentage: 10, color: 'bg-pink-500' },
    { id: '5', name: 'Music', planned: 40000, spent: 0, percentage: 8, color: 'bg-yellow-500' },
    { id: '6', name: 'Transportation', planned: 30000, spent: 0, percentage: 6, color: 'bg-indigo-500' },
    { id: '7', name: 'Attire', planned: 25000, spent: 0, percentage: 5, color: 'bg-red-500' },
    { id: '8', name: 'Miscellaneous', planned: 30000, spent: 0, percentage: 6, color: 'bg-gray-500' },
  ];

  useEffect(() => {
    if (session) {
      loadBudgetData();
    }
  }, [session]);

  const loadBudgetData = () => {
    // Load from localStorage or API
    const savedCategories = localStorage.getItem('budget-categories');
    const savedItems = localStorage.getItem('budget-items');
    const savedTotal = localStorage.getItem('total-budget');
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(defaultCategories);
    }
    
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    
    if (savedTotal) {
      setTotalBudget(parseInt(savedTotal));
    }
  };

  const saveBudgetData = () => {
    localStorage.setItem('budget-categories', JSON.stringify(categories));
    localStorage.setItem('budget-items', JSON.stringify(items));
    localStorage.setItem('total-budget', totalBudget.toString());
  };

  useEffect(() => {
    saveBudgetData();
  }, [categories, items, totalBudget]);

  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    const category: BudgetCategory = {
      id: Date.now().toString(),
      name: newCategory,
      planned: 0,
      spent: 0,
      percentage: 0,
      color: 'bg-gray-500'
    };
    
    setCategories([...categories, category]);
    setNewCategory('');
    setShowAddCategory(false);
    toast({
      title: 'Category Added',
      description: `${newCategory} has been added to your budget.`,
    });
  };

  const addItem = () => {
    if (!newItem.name.trim() || newItem.amount <= 0 || !newItem.categoryId) return;
    
    const item: BudgetItem = {
      id: Date.now().toString(),
      categoryId: newItem.categoryId,
      name: newItem.name,
      amount: newItem.amount,
      date: new Date().toISOString().split('T')[0],
      vendor: newItem.vendor,
      status: 'planned'
    };
    
    setItems([...items, item]);
    setNewItem({ name: '', amount: 0, categoryId: '', vendor: '' });
    setShowAddItem(false);
    toast({
      title: 'Item Added',
      description: `${newItem.name} has been added to your budget.`,
    });
  };

  const updateCategorySpent = (categoryId: string, amount: number) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, spent: amount }
        : cat
    ));
  };

  const getTotalSpent = () => {
    return categories.reduce((sum, cat) => sum + cat.spent, 0);
  };

  const getTotalPlanned = () => {
    return categories.reduce((sum, cat) => sum + cat.planned, 0);
  };

  const getBudgetStatus = () => {
    const spent = getTotalSpent();
    const planned = getTotalPlanned();
    const percentage = planned > 0 ? (spent / planned) * 100 : 0;
    
    if (percentage > 100) return { status: 'over', color: 'text-red-600', icon: AlertCircle };
    if (percentage > 80) return { status: 'warning', color: 'text-yellow-600', icon: AlertCircle };
    return { status: 'good', color: 'text-green-600', icon: CheckCircle };
  };

  const budgetStatus = getBudgetStatus();
  const StatusIcon = budgetStatus.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wedding Budget Planner</h1>
          <p className="mt-2 text-gray-600">Plan and track your wedding expenses</p>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">
                    LKR {totalBudget.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    LKR {getTotalSpent().toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget Status</p>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-5 w-5 ${budgetStatus.color}`} />
                    <span className={`text-lg font-bold ${budgetStatus.color}`}>
                      {budgetStatus.status === 'over' ? 'Over Budget' : 
                       budgetStatus.status === 'warning' ? 'Warning' : 'On Track'}
                    </span>
                  </div>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Slider */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Adjust Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Total Budget: LKR {totalBudget.toLocaleString()}</Label>
                <Badge variant="outline">
                  {((getTotalSpent() / totalBudget) * 100).toFixed(1)}% Used
                </Badge>
              </div>
              <Slider
                value={[totalBudget]}
                onValueChange={(value) => setTotalBudget(value[0])}
                max={2000000}
                min={100000}
                step={10000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>LKR 100,000</span>
                <span>LKR 2,000,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Budget Categories</CardTitle>
                <Button
                  onClick={() => setShowAddCategory(true)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        LKR {category.spent.toLocaleString()} / {category.planned.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {category.planned > 0 ? ((category.spent / category.planned) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={category.planned > 0 ? (category.spent / category.planned) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Budget Items</CardTitle>
                <Button
                  onClick={() => setShowAddItem(true)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {categories.find(c => c.id === item.categoryId)?.name} • 
                      {item.vendor && ` ${item.vendor} •`}
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">LKR {item.amount.toLocaleString()}</span>
                    <Badge variant={item.status === 'paid' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Add Category Modal */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96">
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g., Flowers, Invitations"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddCategory(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addCategory}>
                    Add Category
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96">
              <CardHeader>
                <CardTitle>Add Budget Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g., Wedding Dress, Photography Package"
                  />
                </div>
                <div>
                  <Label htmlFor="itemAmount">Amount (LKR)</Label>
                  <Input
                    id="itemAmount"
                    type="number"
                    value={newItem.amount}
                    onChange={(e) => setNewItem({ ...newItem, amount: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="itemCategory">Category</Label>
                  <select
                    id="itemCategory"
                    value={newItem.categoryId}
                    onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="itemVendor">Vendor (Optional)</Label>
                  <Input
                    id="itemVendor"
                    value={newItem.vendor}
                    onChange={(e) => setNewItem({ ...newItem, vendor: e.target.value })}
                    placeholder="Vendor name"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddItem(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addItem}>
                    Add Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
