const puppeteer = require('puppeteer');
const {pushCode}=require("./push-code");

// const username = "test123645";
// const password = "password@645";
const username = "*******";
const password = "*************";

const repository = {
    name: process.argv[2],
    description: 'Github Automation auto created Repository using puppeteer',
    isPublic: true,
}

const selectors = {
    username: '#login_field',
    password: '#password',
    login: '[type=submit]',
    new: ".Header-item.position-relative.d-none .details-overlay.details-reset.js-header-promo-toggle ",
    href: '[data-ga-click="Header, create new repository"]',

    repositoryName: '#repository_name',
    repositoryDesc: '#repository_description',
    repositoryPrivate: '#repository_visibility_private',
    repositoryInit: '#repository_auto_init',
    repositoryCreateBtn: '#new_repository > div.js-with-permission-fields > button'
}

const url = "https://github.com/login?return_to=%2Fgithub";

async function createNewRepo(){
    try{
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: false,
            args: ["--start-maximized"],
            slowMo : 50 ,
        });
        const page = await browser.newPage();
        await page.goto(url);
        await page.type(selectors.username, username);
        await page.type(selectors.password, password);
        await page.click(selectors.login);
        // await page.waitForNavigation({waitUntil: "networkidle2"});
        await page.waitFor(1000);
    
        await page.click(selectors.new);
        await page.waitFor(500);
        await page.click(selectors.href);
        // await page.waitFor(1000);
        await page.waitForSelector(selectors.repositoryName, {visible: true});
        // await page.waitForNavigation({waitUntil: "networkidle2"});
    
        const {name, description, isPublic} = repository;
        await page.type(selectors.repositoryName, name);
        await page.type(selectors.repositoryDesc, description);
        if(!isPublic){
            await page.click(selectors.repositoryPrivate);
        }
        // await page.click(selectors.repositoryInit);
        await page.click(selectors.repositoryCreateBtn);    
        await pushCode(repository.name).then(stdout=>{
            console.log("stdout:",stdout)
        }).catch(err => {
            throw err;
        }).finally(async ()=>{
            await page.reload()
        console.log("done");
        });
    
        
    }
   catch(err){
    console.error(err);
   }
}
createNewRepo();
