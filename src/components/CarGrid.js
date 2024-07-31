import React, { useEffect, useState } from 'react';
import { fetchCars } from '../services/api';
import './CarGrid.css';

const CarGrid = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const getCars = async () => {
      const carData = await fetchCars();
      setCars(carData);
    };

    getCars();
  }, []);

  return (
    <div className="car-grid-container">
      <div className="car-grid">
        {cars.map(car => (
          <div key={car.id} className="car-cell">
            <img src={car.image_url} alt={car.name} />
            <div className="car-name">{car.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarGrid;
