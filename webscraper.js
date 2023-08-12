const puppeteer = require("puppeteer");


//Change to true when running site
//const browser = await puppeteer.launch({headless: false});

const getTitle = async (link) => {
    
    //Change to true when running site
    const browser = await puppeteer.launch({headless: true});
    // Create a page
    const page = await browser.newPage();
    // Go to your site
    await page.goto(link);

    // Wait for title to actually appear
    await page.waitForXPath('//*[@id="title"]/h1/yt-formatted-string');

    const element = await page.$x('//*[@id="title"]/h1/yt-formatted-string');

    let title = await page.evaluate(el => el.textContent, element[0])

    //console.log("The title is: ");
    //console.log(title);
    browser.close();
    return title;
}

const getDescription = async (link) => {

    //Change to true when running site
    const browser = await puppeteer.launch({headless: true});
    // Create a page
    const page = await browser.newPage();
    // Go to your site
    await page.goto(link);

    // Wait for desc to appear
    await page.waitForXPath('//*[@id="expand"]');

    const [clickDesc] = await page.$x('//*[@id="expand"]');
    if (clickDesc){
        await clickDesc.click();
    }

    await page.waitForXPath('//*[@id="description-inline-expander"]/yt-attributed-string/span');

    const descElem = await page.$x('//*[@id="description-inline-expander"]/yt-attributed-string/span');

    let desc = await page.evaluate(el => el.textContent, descElem[0]);

    browser.close();
    return desc;
}

getDescription("https://www.youtube.com/watch?v=At6XyItIHsE");


module.exports = {
    getTitle,
    getDescription
};