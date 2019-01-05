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
        /*
        let i = startInd;
        while (true){
            if (this.aircrafts[i].isLastRouteAssigned()){
                // then assignment is not possible
                // decrease startInd and try next one
                return(this.find(startInd-1));
            }
            else{
                this.aircrafts[i].assignNext();
                this.disp();
            }
            
            if (this.check()) // check for the constraints
                return(this.find(startInd+1));
        });
        }
        */
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

        // dummy
        // false if all zero
        var ret = false;
        var sum = 0;
        this.aircrafts.forEach(element => {
            sum += element.assignedRoute;
        });
        sum -= this.aircrafts[this.aircrafts.length-1].assignedRoute;
        console.log(sum);
        
        if (sum == 0)
            return false;
        else
            return true;
    }
}

module.exports = Scenario;