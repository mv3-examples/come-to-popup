document.getElementById('read-content').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        //console.log("inside click listener query activeTab", tab);
        //var resultStr = "testing - inside click listener query activeTab";
        //document.getElementById("result").innerText = resultStr;
        
        function printTitle() {
            //console.log("inside printTitle func");
            const title = document.title;
            var resultStr = "doc title: " + document.title;
            console.log(resultStr);
            
            // https://developer.chrome.com/docs/extensions/mv3/messaging/
            (async () => {
                const response = await chrome.runtime.sendMessage({info: resultStr});
                // do something with response here, not outside the function
                console.log(response);
            })();
            
            //return resultStr;
        };

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: printTitle,
            //        files: ['contentScript.js'],  // To call external file instead
        }).then(() => console.log('Injected a function!'));
    });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script: " + sender.tab.url :
                "from the extension");
    var resp = request.info;
    if (resp) {
        document.getElementById("result").innerText = resp;
        sendResponse({farewell: "thanks for sending! goodbye"});
    }
  }
);
