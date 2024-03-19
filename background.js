chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.runtime.sendNativeMessage('com.viseodoo.donnemoiup', request, function(response) {
  if (typeof response === 'undefined') {
      console.error('No response from the native application');
      console.error(chrome.runtime.lastError.message);
      sendResponse({erreur:'No response from the native application'});
  } else if (response.error) {
      console.error(response.error);
      sendResponse({erreur:response.error});
  } else {
      sendResponse(response);
    }
  });
  return true;
});