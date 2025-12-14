"use client"

import { Button } from "@/components/ui/button"
import { Calendar, CheckSquare, DollarSign, Users } from "lucide-react"

interface PlanningTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function PlanningTabs({ activeTab, onTabChange }: PlanningTabsProps) {
  const tabs = [
    {
      id: "checklist",
      label: "Checklist",
      icon: CheckSquare,
      description: "Track your wedding tasks",
    },
    {
      id: "timeline",
      label: "Timeline",
      icon: Calendar,
      description: "Plan your wedding schedule",
    },
    {
      id: "budget",
      label: "Budget",
      icon: DollarSign,
      description: "Manage your expenses",
    },
    {
      id: "guests",
      label: "Guest List",
      icon: Users,
      description: "Organize your invitations",
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col items-center gap-2 ${
                isActive ? "bg-rose-600 hover:bg-rose-700 text-white" : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">{tab.label}</div>
                <div className={`text-xs ${isActive ? "text-rose-100" : "text-gray-500"}`}>{tab.description}</div>
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}


export default PlanningTabs
