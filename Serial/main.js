/*function myFunction() {
    document.getElementById("demo").innerHTML = "Hello World";
}
*/
var data = String.fromCharCode(2) + "10001^1^10002^1^10007^100^10022^65613" + String.fromCharCode(3) + String.fromCharCode(95);
var gconnectId;
var onConnect = function(connectionInfo) {

   // The serial port has been opened. Save its id to use later.
   gconnectId = connectionInfo.connectionId;//
  writeSerial(data,connectionInfo.connectionId);
   //Do whatever you need to do with the opened port.
};


var onSend = function() {
  chrome.serial.flush(gconnectId, onFlush);

  console.log(6);
};
var onFlush = function() {
  console.log(7);
};

console.log(1);
// Connect to the serial port /dev/ttyS01

//document.getElementById("clickBtn").addEventListener("click", popup);
window.onload = function(){
console.log(2);


document.getElementById("clickBtn").onclick = function() {
  // chrome.serial.connect("com9", {bitrate: 9600, parityBit: "even", stopBits: "one", dataBits: "seven", ctsFlowControl: true}, onConnect);
  chrome.serial.connect("com9", {bitrate: 9600, parityBit: "even", stopBits: "one", dataBits: "seven"}, onConnect);

};
};
console.log(3);

var writeSerial=function(str,connectionId) {
  var convertedString = convertStringToArrayBuffer(str);
  //convertedLength = convertedString.length;
  //console.log(convertedLength);
  chrome.serial.send(gconnectId, convertStringToArrayBuffer(str), onSend);
};
console.log(4);
// Convert string to ArrayBuffer
var convertStringToArrayBuffer=function(str) {
  var buf=new ArrayBuffer(str.length);
  var bufView=new Uint8Array(buf);
  for (var i=0; i<str.length; i++) {
    bufView[i]=str.charCodeAt(i);
  }
  console.log(5);
  return buf;
};
