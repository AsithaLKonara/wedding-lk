import { Calendar, Clock, Bell, CheckCircle, Users, MapPin, Repeat, AlertCircle } from 'lucide-react'

export default function SchedulingFeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Smart Scheduling & Timeline Management
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Never miss a deadline with our intelligent scheduling system that keeps your wedding planning on track with automated reminders and timeline management.
            </p>
          </div>
                </div>
              </div>

      {/* Scheduling Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Wedding Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Wedding Timeline</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Create a comprehensive timeline from engagement to honeymoon with customizable milestones and deadlines.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Customizable milestones
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Progress tracking
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Visual timeline view
              </li>
            </ul>
          </div>

          {/* Smart Reminders */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Smart Reminders</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Get intelligent reminders for important tasks, vendor meetings, and deadlines based on your wedding date.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Automated notifications
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Email & SMS alerts
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Custom reminder timing
              </li>
            </ul>
            </div>

          {/* Vendor Scheduling */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-purple-600" />
                    </div>
              <h3 className="text-xl font-semibold text-gray-900">Vendor Scheduling</h3>
                  </div>
            <p className="text-gray-600 mb-4">
              Coordinate meetings and appointments with all your wedding vendors through integrated scheduling.
                  </p>
                  <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Vendor availability
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Meeting coordination
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Calendar integration
                      </li>
                  </ul>
                </div>

          {/* Event Management */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Event Management</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Plan and schedule all wedding-related events from engagement parties to rehearsal dinners.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Multiple event types
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Guest management
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Location tracking
              </li>
            </ul>
          </div>

          {/* Recurring Tasks */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <Repeat className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Recurring Tasks</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Set up recurring tasks for regular wedding planning activities like vendor follow-ups and payments.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Custom recurrence patterns
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Automatic task creation
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Progress tracking
              </li>
            </ul>
                      </div>

          {/* Deadline Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Deadline Alerts</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Never miss important deadlines with smart alerts that warn you about upcoming due dates.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Escalating alerts
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Priority management
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Team notifications
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Visual Timeline Management
              </h2>
            <p className="text-lg text-gray-600">
              See your entire wedding planning journey at a glance
              </p>
            </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
              
              {/* Timeline Items */}
              <div className="space-y-8">
                <div className="relative flex items-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center z-10">
                    <Calendar className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="ml-8">
                    <h3 className="text-lg font-semibold text-gray-900">12 Months Before</h3>
                    <p className="text-gray-600">Set wedding date, book venue, hire wedding planner</p>
                    <div className="flex items-center mt-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-500">Completed</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center z-10">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="ml-8">
                    <h3 className="text-lg font-semibold text-gray-900">9 Months Before</h3>
                    <p className="text-gray-600">Book photographer, florist, caterer, and entertainment</p>
                    <div className="flex items-center mt-2">
                      <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-500">In Progress</span>
                    </div>
                    </div>
                  </div>
                  
                <div className="relative flex items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center z-10">
                    <Bell className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="ml-8">
                    <h3 className="text-lg font-semibold text-gray-900">6 Months Before</h3>
                    <p className="text-gray-600">Order invitations, book transportation, plan honeymoon</p>
                    <div className="flex items-center mt-2">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-500">Pending</span>
                    </div>
                    </div>
                  </div>
                  
                <div className="relative flex items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center z-10">
                    <MapPin className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="ml-8">
                    <h3 className="text-lg font-semibold text-gray-900">3 Months Before</h3>
                    <p className="text-gray-600">Finalize details, send invitations, plan rehearsal dinner</p>
                    <div className="flex items-center mt-2">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-500">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
                    </div>
                  </div>
                </div>
              </div>
              
      {/* Smart Scheduling Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Intelligent Scheduling
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our AI-powered scheduling system learns from your preferences and automatically suggests optimal times for meetings, deadlines, and tasks.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Smart time slot suggestions based on availability</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Automatic conflict detection and resolution</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Weather-aware outdoor event scheduling</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Vendor availability integration</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl p-8">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Photography Session</span>
                    <span className="text-sm text-green-600">✓ Scheduled</span>
                  </div>
                  <p className="text-sm text-gray-600">Saturday, March 15 at 2:00 PM</p>
                  <p className="text-xs text-gray-500">Central Park - Weather: Sunny, 72°F</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Catering Tasting</span>
                    <span className="text-sm text-yellow-600">⏰ Pending</span>
                  </div>
                  <p className="text-sm text-gray-600">Suggested: Sunday, March 10 at 1:00 PM</p>
                  <p className="text-xs text-gray-500">Available slots: 1:00 PM, 3:00 PM, 5:00 PM</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Venue Walkthrough</span>
                    <span className="text-sm text-blue-600">📅 Confirmed</span>
                  </div>
                  <p className="text-sm text-gray-600">Friday, March 8 at 10:00 AM</p>
                  <p className="text-xs text-gray-500">Grand Ballroom - 2 hours allocated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay on Track with Smart Scheduling
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Never miss a deadline or double-book again with our intelligent scheduling system designed specifically for wedding planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Planning with Smart Scheduling
            </a>
            <a
              href="/help/scheduling"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Learn More About Scheduling
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}