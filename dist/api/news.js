import axios from "axios";
class newsApi {
    constructor() {
        this.getLatestNewsByCategory = async (category) => {
            try {
                const response = await axios.get(`https://newsapi.org/v2/top-headlines?category=${category}&sortBy=relevancy&apiKey=0960d7462c5244af9fd8da981097077c`);
                const articles = response.data.articles.slice(0, 5);
                // Organize the articles as needed for the OpenAI API
                const organizedNews = articles.map((article) => ({
                    title: article.title,
                    description: article.description,
                    url: article.url,
                    source: article.source.name,
                    publishedAt: article.publishedAt,
                }));
                console.log("Organized News for OpenAI: " + JSON.stringify(organizedNews));
                return organizedNews;
            }
            catch (error) {
                console.log("error retriving wheather data for your location: " + error);
            }
        };
        /*
        https://newsapi.org/v2/top-headlines?category=${category}&sortBy=relevancy&apiKey=0960d7462c5244af9fd8da981097077c
        business
        entertainment
        general
        health
        science
        sports
        technology*/
    }
}
export default new newsApi();
//# sourceMappingURL=news.js.map