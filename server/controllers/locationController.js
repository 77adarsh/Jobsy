export const trackLocation = async (req, res) => {
    const { lat, lng } = req.query;
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!lat || !lng) {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }
    if (!OPENWEATHER_API_KEY) {
        return res.status(500).json({ message: 'Server configuration error: Missing API key.' });
    }

    try {
        const geoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${OPENWEATHER_API_KEY}`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        const { name: city = 'N/A', state = 'N/A', country = 'N/A' } = geoData[0] || {};

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        const weatherInfo = weatherData.main && weatherData.weather?.length
            ? {
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description,
                icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
            }
            : null;

        res.json({ location: { city, state, country }, weather: weatherInfo });
    } catch (error) {
        res.status(500).json({ message: 'Failed to track location.', error: error.message });
    }
};  