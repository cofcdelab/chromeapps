var STX = 2;
var ETX = 3;
var ACK = 6;
//var data = String.fromCharCode(2) + "10001^1^10002^1^10007^100^10022^65613" + String.fromCharCode(3) + String.fromCharCode(95);
var gconnectId;
var msg = "";
var outData = "";

blacklistedIds = ["none"];


function onSend() {
  chrome.serial.flush(gconnectId, onFlush);
  console.log("onSend");
//  document.getElementById("response").innerHTML = "Connected";
}

function onFlush() {
  console.log("onFlush");
}
// Convert string to ArrayBuffer
function convertStringToArrayBuffer(str) {
  console.log("enter StringToArray");
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  for (i = 0; i < buf.length; i++) {
    console.log(buf[i]);
  }
  return buf;
}
//LRC string to arrayBuffer
function convertLRCStringToArrayBuffer(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}
// Convert arrayBuffer to string
function convertArrayBufferToString(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
//LRC calculation
function getLRCCharacter(inString) {
  aData = convertLRCStringToArrayBuffer(inString);
  lrc = 0;
  for (i = 0; i < aData.length; i++) {
    lrc = lrc ^ aData[i];
  }
  console.log(lrc);
  return lrc;
}

function dotdotdot(cursor, times, string) {
  return Array(times - Math.abs(cursor % (times * 2) - times) + 1).join(string);
}
var cursor = 0;
    
chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
      if (sender.id in blacklistedIds) {
        sendResponse({"result":"Sorry, could not process your message"});
        return;  // don't allow this extension access
      } else if (request.myCustomMessage) {
        console.log("from "+sender.id+": "+request.myCustomMessage);
//        document.getElementById("text").value = request.myCustomMessage;
        document.getElementById("charge").innerHTML = "Charge Amount: $" + request.myCustomMessage;
          var amount = (parseInt(request.myCustomMessage/*document.getElementById("text").value*/) * 100).toString();
          console.log("amount: " + amount);
          outData = "10001^1^10002^1^10007^" + amount + "^10022^65613" + String.fromCharCode(ETX);
          console.log("outData 1: " + outData);
  outData = String.fromCharCode(STX) + outData + String.fromCharCode(getLRCCharacter(outData));
  console.log("outData 2: " + outData);
  //  window.onload = function() {
  //console.log("onload");
  var onConnect = function(connectionInfo) {
    console.log("onConnect");
    msg = Date() + "<br><b>Connected to device</b><br>";
//    setInterval(function () {
   document.getElementById("connection").innerHTML = msg; //+ dotdotdot(cursor++, 5, '.');
//}, 100);
    gconnectId = connectionInfo.connectionId;
    writeSerial(outData, connectionInfo.connectionId);
  };
  chrome.serial.connect("com1", {
    bitrate: 9600,
    parityBit: "even",
    stopBits: "one",
    dataBits: "seven",
  //  ctsFlowControl: true
  }, onConnect);

        sendResponse({"result":"Message Received by App"});
      } else {
        sendResponse({"result":"App doesn't understand this message"});
      }
    });



    


function writeSerial(str, connectionId) {
  chrome.serial.send(gconnectId, convertStringToArrayBuffer(str), onSend);
  console.log("writeSerial");

}

var stringReceived = '';

function onReceiveCallback(info) {
  console.log("enter onReceiveCallback");
  str = convertArrayBufferToString(info.data);
  i =0;
  while (str.charCodeAt(i) != ETX && i < str.length)
  {
    stringReceived += str.charAt(i);
    i++;
  }

  if (str.charCodeAt(i) == ETX) {
    writeSerial(String.fromCharCode(ACK), gconnectId);
    msgBox(stringReceived);
  }
}

dataHandler = chrome.serial.onReceive.addListener(onReceiveCallback);

function msgBox(inData) {
  var msg = Date() + "<br>";
  inData = inData.substring(0, inData.length - 1);
  resultArray = inData.split("^");
  console.log(resultArray);
  for (i = 0; i < resultArray.length; i++) {
    if (resultArray[i] == String.fromCharCode(ACK) + String.fromCharCode(STX) + "11005") {
      msg += "<b>DECLINED</b><br>";
    } else if (resultArray[i] == String.fromCharCode(ACK) + String.fromCharCode(STX) + "11010") {
      msg += "<b>TRANSACTION CANCELED on device</b><br>";
    } else if ((resultArray[i] == String.fromCharCode(ACK) + String.fromCharCode(STX) + "11001") || (resultArray[i] == String.fromCharCode(ETX) + "+" + String.fromCharCode(STX) + "11001")) {
      msg += "<b>TRANSACTION APPROVED <br> Card Number: " + (resultArray[i + 1]) + "<br>";
    } else if (resultArray[i] == "11002") {
      msg += "Expiration Date: " + (resultArray[i + 1]).slice(-2) + "/" + (resultArray[i + 1]).slice(0, 2) + "<br>";
    } else if (resultArray[i] == "11004") {
      msg = msg + "Authorization Code: " + (resultArray[i + 1]) + "<br>";
    } else if (resultArray[i] == "11009") {
      msg = msg + "Invoice Number: " + (resultArray[i + 1]) + "</b><br>";
    }
  }
  document.getElementById("response").innerHTML = msg;
}

