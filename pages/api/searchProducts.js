const handleSearch = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('/api/searchProducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery, // The query from state
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      setSearchResults(data); // Update the state with search results
  
      console.log('Search results:', data); // For debugging purposes
  
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
  