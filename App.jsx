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
        body: JSON.stringify({ keyword: query })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      const items = (data?.ItemsResult?.Items || []).filter(item => {
        const title = item?.ItemInfo?.Title?.DisplayValue;
        const image = item?.Images?.Primary?.Medium?.URL;
        const url = item?.DetailPageURL;
        if (!title || !image || !url) {
          console.warn("Skipping invalid item:", item);
          return false;
        }
        return true;
      });

      const sorted = items.sort((a, b) => {
        const aPrice = a?.Offers?.Listings?.[0]?.Price?.Amount || Infinity;
        const bPrice = b?.Offers?.Listings?.[0]?.Price?.Amount || Infinity;
        return aPrice - bPrice;
      });

      setResults(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Something went wrong. Check the console.");
    }
  };

  const handleKeyDown = (e
