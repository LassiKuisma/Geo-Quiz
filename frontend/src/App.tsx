import { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [message, setMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getGreeting = async () => {
      try {
        const response = await axios.get('http://localhost:3003/greetings');
        setMessage(response.data);
      } catch (error) {
        //
      }
    };

    getGreeting();
  }, []);

  return (
    <div>
      <div>Hello!</div>
      {message && <div>Server says {message}</div>}
    </div>
  );
};

export default App;
