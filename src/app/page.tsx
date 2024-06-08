import { useEffect, useState } from "react";

interface WeatherData {
  weather: { description: string }[];
  main: { temp: number };
  name: string;
}

function getCurrentDate(): string {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { month: "long" };
  const monthName = currentDate.toLocaleString("en-US", options);
  const date = `${currentDate.getDate()}, ${monthName}`;
  return date;
}

export default function Home() {
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>("New Delhi");

  async function fetchData(cityName: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/weather?address=${cityName}`);
      const jsonData = (await response.json()).data as WeatherData;
      setWeatherData(jsonData);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchDataByCoordinates(latitude: number, longitude: number) {
    try {
      const response = await fetch(`http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}`);
      const jsonData = (await response.json()).data as WeatherData;
      setWeatherData(jsonData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchDataByCoordinates(latitude, longitude);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);

  return (
    <main className="bg-gradient-to-r from-indigo-400 to-cyan-400 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-lg bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(city);
          }}
          className="mb-4 flex flex-col md:flex-row items-center"
        >
          <input
            type="text"
            name="cityName"
            id="cityName"
            placeholder="Enter city name"
            onChange={(e) => setCity(e.target.value)}
            className="bg-white focus:outline-none border border-gray-300 rounded-md py-2 px-4 mb-2 md:mb-0 md:mr-2 w-full md:w-auto"
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full md:w-auto">
            Search
          </button>
        </form>
        {weatherData && weatherData.weather && weatherData.weather[0] ? (
          <>
            <div className="flex justify-center items-center mb-4">
              <div className="text-4xl">
                {weatherData?.weather[0]?.description === "rain" ||
                weatherData?.weather[0]?.description === "fog" ? (
                  <i className={`wi wi-day-${weatherData?.weather[0]?.description}`}></i>
                ) : (
                  <i className={`wi wi-day-cloudy`}></i>
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold">
                <span>{(weatherData?.main?.temp - 273.5).toFixed(2) + String.fromCharCode(176)}</span>
              </div>
              <div className="text-xl">{weatherData?.weather[0]?.description?.toUpperCase()}</div>
              <div className="text-lg">{weatherData?.name}</div>
              <div className="text-md">{date}</div>
            </div>
          </>
        ) : (
          <div className="text-white text-center">Loading....</div>
        )}
      </div>
    </main>
  );
}
