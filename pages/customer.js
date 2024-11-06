// pages/customer.js
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CustomerPage = () => {
  const { user } = useAuth();
  console.log("data",user);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log("Token received", data);    
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

  return (
    <div className='mt-20'>
  <h1>Your Addresses</h1>
  {addresses.length === 0 ? (
    <p>No addresses found.</p>
  ) : (
    <ul>
      {addresses.map((address, index) => (
        <li key={index}>
          <h2>{address.firstName} {address.lastName}</h2>
          <p>{address.address1}{address.address2 ? `, ${address.address2}` : ''}</p>
          <p>{address.city}, {address.province} {address.zip}</p>
          <p>{address.country}</p>
          <p>{address.phone}</p>
        </li>
      ))}
    </ul>
  )}
</div> 
  );
};

export default CustomerPage;
