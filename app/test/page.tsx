"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { CheckCircle, XCircle, Clock, Database, Shield, CreditCard, Calendar } from "lucide-react"

interface TestResult {
  name: string
  status: "pending" | "success" | "error"
  message: string
  details?: string
}

// Card will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Badge will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Database Connection", status: "pending", message: "Testing MongoDB connection..." },
    { name: "Authentication System", status: "pending", message: "Testing NextAuth configuration..." },
    { name: "Venues API", status: "pending", message: "Testing venues endpoint..." },
    { name: "Vendors API", status: "pending", message: "Testing vendors endpoint..." },
    { name: "Users API", status: "pending", message: "Testing users endpoint..." },
    { name: "Bookings API", status: "pending", message: "Testing bookings endpoint..." },
    { name: "Payments API", status: "pending", message: "Testing payments endpoint..." },
    { name: "AI Search API", status: "pending", message: "Testing AI search endpoint..." },
  ])

  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (name: string, status: "success" | "error", message: string, details?: string) => {
    setTests((prev) => prev.map((test) => (test.name === name ? { ...test, status, message, details } : test)))
  }

  const runTests = async () => {
    setIsRunning(true)

    // Test Database Connection
    try {
      const dbResponse = await fetch("/api/test/database")
      const dbResult = await dbResponse.json()
      updateTest(
        "Database Connection",
        dbResponse.ok ? "success" : "error",
        dbResponse.ok ? "MongoDB connected successfully" : "Database connection failed",
        JSON.stringify(dbResult, null, 2),
      )
    } catch (error) {
      updateTest("Database Connection", "error", "Database test failed", String(error))
    }

    // Test Authentication
    try {
      const authResponse = await fetch("/api/auth/session")
      updateTest(
        "Authentication System",
        authResponse.ok ? "success" : "error",
        authResponse.ok ? "NextAuth configured correctly" : "Authentication system error",
      )
    } catch (error) {
      updateTest("Authentication System", "error", "Auth test failed", String(error))
    }

    // Test APIs
    const apiTests = [
      { name: "Venues API", endpoint: "/api/venues" },
      { name: "Vendors API", endpoint: "/api/vendors" },
      { name: "Users API", endpoint: "/api/users" },
      { name: "Bookings API", endpoint: "/api/bookings" },
      { name: "Payments API", endpoint: "/api/payments" },
      { name: "AI Search API", endpoint: "/api/ai-search" },
    ]

    for (const test of apiTests) {
      try {
        const response = await fetch(test.endpoint)
        const result = await response.json()
        updateTest(
          test.name,
          response.ok ? "success" : "error",
          response.ok ? "API endpoint working" : `API error: ${response.status}`,
          JSON.stringify(result, null, 2),
        )
      } catch (error) {
        updateTest(test.name, "error", "API test failed", String(error))
      }
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Wedding Platform Test Suite</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive testing of all platform components and integrations
        </p>
      </div>

      {/* Test Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button onClick={runTests} disabled={isRunning} className="bg-gradient-to-r from-rose-500 to-pink-600">
              {isRunning ? "Running Tests..." : "Run All Tests"}
            </Button>
            <div className="text-sm text-gray-600">
              Tests: {tests.filter((t) => t.status === "success").length} passed,{" "}
              {tests.filter((t) => t.status === "error").length} failed,{" "}
              {tests.filter((t) => t.status === "pending").length} pending
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="space-y-4">
        {tests.map((test, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <h3 className="text-lg font-semibold">{test.name}</h3>
                </div>
                {getStatusBadge(test.status)}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{test.message}</p>
              {test.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">View Details</summary>
                  <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                    {test.details}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Platform Features Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold">Database</h4>
              <p className="text-sm text-gray-600">MongoDB with user, venue, vendor models</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold">Authentication</h4>
              <p className="text-sm text-gray-600">NextAuth with Google OAuth & credentials</p>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold">Booking System</h4>
              <p className="text-sm text-gray-600">Complete venue booking with confirmation</p>
            </div>
            <div className="text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-rose-600" />
              <h4 className="font-semibold">Payments</h4>
              <p className="text-sm text-gray-600">Sri Lankan payment gateways integration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" asChild>
              <a href="/login">Login Page</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/register">Register Page</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/venues">Browse Venues</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/vendors">Find Vendors</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/dashboard">User Dashboard</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/planning">Planning Tools</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/gallery">Photo Gallery</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/about">About Us</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
