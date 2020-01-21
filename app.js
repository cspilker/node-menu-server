Date.prototype.getWeek = function () {
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

let fs = require('fs'),
    PDFParser = require("pdf2json");


let h = 37.208;
let w = 52.62;

let dina4h = 2480;
let dina4w = 3508;

let resArr = [];
let dayArr = [];

let pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFile("./a.json", JSON.stringify(pdfData), 'utf-8', () => { console.log("done."); });
});

pdfParser.loadPDF("./pdf/c.pdf");



var son;
fs.readFile("a.json", 'utf-8', (err, data) => {
    son = JSON.parse(data.toString()).formImage.Pages[0].Texts;

    son = JSON.stringify(son);
    son = '{"Texts":' + son + '}';
    lon = JSON.parse(son);


    fs.writeFile("./b.json", JSON.stringify(lon), 'utf-8', (err) => {

        parseColumns(lon);

    });





});

/**
 * @param {JSON} jsobj - The date
 */
function parseColumns(jsobj) {

    let xfactor = dina4w / w;
    let yfactor = dina4h / h;
    console.log("x: " + xfactor + ",   y: " + yfactor);

    var arr = [[], [], [], [], [], []];

    jsobj.Texts.forEach(element => {

        xpx = element.x * xfactor;
        ypx = element.y * yfactor;

        if (xpx < 465) {

            let txt = { x: xpx, y: ypx, t: element.R[0].T, tsize: element.R[0].TS[1] };
            arr[0].push(txt);

        } else if (xpx < 955) {
            let txt = { x: xpx, y: ypx, t: element.R[0].T, tsize: element.R[0].TS[1] };
            arr[1].push(txt);

        } else if (xpx < 1495) {
            let txt = { x: xpx, y: ypx, t: element.R[0].T, tsize: element.R[0].TS[1] };
            arr[2].push(txt);

        } else if (xpx < 1975) {
            let txt = { x: xpx, y: ypx, t: element.R[0].T, tsize: element.R[0].TS[1] };
            arr[3].push(txt);

        } else if (xpx < 2455) {
            let txt = { x: xpx, y: ypx, t: element.R[0].T, tsize: element.R[0].TS[1] };
            arr[4].push(txt);

        } else if (xpx < 2930) {
            let txt = { x: xpx, y: ypx, t: element.R[0].T, tsize: element.R[0].TS[1] };
            arr[5].push(txt);
        }

    });



    parseRows(arr);



    return "jsobj";
}


function parseRows(arr) {



    arr.forEach((element, count) => {

        let buff = [[], [], [], [], [], []];


        element.forEach(element2 => {


            if (element2.y < 380) {


            } else

                if (element2.y < 430) {
                    buff[0].push(element2);

                } else if (element2.y < 490) {
                    buff[1].push(element2);

                } else if (element2.y < 770) {
                    buff[2].push(element2);

                } else if (element2.y < 1080) {
                    buff[3].push(element2);

                } else if (element2.y < 1440) {
                    buff[4].push(element2);

                } else if (element2.y < 1750) {
                    buff[5].push(element2);

                }




        });

        if (count != 0) {
            resArr.push(buff);
        }

    });

    console.log('\n\n\nRESULT:');


    console.log(resArr);
    readArray(resArr);



}

/**
 * @param {Array} inArr - Array
 */
function readArray(inArr) {

    inArr.forEach((element, count) => {

        let weekday;
        let date;
        let dayObj = { date: null, weekday: null, menu: [] }


        switch (decodeURI(element[0][0].t)) {
            case 'Montag':
                weekday = "Monday";
                break;
            case 'Dienstag':
                weekday = "Tuesday";
                break;
            case 'Mittwoch':
                weekday = "Wednesday";
                break;
            case 'Donnerstag':
                weekday = "Thursday";
                break;
            case 'Freitag':
                weekday = "Friday";
                break;
            default:
                console.error('--------- ERROR ----------');
                break;
        }

        var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        date = new Date(decodeURI(element[1][0].t).replace(pattern, '$3-$2-$1'));

        if (date.toLocaleString('en-us', { weekday: 'long' }) == weekday) {
        } else {
            console.error('--------- ERROR ----------');
        }

        dayObj.date = date;
        dayObj.weekday = weekday;



        element.forEach((element2, count) => {
            if (count > 1) {
                let menuItem = { menuType: null, menuDescription: null, description: null, price: null, specialPrice: null, allergens: [] };

                switch (count - 1) {
                    case 1:
                        menuItem.menuDescription = "Kleine Gerichte";
                        break;
                    case 2:
                        menuItem.menuDescription = "Das Traditionelle Menü";
                        break;
                    case 3:
                        menuItem.menuDescription = "Der Tipp des Tages";
                        break;
                    case 4:
                        menuItem.menuDescription = "Die Aktiven";
                        break;
                    default:
                        console.error('--------- ERROR ----------');
                        break;
                }
                menuItem.menuType = count - 1;
                // DESC --------------------------------------------------------------
                let desc = [];

                element2.forEach(element3 => {
                    if (Math.trunc(element3.tsize) == 11) {
                        desc.push(element3);
                    }
                });

                // console.log(desc);
                desc.sort(function (a, b) { return b.y + a.y });
                let descStrng = '';
                desc.forEach(element4 => {
                    descStrng = descStrng + element4.t;
                });

                menuItem.description = decodeURIComponent(descStrng);

                // PRICE --------------------------------------------------------------
                let price = [];
                let allergens = '';

                element2.forEach(element5 => {
                    if (Math.trunc(element5.tsize) == 8 || Math.trunc(element5.tsize) == 10) {

                        price.push(element5);
                    }
                });

                price.sort(function (a, b) { return b.y - a.y });
                if (price.length == 3) {
                    allergens = decodeURIComponent(price.pop().t);
                }

                price.sort(function (a, b) { return a.x - b.x });

                decStr = decodeURIComponent(price[0].t);
                menuItem.specialPrice = parseInt(decStr.substring(decStr.length - 6, decStr.length - 5) + decStr.substring(decStr.length - 4, decStr.length - 2), 10);


                decStr2 = decodeURIComponent(price[1].t);
                menuItem.price = parseInt(decStr2.substring(decStr2.length - 6, decStr2.length - 5) + decStr2.substring(decStr2.length - 4, decStr2.length - 2), 10);

                if (allergens.length > 1) {
                    menuItem.allergens = allergens.replace(/\)|\(/g, '').split(',').map((strng) => { return parseInt(strng); });
                }



                dayObj.menu.push(menuItem);

            }
        });
        dayArr.push(dayObj);
    });


    console.log(JSON.stringify(dayArr));
    fs.readFile("tttt.json", 'utf-8', (err, data) => {

        let currYear = dayArr[0].date.getYear();
        let currWeek = dayArr[0].date.getWeek();

        var db = JSON.parse(data);

        let yearExists = false;
        db.years.forEach(element => {
            if (element.year == currYear) {

            }

        });


    });
}