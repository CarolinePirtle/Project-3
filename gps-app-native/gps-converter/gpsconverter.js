import { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button } from 'react-native';
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
 * @param {Number} gps_time gps time to convert
 * @return {String} converted, formatted UTC time
 */
function gps2UTC(gps_time){
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
 * @param {Number} year UTC year
 * @param {Number} month UTC month
 * @param {Number} day UTC day
 * @param {Number} hours UTC hours
 * @param {Number} minutes UTC minutes
 * @param {Number} seconds UTC seconds
 * @returns {Number} converted gps time
 */
export function UTC2gps(year, month, day, hours = 0, minutes = 0, seconds = 0){
    var unix_time = (new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds)).getTime() / 1000)
    console.log(unix_time)
    return unix2gps(unix_time)

}
//test
console.log(gps2UTC(1262304000))
console.log(UTC2gps(2020, 1, 5, 23, 59, 42))


export default function ConverterFunc() {
   const [input, setInput] = useState('');
   const [result, setResult] = useState('');

   const handleTextInputChange = (text) => {
      setInputValue(text);
    };

   return(
       <View style = {styles.container}>
         <Text>Enter Time Below (yyyy-mm-d):</Text>
         <Text>Hours and minutes are optional</Text>
       <TextInput
       style={{
         height: 40,
         borderColor: 'gray',
         borderWidth: 2
       }}
       
       defaultValue="   "
       onChangeText={handleTextInputChange}
      
       
     />
      <Button backgroundColor={'blue'} title='Convert' 
          onPress={() => UTC2gps(2003,12,2)} />
          <Text>Result: {result}</Text>
     </View>

   );
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
     alignItems: 'center',
     justifyContent: 'center',
   },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'blue',
      },
      text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
    });