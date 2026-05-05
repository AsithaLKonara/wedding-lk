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
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Camera, 
  Video, 
  FileText, 
  Users, 
  Calendar,
  TrendingUp,
  MapPin,
  Share2,
  Sparkles,
  Heart,
  MessageCircle,
  Star
} from "lucide-react";

export default function EnhancedFeedPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const gateAction = (actionLabel: string, actionFn: () => void) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: `Please sign in to perform actions like ${actionLabel.toLowerCase()}.`,
        variant: "destructive"
      });
      router.push('/auth/signin');
      return;
    }
    actionFn();
  };

  const quickActions = [
    {
      icon: <Camera className="h-5 w-5" />,
      label: "Photo",
      action: () => gateAction("posting photos", () => setShowCreatePost(true)),
      color: "bg-pink-500"
    },
    {
      icon: <Video className="h-5 w-5" />,
      label: "Video",
      action: () => gateAction("posting videos", () => setShowCreatePost(true)),
      color: "bg-purple-500"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Story",
      action: () => gateAction("posting stories", () => setShowCreatePost(true)),
      color: "bg-blue-500"
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Group",
      action: () => gateAction("creating groups", () => setShowCreateGroup(true)),
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
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
          <motion.div
            animate={{
              background: [
                "radial-gradient(circle at 10% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 40%)",
                "radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 40%)",
                "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 40%)",
                "radial-gradient(circle at 10% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 40%)",
              ],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center lg:text-left"
          >
            <div className="inline-flex items-center bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-border/50">
              <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Community Pulse</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4 tracking-tighter">
              Wedding <span className="gradient-text">Feed</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
              Discover, share, and connect with the vibrant wedding community.
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
                <Card className="border border-border/50 shadow-xl bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden mb-8">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      <Button 
                        variant="ghost" 
                        className="flex-1 justify-start text-muted-foreground font-medium h-12 bg-muted/30 rounded-2xl border border-border/50 hover:bg-muted/50 transition-all"
                        onClick={() => gateAction("creating updates", () => setShowCreatePost(true))}
                      >
                        What's your dream wedding update?
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="flex flex-col items-center space-y-2 h-auto py-4 rounded-2xl hover:bg-purple-500/5 group transition-all"
                          onClick={action.action}
                        >
                          <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-lg transition-all text-white`}>
                            {action.icon}
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-purple-500">{action.label}</span>
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
                <Card className="border border-border/50 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center space-x-2 text-lg font-black tracking-tight">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      <span>Trending Topics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {trendingTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold group-hover:text-purple-500 transition-colors">{topic.tag}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {topic.posts} posts this week
                          </span>
                        </div>
                        <div className={`flex items-center p-1.5 rounded-lg ${
                          topic.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
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
                <Card className="border border-border/50 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center space-x-2 text-lg font-black tracking-tight">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      <span>Nearby Events</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {nearbyEvents.map((event) => (
                      <div key={event.id} className="border border-border/30 rounded-2xl p-4 bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer group">
                        <h4 className="font-bold text-sm mb-2 group-hover:text-purple-500 transition-colors">{event.title}</h4>
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <Calendar className="h-3 w-3 text-purple-500" />
                            <span>{new Date(event.date).toLocaleDateString('en-GB')}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <MapPin className="h-3 w-3 text-purple-500" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest rounded-lg bg-purple-500/10 text-purple-600 border-none">
                            {event.type}
                          </Badge>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {event.attendees} attending
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="border border-border/50 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-black tracking-tight">Your Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {[
                      { icon: <Heart className="h-4 w-4 text-rose-500" />, label: "Posts Liked", value: "24", bg: "bg-rose-500/10" },
                      { icon: <MessageCircle className="h-4 w-4 text-purple-500" />, label: "Comments", value: "12", bg: "bg-purple-500/10" },
                      { icon: <Share2 className="h-4 w-4 text-blue-500" />, label: "Shares", value: "8", bg: "bg-blue-500/10" },
                      { icon: <Star className="h-4 w-4 text-yellow-500" />, label: "Bookmarks", value: "15", bg: "bg-yellow-500/10" }
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 ${stat.bg} rounded-xl`}>
                            {stat.icon}
                          </div>
                          <span className="text-sm font-bold text-muted-foreground">{stat.label}</span>
                        </div>
                        <span className="font-black text-foreground">{stat.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Groups You Might Like */}
                <Card className="border border-border/50 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-black tracking-tight">Groups For You</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "Colombo Brides", members: "1.2k", icon: <Users className="h-4 w-4 text-blue-500" />, bg: "bg-blue-500/10" },
                      { name: "Wedding Planners SL", members: "850", icon: <Calendar className="h-4 w-4 text-emerald-500" />, bg: "bg-emerald-500/10" },
                      { name: "Photography Elite", members: "2.1k", icon: <Camera className="h-4 w-4 text-purple-500" />, bg: "bg-purple-500/10" }
                    ].map((group, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer p-1 rounded-2xl hover:bg-muted/30 transition-all">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${group.bg} rounded-xl flex items-center justify-center`}>
                            {group.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold group-hover:text-purple-500 transition-colors">{group.name}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{group.members} members</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-purple-500 hover:text-white transition-all">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4 rounded-xl font-bold border-2 text-xs uppercase tracking-widest">
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
