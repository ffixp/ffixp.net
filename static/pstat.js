// Definitions for the various status icons
var pstat_icons = {
    online: '<div style="background-color:green;padding-left:3px;padding-right:3px;text-align:center;color:white;"><p style="margin:0;padding:0;font-weight:bolder;">OK</p></div>',
    offline: '<div style="background-color:red;padding-left:3px;padding-right:3px;text-align:center;color:white;"><p style="margin:0;padding:0;font-weight:bolder;">OFFLINE</p></div>',
    connecting: '<div style="background-color:blue;padding-left:3px;padding-right:3px;text-align:center;color:white;"><p style="margin:0;padding:0;font-weight:bolder;">CONNECT</p></div>',
    idle: '<div style="background-color:gray;padding-left:3px;padding-right:3px;text-align:center;color:white;"><p style="margin:0;padding:0;font-weight:bolder;">IDLE</p></div>',
};

function doPstatLogic() {
    console.log("Performing pstat logic");

    // Get the JSON data from connect.ffixp.net/peers.json
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Get the JSON data containing the peer list
            var jsonPeers = JSON.parse(this.responseText);
            console.log("Got peers: ");
            console.log(jsonPeers);

            // Search for all <pstat> elements
            var pstats = document.getElementsByTagName("pstat");
            for (var i = 0; i < pstats.length; i++) {
                // If there is a data:force tag, override the output
                if (pstats[i].getAttribute("data:force") == "1") {
                    pstats[i].innerHTML = pstat_icons.online;
                    continue;
                }

                // Otherwise, we search based on ASN
                var peer_asn = pstats[i].getAttribute("data:as");
                for (var j = 0; j < jsonPeers.length; j++) {
                    if (jsonPeers[j].name == `as${peer_asn}`) {
                        // Found the peer, set the icon
                        if (jsonPeers[j].info == "Established") {
                            pstats[i].innerHTML = pstat_icons.online;
                        } else if (jsonPeers[j].info == null) {
                            pstats[i].innerHTML = pstat_icons.offline;
                        } else if (jsonPeers[j].info == "Connect") {
                            pstats[i].innerHTML = pstat_icons.connecting;
                        } else {
                            pstats[i].innerHTML = pstat_icons.idle;
                        }
                        break;
                    }

                    // If we didn't find the peer, set the icon to offline
                    if (j == jsonPeers.length - 1) {
                        pstats[i].innerHTML = pstat_icons.offline;
                    }
                }

            }

        }
    };
    xmlhttp.open("GET", "https://connect.ffixp.net/peers.json", true);
    xmlhttp.send();

}

document.onload = doPstatLogic();