"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export function ContactInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-gray-600">info@weddinglk.com</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-sm text-gray-600">+94 11 234 5678</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-red-600" />
          <div>
            <p className="font-medium">Address</p>
            <p className="text-sm text-gray-600">123 Wedding Street, Colombo 01, Sri Lanka</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-purple-600" />
          <div>
            <p className="font-medium">Business Hours</p>
            <p className="text-sm text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-sm text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 

export default ContactInfo;
