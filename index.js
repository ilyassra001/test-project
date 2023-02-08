const Apify = require('apify');

Apify.main(async () => {
    const keyword = 'your keyword here';
    const site = 'your site here, e.g. example.com';
    const limit = 10; // max number of pages to fetch

    const requestQueue = await Apify.openRequestQueue();
    for (let i = 0; i < limit; i++) {
        await requestQueue.addRequest({
            url: `https://www.google.com/search?q=${encodeURIComponent(keyword)}+site:${site}&start=${i * 10}`
        });
    }

    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        handlePageFunction: async ({ request, page }) => {
            const results = await page.evaluate(() => {
                const elements = Array.from(document.querySelectorAll('.r a'));
                return elements.map(element => element.href);
            });

            console.log(results);
        },
        maxRequestRetries: 1,
        handleFailedRequestFunction: async ({ request }) => {
            console.log(`Request ${request.url} failed too many times`);
        },
    });

    await crawler.run();
});
