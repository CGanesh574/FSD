import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import ListingCard from '../components/ListingCard';

export default function Search() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [offer, setOffer] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [parking, setParking] = useState(false);
  const [type, setType] = useState('all');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const searchQuery = new URLSearchParams({
          searchTerm,
          offer,
          furnished,
          parking,
          type,
        }).toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
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
  }, [searchTerm, offer, furnished, parking, type]);

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <input
              type='text'
              placeholder='Search by name or address...'
              className='border rounded-lg p-3 w-full'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type='button'
              className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
            >
              <FaSearch />
            </button>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <select
              className='border rounded-lg p-3'
              onChange={(e) => setType(e.target.value)}
              value={type}
            >
              <option value='all'>All</option>
              <option value='rent'>Rent</option>
              <option value='sale'>Sale</option>
            </select>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                checked={offer}
                onChange={(e) => setOffer(e.target.checked)}
              />
              <span>Offer</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                checked={furnished}
                onChange={(e) => setFurnished(e.target.checked)}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
              />
              <span>Parking</span>
            </div>
          </div>
        </form>
      </div>

      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listings found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}
          {error && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Something went wrong!
            </p>
          )}
          {!loading &&
            !error &&
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
        </div>
      </div>
    </div>
  );
}
