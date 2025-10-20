import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Package } from '@/lib/models/package'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB()
    
    // Get packages from database
    const packages = await Package.find({ isActive: true }).limit(20)
    
    // If no packages in database, return sample data
    if (packages.length === 0) {
      const samplePackages = [
        {
          _id: '1',
          name: 'Premium Wedding Package',
          description: 'Complete wedding package with luxury amenities',
          price: 150000,
          features: {
            'Venue': true,
            'Photography': true,
            'Catering': true,
            'Music': true,
            'Decoration': true
          },
          category: 'Premium',
          images: ['package1.jpg'],
          rating: 4.8
        },
        {
          _id: '2',
          name: 'Standard Wedding Package',
          description: 'Standard wedding package with essential services',
          price: 100000,
          features: {
            'Venue': true,
            'Photography': true,
            'Catering': true,
            'Music': false,
            'Decoration': true
          },
          category: 'Standard',
          images: ['package2.jpg'],
          rating: 4.5
        },
        {
          _id: '3',
          name: 'Basic Wedding Package',
          description: 'Basic wedding package for budget-conscious couples',
          price: 75000,
          features: {
            'Venue': true,
            'Photography': false,
            'Catering': true,
            'Music': false,
            'Decoration': false
          },
          category: 'Basic',
          images: ['package3.jpg'],
          rating: 4.2
        }
      ]
      return NextResponse.json(samplePackages)
    }
    
    return NextResponse.json(packages)
    
  } catch (error) {
    console.error('Packages API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Connect to database
    await connectDB()
    
    // Create new package
    const newPackage = new Package({
      name: body.name,
      description: body.description,
      price: body.price,
      features: body.features,
      category: body.category,
      images: body.images || [],
      rating: body.rating || 0,
      isActive: body.isActive !== undefined ? body.isActive : true
    })
    
    const savedPackage = await newPackage.save()
    
    return NextResponse.json({ 
      message: 'Package created successfully', 
      data: savedPackage 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Create package error:', error)
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 })
  }
}
