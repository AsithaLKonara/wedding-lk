const mongoose = require('mongoose');
const { User, Vendor, Venue, Testimonial } = require('../lib/models');
require('dotenv').config({ path: '../.env.local' });

async function checkData() {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI;
    await mongoose.connect(uri);
    console.log('Connected to DB');
    
    const vendorCount = await mongoose.model('Vendor').countDocuments();
    const featuredVendorCount = await mongoose.model('Vendor').countDocuments({ featured: true });
    
    const venueCount = await mongoose.model('Venue').countDocuments();
    const featuredVenueCount = await mongoose.model('Venue').countDocuments({ isFeatured: true });
    
    const testimonialCount = await mongoose.model('Testimonial').countDocuments();
    const featuredTestimonialCount = await mongoose.model('Testimonial').countDocuments({ featured: true });
    
    console.log(JSON.stringify({
      vendors: { total: vendorCount, featured: featuredVendorCount },
      venues: { total: venueCount, featured: featuredVenueCount },
      testimonials: { total: testimonialCount, featured: featuredTestimonialCount }
    }, null, 2));
    
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

checkData();
