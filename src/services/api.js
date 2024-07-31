// import axios from 'axios';

// export const fetchCars = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/cars?api_key=${API_KEY}`);
//     return response.data.results;
//   } catch (error) {
//     console.error('Error fetching cars', error);
//   }
// };



// src/services/api.js
export const fetchCars = async () => {
    return [
      { id: 1, name: 'Car 1', image_url: 'https://via.placeholder.com/200' },
      { id: 2, name: 'Car 2', image_url: 'https://via.placeholder.com/200' },
      { id: 3, name: 'Car 2', image_url: 'https://via.placeholder.com/200' },
      { id: 4, name: 'Car 2', image_url: 'https://via.placeholder.com/200' },
      { id: 5, name: 'Car 2', image_url: 'https://via.placeholder.com/200' },
      { id: 6, name: 'Car 2', image_url: 'https://via.placeholder.com/200' },
      { id: 7, name: 'Car 2', image_url: 'https://via.placeholder.com/200' },
      { id: 8, name: 'Car 2', image_url: 'https://via.placeholder.com/200' },
      { id: 9, name: 'Car 2', image_url: 'https://via.placeholder.com/200' }
      // Add more sample data
    ];
  };
  