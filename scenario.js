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
    }
}

module.exports = Scenario;