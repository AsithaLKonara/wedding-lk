'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  PieChart, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Calculator,
  Target
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BudgetItem {
  id: string;
  category: string;
  name: string;
  estimatedCost: number;
  actualCost: number;
  paid: number;
  status: 'planned' | 'booked' | 'paid' | 'completed';
  notes: string;
  vendor?: string;
  dueDate?: string;
}

interface BudgetCategory {
  name: string;
  percentage: number;
  color: string;
  icon: string;
}

const defaultCategories: BudgetCategory[] = [
  { name: 'Venue', percentage: 40, color: 'bg-blue-500', icon: '🏛️' },
  { name: 'Catering', percentage: 25, color: 'bg-green-500', icon: '🍽️' },
  { name: 'Photography', percentage: 10, color: 'bg-purple-500', icon: '📸' },
  { name: 'Music', percentage: 8, color: 'bg-yellow-500', icon: '🎵' },
  { name: 'Decoration', percentage: 7, color: 'bg-pink-500', icon: '🌸' },
  { name: 'Transportation', percentage: 5, color: 'bg-indigo-500', icon: '🚗' },
  { name: 'Other', percentage: 5, color: 'bg-gray-500', icon: '📋' }
];

export default function BudgetPlannerPage() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [totalBudget, setTotalBudget] = useState(1000000); // Default 1M LKR
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    estimatedCost: 0,
    actualCost: 0,
    paid: 0,
    status: 'planned' as 'planned' | 'booked' | 'paid' | 'completed',
    notes: '',
    vendor: '',
    dueDate: ''
  });

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = () => {
    // TODO: Load from API
    const mockData: BudgetItem[] = [
      {
        id: '1',
        category: 'Venue',
        name: 'Grand Ballroom',
        estimatedCost: 400000,
        actualCost: 420000,
        paid: 210000,
        status: 'booked',
        notes: 'Deposit paid, balance due 30 days before',
        vendor: 'Grand Hotel',
        dueDate: '2024-06-15'
      },
      {
        id: '2',
        category: 'Catering',
        name: 'Wedding Dinner',
        estimatedCost: 250000,
        actualCost: 0,
        paid: 0,
        status: 'planned',
        notes: 'Need to finalize menu',
        vendor: '',
        dueDate: '2024-07-01'
      }
    ];
    setBudgetItems(mockData);
  };

  const calculateTotals = () => {
    const estimated = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
    const actual = budgetItems.reduce((sum, item) => sum + item.actualCost, 0);
    const paid = budgetItems.reduce((sum, item) => sum + item.paid, 0);
    const remaining = actual - paid;
    
    return { estimated, actual, paid, remaining };
  };

  const getCategoryTotals = () => {
    const categoryTotals: { [key: string]: { estimated: number; actual: number; paid: number } } = {};
    
    budgetItems.forEach(item => {
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = { estimated: 0, actual: 0, paid: 0 };
      }
      categoryTotals[item.category].estimated += item.estimatedCost;
      categoryTotals[item.category].actual += item.actualCost;
      categoryTotals[item.category].paid += item.paid;
    });
    
    return categoryTotals;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge variant="secondary">Planned</Badge>;
      case 'booked':
        return <Badge className="bg-blue-100 text-blue-800">Booked</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSaveItem = () => {
    if (!formData.category || !formData.name || formData.estimatedCost <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    if (editingItem) {
      // Update existing item
      setBudgetItems(prev => 
        prev.map(item => 
          item.id === editingItem.id 
            ? { ...item, ...formData }
            : item
        )
      );
      toast({
        title: 'Budget Item Updated',
        description: 'Your budget item has been updated successfully.',
      });
    } else {
      // Add new item
      const newItem: BudgetItem = {
        id: Date.now().toString(),
        ...formData
      };
      setBudgetItems(prev => [...prev, newItem]);
      toast({
        title: 'Budget Item Added',
        description: 'New budget item has been added successfully.',
      });
    }

    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({
      category: '',
      name: '',
      estimatedCost: 0,
      actualCost: 0,
      paid: 0,
      status: 'planned',
      notes: '',
      vendor: '',
      dueDate: ''
    });
  };

  const handleEditItem = (item: BudgetItem) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      name: item.name,
      estimatedCost: item.estimatedCost,
      actualCost: item.actualCost,
      paid: item.paid,
      status: item.status,
      notes: item.notes,
      vendor: item.vendor || '',
      dueDate: item.dueDate || ''
    });
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setBudgetItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: 'Budget Item Deleted',
      description: 'Budget item has been removed successfully.',
    });
  };

  const totals = calculateTotals();
  const categoryTotals = getCategoryTotals();
  const budgetUtilization = (totals.actual / totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wedding Budget Planner</h1>
          <p className="text-gray-600">Plan and track your wedding expenses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Budget Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Budget Item' : 'Add Budget Item'}
              </DialogTitle>
              <DialogDescription>
                {editingItem 
                  ? 'Update your budget item details.' 
                  : 'Add a new item to your wedding budget.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultCategories.map(category => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Wedding Venue"
                />
              </div>
              <div>
                <Label htmlFor="estimatedCost">Estimated Cost (LKR) *</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="actualCost">Actual Cost (LKR)</Label>
                <Input
                  id="actualCost"
                  type="number"
                  value={formData.actualCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, actualCost: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="paid">Amount Paid (LKR)</Label>
                <Input
                  id="paid"
                  type="number"
                  value={formData.paid}
                  onChange={(e) => setFormData(prev => ({ ...prev, paid: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vendor">Vendor</Label>
                <Input
                  id="vendor"
                  value={formData.vendor}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                  placeholder="Vendor name"
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveItem}>
                {editingItem ? 'Update' : 'Add'} Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">LKR {totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calculator className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Estimated Cost</p>
                <p className="text-2xl font-bold text-gray-900">LKR {totals.estimated.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actual Cost</p>
                <p className="text-2xl font-bold text-gray-900">LKR {totals.actual.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Amount Paid</p>
                <p className="text-2xl font-bold text-gray-900">LKR {totals.paid.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Utilization</CardTitle>
          <CardDescription>
            Track how much of your budget has been allocated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Budget Used</span>
              <span>{budgetUtilization.toFixed(1)}%</span>
            </div>
            <Progress value={budgetUtilization} className="h-2" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>LKR {totals.actual.toLocaleString()} used</span>
              <span>LKR {(totalBudget - totals.actual).toLocaleString()} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>
            See how your budget is distributed across categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryTotals).map(([category, totals]) => {
              const percentage = (totals.estimated / totalBudget) * 100;
              const categoryInfo = defaultCategories.find(c => c.name === category);
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{categoryInfo?.icon}</span>
                      <span className="font-medium">{category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">LKR {totals.estimated.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Budget Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Items</CardTitle>
          <CardDescription>
            Manage your individual budget items
          </CardDescription>
        </CardHeader>
        <CardContent>
          {budgetItems.length === 0 ? (
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No budget items yet</h3>
              <p className="text-gray-600 mb-4">
                Start planning your wedding budget by adding your first item.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {budgetItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {defaultCategories.find(c => c.name === item.category)?.icon}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(item.status)}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Estimated:</span>
                      <div className="font-medium">LKR {item.estimatedCost.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Actual:</span>
                      <div className="font-medium">LKR {item.actualCost.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Paid:</span>
                      <div className="font-medium">LKR {item.paid.toLocaleString()}</div>
                    </div>
                  </div>
                  {item.vendor && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Vendor:</span> {item.vendor}
                    </div>
                  )}
                  {item.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
