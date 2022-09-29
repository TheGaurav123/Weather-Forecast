import React, { useEffect, useState } from 'react'
import './home.css'
import Sunrise from '../images/sunrise.png'
import Sunset from '../images/sunset.png'
import Sun from '../images/sun.svg'
import Moon from '../images/moon.svg'  //eslint-disable-line
import NightBg from '../images/nightimg.gif' //eslint-disable-line
import DayBg from '../images/dayimg.gif' //eslint-disable-line

/* ---------------------------------------------  
        S M A R T P H O N E  I M P O R T S
------------------------------------------------*/
import LocationIcon from '../images/phoneicon/locationicon.svg'
import MobSun from '../images/phoneicon/sun.svg'
import MobMoon from '../images/phoneicon/moon.svg'
import AirIcon from '../images/phoneicon/airicon.png'
import UvIcon from '../images/phoneicon/uvicon.png'
import RainChance from '../images/phoneicon/rainchance.png'


const Home = () => {

    /*-------------------------------------------------------------
                        S T A T E    M A N A G E M E N T
    ---------------------------------------------------------------*/

    // Input State Management
    const [input, setInput] = useState('delhi')


    // User Location State Management
    const [usrLoc, setUsrLoc] = useState({
        lat: '',
        long: ''
    })


    // Api Data State Management
    const [weatherData, setWeatherData] = useState({
        currTemp: '',
        currState: '',
        currIcon: '',
        city: '',
        state: '',
        country: '',
        sunrise: '',
        sunset: '',
        uv: '',
        dayornight: '',
        air_quality: '',
        hourlyData: [''],
        rainchance: '',
        currDateTime: '',
        co: '',
        no: '',
        so: ''
    })


    // Debounce State
    const [debounceTime, setDebounceTime] = useState(0)


    /*-------------------------------------------------------------
                          F U N C T I O N S    
---------------------------------------------------------------*/



    // API Fetch Function

    const API_KEY = process.env.REACT_APP_API_KEY

    const BASE_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&aqi=yes`

    const fetchApi = async () => {
        let usrCoords = `${usrLoc.lat},${usrLoc.long}`
        const data = await fetch(`${BASE_URL}&q=${usrLoc.lat !== '' ? usrCoords : (input !== '' ? input : usrCoords)}`)
        const result = await data.json()

        if (data.status === 200) {
            let dt = new Date(result.location.localtime_epoch * 1000).getHours()
            let amorpm = dt === 0 ? `${dt + 12}:00 AM` : (dt < 12 ? `${dt}:00 AM` : (dt === 12 ? `${dt}:00 PM` : `${dt - 12}:00 PM`))
            setWeatherData({
                currTemp: result.current.temp_c,
                currState: result.current.condition.text,
                currIcon: result.current.condition.icon,
                city: result.location.name,
                state: result.location.region,
                country: result.location.country,
                sunrise: result.forecast.forecastday[0].astro.sunrise,
                sunset: result.forecast.forecastday[0].astro.sunset,
                uv: result.current.uv,
                dayornight: result.current.is_day,
                air_quality: result.current.air_quality['us-epa-index'],
                hourlyData: result.forecast.forecastday[0].hour,
                rainchance: result.forecast.forecastday[0].day.daily_chance_of_rain,
                currDateTime: amorpm,
                co: Math.trunc(result.current.air_quality.co),
                no: Math.trunc(result.current.air_quality.no2),
                so: Math.trunc(result.current.air_quality.so2)
            })

            let errorDiv = document.getElementById('errorDiv');
            errorDiv.style.display = 'none'

            let DeskError = document.getElementById('deskErrorShow');
            DeskError.style.display = 'none'

            let loc = document.getElementById('locHide');
            loc.style.display = 'block'

            let cityHide = document.getElementById('cityHide');
            cityHide.style.display = 'block'
        }
        else {
            let errorDiv = document.getElementById('errorDiv');
            errorDiv.style.display = 'block'

            let DeskError = document.getElementById('deskErrorShow');
            DeskError.style.display = 'block'

            let loc = document.getElementById('locHide');
            loc.style.display = 'none'

            let cityHide = document.getElementById('cityHide');
            cityHide.style.display = 'none'
        }

    }




    // UV Index Management 
    var color = ''
    var uvText = ''

    const uvColorFunc = () => {
        if (weatherData.uv === 0 || weatherData.uv === 1 || weatherData.uv === 2) {
            uvText = 'LOW'
            color = 'greenyellow'
        } else if (weatherData.uv === 3 || weatherData.uv === 4 || weatherData.uv === 5) {
            uvText = 'MODERATE'
            color = 'yellow'
        }
        else if (weatherData.uv === 6 || weatherData.uv === 7) {
            uvText = 'HIGH'
            color = 'orangered'
        }
        else if (weatherData.uv === 8 || weatherData.uv === 9 || weatherData.uv === 10) {
            uvText = 'VERY HIGH'
            color = 'red'
        }
        else if (weatherData.uv >= 11) {
            uvText = 'EXTREME'
            color = 'violet'
        }
        else {
            color = 'white'
        }

    }

    uvColorFunc();


    // Day Night Bg

    const setBg = () => {
        return (
            weatherData.dayornight === 1 ? DayBg : NightBg
        )
    }

    const dayNight = () => {
        return weatherData.dayornight === 1 ? Sun : Moon
    }


    // Air Quality

    let airText = ''
    let airColor = ''


    const airCheck = () => {
        if (weatherData.air_quality === 1) {
            return (
                airText = 'Healthy',
                airColor = 'greenyellow'
            )
        }
        else if (weatherData.air_quality === 2) {
            return (
                airText = 'Moderate',
                airColor = 'yellow'
            )
        }
        else if (weatherData.air_quality === 3) {
            return (
                airText = 'Unhealthy For Sensitive Group',
                airColor = 'orange'
            )
        }
        else if (weatherData.air_quality === 4) {
            return (
                airText = 'Unhealthy',
                airColor = 'orangered'
            )
        }
        else if (weatherData.air_quality === 5) {
            return (
                airText = 'Very Unhealthy',
                airColor = 'red'
            )
        }
        else if (weatherData.air_quality === 6) {
            return (
                airText = 'Hazardous',
                airColor = 'violet'
            )
        }
    }

    airCheck();


    /*-------------------------------------------------------------
                   E F F E C T    M A N A G E M E N T
---------------------------------------------------------------*/



    useEffect(() => {
        if (debounceTime !== 0) {
            clearTimeout(debounceTime)
        }

        const timeout = setTimeout(async () => {
            await fetchApi();
        }, 950)

        setDebounceTime(timeout)

    }, [input, usrLoc]) //eslint-disable-line

    const blankInput = input === ''
    useEffect(() => {
        const fetchLocation = () => {
            navigator.geolocation.getCurrentPosition((position) => {
                setUsrLoc({
                    long: position.coords.longitude,
                    lat: position.coords.latitude
                })
            });
        }
        fetchLocation();
    }, [blankInput])
















    return (
        <>

            {/* ---------------------------------------------------------------------
                L A R G E    S C R E E N   D E V I C E S
-------------------------------------------------------------------------*/}

            <div className='container' style={{
                backgroundImage: `url(${setBg()})`
            }}>
                <div className="main-Div">

                    {/* ------------------------------------
                        L E F T   D I V
               ----------------------------------------*/}
                    <div className="left-Div">

                        <div className="temp-Div sizing">
                            <h4>What's the weather !</h4>
                            <div className="weather-Data data">
                                <h3>{weatherData.currTemp}&#176;C</h3>
                                <h5>{weatherData.currState}</h5>
                            </div>

                        </div>

                        <div className="climate-Div sizing">
                            <h4>Air Quality</h4>
                            <div className="climate-Data data">
                                <h3 style={{
                                    backgroundColor: `${airColor}`
                                }}>{airText}</h3>
                            </div>
                            <div className="more-climate-Data">
                                <h4>CO : {weatherData.co}</h4>
                                <h4>no2 : {weatherData.no}</h4>
                                <h4>so2 : {weatherData.so}</h4>
                            </div>

                        </div>

                        <div className="forecast-Div sizing">
                            <h4>How the today's weather ?</h4>

                            <div className="forecast-Data">
                                {weatherData.hourlyData.map((data, index) => {
                                    let dataTime = new Date(data.time_epoch * 1000).getHours();
                                    let amorpm = dataTime === 0 ? `${dataTime + 12}:00 AM` : (dataTime < 12 ? `${dataTime}:00 AM` : (dataTime === 12 ? `${dataTime}:00 PM` : `${dataTime - 12}:00 PM`))

                                    return (
                                        <div className="set" key={index}>
                                            <div className="cloudImg">
                                                <img src={data.condition ? data.condition.icon : null} alt="cloud" />
                                            </div>
                                            <h4>{data.temp_c}&#176;C</h4>
                                            <h5>{amorpm}</h5>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>


                    {/* ------------------------------------
                        R I G H T   D I V
               ----------------------------------------*/}

                    <div className="right-Div">
                        <div className="location-Div">
                            <input type="text" id='bigerrorShow' placeholder='Search' onChange={(event) => {
                                setInput(event.target.value);
                                setUsrLoc({
                                    lat: '',
                                    long: ''
                                })
                            }} />
                            <h4 id='deskErrorShow' style={{ color: 'red', fontWeight: 'lighter', fontSize: '2rem' }}>Location Not Found...</h4>
                            <h4 id='locHide'>{weatherData.city}, {weatherData.state}, {weatherData.country}</h4>
                            <h5>{weatherData.currDateTime}</h5>
                        </div>


                        <div className="uv-Div">
                            <div className="uv-Data">
                                <img src={dayNight()} alt="Day/Night" />
                                <h4>UVI <span style={{
                                    backgroundColor: `${color}`
                                }}>{uvText}</span></h4>
                            </div>
                        </div>


                        <div className="sunTime">
                            <div className="sunrise grading-sun">
                                <img src={Sunrise} alt="sunrise" />
                                <h4>{weatherData.sunrise}</h4>
                                <h5>Sunrise</h5>
                            </div>
                            <div className="sunset grading-sun">
                                <img src={Sunset} alt="sunset" />
                                <h4>{weatherData.sunset}</h4>
                                <h5>Sunset</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* ---------------------------------------------------------------------
                S M A L L    S C R E E N   D E V I C E S
-------------------------------------------------------------------------*/}

            <div className="mob-Container"  style={{
                backgroundImage: `url(${setBg()})`
            }}>

                <div className="mob-box">

                    <div className="top-section">
                        <div className="curr-location">
                            <img src={LocationIcon} alt="your location" />
                            <input type="text" placeholder='Search' onChange={(event) => {
                                setInput(event.target.value)
                                setUsrLoc({
                                    lat: '',
                                    long: ''
                                })
                            }} />
                        </div>
                        <div className="day-Night-Toggle">
                            <img src={MobSun} className={weatherData.dayornight === 1 ? 'toggle' : null} alt="Day" />
                            <img src={MobMoon} className={weatherData.dayornight === 0 ? 'toggle' : null} alt="Night" />
                        </div>
                    </div>
                    <h4 style={{
                        fontSize : '2rem',
                        marginTop : '1rem',
                        marginLeft : '7rem'
                    }} id='cityHide'>{`${weatherData.city}, ${weatherData.state}, ${weatherData.country}`}</h4>
                    <h5 id='errorDiv' style={{ display: 'block', fontSize: '2rem', textAlign: 'center', marginTop: '2rem' }}>Location Not Found...</h5>

                    <div className="middle-section">
                        <h4>Today's Report  </h4>
                        <h5 id='currTimeStamp'>{weatherData.currDateTime}</h5>
                        <div className="currweather-Data">
                            <img src={weatherData.currIcon} alt="weather-condition" />
                            <h5>{weatherData.currState}</h5>
                            <h3>{weatherData.currTemp}&#176;C</h3>
                        </div>

                        <div className="mob-sun">
                            <div className="mob-sunrise mob-design">
                                <img src={Sunrise} alt="sunrise" />
                                <h4>{weatherData.sunrise}</h4>
                                <h5>Sunrise</h5>
                            </div>
                            <div className="mob-sunset mob-design">
                                <img src={Sunset} alt="sunset" />
                                <h4>{weatherData.sunset}</h4>
                                <h5>Sunset</h5>
                            </div>
                        </div>
                    </div>

                    <div className="bottom-section">
                        <div className="air-quality mob-design">
                            <img src={AirIcon} alt="air-quality" />
                            <h4>{airText}</h4>
                            <h5>Air Quality</h5>
                        </div>
                        <div className="mob-uvi mob-design">
                            <img src={UvIcon} alt="uv-rays" />
                            <h4>{uvText}</h4>
                            <h5>UVI</h5>
                        </div>
                        <div className="mob-uvi mob-design">
                            <img src={RainChance} alt="uv-rays" />
                            <h4>{weatherData.rainchance}%</h4>
                            <h5>Chance Of Rain</h5>
                        </div>
                    </div>
                </div>

            </div>


        </>
    )
}

export default Home