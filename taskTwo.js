const dotenv = require('dotenv')
const axios = require('axios')
const fs = require("fs");
const moment = require("moment");

// env config
dotenv.config()


// function to fetch data
const fetchData = async (author) => {
    try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=apple&apiKey=${process.env.API_KEY}`)
        const newsData = response.data.articles

        return newsData
    } catch (e) {
        console.log(e)
    }
}

const getFirstDayOfWeek = (d) => {
    const date = new Date(d);

    const dayOfMonth = date.getDate();
    const dayOfWeek = date.getDay();
    const firstDayOfWeek = dayOfMonth - dayOfWeek;

    // new date object whose date is set to first day of the week
    return new Date(date.setDate(firstDayOfWeek));

};

const taskTwo = async () => {
    try {
        const filteredData = await fetchData()

        const weeklyNews = filteredData.reduce((accumulator, { source, ...other }) => {

            const newArticle = {
                source: source.name,
                ...other,
            };

            const date = new Date(newArticle.publishedAt);

            const firstDayOfWeek = getFirstDayOfWeek(date);
            
            const lastDayOfWeek = new Date(
                new Date(date).setDate(firstDayOfWeek.getDate() + 6)
            );

            const format = "YYYY-MM-DD";
          
            const key = `${moment(firstDayOfWeek).format(format)}_${moment(
                lastDayOfWeek
            ).format(format)}`;

            const updatedArray = accumulator[key] || [];

            updatedArray.push(newArticle);
            accumulator[key] = updatedArray;

            return accumulator;
        }, {});

        fs.writeFile(
            "weeklyArticle.json",
            JSON.stringify(weeklyNews),
            (err) => {
                if (err) {
                    console.log(err);
                }
            }
        );

        return weeklyNews

    } catch (e) {
        console.log(e);
    }
}

taskTwo().then((data) => console.log(data))
