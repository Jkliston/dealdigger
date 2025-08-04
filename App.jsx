import React, { useState } from 'react';

const WORKER_URL = 'https://proud-bread-1784.joshuakliston.workers.dev/';
const AFFILIATE_TAG = 'joshuakliston-20';

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchAmazon = async () => {
    console.log("Search button clicked. Query:", query);
    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: query }) // <-- FIXED KEY
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      const items = data.ItemsResult?.Items || [];

      const sorted = items
        .filter(item =>
          item?.ItemInfo?.Title?.DisplayValue &&
          item?.Images?.Primary?.Medium?.URL &&
          item?.Offers?.Listings?.[0]?.Price?.Amount
        )
        .sort((a, b) => {
          const aPrice = a?.Offers?.Listings?.[0]?.Price?.Amount || Infinity;
          const bPrice = b?.Offers?.Listings?.[0]?.Price?.Amount || Infinity;
          return aPrice - bPrice;
        });

      setResults(sorted);
    } catch (err) {
      console.error("Failed to fetch from Worker:", err);
      alert("Something went wrong. Check the console for details.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchAmazon();
    }
  };

  return (
    <div className="container">
      <h1>DealDigger 🔍</h1>
      <input
        type="text"
        value={query}
        placeholder="Search Amazon products..."
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={searchAmazon}>Search</button>

      <div className="results">
        {results.length === 0 && <p>No results found.</p>}
        {results.map((item, index) => {
          const title = item?.ItemInfo?.Title?.DisplayValue || 'Untitled';
          const image = item?.Images?.Primary?.Medium?.URL;
          const price = item?.Offers?.Listings?.[0]?.Price?.Amount;
          const url = `${item.DetailPageURL}?tag=${AFFILIATE_TAG}`;

          return (
            <div key={index} className="card">
              <img src={image} alt={title} />
              <h3>{title}</h3>
              <p>${price}</p>
              <a href={url} target="_blank" rel="noopener noreferrer">
                View on Amazon
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
