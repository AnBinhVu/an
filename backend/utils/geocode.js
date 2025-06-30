const axios = require('axios');

async function getCoordinates(city, district) {
  const query = `${district}, ${city}, Vietnam`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

  const res = await axios.get(url, {
    headers: { 'User-Agent': 'real-estate-app' }
  });
  if (res.data.length > 0) {
    const { lat, lon } = res.data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  } else {
    throw new Error('Không tìm thấy toạ độ cho địa chỉ này.');
  }
}

module.exports = getCoordinates;