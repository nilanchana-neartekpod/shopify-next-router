import React, { useState } from 'react';
import Rating from 'react-rating';

const ReviewForm = ({productid}) => {
  const [title, setTitle] = useState('');
  const [pid, setPid] = useState(productid);
  const [body, setBody] = useState('');
  const [rating, setRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubmitted(true); 
    }, 500);

    const fields = [
      { key: 'title', value: title },
      { key: 'pid', value: pid },
      { key: 'body', value: body },
      { key: 'rating', value: rating.toString() },
      { key: 'customer_name', value: customerName },
      { key: 'email', value: email },
    ];
    console.log("Submitted Fields:", fields);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Metaobject created:', data.metaobjectFields);
      } else {
        console.error('Error creating metaobject:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col item-start gap-6 p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div style={{display:"none"}}>
          <label className="block text-sm font-medium mb-1">PID:</label>
          <input
            type="text"
            value={pid}
            onChange={(e) => setPid(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rate this Product:</label>
          <Rating
            initialRating={rating}
            onChange={(value) => setRating(value)}
            emptySymbol={
              <span className="text-gray-300 text-xl">&#9734;</span>
            } // Empty star
            fullSymbol={
              <span className="text-yellow-400 text-xl">&#9733;</span>
            } // Full star
            fractions={2}
          />
          <p className="text-sm mt-2">Your Rating: {rating}</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Customer Name:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Submit Review
        </button>
      </form>
      {isSubmitted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-green-600 text-lg font-semibold">Review Submitted!</h2>
            <p className="text-gray-700 mt-2">Thank you for your feedback.</p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
