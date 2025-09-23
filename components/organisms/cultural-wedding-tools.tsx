"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Clock, Users, Heart } from "lucide-react"

export function CulturalWeddingTools() {
  const [selectedTool, setSelectedTool] = useState("astrology")
  const [astrologyData, setAstrologyData] = useState({
    brideDate: "",
    brideName: "",
    groomDate: "",
    groomName: "",
    weddingDate: "",
    location: "",
  })

  const tools = [
    {
      id: "astrology",
      title: "Astrology Matching",
      titleLocal: "ජ්‍යොතිෂ ගැලපීම",
      icon: Star,
      description: "Find auspicious dates and check compatibility",
      price: 2500,
    },
    {
      id: "poruwa",
      title: "Poruwa Ceremony",
      titleLocal: "පොරුව උත්සවය",
      icon: Heart,
      description: "Traditional Kandyan wedding ceremony planning",
      price: 5000,
    },
    {
      id: "timing",
      title: "Auspicious Timing",
      titleLocal: "ශුභ වේලාව",
      icon: Clock,
      description: "Calculate perfect ceremony timings",
      price: 1500,
    },
    {
      id: "traditional",
      title: "Traditional Services",
      titleLocal: "සාම්ප්‍රදායික සේවා",
      icon: Users,
      description: "Kandyan dancers, drummers, and more",
      price: 3000,
    },
  ]

  const renderAstrologyTool = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="mr-2 h-5 w-5 text-yellow-500" />
          Astrology Matching & Auspicious Dates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Bride's Name / කනිකාවගේ නම</Label>
            <Input
              placeholder="Enter bride's name"
              value={astrologyData.brideName}
              onChange={(e) => setAstrologyData({ ...astrologyData, brideName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Bride's Birth Date / කනිකාවගේ උපන් දිනය</Label>
            <Input
              type="datetime-local"
              value={astrologyData.brideDate}
              onChange={(e) => setAstrologyData({ ...astrologyData, brideDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Groom's Name / මනාලයාගේ නම</Label>
            <Input
              placeholder="Enter groom's name"
              value={astrologyData.groomName}
              onChange={(e) => setAstrologyData({ ...astrologyData, groomName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Groom's Birth Date / මනාලයාගේ උපන් දිනය</Label>
            <Input
              type="datetime-local"
              value={astrologyData.groomDate}
              onChange={(e) => setAstrologyData({ ...astrologyData, groomDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Preferred Wedding Location / කැමති විවාහ ස්ථානය</Label>
          <Select
            value={astrologyData.location}
            onValueChange={(value) => setAstrologyData({ ...astrologyData, location: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="colombo">Colombo / කොළඹ</SelectItem>
              <SelectItem value="kandy">Kandy / මහනුවර</SelectItem>
              <SelectItem value="galle">Galle / ගාල්ල</SelectItem>
              <SelectItem value="negombo">Negombo / මීගමුව</SelectItem>
              <SelectItem value="other">Other / වෙනත්</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500">
          Calculate Compatibility & Dates (LKR 2,500)
        </Button>

        {/* Sample Results */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Sample Astrological Insights:</h4>
          <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
            <div>• Compatibility Score: 85% (Very Good)</div>
            <div>• Recommended Wedding Dates: March 15, April 8, May 22</div>
            <div>• Auspicious Time: 6:30 AM - 8:15 AM</div>
            <div>• Lucky Colors: Gold, Red, White</div>
            <div>• Favorable Direction: East</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderPoruwaPlanning = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5 text-red-500" />
          Traditional Poruwa Ceremony Planning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Ceremony Elements / උත්සව අංග</h4>
            <div className="space-y-2">
              {[
                "Poruwa Construction / පොරුව ඉදිකිරීම",
                "Traditional Decorations / සාම්ප්‍රදායික අලංකරණ",
                "Kandyan Drummers / කන්දුකර වාදකයන්",
                "Traditional Dancers / සාම්ප්‍රදායික නර්තන",
                "Religious Blessings / ආගමික ආශීර්වාද",
                "Traditional Attire / සාම්ප්‍රදායික ඇඳුම්",
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Package Options / පැකේජ විකල්ප</h4>
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <div className="font-medium">Basic Poruwa Package</div>
                <div className="text-sm text-gray-600">LKR 75,000</div>
                <div className="text-xs text-gray-500">Poruwa + Basic decorations</div>
              </div>
              <div className="border rounded-lg p-3 border-purple-200 bg-purple-50">
                <div className="font-medium">Premium Poruwa Package</div>
                <div className="text-sm text-gray-600">LKR 150,000</div>
                <div className="text-xs text-gray-500">Complete traditional ceremony</div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="font-medium">Royal Poruwa Package</div>
                <div className="text-sm text-gray-600">LKR 250,000</div>
                <div className="text-xs text-gray-500">Luxury traditional experience</div>
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500">Plan Poruwa Ceremony (LKR 5,000)</Button>
      </CardContent>
    </Card>
  )

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-red-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Traditional Wedding Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">සාම්ප්‍රදායික විවාහ සැලසුම් සහ ජ්‍යොතිෂ සේවා</p>
        </motion.div>

        {/* Tool Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedTool === tool.id ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20" : ""
                  }`}
                  onClick={() => setSelectedTool(tool.id)}
                >
                  <CardContent className="p-4 text-center">
                    <IconComponent className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <h3 className="font-semibold text-sm">{tool.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{tool.titleLocal}</p>
                    <p className="text-xs text-purple-600 font-medium mt-1">LKR {tool.price.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Tool Content */}
        <motion.div
          key={selectedTool}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {selectedTool === "astrology" && renderAstrologyTool()}
          {selectedTool === "poruwa" && renderPoruwaPlanning()}
          {selectedTool === "timing" && (
            <Card>
              <CardHeader>
                <CardTitle>Auspicious Timing Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Calculate the perfect timing for your wedding ceremonies based on traditional astrology.</p>
                <Button className="mt-4">Calculate Timing (LKR 1,500)</Button>
              </CardContent>
            </Card>
          )}
          {selectedTool === "traditional" && (
            <Card>
              <CardHeader>
                <CardTitle>Traditional Services Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Find authentic Kandyan dancers, traditional drummers, and cultural performers.</p>
                <Button className="mt-4">Browse Services (LKR 3,000)</Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  )
}
