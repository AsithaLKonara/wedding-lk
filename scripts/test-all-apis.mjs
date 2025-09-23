#!/usr/bin/env node

const BASE_URL = "https://wedding-lkcom.vercel.app"

const API_ENDPOINTS = [
  // Test APIs
  { path: "/api/test-simple", method: "GET", name: "Test Simple API" },
  { path: "/api/test-db", method: "GET", name: "Database Test API" },
  
  // Core APIs
  { path: "/api/vendors", method: "GET", name: "Vendors API" },
  { path: "/api/venues", method: "GET", name: "Venues API" },
  { path: "/api/services", method: "GET", name: "Services API" },
  { path: "/api/users", method: "GET", name: "Users API" },
  { path: "/api/reviews", method: "GET", name: "Reviews API" },
  { path: "/api/bookings", method: "GET", name: "Bookings API" },
  { path: "/api/clients", method: "GET", name: "Clients API" },
  { path: "/api/tasks", method: "GET", name: "Tasks API" },
  { path: "/api/payments", method: "GET", name: "Payments API" },
  
  // Auth APIs
  { path: "/api/auth/providers", method: "GET", name: "Auth Providers API" },
  { path: "/api/auth/signin/google", method: "GET", name: "Google Sign-in URL" },
  
  // Additional APIs
  { path: "/api/ai-search", method: "GET", name: "AI Search API" },
  { path: "/api/errors", method: "GET", name: "Errors API" },
]

async function testAPI(endpoint) {
  try {
    const url = `${BASE_URL}${endpoint.path}`
    console.log(`\n🔍 Testing ${endpoint.name}...`)
    console.log(`   URL: ${url}`)
    
    const response = await fetch(url, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const status = response.status
    const statusText = response.statusText
    
    console.log(`   Status: ${status} ${statusText}`)
    
    if (status === 200) {
      try {
        const data = await response.json()
        console.log(`   ✅ SUCCESS - Data received`)
        if (data.success !== undefined) {
          console.log(`   Response success: ${data.success}`)
        }
        if (data.count !== undefined) {
          console.log(`   Data count: ${data.count}`)
        }
        if (data.message) {
          console.log(`   Message: ${data.message}`)
        }
      } catch (jsonError) {
        console.log(`   ⚠️  SUCCESS - Non-JSON response (${response.headers.get('content-type')})`)
      }
    } else if (status === 401) {
      console.log(`   🔒 UNAUTHORIZED - Authentication required (expected for some endpoints)`)
    } else if (status === 404) {
      console.log(`   ❌ NOT FOUND - API endpoint not accessible`)
    } else if (status === 400) {
      console.log(`   ⚠️  BAD REQUEST - May need proper parameters`)
    } else {
      console.log(`   ❌ ERROR - Unexpected status code`)
    }
    
    return {
      name: endpoint.name,
      path: endpoint.path,
      status,
      statusText,
      success: status === 200 || status === 401
    }
    
  } catch (error) {
    console.log(`   ❌ ERROR - ${error.message}`)
    return {
      name: endpoint.name,
      path: endpoint.path,
      status: 0,
      statusText: error.message,
      success: false
    }
  }
}

async function testAllAPIs() {
  console.log("🚀 Starting Comprehensive API Testing")
  console.log("=" * 50)
  
  const results = []
  
  for (const endpoint of API_ENDPOINTS) {
    const result = await testAPI(endpoint)
    results.push(result)
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log("\n" + "=" * 50)
  console.log("📊 TEST RESULTS SUMMARY")
  console.log("=" * 50)
  
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  console.log(`\n✅ Successful APIs: ${successful.length}/${results.length}`)
  successful.forEach(result => {
    console.log(`   • ${result.name} (${result.status})`)
  })
  
  console.log(`\n❌ Failed APIs: ${failed.length}/${results.length}`)
  failed.forEach(result => {
    console.log(`   • ${result.name} (${result.status} ${result.statusText})`)
  })
  
  console.log(`\n📈 Success Rate: ${Math.round((successful.length / results.length) * 100)}%`)
  
  if (failed.length > 0) {
    console.log("\n🔧 RECOMMENDATIONS:")
    console.log("1. Check Vercel deployment logs for 404 errors")
    console.log("2. Verify API routes are properly exported")
    console.log("3. Check for build errors in production")
    console.log("4. Ensure environment variables are set correctly")
  }
}

testAllAPIs().catch(console.error)
