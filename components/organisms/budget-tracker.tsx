"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Plus, Edit, Trash2, Calendar, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface BudgetCategory {
  id: string
  name: string
  budgeted: number
  spent: number
  color: string
  items: BudgetItem[]
}

interface BudgetItem {
  id: string
  name: string
  amount: number
  paid: boolean
  dueDate: string
}

export function BudgetTracker() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [totalBudget, setTotalBudget] = useState(2500000) // LKR 2.5M

  const [categories, setCategories] = useState<BudgetCategory[]>([
    {
      id: "1",
      name: "Venue",
      budgeted: 800000,
      spent: 750000,
      color: "bg-rose-500",
      items: [
        { id: "1", name: "Reception Hall", amount: 500000, paid: true, dueDate: "2024-01-15" },
        { id: "2", name: "Ceremony Space", amount: 250000, paid: true, dueDate: "2024-01-15" },
      ],
    },
    {
      id: "2",
      name: "Catering",
      budgeted: 600000,
      spent: 450000,
      color: "bg-blue-500",
      items: [
        { id: "3", name: "Wedding Dinner", amount: 400000, paid: true, dueDate: "2024-02-01" },
        { id: "4", name: "Cocktail Hour", amount: 50000, paid: true, dueDate: "2024-02-01" },
      ],
    },
    {
      id: "3",
      name: "Photography",
      budgeted: 300000,
      spent: 200000,
      color: "bg-purple-500",
      items: [
        { id: "5", name: "Wedding Photographer", amount: 150000, paid: true, dueDate: "2024-01-20" },
        { id: "6", name: "Videographer", amount: 50000, paid: true, dueDate: "2024-01-20" },
      ],
    },
    {
      id: "4",
      name: "Decorations",
      budgeted: 400000,
      spent: 180000,
      color: "bg-green-500",
      items: [
        { id: "7", name: "Floral Arrangements", amount: 120000, paid: true, dueDate: "2024-02-10" },
        { id: "8", name: "Lighting", amount: 60000, paid: true, dueDate: "2024-02-10" },
      ],
    },
    {
      id: "5",
      name: "Attire",
      budgeted: 200000,
      spent: 85000,
      color: "bg-yellow-500",
      items: [
        { id: "9", name: "Wedding Dress", amount: 60000, paid: true, dueDate: "2024-01-30" },
        { id: "10", name: "Groom's Suit", amount: 25000, paid: true, dueDate: "2024-01-30" },
      ],
    },
    {
      id: "6",
      name: "Entertainment",
      budgeted: 200000,
      spent: 0,
      color: "bg-indigo-500",
      items: [
        { id: "11", name: "DJ Services", amount: 80000, paid: false, dueDate: "2024-02-15" },
        { id: "12", name: "Live Band", amount: 120000, paid: false, dueDate: "2024-02-15" },
      ],
    },
  ])

  // Modal states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null)
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    budgeted: "",
    color: "bg-blue-500"
  })

  const [itemForm, setItemForm] = useState({
    name: "",
    amount: "",
    dueDate: "",
    paid: false
  })

  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0)
  const remaining = totalBudget - totalSpent
  const overBudget = totalSpent > totalBudget

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getSpentPercentage = (spent: number, budgeted: number) => {
    return budgeted > 0 ? (spent / budgeted) * 100 : 0
  }

  const handleAddCategory = async () => {
    if (!categoryForm.name || !categoryForm.budgeted) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const budgeted = parseFloat(categoryForm.budgeted)
    if (isNaN(budgeted) || budgeted <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid budget amount.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const newCategory: BudgetCategory = {
        id: Date.now().toString(),
        name: categoryForm.name,
        budgeted,
        spent: 0,
        color: categoryForm.color,
        items: []
      }

      setCategories(prev => [...prev, newCategory])
      setCategoryForm({ name: "", budgeted: "", color: "bg-blue-500" })
      setIsAddCategoryOpen(false)
      
      toast({
        title: "Category Added",
        description: `${categoryForm.name} has been added to your budget.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory || !categoryForm.name || !categoryForm.budgeted) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const budgeted = parseFloat(categoryForm.budgeted)
    if (isNaN(budgeted) || budgeted <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid budget amount.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: categoryForm.name, budgeted, color: categoryForm.color }
          : cat
      ))
      setCategoryForm({ name: "", budgeted: "", color: "bg-blue-500" })
      setEditingCategory(null)
      
      toast({
        title: "Category Updated",
        description: `${categoryForm.name} has been updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    setIsLoading(true)
    try {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
      toast({
        title: "Category Deleted",
        description: `${categoryName} has been removed from your budget.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddItem = async () => {
    if (!selectedCategoryId || !itemForm.name || !itemForm.amount || !itemForm.dueDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const amount = parseFloat(itemForm.amount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const newItem: BudgetItem = {
        id: Date.now().toString(),
        name: itemForm.name,
        amount,
        paid: itemForm.paid,
        dueDate: itemForm.dueDate
      }

      setCategories(prev => prev.map(cat => 
        cat.id === selectedCategoryId 
          ? { 
              ...cat, 
              items: [...cat.items, newItem],
              spent: cat.spent + (itemForm.paid ? amount : 0)
            }
          : cat
      ))
      setItemForm({ name: "", amount: "", dueDate: "", paid: false })
      setSelectedCategoryId("")
      setIsAddItemOpen(false)
      
      toast({
        title: "Item Added",
        description: `${itemForm.name} has been added to the budget.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditItem = async () => {
    if (!editingItem || !itemForm.name || !itemForm.amount || !itemForm.dueDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const amount = parseFloat(itemForm.amount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      setCategories(prev => prev.map(cat => ({
        ...cat,
        items: cat.items.map(item => 
          item.id === editingItem.id 
            ? { ...item, name: itemForm.name, amount, paid: itemForm.paid, dueDate: itemForm.dueDate }
            : item
        ),
        spent: cat.items.reduce((sum, item) => 
          sum + (item.id === editingItem.id 
            ? (itemForm.paid ? amount : 0)
            : (item.paid ? item.amount : 0)
          ), 0
        )
      })))
      setItemForm({ name: "", amount: "", dueDate: "", paid: false })
      setEditingItem(null)
      
      toast({
        title: "Item Updated",
        description: `${itemForm.name} has been updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteItem = async (categoryId: string, itemId: string, itemName: string) => {
    setIsLoading(true)
    try {
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? {
              ...cat,
              items: cat.items.filter(item => item.id !== itemId),
              spent: cat.items.reduce((sum, item) => 
                item.id !== itemId ? sum + (item.paid ? item.amount : 0) : sum, 0
              )
            }
          : cat
      ))
      toast({
        title: "Item Deleted",
        description: `${itemName} has been removed from the budget.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleItemPaid = async (categoryId: string, itemId: string, itemName: string, currentPaid: boolean, amount: number) => {
    setIsLoading(true)
    try {
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? {
              ...cat,
              items: cat.items.map(item => 
                item.id === itemId ? { ...item, paid: !currentPaid } : item
              ),
              spent: cat.spent + (currentPaid ? -amount : amount)
            }
          : cat
      ))
      toast({
        title: currentPaid ? "Marked as Unpaid" : "Marked as Paid",
        description: `${itemName} has been ${currentPaid ? "marked as unpaid" : "marked as paid"}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openEditCategory = (category: BudgetCategory) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      budgeted: category.budgeted.toString(),
      color: category.color
    })
  }

  const openEditItem = (item: BudgetItem) => {
    setEditingItem(item)
    setItemForm({
      name: item.name,
      amount: item.amount.toString(),
      dueDate: item.dueDate,
      paid: item.paid
    })
  }

  const colorOptions = [
    { value: "bg-blue-500", label: "Blue" },
    { value: "bg-green-500", label: "Green" },
    { value: "bg-purple-500", label: "Purple" },
    { value: "bg-yellow-500", label: "Yellow" },
    { value: "bg-red-500", label: "Red" },
    { value: "bg-indigo-500", label: "Indigo" },
    { value: "bg-pink-500", label: "Pink" },
    { value: "bg-orange-500", label: "Orange" },
  ]

  return (
    <div className="space-y-6" role="region" aria-label="Budget Tracker">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span className="text-sm font-medium">Total Budget</span>
            </div>
            <div className="text-2xl font-bold text-blue-600" aria-live="polite">
              {formatCurrency(totalBudget)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" aria-hidden="true" />
              <span className="text-sm font-medium">Total Spent</span>
            </div>
            <div className="text-2xl font-bold text-green-600" aria-live="polite">
              {formatCurrency(totalSpent)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className={`h-4 w-4 ${overBudget ? "text-red-600" : "text-gray-600"}`} aria-hidden="true" />
              <span className="text-sm font-medium">Remaining</span>
            </div>
            <div className={`text-2xl font-bold ${overBudget ? "text-red-600" : "text-gray-600"}`} aria-live="polite">
              {formatCurrency(remaining)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" aria-hidden="true" />
              <span className="text-sm font-medium">Budget Used</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600" aria-live="polite">
              {Math.round((totalSpent / totalBudget) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Spent: {formatCurrency(totalSpent)}</span>
              <span>Budget: {formatCurrency(totalBudget)}</span>
            </div>
            <Progress 
              value={(totalSpent / totalBudget) * 100} 
              className={`h-3 ${overBudget ? "bg-red-100" : ""}`}
              aria-label={`Budget progress: ${Math.round((totalSpent / totalBudget) * 100)}% used`}
            />
            {overBudget && (
              <div className="flex items-center gap-2 text-red-600 text-sm" role="alert">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                You are over budget by {formatCurrency(totalSpent - totalBudget)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, index) => {
          const spentPercentage = getSpentPercentage(category.spent, category.budgeted)
          const isOverBudget = category.spent > category.budgeted

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={isOverBudget ? "destructive" : "secondary"}>
                        {Math.round(spentPercentage)}%
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditCategory(category)}
                        aria-label={`Edit ${category.name} category`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Delete ${category.name} category`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? This will also remove all items in this category.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(category.id, category.name)}
                              disabled={isLoading}
                            >
                              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Spent: {formatCurrency(category.spent)}</span>
                    <span>Budget: {formatCurrency(category.budgeted)}</span>
                  </div>
                  <Progress 
                    value={spentPercentage} 
                    className="h-2"
                    aria-label={`${category.name} budget progress: ${Math.round(spentPercentage)}% used`}
                  />

                  {/* Category Items */}
                  <div className="space-y-2">
                    {category.items.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <p>No items in this category</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setSelectedCategoryId(category.id)
                            setIsAddItemOpen(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    ) : (
                      <>
                        {category.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm p-2 rounded-lg border">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={item.paid}
                                onCheckedChange={() => handleToggleItemPaid(category.id, item.id, item.name, item.paid, item.amount)}
                                disabled={isLoading}
                                aria-label={`Mark ${item.name} as ${item.paid ? 'unpaid' : 'paid'}`}
                              />
                              <span className={item.paid ? "line-through text-gray-500" : ""}>
                                {item.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>{formatCurrency(item.amount)}</span>
                              <Badge variant={item.paid ? "default" : "outline"} className="text-xs">
                                {item.paid ? "Paid" : "Pending"}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditItem(item)}
                                aria-label={`Edit ${item.name}`}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    aria-label={`Delete ${item.name}`}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Item</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{item.name}"?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteItem(category.id, item.id, item.name)}
                                      disabled={isLoading}
                                    >
                                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedCategoryId(category.id)
                            setIsAddItemOpen(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Add Category Button */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Budget Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Budget Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Category Name *</Label>
                  <Input
                    id="category-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Venue, Catering"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category-budget">Budget Amount (LKR) *</Label>
                  <Input
                    id="category-budget"
                    type="number"
                    value={categoryForm.budgeted}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, budgeted: e.target.value }))}
                    placeholder="0"
                    min="0"
                    step="1000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category-color">Color</Label>
                  <Select value={categoryForm.color} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, color: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${color.value}`} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddCategory}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Category"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddCategoryOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-category-name">Category Name *</Label>
              <Input
                id="edit-category-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Venue, Catering"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-category-budget">Budget Amount (LKR) *</Label>
              <Input
                id="edit-category-budget"
                type="number"
                value={categoryForm.budgeted}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, budgeted: e.target.value }))}
                placeholder="0"
                min="0"
                step="1000"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-category-color">Color</Label>
              <Select value={categoryForm.color} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, color: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${color.value}`} />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleEditCategory}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Category"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingCategory(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Budget Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-name">Item Name *</Label>
              <Input
                id="item-name"
                value={itemForm.name}
                onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Wedding Dress"
                required
              />
            </div>
            <div>
              <Label htmlFor="item-amount">Amount (LKR) *</Label>
              <Input
                id="item-amount"
                type="number"
                value={itemForm.amount}
                onChange={(e) => setItemForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0"
                min="0"
                step="1000"
                required
              />
            </div>
            <div>
              <Label htmlFor="item-due-date">Due Date *</Label>
              <Input
                id="item-due-date"
                type="date"
                value={itemForm.dueDate}
                onChange={(e) => setItemForm(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="item-paid"
                checked={itemForm.paid}
                onCheckedChange={(checked) => setItemForm(prev => ({ ...prev, paid: checked as boolean }))}
              />
              <Label htmlFor="item-paid">Mark as paid</Label>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddItem}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Item"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddItemOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-item-name">Item Name *</Label>
              <Input
                id="edit-item-name"
                value={itemForm.name}
                onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Wedding Dress"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-item-amount">Amount (LKR) *</Label>
              <Input
                id="edit-item-amount"
                type="number"
                value={itemForm.amount}
                onChange={(e) => setItemForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0"
                min="0"
                step="1000"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-item-due-date">Due Date *</Label>
              <Input
                id="edit-item-due-date"
                type="date"
                value={itemForm.dueDate}
                onChange={(e) => setItemForm(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-item-paid"
                checked={itemForm.paid}
                onCheckedChange={(checked) => setItemForm(prev => ({ ...prev, paid: checked as boolean }))}
              />
              <Label htmlFor="edit-item-paid">Mark as paid</Label>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleEditItem}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Item"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingItem(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
