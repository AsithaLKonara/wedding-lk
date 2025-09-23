"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Activity } from "lucide-react"

interface SystemStatus {
  name: string
  status: "operational" | "degraded" | "down"
  lastChecked: string
  responseTime?: number
}

export function PlatformStatus() {
  const [systems, setSystems] = useState<SystemStatus[]>([
    { name: "Authentication", status: "operational", lastChecked: new Date().toISOString() },
    { name: "Database", status: "operational", lastChecked: new Date().toISOString() },
    { name: "Booking System", status: "operational", lastChecked: new Date().toISOString() },
    { name: "Payment Gateway", status: "operational", lastChecked: new Date().toISOString() },
    { name: "AI Search", status: "operational", lastChecked: new Date().toISOString() },
  ])

  const checkSystemStatus = async () => {
    // This would normally check actual system health
    // For demo purposes, we'll simulate status checks
    const updatedSystems = systems.map((system) => ({
      ...system,
      lastChecked: new Date().toISOString(),
      responseTime: Math.floor(Math.random() * 200) + 50, // Random response time 50-250ms
    }))
    setSystems(updatedSystems)
  }

  useEffect(() => {
    checkSystemStatus()
    const interval = setInterval(checkSystemStatus, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "down":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
      case "down":
        return <Badge className="bg-red-100 text-red-800">Down</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const overallStatus = systems.every((s) => s.status === "operational")
    ? "operational"
    : systems.some((s) => s.status === "down")
      ? "down"
      : "degraded"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Status</span>
          {getStatusBadge(overallStatus)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {systems.map((system, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(system.status)}
                <span className="font-medium">{system.name}</span>
              </div>
              <div className="text-right text-sm text-gray-600">
                {system.responseTime && <div>{system.responseTime}ms</div>}
                <div>Updated {new Date(system.lastChecked).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
