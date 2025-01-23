import React from 'react';
import { useState } from "react"; 



export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( email ),
      });

      const result = await response.json();
      console.log(result,"xxdfvbnjmjhgsdfghj");

      // Handle success
      if (response.ok) {
        console.log(`Success! You have been subscribed with email: ${result.email}`);
      } else {
        throw new Error(result.error || 'Subscription failed');
      }
    } catch (error) {
      console.error(`Error: ${error.message || "An error occurred while subscribing."}`);
    }

    // Reset state after the operation
    setEmail("");
    setLoading(false);
  };

  return (
    <div className="min-h-16 flex items-center justify-center mt-16">
      <div className="relative w-full max-w-md mx-auto bg-gradient-to-r from-purple-800 via-purple-600 to-purple-400 text-white rounded-lg shadow-lg overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{
            backgroundImage:
              "url('https://source.unsplash.com/1600x900/?city,skyline')",
          }}
        ></div>
        <div className="relative z-10 p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Our Newsletter</h1>
          <p className="text-sm mb-6">
            We bring the right people together to challenge established thinking
            and drive transformation. We will show the way to success.
          </p>
          <form onSubmit={handleSubmit} className="flex items-center justify-center">
            <input
             type="email"
             placeholder="Enter your email..."
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="px-4 py-2 rounded-l-lg w-full max-w-[250px] text-gray-900 focus:outline-none"
             required
            />
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-r-lg"disabled={loading}
            >
              {loading ? "Subscribing..." : "Subscribe Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
