"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Bug, Database, Lock, CreditCard } from "lucide-react"

interface Issue {
  id: string
  type: "form" | "api" | "auth" | "payment"
  severity: "critical" | "warning" | "info"
  title: string
  description: string
  solution: string
  status: "detected" | "fixed" | "testing"
}

// Card will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Badge will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Tabs will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsList will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsTrigger will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function IssuesDebugPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [systemHealth, setSystemHealth] = useState({
    database: "unknown",
    authentication: "unknown",
    apis: "unknown",
    payments: "unknown",
  })

  const scanForIssues = async () => {
    setIsScanning(true)
    const detectedIssues: Issue[] = []

    try {
      // Test Database Connection
      const dbTest = await fetch("/api/test/database")
      const dbResult = await dbTest.json()

      if (!dbResult.success) {
        detectedIssues.push({
          id: "db-connection",
          type: "api",
          severity: "critical",
          title: "Database Connection Failed",
          description: "Cannot connect to MongoDB database",
          solution: "Check MONGODB_URI environment variable and database server status",
          status: "detected",
        })
        setSystemHealth((prev) => ({ ...prev, database: "error" }))
      } else {
        setSystemHealth((prev) => ({ ...prev, database: "healthy" }))
      }

      // Test Authentication
      const authTest = await fetch("/api/auth/session")
      if (!authTest.ok) {
        detectedIssues.push({
          id: "auth-config",
          type: "auth",
          severity: "critical",
          title: "Authentication Configuration Error",
          description: "NextAuth configuration is not working properly",
          solution: "Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables",
          status: "detected",
        })
        setSystemHealth((prev) => ({ ...prev, authentication: "error" }))
      } else {
        setSystemHealth((prev) => ({ ...prev, authentication: "healthy" }))
      }

      // Test API Endpoints
      const apiTests = [
        { endpoint: "/api/venues", name: "Venues API" },
        { endpoint: "/api/vendors", name: "Vendors API" },
        { endpoint: "/api/users", name: "Users API" },
      ]

      let apiErrors = 0
      for (const test of apiTests) {
        try {
          const response = await fetch(test.endpoint)
          if (!response.ok) {
            apiErrors++
            detectedIssues.push({
              id: `api-${test.endpoint.replace("/api/", "")}`,
              type: "api",
              severity: "warning",
              title: `${test.name} Not Responding`,
              description: `${test.endpoint} returned ${response.status}`,
              solution: "Check API route implementation and database connection",
              status: "detected",
            })
          }
        } catch (error) {
          apiErrors++
          detectedIssues.push({
            id: `api-${test.endpoint.replace("/api/", "")}-error`,
            type: "api",
            severity: "critical",
            title: `${test.name} Connection Error`,
            description: `Failed to connect to ${test.endpoint}`,
            solution: "Check server status and network connectivity",
            status: "detected",
          })
        }
      }

      setSystemHealth((prev) => ({ ...prev, apis: apiErrors === 0 ? "healthy" : "error" }))

      // Test Payment System
      try {
        const paymentTest = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "test", amount: 100 }),
        })

        if (!paymentTest.ok) {
          detectedIssues.push({
            id: "payment-system",
            type: "payment",
            severity: "warning",
            title: "Payment System Error",
            description: "Payment processing endpoint not responding correctly",
            solution: "Check payment gateway configuration and API keys",
            status: "detected",
          })
          setSystemHealth((prev) => ({ ...prev, payments: "error" }))
        } else {
          setSystemHealth((prev) => ({ ...prev, payments: "healthy" }))
        }
      } catch (error) {
        detectedIssues.push({
          id: "payment-connection",
          type: "payment",
          severity: "critical",
          title: "Payment Connection Failed",
          description: "Cannot connect to payment processing system",
          solution: "Check payment gateway configuration and network connectivity",
          status: "detected",
        })
        setSystemHealth((prev) => ({ ...prev, payments: "error" }))
      }

      // Form Validation Issues
      detectedIssues.push({
        id: "form-validation",
        type: "form",
        severity: "info",
        title: "Form Validation Guidelines",
        description: "Ensure all forms have proper client and server-side validation",
        solution: "Use Zod schemas for validation and proper error handling",
        status: "testing",
      })
    } catch (error) {
      console.error("Issue scanning error:", error)
    }

    setIssues(detectedIssues)
    setIsScanning(false)
  }

  const fixIssue = (issueId: string) => {
    setIssues((prev) => prev.map((issue) => (issue.id === issueId ? { ...issue, status: "fixed" } : issue)))
  }

  useEffect(() => {
    scanForIssues()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "form":
        return <Bug className="h-4 w-4" />
      case "api":
        return <Database className="h-4 w-4" />
      case "auth":
        return <Lock className="h-4 w-4" />
      case "payment":
        return <CreditCard className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Issues & Debugging</h1>
          <p className="text-gray-600 dark:text-gray-400">Identify and resolve platform issues</p>
        </div>
        <Button onClick={scanForIssues} disabled={isScanning}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? "animate-spin" : ""}`} />
          {isScanning ? "Scanning..." : "Scan for Issues"}
        </Button>
      </div>

      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemHealth.database)}
              <span>Database</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemHealth.authentication)}
              <span>Authentication</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemHealth.apis)}
              <span>APIs</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemHealth.payments)}
              <span>Payments</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues by Category */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Issues ({issues.length})</TabsTrigger>
          <TabsTrigger value="form">Form Issues ({issues.filter((i) => i.type === "form").length})</TabsTrigger>
          <TabsTrigger value="api">API Issues ({issues.filter((i) => i.type === "api").length})</TabsTrigger>
          <TabsTrigger value="auth">Auth Issues ({issues.filter((i) => i.type === "auth").length})</TabsTrigger>
          <TabsTrigger value="payment">
            Payment Issues ({issues.filter((i) => i.type === "payment").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {issues.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Issues Detected</h3>
                  <p className="text-gray-600 dark:text-gray-400">All systems are running smoothly!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            issues.map((issue) => (
              <Card key={issue.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(issue.type)}
                      <CardTitle className="text-lg">{issue.title}</CardTitle>
                      <Badge variant={getSeverityColor(issue.severity) as any}>{issue.severity}</Badge>
                    </div>
                    <Badge variant={issue.status === "fixed" ? "default" : "outline"}>{issue.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-400">{issue.description}</p>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Solution:</h4>
                      <p className="text-blue-800 dark:text-blue-200 text-sm">{issue.solution}</p>
                    </div>
                    {issue.status === "detected" && (
                      <Button onClick={() => fixIssue(issue.id)} size="sm">
                        Mark as Fixed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {["form", "api", "auth", "payment"].map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            {issues
              .filter((i) => i.type === type)
              .map((issue) => (
                <Card key={issue.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(issue.type)}
                        <CardTitle className="text-lg">{issue.title}</CardTitle>
                        <Badge variant={getSeverityColor(issue.severity) as any}>{issue.severity}</Badge>
                      </div>
                      <Badge variant={issue.status === "fixed" ? "default" : "outline"}>{issue.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-gray-600 dark:text-gray-400">{issue.description}</p>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Solution:</h4>
                        <p className="text-blue-800 dark:text-blue-200 text-sm">{issue.solution}</p>
                      </div>
                      {issue.status === "detected" && (
                        <Button onClick={() => fixIssue(issue.id)} size="sm">
                          Mark as Fixed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
