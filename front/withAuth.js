import { useAuth } from '../auth-context'; // auth-context dosyanızın yolu
import { useEffect } from 'react';

const MyComponent = () => {
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchWithAuth('http://16.171.148.90:4000/protected-endpoint');
      if (response && response.ok) {
        const data = await response.json();
      }
    };

    fetchData();
  }, []);

  return <div>My Component</div>;
};

export default MyComponent;
