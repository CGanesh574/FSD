import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';

export default function ListingCard({ listing }) {
  // Convert USD to INR (1 USD = 83 INR)
  const convertToINR = (price) => {
    return (price * 83).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls && listing.imageUrls[0] ? 
            `http://localhost:3000${listing.imageUrls[0]}` : 
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {listing.name}
          </p>
          <div className='flex items-center gap-1'>
            <FaMapMarkerAlt className='text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
          <p className='text-slate-500 mt-2 font-semibold'>
            {convertToINR(listing.regularPrice)}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs flex items-center gap-1'>
              <FaBed className='text-lg' />
              {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
            </div>
            <div className='font-bold text-xs flex items-center gap-1'>
              <FaBath className='text-lg' />
              {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
            </div>
            <div className='font-bold text-xs flex items-center gap-1'>
              <FaRulerCombined className='text-lg' />
              {listing.area} sqft
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
} 