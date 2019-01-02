utils = require('./utils.js')
var moment = require('moment');

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
        this.assignedRoute    = -1;

        // calculate deltaTimes and costs for each possible landing time
        this.deltaTimes       = [];
        this.possibleLandingTimeCosts = [];
        var currDeltaTime;
        var currCost;
        this.possibleLandingTimes.forEach(element => {
            currDeltaTime = this.targetTime.diff(element.time,'seconds');
            this.deltaTimes.push(currDeltaTime);
            currCost = ((currDeltaTime < 0) ? this.earlyPenalty : this.latePenalty);
            currCost *= currDeltaTime;
        });

        // sort possible landings with respect to the landing costs
        this.sortedLandingTimeIndx = [];
        this.sort();
    }

    sort(){
        let a = 1;

    }
}
function getPossibleLandingTimes(apperanceTime){
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