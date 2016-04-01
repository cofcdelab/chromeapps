/*webview.executeScript({
    code: 'document.documentElement.innerHTML'
  },
  function(results) {
    // results[0] would have the webview's innerHTML.
  });
  */

function onload() {
  var webView = document.getElementById("salesWin");
  var text = document.getElementById("text");

  webview.addEventListener("loadstart", function() {
    text.innerText = "loading...";
  });

  webview.addEventListener("loadstop", function() {
      text.innerText = "";
      
  

/*      function execScripts(webView) {
        console.log("execScripts");
        // execute script
        webView.executeScript({
          code: "window.addEventListener('click', function(event){" + "  console.log('Button Clicked');" + "  if(event.data.command == 'getTitle'){" + "    console.log('Sending title...');" + "    event.source.postMessage({ title: document.title }, event.origin);" + "  }" + "});"
        });
      }

      webView.addEventListener('contentload', function() {
        execScripts(webView);
        // postMessage to webview
        console.log("Requesting title...");
        webView.contentWindow.postMessage({
          command: 'getTitle'
        }, '*');
      });
    }

    // onMessage from webview
    window.addEventListener('message', function(event) {
      console.log("Received title:", event.data.title);
    });*/
  });
  webview.addEventListener("loadredirect", function(event) {
    console.log("event.data.newUrl");
  });
}


/*var code = "script = document.createElement('script'); 
script.text=\"var n=document.createElement('span');
n.style.display='none';
n.id='my-id';
n.innerHTML=window.globalVar;
document.body.appendChild(n)\"; 
document.head.appendChild(script);
document.getElementById('my-id').innerHTML";

webview.executeScript(
    {code: code},
    function(results) {
      console.log(results[0]);
    });
    */
