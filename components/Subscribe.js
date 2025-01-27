import React, { useState, useEffect } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check session storage to determine if the modal should be shown
    const isSubscribed = sessionStorage.getItem("subscribed");
    if (!isSubscribed) {
      setShowModal(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      // Handle success
      if (response.ok) {
        console.log(
          `Success! You have been subscribed with email: ${result.email}`
        );
        sessionStorage.setItem("subscribed", true); 
        setShowModal(false); 
      } else {
        throw new Error(result.error || "Subscription failed");
      }
    } catch (error) {
      console.error(
        `Error: ${error.message || "An error occurred while subscribing."}`
      );
    }

    // Reset state after the operation
    setEmail("");
    setLoading(false);
  };

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative z-10 p-6 text-center">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <img
                src="https://ecomusnext-themesflat.vercel.app/images/item/banner-newleter.jpg" 
                alt="Welcome Image"
                className="mb-6 rounded-lg shadow-lg"
              />
              <h1 className="text-2xl font-bold mb-4">Don’t miss out</h1>
              <p className="text-sm mb-6">
                Be the first one to get the new product at early bird prices.
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center"
              >
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 rounded-lg w-full max-w-[250px] text-gray-900 border border-gray-300 focus:outline-none mb-4"
                  required
                />
                <button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-lg w-full max-w-[250px]"
                  disabled={loading}
                >
                  {loading ? "Subscribing..." : "Keep me updated"}
                </button>
              </form>
              <button
                className="mt-4 text-sm text-blue-500 hover:underline hover:text-blue-800"
                onClick={() => {
                  sessionStorage.setItem("subscribed", true);
                  setShowModal(false);
                }}
              >
                Not interested
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
