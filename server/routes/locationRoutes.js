// backend/routes/locationRoutes.js
import express from 'express';
// In Node.js 18 and later, 'fetch' is built-in, so 'node-fetch' is generally not needed.
// If you're using an older Node.js version, keep it:
// import fetch from 'node-fetch';

const router = express.Router();

router.get('/track', async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    // ONLY OpenWeatherMap API Key is needed now, as we're using its geocoding
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!OPENWEATHER_API_KEY) {
        console.error("API key not set. Make sure OPENWEATHER_API_KEY is in your .env file.");
        return res.status(500).json({ message: 'Server configuration error: OpenWeatherMap API key missing.' });
    }

    try {
        // 1. Reverse Geocoding (to get City, State, Country from coordinates using OpenWeatherMap's Geocoding API)
        const geocodingUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${OPENWEATHER_API_KEY}`;
        const geocodingRes = await fetch(geocodingUrl);
        const geocodingData = await geocodingRes.json();

        let city = 'N/A';
        let state = 'N/A';
        let country = 'N/A';

        if (geocodingData && geocodingData.length > 0) {
            const firstResult = geocodingData[0];
            city = firstResult.name || 'N/A'; // OpenWeatherMap returns 'name' for city
            state = firstResult.state || 'N/A';
            country = firstResult.country || 'N/A';
        }

        // 2. Weather Data (from OpenWeatherMap)
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`; // units=metric for Celsius
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        let weatherInfo = null;
        if (weatherData.main && weatherData.weather && weatherData.weather.length > 0) {
            weatherInfo = {
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description,
                icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` // Icon URL
            };
        }

        // 3. Remove Google Maps Embed URL (Frontend handles map with Leaflet/OpenStreetMap)
        // The `mapUrl` is no longer needed as the frontend directly renders the map using Leaflet.js.
        // We will remove it from the response for clarity and efficiency.

        res.json({
            location: { city, state, country },
            weather: weatherInfo,
            // mapUrl: mapUrl // <--- REMOVED THIS LINE
        });

    } catch (error) {
        console.error('Error tracking location:', error);
        // Return a more specific error message for the frontend
        res.status(500).json({ message: 'Failed to track location. Please check backend logs.', error: error.message });
    }
});

export default router;