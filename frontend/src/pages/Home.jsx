import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Convert USD to INR (1 USD = 83 INR)
  const convertToINR = (price) => {
    return (price * 83).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/listing/get');
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListings(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-br from-white via-blue-50 to-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80')",
            filter: "brightness(0.7)"
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a237e] drop-shadow-lg">Find Your Dream Home</h1>
          <p className="text-xl md:text-2xl mb-8 text-[#1a237e]">Discover the perfect property that matches your lifestyle</p>
          <Link 
            to="/search"
            className="bg-[#1a237e] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#283593] transition-all shadow-lg"
          >
            Start Searching
          </Link>
        </div>
      </div>

      {/* Recent Listings Section */}
      <div className="max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-semibold text-[#1a237e] mb-8">Recent Listings</h2>
        
        {loading && (
          <div className="text-center text-2xl">Loading...</div>
        )}
        
        {error && (
          <div className="text-center text-2xl text-red-700">Something went wrong!</div>
        )}
        
        {!loading && !error && listings.length === 0 && (
          <div className="text-center text-2xl">No listings found!</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Link
              key={listing._id}
              to={`/listing/${listing._id}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border border-[#e3e6f3] hover:border-[#1a237e]"
            >
              <div className="relative h-48">
                {listing.imageUrls && listing.imageUrls.length > 0 ? (
                  <img
                    src={`http://localhost:3000${listing.imageUrls[0]}`}
                    alt={listing.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image load error:', e);
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80';
                    }}
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80"
                    alt="Default property image"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                    listing.type === 'rent' ? 'bg-[#3949ab]' : 'bg-[#1a237e]'
                  } text-white shadow-md`}>
                    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-semibold text-[#1a237e] mb-2">{listing.name}</h3>
                <p className="text-[#3949ab] mb-2">{listing.address}</p>
                <p className="text-2xl font-bold text-[#1a237e] mb-3">
                  {convertToINR(listing.regularPrice)}
                  {listing.type === 'rent' && ' / month'}
                </p>
                
                <div className="flex items-center gap-4 text-[#3949ab]">
                  <div className="flex items-center gap-1">
                    <FaBed className="text-lg" />
                    <span>{listing.bedrooms} beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaBath className="text-lg" />
                    <span>{listing.bathrooms} baths</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaRulerCombined className="text-lg" />
                    <span>{listing.area} sqft</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
