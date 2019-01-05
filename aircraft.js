utils = require('./utils.js')
var moment = require('moment');

var fieldsToDisplay = [
    "number",
    "entry",
    "apperanceTime",
    "type",
    "assignedRoute"
];

class Aircraft{
    
    constructor(scenarioDataLine){
        var fields = scenarioDataLine.split(';');
        
        this.number           = parseInt(fields[0]);
        this.entry            = fields[1];
        this.type             = fields[2];
        this.apperanceTime    = utils.parseTimeStr(fields[3]);
        this.earliestTime     = utils.parseTimeStr(fields[4]);
        this.targetTime       = utils.parseTimeStr(fields[5]);
        this.latestTime       = utils.parseTimeStr(fields[6]);
        this.actualTime       = utils.parseTimeStr(fields[7]);
        this.earlyPenalty     = parseInt(fields[8]);
        this.latePenalty      = parseInt(fields[9]);
        this.possibleLandingTimes 
            = getPossibleLandingTimes(this.apperanceTime);
        // this indicates the ind in the array sortedPossibleLandingTimeIndx
        this.assignedRoute    = -1;

        // calculate deltaTimes and costs for each possible landing time
        this.deltaTimes       = [];
        this.possibleLandingTimeCosts = [];
        var currDeltaTime;
        var currCost;
        this.possibleLandingTimes.forEach(element => {
            currDeltaTime = this.targetTime.diff(element.time,'seconds');
            this.deltaTimes.push(currDeltaTime);
            currCost = ((currDeltaTime < 0) ? -this.earlyPenalty : this.latePenalty);
            currCost *= currDeltaTime;
            this.possibleLandingTimeCosts.push(currCost);
        });

        // sort possible landings with respect to the landing costs
        this.sortedPossibleLandingTimeIndx = [];
        this.sort();
    }

    sort(){
        this.sortedPossibleLandingTimeIndx = 
            sortWithIndeces(this.possibleLandingTimeCosts);

            function sortWithIndeces(toSort){
                for (let i = 0; i < toSort.length; i++) {
                    toSort[i] = [toSort[i], i];
                }
                toSort.sort(function(left, right) {
                    if (left[0] == right[0])
                        return 0;
                    return left[0] < right[0] ? 1 : -1;
                });
                toSort.sortIndices = [];
                for (var j = 0; j < toSort.length; j++) {
                    toSort.sortIndices.push(toSort[j][1]);
                    toSort[j] = toSort[j][0];
                }
                return toSort.sortIndices;
            }
    }

    disp(){
        let str = [];
        fieldsToDisplay.forEach(element => {
            str += this[element].toString() + " / "
        });

        console.log(str);

        // now possible landing times, sorted
        this.sortedPossibleLandingTimeIndx.forEach(ind => {
            str = [];
            if (this.assignedRoute == ind){
                str += "->";
            }else{
                str += "  ";
            }
            str += 
                "Route#" + ind.toString() + " | " + 
                this.possibleLandingTimes[ind].route.toString() + " | " +
                this.possibleLandingTimes[ind].time.toString() + " | " +
                this.possibleLandingTimeCosts[ind].toString() + " | ";
            console.log(str);
        })
        console.log(" ");
        
    }
    dispFields(){
        var str = [];
        fieldsToDisplay.forEach(element => {
            str += element + " / ";
        });

        console.log(str);
    }
}
function getPossibleLandingTimes(apperanceTime){
    // TODO: aslinda appearanceTime ile ilkleyip sureleri bunun uzerine eklemeli
    // boyle de yazabiliriz var person = {firstName:"John", lastName:"Doe", age:46}; 
    var landingTimes =  [
        {
            time:new moment({minute:6, second:5}),
            route:"TIP1+WP1"
        },
        {
            time:new moment({minute:7, second:5}),
            route:"TIP1+WP2"
        },
        {
            time:new moment({minute:8, second:5}),
            route:"TIP1+WP3"
        },
        {
            time:new moment({minute:9, second:5}),
            route:"TIP1+WP4"
        },
        {
            time:new moment({minute:10, second:5}),
            route:"TIP1+WP5"
        },
        {
            time:new moment({minute:11, second:5}),
            route:"TIP1+WP6"
        },
        
        {
            time:new moment({minute:7, second:29}),
            route:"TIP2+WP1"
        },
        {
            time:new moment({minute:8, second:29}),
            route:"TIP2+WP2"
        },
        {
            time:new moment({minute:9, second:29}),
            route:"TIP2+WP3"
        },
        {
            time:new moment({minute:10, second:29}),
            route:"TIP2+WP4"
        },
        {
            time:new moment({minute:11, second:29}),
            route:"TIP2+WP5"
        },
        {
            time:new moment({minute:12, second:29}),
            route:"TIP2+WP6"
        },
    ]

    for(let i = 0; i<landingTimes.length; i++)
    {
        landingTimes[i].time = landingTimes[i].time.add(apperanceTime);
    }
    return landingTimes;
}

module.exports = Aircraft;