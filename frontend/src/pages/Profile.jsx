import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const navigate = useNavigate();
  const [signOutError, setSignOutError] = useState(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to sign out');
      }
      
      // Clear any local state or storage if needed
      localStorage.removeItem('user');
      
      // Navigate to sign-in page
      navigate('/sign-in');
    } catch (error) {
      setSignOutError(error.message);
      console.error('Sign out error:', error);
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {});
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="p-6 max-w-lg w-full bg-white rounded-xl shadow-lg border border-[#1a237e]/20">
        <h1 className="text-3xl font-semibold text-center my-7 text-[#1a237e]">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/.*"
          />
          <img
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-4 border-[#1a237e]/30"
            onClick={() => fileRef.current.click()}
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error image upload (Image must be less than 2MB)
              </span>
            ) : filePercentage > 0 && filePercentage < 100 ? (
              <span className="text-[#1a237e]">{`Uploading ${filePercentage}%`}</span>
            ) : filePercentage === 100 ? (
              <span className="text-green-700">Image successfully uploaded</span>
            ) : (
              ''
            )}
          </p>
          <input
            type="text"
            placeholder="username"
            defaultValue={currentUser.username}
            id="username"
            className="border p-3 rounded-lg focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e]/30"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            defaultValue={currentUser.email}
            id="email"
            className="border p-3 rounded-lg focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e]/30"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="phone"
            defaultValue={currentUser.phone}
            id="phone"
            className="border p-3 rounded-lg focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e]/30"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            className="border p-3 rounded-lg focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e]/30"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-[#1a237e] text-white p-3 rounded-lg uppercase hover:bg-[#283593] disabled:opacity-80 transition-all shadow-md"
          >
            Update
          </button>
        </form>
        <div className="flex gap-4 mt-4 justify-center">
          <button
            onClick={handleDeleteUser}
            className="text-red-700 font-semibold hover:underline"
          >
            Delete Account
          </button>
          <button
            onClick={handleSignOut}
            className="text-[#1a237e] font-semibold hover:underline"
          >
            Sign Out
          </button>
        </div>
        {/* Restore Create Listing button */}
        <Link
          to={'/create-listing'}
          className="mt-6 w-full block bg-[#1a237e] text-white p-3 rounded-lg font-semibold text-center hover:bg-[#283593] transition-all shadow-md"
        >
          Create Listing
        </Link>
        {updateSuccess && <p className="text-green-700 text-center mt-3">Profile updated successfully!</p>}
        {error && <p className="text-red-700 text-center mt-3">{error}</p>}
        {signOutError && <p className="text-red-700 text-center mt-3">{signOutError}</p>}
        <button
          onClick={handleShowListings}
          className="mt-4 w-full bg-[#1a237e] text-white p-3 rounded-lg font-semibold hover:bg-[#283593] transition-all shadow-md"
        >
          Show My Listings
        </button>
        {showListingError && <p className="text-red-700 text-center mt-3">Could not fetch listings</p>}
        {userListings && userListings.length > 0 && (
          <div className="flex flex-col gap-4 mt-6">
            <h1 className="text-center text-2xl font-semibold text-[#1a237e]">Your Listings</h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4 bg-white shadow hover:shadow-lg border-[#e3e6f3] hover:border-[#1a237e]"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="Listing cover"
                    className="h-16 w-16 object-contain rounded-lg border border-[#1a237e]/20"
                  />
                </Link>
                <Link
                  to={`/listing/${listing._id}`}
                  className="flex-1 text-[#1a237e] font-semibold hover:underline truncate"
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-[#1a237e] uppercase hover:underline">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
