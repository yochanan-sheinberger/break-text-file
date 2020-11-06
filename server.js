const fs = require('fs'); 

// import text file
let text = fs.readFileSync('./files.txt', 'utf-8'); 
let text2 = fs.readFileSync('./files2.txt', 'utf-8'); 

//split text file to array and remove all Unnecessary characters
let arr = text.match(/(?<=File Count: |Time: |Value: )[\d:.]*/g);

//decler array for file data objects
let fileDataArr = [];

//populate file data array with objects in this form:
// { time: <miliseconds>, fileCount: <number> }
arr.forEach((el, i) => {
  if (i % 2 === 0) {
    fileDataArr.push({
      time: getMiliseconds(el),
      fileCount: +arr[i + 1],
    })
  }
});

// declere array for time periods
let timePeriodsArr = [];

// populate time eriods array with objects for each time period
for (let i = 0; i < 24; i++) {
  for (let x = 15; x <= 60; x += 15) {
    let mins = x % 60 === 0 ? '00' : x;
    let hours = mins === '00' ? i + 1 : i;
    hours = hours < 10 ? '0' + hours : hours;
    timePeriodsArr.push({
      timePeriod: `${hours}:${mins}`,
      fileCountAvg: 0,
    })
  }
}
// console.log(timePeriodsArr);

// get array length
let arrLng = timePeriodsArr.length - 1;

//for each time period get start and end time in miliseconds
timePeriodsArr.forEach((timeObj, i) => {
  let startMs = i > 0 ? getMiliseconds(timePeriodsArr[i - 1].timePeriod) : 0;
  let endMs = getMiliseconds(timeObj.timePeriod);
  let counter = 0;

  // check for each file data object if fits the current time period and calculate the average
  fileDataArr.forEach((fileObj) => {
    if (fileObj.time >= startMs && fileObj.time < endMs) {
      timeObj.fileCountAvg += fileObj.fileCount;
      counter++;
    }
  })
  timeObj.fileCountAvg = timeObj.fileCountAvg / counter;
});

// time to miliseconds function
function getMiliseconds(el) {
  el = el.split(/:|\./g);
  if (el.length === 4) {
    return (+el[0] * 60 * 60 + +el[1] * 60 + +el[2]) * 1000 + +el[3];
  } else {
    return (el[0] * 60 * 60 + el[1] * 60) * 1000;
  }
}

console.log(timePeriodsArr);


