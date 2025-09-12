'use client';

import React from "react";
import { useState } from "react";
import { MainLayout } from "@/components/templates/main-layout";
import { StoriesSection } from "@/components/organisms/stories-section";
import { EnhancedFeedPosts } from "@/components/organisms/enhanced-feed-posts";
import { FeedSidebar } from "@/components/organisms/feed-sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Camera, 
  Video, 
  FileText, 
  Users, 
  Calendar,
  TrendingUp,
  MapPin,
  Star,
  Heart,
  MessageCircle,
  Share2
} from "lucide-react";

export default function EnhancedFeedPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const quickActions = [
    {
      icon: <Camera className="h-5 w-5" />,
      label: "Photo",
      action: () => setShowCreatePost(true),
      color: "bg-pink-500"
    },
    {
      icon: <Video className="h-5 w-5" />,
      label: "Video",
      action: () => setShowCreatePost(true),
      color: "bg-purple-500"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Story",
      action: () => setShowCreatePost(true),
      color: "bg-blue-500"
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Group",
      action: () => setShowCreateGroup(true),
      color: "bg-green-500"
    }
  ];

  const trendingTopics = [
    { tag: "#weddingplanning", posts: 1250, trend: "up" },
    { tag: "#srilankawedding", posts: 890, trend: "up" },
    { tag: "#bridal", posts: 2100, trend: "up" },
    { tag: "#venue", posts: 650, trend: "down" },
    { tag: "#photography", posts: 1800, trend: "up" }
  ];

  const nearbyEvents = [
    {
      id: "1",
      title: "Wedding Fair 2024",
      date: "2024-02-15",
      location: "Colombo",
      attendees: 250,
      type: "exhibition"
    },
    {
      id: "2", 
      title: "Bridal Fashion Show",
      date: "2024-02-20",
      location: "Kandy",
      attendees: 180,
      type: "fashion"
    },
    {
      id: "3",
      title: "Wedding Photography Workshop",
      date: "2024-02-25",
      location: "Galle",
      attendees: 45,
      type: "workshop"
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Enhanced Wedding Feed
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Discover, share, and connect with the wedding community
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-3 space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                      <Button 
                        variant="outline" 
                        className="flex-1 justify-start text-gray-500"
                        onClick={() => setShowCreatePost(true)}
                      >
                        What's on your mind?
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="flex flex-col items-center space-y-2 h-auto py-4 hover:bg-gray-100"
                          onClick={action.action}
                        >
                          <div className={`w-8 h-8 ${action.color} rounded-full flex items-center justify-center`}>
                            {action.icon}
                          </div>
                          <span className="text-xs">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stories Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <StoriesSection />
              </motion.div>

              {/* Enhanced Posts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <EnhancedFeedPosts 
                  activeFilter={activeFilter} 
                  onFilterChange={setActiveFilter} 
                />
              </motion.div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="sticky top-24 space-y-6"
              >
                {/* Trending Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Trending Topics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{topic.tag}</span>
                          <Badge variant="outline" className="text-xs">
                            {topic.posts} posts
                          </Badge>
                        </div>
                        <div className={`flex items-center ${
                          topic.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          <TrendingUp className={`h-3 w-3 ${
                            topic.trend === 'down' ? 'rotate-180' : ''
                          }`} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Nearby Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>Nearby Events</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {nearbyEvents.map((event) => (
                      <div key={event.id} className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                          <span className="text-xs text-gray-600">
                            {event.attendees} attending
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Posts Liked</span>
                      </div>
                      <span className="font-semibold">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Comments</span>
                      </div>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Share2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Shares</span>
                      </div>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Bookmarks</span>
                      </div>
                      <span className="font-semibold">15</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Groups You Might Like */}
                <Card>
                  <CardHeader>
                    <CardTitle>Groups You Might Like</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Colombo Brides</h4>
                        <p className="text-xs text-gray-600">1.2k members</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Wedding Planners SL</h4>
                        <p className="text-xs text-gray-600">850 members</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Camera className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Wedding Photography</h4>
                        <p className="text-xs text-gray-600">2.1k members</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View All Groups
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
