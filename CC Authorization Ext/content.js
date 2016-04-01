chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    
    if (msg.action && (msg.action == "makePayment")) {
        response({amount: document.getElementById("text").value });
        console.log("Amount Sent: $" + document.getElementById("text").value);
//        document.getElementById("responseBox").innerHTML += "Amount Sent: $" + document.getElementById("text").value + "<br>";
    }
    else if (msg.action && (msg.action == "responder")) {
      console.log("Response received");
//      document.getElementById("responseBox").innerHTML += msg.responseRec + "<br>";
    }
    else if (msg.action && (msg.action == "autho")) {
      console.log("Autho received");
//      document.getElementById("responseBox").innerHTML += "Transaction Approved <br>" + msg.authoRec + "<br>"; 
}
});
