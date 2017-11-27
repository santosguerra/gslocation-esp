var settings = {
  'latitude': "",
  'longitude': "",
  'location': "",
  'enabled': false
};
chrome.storage.sync.get(settings, function(result) {
  if(result.latitude) settings.latitude = result.latitude;
  if(result.longitude) settings.longitude = result.longitude;
  if(result.location) settings.location = result.location;
  if(result.enabled) settings.enabled = result.enabled;
});

var requestFilter = {urls: ["*://www.google.com/search*","*://www.google.de/search*","*://www.google.ch/search*","*://www.google.at/search*"]}
var onBeforeSendHeadersHandler = function(details) {
  if (!settings.enabled) {
    return {};
  }
  var lat = settings.latitude*1e7 || 525109360;
  var lng = settings.longitude*1e7 || 134104990;
  var decodedXgeo = 'role: CURRENT_LOCATION\nproducer: DEVICE_LOCATION\nradius: 65000\nlatlng <\n  latitude_e7: '+lat+'\n  longitude_e7: '+lng+'\n>';
  var encodedXgeo = 'a '+btoa(decodedXgeo);
  var xgeoHeader = {
    name: "x-geo",
    value: encodedXgeo
  };
  details.requestHeaders.push(xgeoHeader);
  return {requestHeaders: details.requestHeaders};
};

chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeadersHandler, requestFilter, ["blocking", "requestHeaders"]);