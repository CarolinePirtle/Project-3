import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
const leaps = [46828800, 78364801, 109900802, 173059203, 252028804, 315187205, 346723206, 393984007, 425520008, 457056009, 504489610, 
                551750411, 599184012, 820108813, 914803214, 1025136015, 1119744016, 1167264017]

/**
 * checks if a gps time is a time that a leap second occurs
 * @function isLeap 
 * @param {Number} gps_time gps time to check
 * @return {Boolean} isLeap whether time is leap time or not 
 */
function isLeap(gps_time){
    let isLeap = false
    for (let i = 0; i < leaps.length; i++) {
       if (gps_time == leaps[i]) {
          isLeap = true
       }
    }
    return isLeap
}

/**
 * counts number of leap seconds before the given gps time
 * @function countleaps 
 * @param {Number} gps_time gps time to check
 * @param {String} dirFlag whether converting from unix to gps or gps to unix
 * @return {Number} number of leaps before the time
 */
function countleaps(gps_time, dirFlag){
    let nleaps = 0 // number of leap seconds prior to gpsTime
    for (i = 0; i < leaps.length; i++) {
        if (dirFlag === 'unix2gps') {
          if (gps_time >= leaps[i] - i) {
             nleaps++
          }
       } 
       else if (dirFlag === 'gps2unix') {
          if (gps_time >= leaps[i]) {
             nleaps++
          }
       } 
    }
    return nleaps
 }

 /**
 * coverts from gps time to unix time
 * @function gps2unix
 * @param {Number} gps_time gps time to convert
 * @return {Number} converted unix time
 */
function gps2unix(gps_time){
    let unix_time = gps_time + 315964800
    let nleaps = countleaps(gps_time, 'gps2unix')
    unix_time = unix_time - nleaps
    if (isLeap(gps_time)) {
       unix_time = unix_time + 0.5
    }
    return unix_time
}

 /**
 * coverts from unix time to gps time
 * @function unix2gps
 * @param {Number} unix_time unix time to convert
 * @return {Number} converted gps time
 */
function unix2gps(unix_time){
    // Add offset in seconds
    if (unix_time % 1 != 0) {
       unix_time = unix_time - 0.5
       var isLeap = 1
    } else {
       var isLeap = 0
    }
    let gps_time = unix_time - 315964800
    let nleaps = countleaps(gps_time, 'unix2gps')
    gps_time = gps_time + nleaps + isLeap
    return gps_time
}

 /**
 * coverts from gps time to UTC time
 * @function gps2UTC
 * @param {String} gps_time gps time to convert
 * @return {String} converted, formatted UTC time
 */
 function gps2UTC(gps_time){
   gps_time = parseInt(gps_time)
    var unix_time = gps2unix(gps_time)
    var date = new Date(unix_time * 1000)
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = date.getUTCFullYear()
    var month = months[date.getUTCMonth()]
    var day = date.getUTCDate()
    var hour = date.getUTCHours()
    var min = date.getUTCMinutes()
    var sec = date.getUTCSeconds()
    var dateFormatted  = day + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return dateFormatted;
}
/**
 * converts from UTC time to gps time
 * @param {String} time time to convert in form XXXX-XX-XX XX:XX:XX
 * @returns {Number} converted gps time
 */
function UTC2gps(date_time){
   var split_date_time = date_time.split(' ')
   if (split_date_time.length > 1){
      let times = split_date_time[1].split(':')
      var hours = parseInt(times[0])
      var minutes = parseInt(times[1])
      var seconds = parseInt(times[2])
   }
   else{
      var hours = 0
      var minutes = 0
      var seconds = 0
   }
   let dates = split_date_time[0].split('-')
   let year = parseInt(dates[0])
   let month = parseInt(dates[1])
   let day = parseInt(dates[2])

   var unix_time = (new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds)).getTime() / 1000)
   return unix2gps(unix_time)
}
//test
console.log(gps2UTC(1262304000))
//console.log(UTC2gps(2020, 1, 5, 23, 59, 42))

function RandomDateGenerator({ onRandomDateChange }) {

   const [randomDate, setRandomDate] = useState('');
 

   var getRandomDate = function () {
     var request = new XMLHttpRequest();
     request.open('GET', 'https://api.lrs.org/random-date-generator?num_dates=1', true);
 
     request.onload = function () {
         var data = JSON.parse(request.responseText);
         const firstKey = Object.keys(data.data)[0];
         const { db } = data.data[firstKey];
         onRandomDateChange(db);
     };
   
     request.send();
   };
 
   return (
      <View style={styles.randomContainer}>
        <Button title="Generate Random Date" onPress={getRandomDate} />
      </View>
    );
  }

export default function ConverterFunc() {
   const [text, setText] = useState('');
   const [result, setResult] = useState('');
 
   const convertToGPS = () => {
     const gpsTime = UTC2gps(text);
     setResult(gpsTime.toString());
   };
 
   return (
     <View style={styles.container}>
       <Text style={styles.header}>GPS Time Converter</Text>
       <Text>Enter Time Below:</Text>
       <TextInput
         style={styles.input}
         placeholder="YYYY-MM-DD HH:mm:ss"
         onChangeText={(newText) => setText(newText)}
         />
         <Button title="Convert" onPress={convertToGPS} />
         {result ? <Text style={styles.result}>Result: {result}</Text> : null}
         <RandomDateGenerator onRandomDateChange={(randomDate) => setText(randomDate)} />
         {text ? (
  <View>
    <Text style={styles.result}>UTC Time: {text}</Text>
    <Text style={styles.result}>GPS Time: {UTC2gps(text)}</Text>
  </View>
) : null}
       </View>
     );
   }
   const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
      },
      header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: 'blue',
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 2,
        marginBottom: 16,
        padding: 8,
        width: '80%',
      },
      result: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: 'bold',
      },
      randomContainer: {
        marginTop: 16,
      },
    });