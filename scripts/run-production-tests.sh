#!/bin/bash

# 🧪 WeddingLK Production Testing Script
# Comprehensive E2E testing for the live production application

set -e  # Exit on any error

echo "🧪 Starting WeddingLK Production Testing Suite..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PRODUCTION_URL="https://wedding-9f2773v90-asithalkonaras-projects.vercel.app"
TEST_RESULTS_DIR="test-results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}📋 Testing Configuration:${NC}"
echo "   Production URL: $PRODUCTION_URL"
echo "   Results Directory: $TEST_RESULTS_DIR"
echo "   Timestamp: $TIMESTAMP"
echo ""

# Create results directory
mkdir -p "$TEST_RESULTS_DIR"

# Function to run test and capture results
run_test() {
    local test_name="$1"
    local test_command="$2"
    local output_file="$TEST_RESULTS_DIR/${test_name}_${TIMESTAMP}.txt"
    
    echo -e "${YELLOW}🔍 Running $test_name...${NC}"
    
    if eval "$test_command" > "$output_file" 2>&1; then
        echo -e "${GREEN}✅ $test_name PASSED${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name FAILED${NC}"
        echo -e "${YELLOW}   Check $output_file for details${NC}"
        return 1
    fi
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo -e "${BLUE}🔍 Checking dependencies...${NC}"

if ! command_exists "playwright"; then
    echo -e "${YELLOW}⚠️  Playwright not found. Installing...${NC}"
    npm install -g @playwright/test
    npx playwright install
fi

if ! command_exists "k6"; then
    echo -e "${YELLOW}⚠️  K6 not found. Installing...${NC}"
    # Install K6 (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install k6
    else
        echo -e "${RED}❌ Please install K6 manually: https://k6.io/docs/getting-started/installation/${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ All dependencies available${NC}"
echo ""

# Test 1: Health Check
echo -e "${BLUE}🏥 Test 1: Health Check${NC}"
run_test "health_check" "curl -s -w 'HTTP Status: %{http_code}\nResponse Time: %{time_total}s\n' '$PRODUCTION_URL/api/health'"

# Test 2: Basic API Endpoints
echo -e "${BLUE}🔌 Test 2: Basic API Endpoints${NC}"
run_test "api_vendors" "curl -s -w 'HTTP Status: %{http_code}\nResponse Time: %{time_total}s\n' '$PRODUCTION_URL/api/vendors'"
run_test "api_venues" "curl -s -w 'HTTP Status: %{http_code}\nResponse Time: %{time_total}s\n' '$PRODUCTION_URL/api/venues'"
run_test "api_search" "curl -s -w 'HTTP Status: %{http_code}\nResponse Time: %{time_total}s\n' '$PRODUCTION_URL/api/search?vendors=photography'"

# Test 3: Frontend E2E Tests
echo -e "${BLUE}🎭 Test 3: Frontend E2E Tests${NC}"
run_test "e2e_frontend" "npm run test:production"

# Test 4: API E2E Tests
echo -e "${BLUE}🔗 Test 4: API E2E Tests${NC}"
run_test "e2e_api" "npm run test:production-api"

# Test 5: Load Testing
echo -e "${BLUE}⚡ Test 5: Load Testing${NC}"
run_test "load_test" "npm run test:production-load"

# Test 6: Performance Testing
echo -e "${BLUE}📊 Test 6: Performance Testing${NC}"
run_test "performance_test" "curl -s -w 'HTTP Status: %{http_code}\nResponse Time: %{time_total}s\nSize: %{size_download} bytes\n' '$PRODUCTION_URL'"

# Test 7: Security Testing
echo -e "${BLUE}🔒 Test 7: Security Testing${NC}"
run_test "security_headers" "curl -s -I '$PRODUCTION_URL' | grep -E '(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection|Strict-Transport-Security)'"
run_test "https_redirect" "curl -s -I 'http://wedding-9f2773v90-asithalkonaras-projects.vercel.app' | grep -E '(301|302|Location)'"

# Test 8: Mobile Responsiveness
echo -e "${BLUE}📱 Test 8: Mobile Responsiveness${NC}"
run_test "mobile_test" "playwright test tests/e2e/production-test.spec.ts --grep 'Mobile Responsiveness'"

# Test 9: Error Handling
echo -e "${BLUE}🚨 Test 9: Error Handling${NC}"
run_test "error_404" "curl -s -w 'HTTP Status: %{http_code}\n' '$PRODUCTION_URL/non-existent-page'"
run_test "error_api" "curl -s -w 'HTTP Status: %{http_code}\n' '$PRODUCTION_URL/api/non-existent-endpoint'"

# Test 10: Database Connectivity
echo -e "${BLUE}🗄️ Test 10: Database Connectivity${NC}"
run_test "database_test" "curl -s '$PRODUCTION_URL/api/health' | grep -E '(database|healthy|degraded)'"

# Generate comprehensive report
echo -e "${BLUE}📋 Generating Test Report...${NC}"

REPORT_FILE="$TEST_RESULTS_DIR/test_report_${TIMESTAMP}.md"

cat > "$REPORT_FILE" << EOF
# 🧪 WeddingLK Production Test Report

**Generated:** $(date)
**Production URL:** $PRODUCTION_URL
**Test Suite:** Comprehensive E2E Testing

## 📊 Test Summary

| Test Category | Status | Details |
|---------------|--------|---------|
| Health Check | $(if [ -f "$TEST_RESULTS_DIR/health_check_${TIMESTAMP}.txt" ] && grep -q "HTTP Status: 200" "$TEST_RESULTS_DIR/health_check_${TIMESTAMP}.txt"; then echo "✅ PASSED"; else echo "❌ FAILED"; fi) | API health endpoint |
| API Endpoints | $(if [ -f "$TEST_RESULTS_DIR/api_vendors_${TIMESTAMP}.txt" ] && grep -q "HTTP Status: 200" "$TEST_RESULTS_DIR/api_vendors_${TIMESTAMP}.txt"; then echo "✅ PASSED"; else echo "❌ FAILED"; fi) | Vendors, venues, search APIs |
| Frontend E2E | $(if [ -f "$TEST_RESULTS_DIR/e2e_frontend_${TIMESTAMP}.txt" ] && grep -q "passed" "$TEST_RESULTS_DIR/e2e_frontend_${TIMESTAMP}.txt"; then echo "✅ PASSED"; else echo "❌ FAILED"; fi) | User interface testing |
| API E2E | $(if [ -f "$TEST_RESULTS_DIR/e2e_api_${TIMESTAMP}.txt" ] && grep -q "passed" "$TEST_RESULTS_DIR/e2e_api_${TIMESTAMP}.txt"; then echo "✅ PASSED"; else echo "❌ FAILED"; fi) | API integration testing |
| Load Testing | $(if [ -f "$TEST_RESULTS_DIR/load_test_${TIMESTAMP}.txt" ] && grep -q "PASSED" "$TEST_RESULTS_DIR/load_test_${TIMESTAMP}.txt"; then echo "✅ PASSED"; else echo "❌ FAILED"; fi) | Performance under load |
| Security | $(if [ -f "$TEST_RESULTS_DIR/security_headers_${TIMESTAMP}.txt" ] && grep -q "X-Frame-Options" "$TEST_RESULTS_DIR/security_headers_${TIMESTAMP}.txt"; then echo "✅ PASSED"; else echo "❌ FAILED"; fi) | Security headers |
| Mobile | $(if [ -f "$TEST_RESULTS_DIR/mobile_test_${TIMESTAMP}.txt" ] && grep -q "passed" "$TEST_RESULTS_DIR/mobile_test_${TIMESTAMP}.txt"; then echo "✅ PASSED"; else echo "❌ FAILED"; fi) | Mobile responsiveness |
| Error Handling | $(if [ -f "$TEST_RESULTS_DIR/error_404_${TIMESTAMP}.txt" ] && grep -q "HTTP Status: 404" "$TEST_RESULTS_DIR/error_404_${TIMESTAMP}.txt"; then echo "✅ PASSED"; else echo "❌ FAILED"; fi) | 404 and error pages |
| Database | $(if [ -f "$TEST_RESULTS_DIR/database_test_${TIMESTAMP}.txt" ] && grep -q "healthy\|degraded" "$TEST_RESULTS_DIR/database_test_${TIMESTAMP}.txt"; then echo "✅ PASSED"; else echo "❌ FAILED"; fi) | Database connectivity |

## 📁 Test Results

All detailed test results are available in the \`$TEST_RESULTS_DIR\` directory:

EOF

# Add individual test results to report
for file in "$TEST_RESULTS_DIR"/*_${TIMESTAMP}.txt; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "### $filename" >> "$REPORT_FILE"
        echo '```' >> "$REPORT_FILE"
        head -20 "$file" >> "$REPORT_FILE"
        echo '```' >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
    fi
done

cat >> "$REPORT_FILE" << EOF

## 🎯 Recommendations

1. **Monitor Error Logs**: Check the error logging endpoint for any runtime errors
2. **Performance Optimization**: Review load test results for bottlenecks
3. **Security Review**: Ensure all security headers are properly configured
4. **Mobile Testing**: Verify mobile experience across different devices
5. **Database Monitoring**: Monitor database performance and connection health

## 🚀 Next Steps

1. Review any failed tests and address issues
2. Set up continuous monitoring for production
3. Implement automated testing in CI/CD pipeline
4. Regular performance and security audits

---

**Test completed at:** $(date)
**Total test files:** $(ls -1 "$TEST_RESULTS_DIR"/*_${TIMESTAMP}.txt 2>/dev/null | wc -l)
EOF

echo -e "${GREEN}📋 Test Report Generated: $REPORT_FILE${NC}"

# Display summary
echo ""
echo -e "${GREEN}🎉 Production Testing Complete!${NC}"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo "   📁 Results Directory: $TEST_RESULTS_DIR"
echo "   📋 Report: $REPORT_FILE"
echo "   🕐 Timestamp: $TIMESTAMP"
echo ""
echo -e "${BLUE}🔍 Review Results:${NC}"
echo "   • Check individual test files in $TEST_RESULTS_DIR/"
echo "   • Read comprehensive report: $REPORT_FILE"
echo "   • Address any failed tests"
echo ""
echo -e "${GREEN}🚀 WeddingLK Production Testing Suite Complete!${NC}"

