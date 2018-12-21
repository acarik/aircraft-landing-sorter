const aircraftData = require('./aircraft-data.json');
const utils = require('./utils.js');

const routes = [];
// push each aircraft into the array
aircraftData.forEach(element => {
    routes.push(new utils.route(element));
});

// let's try
let minCost = Number.MAX_SAFE_INTEGER;
let currCost = 0;
let minRoutes = [];
let currRoutes = [];
let breakFlag = true;
let ctr = 0;
while (true){
    
    currRoutes = [];
    routes.forEach(element => {
        currRoutes.push(element.penalty());
    })
    currCost = 0;
    routes.forEach(element => {
        currCost += element.penalty();
    })

    /*
    console.log("Total cost " + currCost + " for");
    console.log(currRoutes);
    */

    if (currCost < minCost)
    {
        minCost = currCost;
        minRoutes = [];
        routes.forEach(element => {
            minRoutes.push(element.currentRouteInd);
        })
            
        console.log("Total cost " + minCost + " for");
        console.log(minRoutes);
    }

    /*
    if (ctr++%1000000 == 0)
        console.log(ctr/Math.pow(routes[0].routeInfo.length,routes.length));
        */
       
    breakFlag = true;
    for (let i = routes.length-1; i>=0; i--)
    {
        if (routes[i].nextRoute()){            
            continue;
        }else{
            breakFlag = false;
            break;
        }
    }
    if (breakFlag){
        break;
    }
}



return console.log("end");





routes.forEach(element => {
    console.log("Earliest landing time for " + element.aircraftData['Aircraft name'] + " is " + element.routeInfo[0].time.toString());
    console.log(element.time());
    console.log(element.penalty());
    console.log(" ");
    
});

console.log("deneme");
console.log(routes[0].time());
console.log(routes[0].penalty());
console.log(routes[0].nextRoute());
console.log(routes[0].time());
console.log(routes[0].penalty());
routes[0]




