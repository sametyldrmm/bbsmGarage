import React, { useEffect, useState } from 'react';

const ProtectedComponent = () => {
  const [protectedData, setProtectedData] = useState(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem('token');

      const response = await fetch('http://16.171.148.90:4000/protected', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProtectedData(data);
      } else {
        console.error('Failed to fetch protected data', response.status);
      }
    };

    fetchProtectedData();
  }, []);

  return (
    <div>
      <h1>Protected Data</h1>
      {protectedData ? (
        <pre>{JSON.stringify(protectedData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProtectedComponent;
