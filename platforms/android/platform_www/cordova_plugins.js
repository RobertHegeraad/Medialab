cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.jshybugger.cordova/www/jsHybuggerLoader.js",
        "id": "org.jshybugger.cordova.jsHybuggerLoader",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
        "id": "cordova-plugin-geolocation.geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
        "id": "cordova-plugin-geolocation.PositionError",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "org.jshybugger.cordova": "4.5.9",
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-geolocation": "2.2.0"
};
// BOTTOM OF METADATA
});