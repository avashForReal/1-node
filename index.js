const dotenv = require('dotenv')
const axios = require('axios')
const readline = require('readline')

// env config
dotenv.config()


// function to fetch data
const fetchData = async (author) => {
    try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=apple&apiKey=${process.env.API_KEY}`)
        const newsData = response.data.articles
        
        // console.log(newsData);
        const filteredData = newsData.filter((data) => data.author === author)
        
        return filteredData
    } catch (e) {
        console.log(e)
    }
}


// readline from command line
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter author\'s name: ', (author) => {

    // fetch data
    fetchData(author).then((filteredData) => console.log(filteredData))

    // close the interface
    rl.close();
});

