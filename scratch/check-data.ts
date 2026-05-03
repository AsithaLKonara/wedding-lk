import { connectDB } from '@/lib/db';
import { Vendor, Venue, Testimonial } from '@/lib/models';

async function checkData() {
  await connectDB();
  
  const vendorCount = await Vendor.countDocuments();
  const featuredVendorCount = await Vendor.countDocuments({ featured: true });
  
  const venueCount = await Venue.countDocuments();
  const featuredVenueCount = await Venue.countDocuments({ isFeatured: true });
  
  const testimonialCount = await Testimonial.countDocuments();
  const featuredTestimonialCount = await Testimonial.countDocuments({ featured: true });
  
  console.log({
    vendors: { total: vendorCount, featured: featuredVendorCount },
    venues: { total: venueCount, featured: featuredVenueCount },
    testimonials: { total: testimonialCount, featured: featuredTestimonialCount }
  });
  
  process.exit(0);
}

checkData();
