// import axios from 'axios';

// export const fetchCars = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/cars?api_key=${API_KEY}`);
//     return response.data.results;
//   } catch (error) {
//     console.error('Error fetching cars', error);
//   }
// };
import car1 from '../assets/images/1200px-2018_BMW_X3_xDrive30d_M_Sport_Automatic_3.0_Front.jpg';
import car2 from '../assets/images/1925_Ford_Model_T_touring.jpg';
import car3 from '../assets/images/1971-datsun-240z.jpg';
import car4 from '../assets/images/1992-lancia-delta-integrale-evo.jpg';
import car5 from '../assets/images/1996_McLaren_F1_Chassis_No_63_6.1_Front.jpg';
import car6 from '../assets/images/2013_chevrolet_impala_angularfront.jpg';
import car7 from '../assets/images/gemera.jpg';
import car8 from '../assets/images/Mercedes-Benz_W463_G_350_BlueTEC_01.jpg';
import car9 from '../assets/images/wrx.jpg';


// src/services/api.js
export const fetchCars = async () => {
    return [
      { id: 1, name: 'Car 1', image_url: car1 },
      { id: 2, name: 'Car 2', image_url: car2 },
      { id: 3, name: 'Car 3', image_url: car3 },
      { id: 4, name: 'Car 4', image_url: car4 },
      { id: 5, name: 'Car 5', image_url: car5 },
      { id: 6, name: 'Car 6', image_url: car6 },
      { id: 7, name: 'Car 7', image_url: car7 },
      { id: 8, name: 'Car 8', image_url: car8 },
      { id: 9, name: 'Car 9', image_url: car9 }
    ];
};
  