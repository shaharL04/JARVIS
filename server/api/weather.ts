import axios from "axios"

export const getWheatherPerLocation = async (location: string) =>{
    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Israel&appid=8a363841a75a1d1e6f3576c5e4d42273`);
        console.log("wheather: "+JSON.stringify(response.data))
    }catch(error){
        console.log("error retriving wheather data for your location: "+ error)
    }
}
/*https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=8a363841a75a1d1e6f3576c5e4d42273 */