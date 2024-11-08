import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CustomerPage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch addresses when the user is available
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user || !user.accessToken) return;

      try {
        const response = await fetch('/api/getCustomerAddresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken: user.accessToken }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch addresses');
        }

        const data = await response.json();
        setAddresses(data.addresses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Add check to ensure `user` is defined before accessing `user.name`
  if (!user) return <p>Please log in to view your account.</p>;

  return (
    <div className='max-w-4xl mx-auto mt-24 p-6 bg-white rounded-md shadow-md'>
      {/* Welcome section */}
      <div className='text-center'>
        <h1 className='text-3xl font-semibold'>Welcome, {user?.Name || 'Guest'}!</h1>
        <p className='text-gray-600 mt-2'>We are glad to have you here.</p>
      </div>

      {/* Order History Section */}
      <div className='my-8'>
        <h2 className='text-xl font-semibold'>Your Order History</h2>
        <p className='text-gray-500'>Order history details will be displayed here.</p>
        {/* Add component or list to display order history */}
      </div>

      {/* Address Section */}
      <div className='my-8'>
        <h2 className='text-xl font-semibold'>Your Addresses</h2>
        {addresses.length === 0 ? (
          <p className='text-gray-500'>No addresses found.</p>
        ) : (
          addresses.map((address, index) => (
            <div key={index} className="my-4 p-4 border rounded-md shadow-sm">
              <h3 className="text-lg font-semibold">{address.firstName} {address.lastName}</h3>
              <p>{address.address1}{address.address2 ? `, ${address.address2}` : ''}</p>
              <p>{address.city}, {address.province} {address.zip}</p>
              <p>{address.country}</p>
              <p>{address.phone}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerPage;
