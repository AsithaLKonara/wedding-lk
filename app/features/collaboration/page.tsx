import { Users, MessageCircle, Share2, Calendar, CheckCircle, FileText, Video, Phone } from 'lucide-react'

export default function CollaborationFeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Seamless Collaboration
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plan your perfect wedding together with family, friends, and vendors through our advanced collaboration tools designed for modern couples.
            </p>
          </div>
        </div>
      </div>

      {/* Collaboration Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Real-time Messaging */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Real-time Messaging</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Instant communication with your wedding party, vendors, and family members through our integrated messaging system.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Group conversations
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                File sharing
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Message history
              </li>
            </ul>
          </div>

          {/* Shared Planning Board */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Share2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Shared Planning Board</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Collaborate on wedding details with a shared digital board where everyone can contribute ideas and updates.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Real-time updates
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Comment system
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Version control
              </li>
            </ul>
          </div>

          {/* Task Management */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Task Management</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Assign and track wedding planning tasks with your team, ensuring nothing falls through the cracks.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Task assignments
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Progress tracking
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Deadline reminders
              </li>
            </ul>
          </div>

          {/* Document Sharing */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Document Sharing</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Share contracts, invoices, and important documents with your wedding team securely and efficiently.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Secure file storage
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Version control
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Access permissions
              </li>
            </ul>
          </div>

          {/* Video Conferencing */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Video Meetings</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Conduct virtual meetings with vendors and family members directly within the platform.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                HD video calls
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Screen sharing
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Meeting recordings
              </li>
            </ul>
          </div>

          {/* Guest Coordination */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Guest Coordination</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Coordinate with your wedding party and guests through dedicated communication channels.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Guest groups
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                RSVP management
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Event updates
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Collaboration Workflow */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Collaboration Works
            </h2>
            <p className="text-lg text-gray-600">
              A simple 4-step process to keep everyone in sync
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Invite Team</h3>
              <p className="text-gray-600">Add family, friends, and vendors to your wedding planning team</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Assign Tasks</h3>
              <p className="text-gray-600">Distribute planning responsibilities and set deadlines</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Communicate</h3>
              <p className="text-gray-600">Stay connected through messaging and video calls</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Track Progress</h3>
              <p className="text-gray-600">Monitor completion and celebrate milestones together</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Real-time Collaboration
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                See changes as they happen with our real-time collaboration features. No more confusion about who's doing what or when things are due.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Live updates across all devices</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Instant notifications for important changes</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Conflict resolution for simultaneous edits</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Activity feed showing all team actions</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-8">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Sarah Johnson</span>
                    <span className="text-sm text-gray-500 ml-2">2 minutes ago</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
                  </div>
                  <p className="text-gray-700">Updated the venue selection with new photos</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Mike Chen</span>
                    <span className="text-sm text-gray-500 ml-2">5 minutes ago</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
                  </div>
                  <p className="text-gray-700">Completed the catering menu selection</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <MessageCircle className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Wedding Planner</span>
                    <span className="text-sm text-gray-500 ml-2">10 minutes ago</span>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full ml-auto"></div>
                  </div>
                  <p className="text-gray-700">Scheduled vendor meeting for next week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Collaborating Today
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Bring your wedding planning team together and create the perfect celebration with seamless collaboration tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Planning Together
            </a>
            <a
              href="/help/collaboration"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Learn More About Collaboration
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}