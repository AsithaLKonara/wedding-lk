import { Zap, Gauge, Clock, Smartphone, Globe, Database, Cpu, Battery } from 'lucide-react'

export default function PerformanceFeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Lightning-Fast Performance
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience blazing-fast wedding planning with our optimized platform that loads in milliseconds and works seamlessly across all devices.
            </p>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">&lt; 1s</div>
              <div className="text-green-100">Page Load Time</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-green-100">Uptime</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">95+</div>
              <div className="text-green-100">Performance Score</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-green-100">Concurrent Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Fast Loading */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Gauge className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Ultra-Fast Loading</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Pages load in under 1 second with our optimized code, CDN delivery, and smart caching strategies.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Code splitting and lazy loading
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Image optimization
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                CDN acceleration
              </li>
            </ul>
          </div>

          {/* Mobile Performance */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Mobile Optimized</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Perfect performance on mobile devices with touch-optimized interactions and responsive design.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Touch-friendly interface
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Offline functionality
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Progressive Web App
              </li>
            </ul>
          </div>

          {/* Global CDN */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Global CDN</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Content delivered from 200+ locations worldwide for lightning-fast access from anywhere.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                200+ global locations
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Edge caching
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Automatic failover
              </li>
            </ul>
          </div>

          {/* Database Optimization */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <Database className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Database Performance</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Optimized database queries and intelligent caching for instant data retrieval and updates.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Query optimization
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Redis caching
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Connection pooling
              </li>
            </ul>
          </div>

          {/* Real-time Updates */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Real-time Updates</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Instant updates and notifications without page refreshes using WebSocket technology.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Live notifications
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Real-time chat
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Live collaboration
              </li>
            </ul>
          </div>

          {/* Resource Optimization */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <Cpu className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Resource Optimization</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Minimal resource usage with efficient code, smart bundling, and optimized assets.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Tree shaking
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Bundle optimization
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Asset compression
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Performance Benchmarks
            </h2>
            <p className="text-lg text-gray-600">
              Measured performance metrics that exceed industry standards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">0.8s</div>
              <div className="text-gray-600">Average Load Time</div>
              <div className="text-sm text-gray-500 mt-1">Industry: 3.2s</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">95</div>
              <div className="text-gray-600">Lighthouse Score</div>
              <div className="text-sm text-gray-500 mt-1">Out of 100</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
              <div className="text-sm text-gray-500 mt-1">Last 12 months</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-2">10K+</div>
              <div className="text-gray-600">Concurrent Users</div>
              <div className="text-sm text-gray-500 mt-1">Supported</div>
            </div>
          </div>
        </div>
      </div>

      {/* Battery Optimization */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Battery-Friendly Design
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our platform is designed to be gentle on your device's battery, using efficient algorithms and smart resource management.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Battery className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-gray-700">Efficient JavaScript execution</span>
                </div>
                <div className="flex items-center">
                  <Battery className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-gray-700">Smart background processing</span>
                </div>
                <div className="flex items-center">
                  <Battery className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-gray-700">Minimal network requests</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-8 text-center">
              <Battery className="w-24 h-24 text-green-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-2">50% Less</div>
              <div className="text-gray-600">Battery Usage</div>
              <div className="text-sm text-gray-500 mt-2">Compared to similar apps</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Experience Lightning-Fast Wedding Planning
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Join thousands of couples who enjoy fast, reliable wedding planning with our optimized platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Planning Now
            </a>
            <a
              href="/help/performance"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Learn More About Performance
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}