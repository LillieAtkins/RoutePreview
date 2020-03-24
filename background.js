var currentTab;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // In order to only display the video previewer on matched websites
  //We must query for the tab and show it through the pageAction function
  if (request == 'showPageAction') {
    chrome.tabs.query(
      {currentWindow: true, active: true},
      function(tabArray) {
        if (tabArray && tabArray[0])
        chrome.pageAction.show(tabArray[0].id);
      }
    );
  }
});
