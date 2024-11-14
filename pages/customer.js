import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { FaEdit, FaTrash } from 'react-icons/fa';
 
const CustomerPage = () => {
  const { user } = useAuth();
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
    default: false,
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
      query: { order: JSON.stringify(order) }, 
    });
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
 
  const handleDelete = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      const updatedAddresses = addresses.map((address, index) =>
        index === currentEditIndex ? newAddress : address
      );
      setAddresses(updatedAddresses);
      setEditMode(false);
      setCurrentEditIndex(null);
    } else {
      setAddresses([...addresses, newAddress]);
    }
 
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
      default: false,
    });
    setShowAddressForm(false);
  };
 
  if (loading) return <p>Loading...</p>;
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
                <h3 className="text-lg font-semibold">{address.firstName} {address.lastName}</h3>
                <p>{address.address1}{address.address2 ? `, ${address.address2}` : ''}</p>
                <p>{address.city}, {address.province} {address.zip}</p>
                <p>{address.country}</p>
                <p>{address.phone}</p>
              </div>
              <div className="flex space-x-2">
                <FaEdit
                  className="text-blue-500 cursor-pointer"
                  onClick={() => handleEdit(index)}
                  title="Edit Address"
                />
                <FaTrash
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(index)}
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
              phone: '',
              default: false,
            });
          }}
        >
          {showAddressForm ? 'Cancel' : 'Add New Address'}
        </button>
 
        {showAddressForm && (
          <form className='mt-4' onSubmit={handleSubmit}>
            <div className='grid grid-cols-2 gap-4'>
              <input
                type='text'
                name='firstName'
                placeholder='First name'
                value={newAddress.firstName}
                onChange={handleInputChange}
                required
                className='border p-2 rounded-md'
              />
              <input
                type='text'
                name='lastName'
                placeholder='Last name'
                value={newAddress.lastName}
                onChange={handleInputChange}
                required
                className='border p-2 rounded-md'
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
                type='text'
                name='city'
                placeholder='City'
                value={newAddress.city}
                onChange={handleInputChange}
                required
                className='border p-2 rounded-md'
              />
              <input
                type='text'
                name='province'
                placeholder='Province/State'
                value={newAddress.province}
                onChange={handleInputChange}
                required
                className='border p-2 rounded-md'
              />
              <input
                type='text'
                name='zip'
                placeholder='ZIP/Postal Code'
                value={newAddress.zip}
                onChange={handleInputChange}
                required
                className='border p-2 rounded-md'
              />
              <input
                type='text'
                name='country'
                placeholder='Country'
                value={newAddress.country}
                onChange={handleInputChange}
                required
                className='border p-2 rounded-md'
              />
              <input
                type='text'
                name='phone'
                placeholder='Phone'
                value={newAddress.phone}
                onChange={handleInputChange}
                className='border p-2 rounded-md'
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
 