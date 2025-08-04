import React, { useState } from 'react';

const WORKER_URL = 'https://proud-bread-1784.joshuakliston.workers.dev/';
const AFFILIATE_TAG = 'joshuakliston-20';

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchAmazon = async () => {
    console.log("Search button clicked. Query:", query);

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: query })
    });

    const data = await res.json();
    console.log("Fetched data:", data);

    const items = data.SearchResult?.Items || [];

    const sorted = items
      .filter(item => item?.Images?.Primary?.Medium?.URL)
      .sort((a, b) => {
        const aPrice = a?.Offers?.Listings?.[0]?.Price?.Amount || Infinity;
        const bPrice = b?.Offers?.Listings?.[0]?.Price?.Amount || Infinity;
        return aPrice - bPrice;
      });

    setResults(sorted);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') searchAmazon();
  };

  return (
    <div className="container">
      <h1>DealDigger 🔍</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search Amazon..."
      />
      <button onClick={searchAmazon}>Search</button>

      <div className="results">
        {results.length === 0 && <p>No results found.</p>}
        {results.map((item, i) => {
          const image = item?.Images?.Primary?.Medium?.URL;
          const title = item?.ItemInfo?.Title?.DisplayValue;
          const price = item?.Offers?.Listings?.[0]?.Price?.Amount;
          const url = `${item.DetailPageURL}?tag=${AFFILIATE_TAG}`;

          return (
            <div key={i} className="card">
              {image && <img src={image} alt={title} />}
              <h3>{title}</h3>
              {price && <p>${price}</p>}
              <a href={url} target="_blank" rel="noopener noreferrer">View on Amazon</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
