




console.log("hello world");


result = getSeparationTime('light','medium');

console.log(result)


function getSeparationTime(front, end)
{
    const separationData = require('./separation-data.json');
    const result = separationData.find(separation =>
        { 
            return (separation.back == "medium" && separation.front == 'light')
        })
    return result['separation time'];
}