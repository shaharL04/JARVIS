import axios from "axios"

export const getLatestNewsByCategory = async (category: string) =>{
    try{
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?category=business&sortBy=relevancy&apiKey=0960d7462c5244af9fd8da981097077c`);
        console.log("news: "+JSON.stringify(response.data))
    }catch(error){
        console.log("error retriving wheather data for your location: "+ error)
    }
}

/*
https://newsapi.org/v2/top-headlines?category=${category}&sortBy=relevancy&apiKey=0960d7462c5244af9fd8da981097077c
business
entertainment
general
health
science
sports
technology*/