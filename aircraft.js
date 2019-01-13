utils = require('./utils.js')
var moment = require('moment');

var fieldsToDisplay = [
    "number",
    "entry",
    "apperanceTime",
    "type",
    "assignedRoute",
    "earliestTime",
    "latestTime",
    "actualTime"
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
        this.sort();
    }

    length(){
        return this.possibleLandingTimes.length;
    }

    sort(){
        let sortedPossibleLandingTimeIndx = 
            sortWithIndeces(this.possibleLandingTimeCosts);
        // reindex landing times
        let possibleLandingTimeCosts = [];
        let possibleLandingTimes = [];
        sortedPossibleLandingTimeIndx.forEach(ind => {
            possibleLandingTimeCosts.push(this.possibleLandingTimeCosts[ind]);
            possibleLandingTimes.push(this.possibleLandingTimes[ind]);
        });
        this.possibleLandingTimeCosts = possibleLandingTimeCosts;
        this.possibleLandingTimes     = possibleLandingTimes;

            function sortWithIndeces(possibleLandingTimeCosts){
                var toSort = possibleLandingTimeCosts.slice();
                let check = [];
                for (let i = 0; i < toSort.length; i++) {
                    toSort[i] = [toSort[i], i];
                }
                toSort.sort(function(left, right) {
                    if (left[0] == right[0])
                        return 0;
                    return left[0] > right[0] ? 1 : -1;
                });
                toSort.sortIndices = [];
                for (var j = 0; j < toSort.length; j++) {
                    check.push(toSort[j][0])
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
        for(let i = 0; i<this.length(); i++){
            str = [];
            if (this.getAssignedRoute() == i){
                str += "->";
            }else{
                str += "  ";
            }
            str += 
                "Route#" + i.toString() + " | " + 
                this.possibleLandingTimes[i].route.toString() + " | " +
                this.possibleLandingTimes[i].time.toString() + " | " +
                this.possibleLandingTimeCosts[i].toString() + " | ";
            console.log(str);
        }
        console.log(" ");
        
    }
    dispFields(){
        var str = [];
        fieldsToDisplay.forEach(element => {
            str += element + " / ";
        });

        console.log(str);
    }

    assignNext(){
        this.assignedRoute++;
        if (this.assignedRoute >= this.length())
            error("Cannot assign.");
    }

    getAssignedRoute(){
        return this.assignedRoute;
    }
    
    isLastRouteAssigned(){
        return (this.assignedRouteInd == this.length()-1);
    }

    isAssigned(){
        return (this.assignedRoute != -1);
    }

    getAssignedLandingTime(){
        if (this.isAssigned()){
            return this.possibleLandingTimes[this.assignedRoute];
        }
        else{
            return -1;
        }
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