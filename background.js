
var enabled = false;

var proxyConfig = {
  mode: "pac_script",
  pacScript: {
    data: "function FindProxyForURL(url, host) {\n" +
	      "  if(host === 'localhost' || host === '127.0.0.1') return 'DIRECT';" +
          "  return 'HTTPS http.through-proxy.download:3129';\n" +
          "}"
  }
};

var directConfig = {
  mode: "direct"
};

function configureProxy(){
  var config = enabled ? proxyConfig : directConfig;

  chrome.proxy.settings.set({value: config, scope: 'regular'}, function() {
	  chrome.browserAction.setIcon({path: "icon_" + enabled + ".png"});
	  
	  var titleText = enabled ? "Proxy enabled" : "Proxy disabled";
	  chrome.browserAction.setTitle({title: titleText});
  });
}

configureProxy();

chrome.webRequest.onAuthRequired.addListener(
  function setProxyAuth(details) {

    return enabled ? {
        authCredentials: {
            username: 'guest',
            password: 'password'
        }
    } : {}
  },
  {urls: ["http://*/*", "https://*/*"]},
  ["blocking"]);


chrome.browserAction.onClicked.addListener(function switchProxy() {
  enabled = !enabled;
  configureProxy();
});
