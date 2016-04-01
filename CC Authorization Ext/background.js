var sendId = "gmabcchojpekiplgonoemhdbklojcjik";
blacklistedIds = ["none"];

function checkForValidURL(tabId, info, tab) {
  //   var idx = tab.url.indexOf("tiger.armstrong.edu");
  //   if (idx > 0) {
  chrome.pageAction.show(tabId);
  //   } else {
  //       chrome.pageAction.hide(tabId);
  //   }
}
chrome.tabs.onUpdated.addListener(checkForValidURL);

function onPageActionClicked(tab) {
  chrome.tabs.sendMessage(tab.id, {
      action: "makePayment"
    },
    function(response) {
      console.log("Value: " + response);
      chrome.runtime.sendMessage(sendId, {
          myCustomMessage: response.amount
        },
        function(response) {
          chrome.tabs.sendMessage(tab.id, {
            action: "responder",
            responseRec: JSON.stringify(response.result)
          })
          console.log("response: " + JSON.stringify(response));
        })
    });
};

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (sender.id in blacklistedIds) {
      sendResponse({
        "result": "sorry, could not process your message"
      });
      return; // don't allow this extension access
    } else if (request.myCustomMessage) {
      console.log("from " + sender.id + ": " + request.myCustomMessage);
      sendResponse({
        "result": "Ok, got your message"
      });
      //send autho info received from app to content.js
      chrome.tabs.sendMessage(tab.id, {
        action: "autho",
        authoRec: JSON.stringify(response.message)
      })
    } else {
      sendResponse({
        "result": "Ops, I don't understand this message"
      });
    }
  });


chrome.pageAction.onClicked.addListener(onPageActionClicked);

//Messaging
/*
(function(context){

  document.getElementById("appid").value=chrome.runtime.id;  
  var logField = document.getElementById("log");
  var sendText=document.getElementById("sendText");
  var sendText=document.getElementById("sendText");
  var sendId=document.getElementById("sendId");
  var send=document.getElementById("send");

  send.addEventListener('click', function() {
    appendLog("sending to "+sendId.value);
    chrome.runtime.sendMessage(
      sendId.value, 
      {myCustomMessage: sendText.value}, 
      function(response) { 
        appendLog("response: "+JSON.stringify(response));
      })
  });


  blacklistedIds = ["none"];

  chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
      if (sender.id in blacklistedIds) {
        sendResponse({"result":"sorry, could not process your message"});
        return;  // don't allow this extension access
      } else if (request.myCustomMessage) {
        appendLog("from "+sender.id+": "+request.myCustomMessage);
        sendResponse({"result":"Ok, got your message"});
      } else {
        sendResponse({"result":"Ops, I don't understand this message"});
      }
    });



  var appendLog = function(message) {
    logField.innerText+="\n"+message;
  }

  context.appendLog = appendLog;

})(window)
*/
