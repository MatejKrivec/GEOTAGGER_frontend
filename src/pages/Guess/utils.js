import { createClient } from '@google/maps';

const googleMapsClient = createClient({
  key: 'AIzaSyCdwFcRukCF5DwPyaa15dXxX-Ls3Tq55Lo',
  Promise: Promise
});

const calculateDistance = async (origin, destination) => {
  const response = await googleMapsClient.distanceMatrix({
    origins: [origin],
    destinations: [destination],
    mode: 'driving',
    units: 'metric'
  }).asPromise();

  if (response.json.rows[0].elements[0].status === 'OK') {
    return response.json.rows[0].elements[0].distance.text;
  } else {
    throw new Error('Unable to calculate distance');
  }
};
