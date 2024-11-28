"use client"
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { FaEdit, FaTrash } from 'react-icons/fa';
 
const CustomerPage = () => {
  const { user } = useAuth() ;
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    country: '',
    zip: '',
    phone: '',
  });
 
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
        console.log("alldata:", data);
        const addresses = data.addresses.customer.addresses.nodes;
        const orders = data.addresses.customer.orders.edges.map(orderEdge => orderEdge.node);
 
      console.log("Addresses:", addresses);
      console.log("Orders:", orders);
 
      // Set extracted addresses and orders in the state
      setAddresses(addresses);
      setOrders(orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
 
    fetchAddresses();
  }, [user]);
 
  const handleOrderClick = (order) => {
    router.push({
      pathname: '/order',
    }, undefined, { state: { order } });
  };
  
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };
 
  const handleEdit = (index) => {
    setCurrentEditIndex(index);
    setNewAddress(addresses[index]);
    setShowAddressForm(true);
    setEditMode(true);
  };
  const handleUpdate = async (id) => {
    if (!user?.accessToken || !newAddress) return;
  
    // Remove the `id` from `newAddress` if it exists (the id should be passed separately)
    const { id: _, ...addressInput } = newAddress;
  
    try {
      const response = await fetch('/api/updateAddress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'UPDATE_ADDRESS',
          customerAccessToken: user.accessToken,
          addressId: id, // Pass id separately
          addressInput,  // Pass the address data without `id`
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
  
      const { updatedAddress } = await response.json();
  
      setAddresses((prevAddresses) =>
        prevAddresses.map((address) =>
          address.id === id ? { ...address, ...updatedAddress } : address
        )
      );
  
      setShowAddressForm(false);
      setEditMode(false);
      setNewAddress('');
      fetchAddresses();
    } catch (err) {
      console.error('Error updating address:', err.message);
    }
  };
  
 
  const handleDelete = async (id) => {
    if (!user || !user.accessToken) return;
  
    try {
      const response = await fetch('/api/deleteCustomerAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken: user.accessToken, addressId: id }),
      });
      const data = await response.json();
      console.log('Delete API response:', data);  
  
      if (!response.ok) {
        throw new Error('Failed to delete address');
      }
  
      // Remove the deleted address from state
      setAddresses(addresses.filter((address) => address.id !== id));
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };
  
 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user || !user.accessToken) {
      console.error("User is not authenticated.");
      return;
    }
  
    console.log("New Address Data:", newAddress);
    if (!newAddress.firstName || !newAddress.lastName || !newAddress.address1 || !newAddress.city || !newAddress.country || !newAddress.zip) {
      console.error("All required address fields must be filled.");
      return;
    }
  
    console.log("Access Token:", user.accessToken);
    console.log("New Address Payload:", newAddress);
  
    try {
      // Make API call to create a new address
      const response = await fetch('/api/customerAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerAccessToken: user.accessToken, // Corrected field name
          addressInput: newAddress,
        }),
      });
  
      // Log the API response
      const data = await response.json();
      console.log("Create Address API Response:", data);
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create address');
      }
  
      // Add the new address to the state
      setAddresses((prevAddresses) => [...prevAddresses, data.address]);
      console.log("Updated Addresses:", [...addresses, data.address]);
  
      // Reset the form state
      setNewAddress({
        firstName: '',
        lastName: '',
        companyName: '',
        address1: '',
        address2: '',
        city: '',
        province: '',
        country: '',
        zip: '',
        phone: '',
      });
      setShowAddressForm(false);
      fetchAddresses();

    } catch (err) {
      console.error("Error creating address:", err);
    }
  };
  
 
  if (loading) return <p className='mt-20'>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>Please log in to view your account.</p>;
 
  return (
    <div className='max-w-4xl mx-auto mt-24 p-6 bg-white rounded-md shadow-md'>
      <div className='text-center'>
        <h1 className='text-3xl font-semibold'>Welcome, {user?.Name || 'Guest'}!</h1>
        <p className='text-gray-600 mt-2'>We are glad to have you here.</p>
      </div>
 
      <div className='my-8'>
        {orders.length === 0 ? (
          <p className='text-gray-500'>No orders found.</p>
        ) : (
          orders.map((order) => (
            order ? (
              <div
                key={order.id}
                className="my-4 p-4 border rounded-md shadow-sm cursor-pointer"
                onClick={() => handleOrderClick(order)}
              >
                <p className="text-lg font-semibold text-blue-500 underline">
                  Order #{order.orderNumber}
                </p>
                <p>Placed on: {new Date(order.processedAt).toLocaleDateString()}</p>
                <p>Total Price: {order.currentTotalPrice.amount} {order.currentTotalPrice.currencyCode}</p>
                <p>Items:</p>
                <ul className='pl-4 list-disc'>
                  {order.lineItems.edges.map((item, idx) => (
                    <li key={idx}>
                      {item.node.title} - {item.node.variant.price.amount} {item.node.variant.price.currencyCode} (Quantity: {item.node.currentQuantity})
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          ))
        )}
      </div>
 
      <div className='my-8'>
        <h2 className='text-xl font-semibold'>Your Addresses</h2>
        {addresses.length === 0 ? (
          <p className='text-gray-500'>No addresses found.</p>
        ) : (
          addresses?.map((address, index) => (
            <div key={index} className="my-4 p-4 border rounded-md shadow-sm flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{address?.firstName} {address?.lastName}</h3>
                <p>{address?.address1}{address?.address2 ? `, ${address?.address2}` : ''}</p>
                <p>{address?.city}, {address?.province} {address?.zip}</p>
                <p>{address?.country}</p>
                <p>{address?.phone}</p>
              </div>
              <div className="flex space-x-2">
                <FaEdit
                  className="text-blue-500 cursor-pointer"
                  onClick={() => handleEdit(index)}
                  title="Edit Address"
                />
                <FaTrash
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(address.id)} 
                  title="Delete Address"
                />
              </div>
            </div>
          ))
        )}
 
        <button
          className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-md'
          onClick={() => {
            setShowAddressForm(!showAddressForm);
            setEditMode(false);
            setNewAddress({
              firstName: '',
              lastName: '',
              // companyName: '',
              address1: '',
              address2: '',
              city: '',
              province: '',
              country: '',
              zip: '',
              phone: ''
            });
          }}
        >
          {showAddressForm ? 'Cancel' : 'Add New Address'}
        </button>
 
        {showAddressForm && (
            <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editMode && currentEditIndex !== null && addresses[currentEditIndex]) {
                handleUpdate(addresses[currentEditIndex].id); // Editing an existing address
              } else {
                handleSubmit(e); // Adding a new address
              }           
            }}
            className="address-form mt-4"
          >
            <h3 className="text-lg font-semibold">{editMode ? 'Edit Address' : 'Add New Address'}</h3>
            <div className='grid grid-cols-2 gap-4'>
            <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={newAddress.firstName}
            onChange={handleInputChange}
            required
            pattern="[A-Za-z\s]+" 
            title="First name must only contain letters and spaces."
            inputMode="text" 
            className="border p-2 rounded-md"
            onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '')} 
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={newAddress.lastName}
            onChange={handleInputChange}
            required
            pattern="[A-Za-z\s]+" 
            title="Last name must only contain letters and spaces."
            inputMode="text"
            className="border p-2 rounded-md"
            onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '')} 
            />
              {/* <input
                type='text'
                name='companyName'
                placeholder='Company Name'
                value={newAddress.companyName}
                onChange={handleInputChange}
                className='border p-2 rounded-md'
              /> */}
              <input
                type='text'
                name='address1'
                placeholder='Address Line 1'
                value={newAddress.address1}
                onChange={handleInputChange}
                required
                className='border p-2 rounded-md'
              />
              <input
                type='text'
                name='address2'
                placeholder='Address Line 2'
                value={newAddress.address2}
                onChange={handleInputChange}
                className='border p-2 rounded-md'
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={newAddress.city}
                onChange={handleInputChange}
                required
                pattern="[A-Za-z\s]+" 
                title="City must only contain letters and spaces."
                inputMode="text"
                className="border p-2 rounded-md"
                onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '')} 
              />
              <input
                type="text"
                name="province"
                placeholder="Province/State"
                value={newAddress.province}
                onChange={handleInputChange}
                required
                pattern="[A-Za-z\s]+" 
                title="Province/State must only contain letters and spaces."
                inputMode="text"
                className="border p-2 rounded-md"
                onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '')} 
              />
              <input
                type="text"
                name="zip"
                placeholder="ZIP/Postal Code"
                value={newAddress.zip}
                onChange={handleInputChange}
                required
                pattern="[A-Za-z0-9\s]+" 
                title="ZIP/Postal code must contain alphanumeric characters and spaces."
                inputMode="text"
                className="border p-2 rounded-md"
              />
               <input
                type="text"
                name="country"
                placeholder="Country"
                value={newAddress.country}
                onChange={handleInputChange}
                required
                pattern="[A-Za-z\s]+" 
                title="Country must only contain letters and spaces."
                inputMode="text"
                className="border p-2 rounded-md"
                onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '')} 
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newAddress.phone}
                onChange={handleInputChange}
                className="border p-2 rounded-md"
                pattern="\d+" 
                title="Phone number must contain only digits."
                inputMode="tel"
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} 
              />
            </div>
            <button type='submit' className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-md'>
              {editMode ? 'Update Address' : 'Add Address'}
            </button>
           
 
          </form>
        )}
      </div>
    </div>
  );
};
 
export default CustomerPage;
 