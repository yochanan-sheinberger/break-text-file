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
  let hours = i < 10 ? '0' + i : i;
  for (let x = 0; x < 60; x += 15) {
    let mins = x === 0 ? '00' : x;
    timePeriodsArr.push({
      timePeriod: `${hours}:${mins}`,
      fileCountAvg: 0,
    })
  }
}

// get array length
let arrLng = timePeriodsArr.length - 1;

// for each time period get start and end time in miliseconds
timePeriodsArr.forEach((timeObj, i) => {
  let startMs = getMiliseconds(timeObj.timePeriod)
  let endMs = i + 1 < arrLng ? getMiliseconds(timePeriodsArr[i + 1].timePeriod) : 86400000;
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


