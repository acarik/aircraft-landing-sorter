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
];

class Aircraft{
    
    constructor(scenario, scenarioDataLine){
        var fields = scenarioDataLine.split(';');
        
        this.scenario         = scenario;
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
        this.possibleLandingTimes  = [];
        this.calculatePossibleLandingTimes();
        this.possibleLandingTimeCosts = [];
        this.calculatePossibleLandingTimeCosts();

        // this indicates the ind in the array sortedPossibleLandingTimeIndx
        this.assignedRoute    = -1;
        
        // sort possible landings with respect to the landing costs
        this.sort();
    }

    calculatePossibleLandingTimes(){
        let scenario = this.scenario;
        let currTipNameStr = [];
        let currWpNameStr = [];
        var words = this.entry.split('-');
        for (let iTip = 0; iTip<scenario.numberOfTips; iTip++){
            for (let iWp = 0; iWp<scenario.numberOfWps; iWp++){
                currTipNameStr = ((iTip==0) ? this.entry : words[1]);
                currWpNameStr = words[1];
                this.possibleLandingTimes.push({
                    "tip":currTipNameStr,
                    "wp":iWp.toString() + "-" + currWpNameStr,
                    "time":scenario.getRouteTime(iTip, iWp)+this.apperanceTime
                })
            }
        }
        let dummy = 1;
    }

    calculatePossibleLandingTimeCosts(){
        // calculate deltaTimes and costs for each possible landing time
        var deltaTimes       = [];
        var currDeltaTime;
        var currCost;
        for (let i = 0; i<this.possibleLandingTimes.length; i++){
            currDeltaTime = this.targetTime - this.possibleLandingTimes[i].time;
            deltaTimes.push(currDeltaTime);
            currCost = ((currDeltaTime < 0) ? -this.earlyPenalty : this.latePenalty);
            currCost *= currDeltaTime;
            this.possibleLandingTimeCosts.push(currCost);
        };
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
        console.log("route# / route / cost / time");
        
        for(let i = 0; i<this.length(); i++){
            str = [];
            if (this.getAssignedRoute() == i){
                str += "->";
            }else{
                str += "  ";
            }
            str += 
                "Route#" + i.toString() + " | " + 
                "TIP-"+this.possibleLandingTimes[i].tip.toString() + ", " +
                "WP"+this.possibleLandingTimes[i].wp.toString() + " | " +
                this.possibleLandingTimeCosts[i].toString() + " | " +
                utils.parseToHmsStr(this.possibleLandingTimes[i].time);
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
            return this.possibleLandingTimes[this.assignedRoute].time;
        }
        else{
            return -1;
        }
    }
}

module.exports = Aircraft;