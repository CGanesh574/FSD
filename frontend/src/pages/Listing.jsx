import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaParking, FaChair } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

export default function Listing() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [owner, setOwner] = useState(null);
  const [showPhone, setShowPhone] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  // Convert USD to INR (1 USD = 83 INR)
  const convertToINR = (price) => {
    return (price * 83).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  // Helper to get full image URL
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url}`;
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        if (data.userRef) {
          const ownerRes = await fetch(`/api/user/${data.userRef}`);
          const ownerData = await ownerRes.json();
          setOwner(ownerData);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  if (loading) {
    return <div className="text-center my-7 text-2xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center my-7 text-2xl">Something went wrong!</div>;
  }

  return (
    <main>
      {listing && (
        <div className="max-w-6xl mx-auto p-3 my-7">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side - Images */}
            <div className="md:w-1/2">
              <div className="flex flex-col gap-4">
                {listing.imageUrls && listing.imageUrls.length > 0 ? (
                  listing.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={getImageUrl(url)}
                      alt={`Listing image ${index + 1}`}
                      className="w-full h-[300px] object-cover rounded-lg shadow-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80';
                      }}
                    />
                  ))
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80"
                    alt="Default property image"
                    className="w-full h-[300px] object-cover rounded-lg shadow-lg"
                  />
                )}
              </div>
            </div>

            {/* Right Side - Information */}
            <div className="md:w-1/2 flex flex-col gap-4">
              <h1 className="text-3xl font-semibold text-slate-700">
                {listing.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-green-700" />
                <p className="text-slate-600">{listing.address}</p>
              </div>

              <div className="flex gap-4">
                <button className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
                  {listing.type === 'rent' ? 'Rent' : 'Sale'}
                </button>
                {listing.offer && (
                  <button className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
                    {convertToINR(listing.regularPrice - listing.discountPrice)} discount
                  </button>
                )}
              </div>

              <div className="text-slate-700">
                <p className="text-2xl font-semibold">
                  {convertToINR(listing.regularPrice)}
                  {listing.type === 'rent' && ' / month'}
                </p>
              </div>

              <div className="text-slate-700">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-slate-600">{listing.description}</p>
              </div>

              <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <FaBed className="text-lg" />
                  {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <FaBath className="text-lg" />
                  {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <FaRulerCombined className="text-lg" />
                  {listing.area} sqft
                </li>
                {listing.ageOfConstruction && (
                  <li className="flex items-center gap-1 whitespace-nowrap">
                    <span className="text-lg">🏗️</span>
                    {listing.ageOfConstruction} yrs old
                  </li>
                )}
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <FaParking className="text-lg" />
                  {listing.parking ? 'Parking spot' : 'No Parking'}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <FaChair className="text-lg" />
                  {listing.furnished ? 'Furnished' : 'Unfurnished'}
                </li>
              </ul>

              {/* Owner Details */}
              {owner && (
                <div className="mt-4 p-4 border rounded-lg bg-slate-50">
                  <h3 className="font-semibold text-lg mb-2">Owner Details</h3>
                  <p><span className="font-semibold">Name:</span> {owner.username}</p>
                  <p><span className="font-semibold">Email:</span> {owner.email}</p>
                  {showPhone && owner.phone && (
                    <p><span className="font-semibold">Phone:</span> {owner.phone}</p>
                  )}
                  <button
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => setShowPhone(true)}
                  >
                    Contact Owner
                  </button>
                </div>
              )}

              {currentUser && listing.userRef !== currentUser._id && !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                >
                  Contact landlord
                </button>
              )}
              {contact && <Contact listing={listing} />}
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 