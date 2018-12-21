const airfieldInfo = require('./airfield-info.json');

class route{
    constructor(currAircraftData){
        this.aircraftData = currAircraftData;
        this.entryPoint = currAircraftData['Entry point'];

        this.corridorInfo = [];
        for (let i = 0; i<airfieldInfo.length; i++){
            if (airfieldInfo[i]['Entry point'] == this.entryPoint){
                this.corridorInfo = airfieldInfo[i];
            }
        }

        this.routeInfo = [];

        let entry2wp1;
        let wpleg;
        let wp2faf;
        let appearance;
        for (let i = 0; i<this.corridorInfo.Route['Number of TPs']; i++){
            for (let j = 0; j<this.corridorInfo.Route['Number of WPs']; j++){
                entry2wp1 = this.corridorInfo.Route['Entry to WP1 times'][i];
                wpleg = this.corridorInfo.Route['WP leg time'] * j;
                wp2faf = this.corridorInfo.Route['WP to FAF time'];
                appearance = this.aircraftData['Appearance time'];
                this.routeInfo.push({
                    "TP" : i,
                    "WP" : j,
                    "time" : 
                    (entry2wp1
                     + wpleg
                     + wp2faf
                     + appearance)
                });
            }
        }
        
        // sort according to times
        this.routeInfo.sort(function(a, b){
            if (a.time > b.time) return 1;
            if (a.time < b.time) return -1;
            return 0;
        });

        this.currentRouteInd = 0;
    }
}

route.prototype.time = function(){
    const temp = this.routeInfo[this.currentRouteInd].time;
    return temp;
}

route.prototype.penalty = function(){
    const targetTime = this.aircraftData['Target time'];
    const time = this.time();
    /*
    if (time > this.aircraftData['Latest time']){
        return Number.MAX_SAFE_INTEGER;
    }
    */
    const delta = time - targetTime;
    let mult = 1;
    if (delta > 0){
        mult = this.aircraftData['Penalty cost per late landing'];
    }else{
        mult = this.aircraftData['Penalty cost per early landing'];
    }
    return delta * mult;
}

route.prototype.nextRoute = function(){
    // return true when overflow
    this.currentRouteInd++;
    if (this.currentRouteInd == this.routeInfo.length){
        this.currentRouteInd = 0;
        return true;
    }else
    {
        return false;
    }

}

exports.route = route;
