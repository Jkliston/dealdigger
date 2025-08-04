import React, { useState } from 'react';

const WORKER_URL = 'https://proud-bread-1784.joshuakliston.workers.dev/';
const AFFILIATE_TAG = 'vibestrom-20';

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchAmazon = async () => {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const { sortedResults } = await response.json();

    setResults(sortedResults || []);
  };

  return (
    <div className="container">
      <h1>DealDigger 🔍</h1>
      <input
        type="text"
        value={query}
        placeholder="Search Amazon products..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchAmazon}>Search</button>

      <div className="results">
        {results.map((item, index) => (
          <div key={index} className="card">
            <img src={item.Images.Primary.Large.URL} alt="product" />
            <h3>{item.ItemInfo.Title.DisplayValue}</h3>
            <p>${item.Offers.Listings[0].Price.Amount}</p>
            <a
              href={`${item.DetailPageURL}?tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Amazon
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
