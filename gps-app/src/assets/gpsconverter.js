const leaps = [46828800, 78364801, 109900802, 173059203, 252028804, 315187205, 346723206, 393984007, 425520008, 457056009, 504489610, 
                551750411, 599184012, 820108813, 914803214, 1025136015, 1119744016, 1167264017]

function isLeap(gps_time){
    let isLeap = false
    for (let i = 0; i < leaps.length; $i++) {
       if (gps_time == leaps[i]) {
          isLeap = true
       }
    }
    return isLeap
}

function countleaps(gps_time, dirFlag){
    let nleaps = 0 // number of leap seconds prior to gpsTime
    for (i = 0; $i < leaps.length; $i++) {
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

function gps2unix(gps_time){
    let unix_time = gps_time + 315964800
    let nleaps = countleaps(gps_time, 'gps2unix')
    unix_time = unix_time - nleaps
    if (isLeap(gps_time)) {
       unix_time = unix_time + 0.5
    }
    return unix_time
}

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

function gps2UTC(gps_time){
    var unix_time = gps2unix(gps_time)
    var date = new Date(unix_time * 1000)
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = date.getFullYear()
    var month = months[date.getMonth()]
    var day = date.getDate()
    var hour = date.getHours()
    var min = date.getMinutes()
    var sec = date.getSeconds()
    var dateFormatted  = day + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return dateFormatted;
}

function UTC2gps(year, month, day, hours = 0, minutes = 0, seconds = 0){
    var date = new Date(year, month, day, hours, minutes, seconds)
    var unix_time = Math.floor(date.getTime() / 1000)
    return unix2gps(unix_time)

}