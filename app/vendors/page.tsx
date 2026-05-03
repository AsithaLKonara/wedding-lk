'use client';

import { useState, useEffect } from 'react';
import { 
  MapPin,
  DollarSign,
  Award,
  CheckCircle,
  Sparkles,
  Search,
  Building2,
  Heart,
  Star,
  Camera,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/templates/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Vendor {
  _id: string;
  name: string;
  businessName: string;
  category: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  rating: number;
  reviewCount: number;
  avatar?: string;
  coverImage?: string;
  description: string;
  priceRange: string;
  services: string[];
  isVerified: boolean;
  yearsInBusiness: number;
  responseTime: string;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/vendors');
      if (response.ok) {
        const result = await response.json();
        console.log('API Response (Vendors):', result);
        setVendors(result.data?.vendors || []);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = (vendor?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vendor?.businessName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vendor?.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || 
                          (vendor?.location?.city || '').toLowerCase().includes(locationFilter.toLowerCase()) ||
                          (vendor?.location?.state || '').toLowerCase().includes(locationFilter.toLowerCase());
    
    // Normalize category match (e.g. "photographer" matches "photography")
    const normCategory = (vendor?.category || '').toLowerCase();
    const normFilter = categoryFilter.toLowerCase();
    const matchesCategory = !categoryFilter || 
                           normCategory === normFilter || 
                           normCategory.includes(normFilter) || 
                           normFilter.includes(normCategory);

    const matchesPrice = !priceFilter || vendor?.priceRange === priceFilter;
    const matchesVerified = !verifiedFilter || 
                          (verifiedFilter === 'verified' && vendor?.isVerified) ||
                          (verifiedFilter === 'unverified' && !vendor?.isVerified);
    
    return matchesSearch && matchesLocation && matchesCategory && matchesPrice && matchesVerified;
  });

  const handleFavorite = async (vendorId: string) => {
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'vendor', id: vendorId }),
      });

      if (response.ok) {
        console.log('Vendor added to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-muted-foreground animate-pulse font-medium">Discovering best vendors...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(219, 39, 119, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      <main className="container mx-auto px-4 py-16 relative z-10">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-border/50">
            <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
            <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Expert Professionals</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tighter">
            Our Elite <span className="gradient-text">Vendors</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Find the finest wedding photographers, caterers, and decorators to make your day extraordinary.
          </p>
        </motion.div>
          
        {/* Glassmorphic Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="border border-border/50 shadow-2xl bg-card/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 h-12 bg-muted/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none transition-all text-sm font-medium"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-12 pr-4 h-12 bg-muted/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none transition-all text-sm font-medium"
                  />
                </div>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 h-12 bg-muted/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none transition-all text-sm font-medium appearance-none"
                >
                  <option value="">All Categories</option>
                  <option value="photography">Photography</option>
                  <option value="catering">Catering</option>
                  <option value="music">Music</option>
                  <option value="flowers">Flowers</option>
                  <option value="transportation">Transportation</option>
                  <option value="beauty">Beauty</option>
                  <option value="decor">Decorations</option>
                  <option value="cake">Cake</option>
                </select>
                
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full px-4 h-12 bg-muted/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none transition-all text-sm font-medium appearance-none"
                >
                  <option value="">Price Range</option>
                  <option value="$">Budget ($)</option>
                  <option value="$$">Moderate ($$)</option>
                  <option value="$$$">Premium ($$$)</option>
                  <option value="$$$$">Luxury ($$$$)</option>
                </select>
                
                <select
                  value={verifiedFilter}
                  onChange={(e) => setVerifiedFilter(e.target.value)}
                  className="w-full px-4 h-12 bg-muted/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none transition-all text-sm font-medium appearance-none"
                >
                  <option value="">All Status</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8 px-4">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Found <span className="text-foreground">{filteredVendors.length}</span> Elite Professionals
          </p>
        </div>

        {/* Vendors Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredVendors.map((vendor, index) => (
              <motion.div
                key={vendor._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="group overflow-hidden border border-border/50 shadow-xl bg-card/40 backdrop-blur-md rounded-3xl hover:border-purple-500/50 transition-all duration-500 hover:shadow-purple-500/10">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {vendor.coverImage ? (
                      <img
                        src={vendor.coverImage}
                        alt={vendor?.name || 'Vendor'}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                        <Camera className="w-12 h-12 text-purple-400 opacity-50" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <button
                      onClick={() => handleFavorite(vendor._id)}
                      className="absolute top-4 right-4 p-2.5 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-2xl shadow-lg hover:bg-rose-500 hover:text-white transition-all duration-300 z-10"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    
                    {vendor.isVerified && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center space-x-1 shadow-lg shadow-purple-500/20">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                       <Button 
                         className="w-full bg-white text-black hover:bg-purple-500 hover:text-white font-bold rounded-xl"
                         onClick={() => window.open(`/vendors/${vendor._id}`, '_blank')}
                       >
                         View Full Portfolio
                       </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-black text-xl text-foreground tracking-tight group-hover:text-purple-500 transition-colors duration-300">
                          {vendor?.businessName || vendor?.name || 'Elite Vendor'}
                        </h3>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                          {vendor.category}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 bg-yellow-400/10 text-yellow-600 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-black">{vendor.rating}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground font-medium">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <span>{vendor.location.city}, {vendor.location.state}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground font-medium">
                        <Award className="w-4 h-4 text-purple-500" />
                        <span>{vendor.yearsInBusiness} Years of Excellence</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4].map((i) => (
                            <DollarSign 
                              key={i} 
                              className={`w-4 h-4 ${i <= vendor.priceRange.length ? 'text-green-500' : 'text-muted-foreground opacity-30'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                          {vendor.responseTime} RESPONSE
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 italic">
                      "{vendor.description}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredVendors.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-2">No Professionals Found</h3>
            <p className="text-muted-foreground mb-8 font-medium">Try broadening your search or clearing filters.</p>
            <Button 
              variant="outline"
              className="rounded-xl font-bold px-8 border-2"
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setCategoryFilter('');
                setPriceFilter('');
                setVerifiedFilter('');
              }}
            >
              Reset All Filters
            </Button>
          </motion.div>
        )}
      </main>
      </div>
    </MainLayout>
  );
}
