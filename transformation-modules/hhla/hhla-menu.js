// Modules
const http = require('http');
const fs = require('fs');
const ini = require('ini');
const PDFParser = require("pdf2json");

//Variables
const configPath = './hhla-menu.ini';
const h = 37.208;
const w = 52.62;
const dina4h = 2480;
const dina4w = 3508;
var menuURL;
var pdfPath;
var verticalBorders;

loadConfig(() => {
    getMenu();
});


function getMenu() {

    downloadMenu(() => {
        readPDF(pdfPath, (data) => { parseToArray(data); });
    });
}


/*
* Downloads the menu pdf file and saves it.
*
* @param {function} cb - Callback function.
*/

function loadConfig(cb) {
    console.log("Loading Config ...");

    fs.readFile(configPath, (err, data) => {
        menuConfig = ini.decode(data.toString());

        menuURL = menuConfig.Paths.menuUrl;
        pdfPath = "../pdf/" + menuConfig.Paths.pdfName;
console.log(menuConfig);
        verticalBorders =  [1, 400, 600];
        let b = "5";
        const key = `menuConfig.Coulumns.border${b}` ;
        console.log(key);

        console.log("Config loaded.");

        cb();
    });

}

function downloadMenu(cb) {

    console.log("Downloading file: \'" + pdfPath.split('/')[pdfPath.split('/').length - 1] + "\' ...");
    let file = fs.createWriteStream(pdfPath);

    let request = http.get(menuURL, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            console.log("Donwloaded file successfully.");
            file.close(cb);
        });
    });
}

function readPDF(path, cb) {

    console.log("Reading pdf ...");
    let pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {

        let rawJSON = pdfData.formImage.Pages[0].Texts;
        rawJSON = JSON.parse('{"Texts":' + JSON.stringify(rawJSON) + '}');

        //Callback
        console.log("Finished Reading File.");
        cb(rawJSON);

    });

    pdfParser.loadPDF(pdfPath);

}


function parseToArray(rawJSON) {

    let xfactor = dina4w / w;
    let yfactor = dina4h / h;

    var arr = [[], [], [], [], [], []];

    console.log("Parsing PDF ...");

    rawJSON.Texts.forEach(element => {

        xPixel = element.x * xfactor;
        yPixel = element.y * yfactor;

        for (let a = 0; a < verticalBorders.length; a++) {
           if(xPixel < verticalBorders[a]){
               let txt = { x: xPixel, y: yPixel, t: element.R[0].T, tsize: element.R[0].TS[1] }
               arr[a].push(txt);
           }
            
        }




        // if (xPixel < 465) {

        //     let txt = { x: xPixel, y: yPixel, t: element.R[0].T, tsize: element.R[0].TS[1] };
        //     arr[0].push(txt);

        // } else if (xPixel < 955) {
        //     let txt = { x: xPixel, y: yPixel, t: element.R[0].T, tsize: element.R[0].TS[1] };
        //     arr[1].push(txt);

        // } else if (xPixel < 1495) {
        //     let txt = { x: xPixel, y: yPixel, t: element.R[0].T, tsize: element.R[0].TS[1] };
        //     arr[2].push(txt);

        // } else if (xPixel < 1975) {
        //     let txt = { x: xPixel, y: yPixel, t: element.R[0].T, tsize: element.R[0].TS[1] };
        //     arr[3].push(txt);

        // } else if (xPixel < 2455) {
        //     let txt = { x: xPixel, y: yPixel, t: element.R[0].T, tsize: element.R[0].TS[1] };
        //     arr[4].push(txt);

        // } else if (xPixel < 2930) {
        //     let txt = { x: xPixel, y: yPixel, t: element.R[0].T, tsize: element.R[0].TS[1] };
        //     arr[5].push(txt);
        // }
   

    });
    console.log("done");
    // console.log(arr);
}

Date.prototype.getWeek = () => {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}