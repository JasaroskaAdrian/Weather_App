const baseAPIurl = 'https://api.openweathermap.org/data/2.5/weather'
const APPID = 'bc1f1d95d73fb246c06f030b6d51b6af'
const city = userInput
const APIurl = `${baseAPIurl}?q=${encodeURI(city)}&units=metric&APPID=${APPID}`

async function main() {
    try {
        const response = await fetch(APIurl)
        
        if (response.status === 200) {
            const body = await response.json()
            console.log(body)
            const temperatures = {
                temp: body.main.temp,
                minTemp: body.main.temp_min,
                maxTemp: body.main.temp_max
            }
            console.log(temperatures)
        }  
    } catch (error) {
        console.log(error)
    }
    
}
main()
    

    

