class Scenario{
    constructor(){
        this.aircrafts = [];
    }
    addAircraft(aircraft){
        this.aircrafts.push(aircraft);
    }
    length(){
        return this.aircrafts.length;
    }
    disp(){
        if (this.length() == 0)
            return;
        // header row
        this.aircrafts[0].dispFields();
        // rest of the aircrafts
        this.aircrafts.forEach(ac => {
            ac.disp();
        });
        console.log("________________________");
    }

    find(startInd){
        // assign the minimum cost aircraft starting from startInd
        if (startInd == this.length())
            return(false); // could not assign
        if (startInd == -1){
            // could not find solution
            return false;
        }
        if (startInd < 0 || startInd > this.length())
            console.error("Invalid start index.");
        for (let i = startInd; i<this.length(); i++){
            if (this.aircrafts[i].isLastRouteAssigned()){
                // then assignment is not possible
                // decrease startInd and try next one
                return(this.find(startInd-1));
            }
            else{
                this.aircrafts[i].assignNext();
                this.disp();
            }
            
            // check for the constraints
            if (this.check()){
                if (i == this.length()-1){
                    // if the last one
                    return(true);
                }else{
                    return(this.find(startInd+1));
                }
            }else{
                // try assigning the next one
                return(this.find(i));
            }
        }
        return(true);
    }
    check(){
        // true if scenario does not violate constraints
        // 1. all aircrafts that are assigned a route must 
        // land in [earliest time, latest time]
        let currLandingTime;
        for(let i = 0; i<this.length(); i++){
            if(this.aircrafts[i].isAssigned()){
                currLandingTime = this.aircrafts[i].getAssignedLandingTime();
                if ((currLandingTime.isBefore(this.aircrafts[i].latestTime)) && (currLandingTime.isAfter(this.aircrafts[i].earliestTime))){
                    // ok. no problem.
                }else{
                    return false;
                }

            }
        }

        // 2. consecutive aircraft separation
        //let currLandingTime;
        let nextLandingTime;
        let currType;
        let nextType;
        let delta;
        for(let i = 0; i<this.length()-1; i++){
            if(this.aircrafts[i].isAssigned() && this.aircrafts[i+1].isAssigned()){
                currLandingTime = this.aircrafts[i].getAssignedLandingTime();
                nextLandingTime = this.aircrafts[i+1].getAssignedLandingTime();
                delta = nextLandingTime - currLandingTime;
                currType = this.aircrafts[i].type;
                nextType = this.aircrafts[i+1].type;
                if (delta>=getRequiredSeparation(currType, nextType)){
                    // ok. no problem.
                }else{
                    return false;
                }

            }
        }
        
        return true;

        function getRequiredSeparation(prev,next){
            return 0;
        }
    }
}

module.exports = Scenario;