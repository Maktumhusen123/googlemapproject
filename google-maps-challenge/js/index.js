
var map;
var markers = [];
var infoWindow;
var image;
function initMap() {
  var losAngeles = {
    lat: 34.06338,
    lng: -118.35808,
  };
  map = new google.maps.Map(document.getElementById("map"), {
    center: losAngeles,
    zoom: 11,
    mapTypeId: "roadmap",
  });
  infoWindow = new google.maps.InfoWindow();
  searchStores();
  //showStoresMarkers();
  //setOnClickListener();
  //  google.maps.event.trigger(markers[0], 'click');
}

function displayStores(stores) {
  var storesHtml = "";
  for (var [index, store] of stores.entries()) {
    var address = store["addressLines"];
    var phone = store["phoneNumber"];
    storesHtml += `
            <div class="store-container">
              <div class="store-container-background">
                <div class="store-info-container">
                    <div class="store-address">
                        <span>${address[0]}</span>
                        <span>${address[1]}</span>
                    </div>
                    <div class="store-phone-number">${phone}</div>
                </div>
                <div class="store-number-container">
                    <div class="store-number">
                        ${index + 1}
                    </div>
                </div>
              </div>
            </div>
        `;
    document.querySelector(".stores-list").innerHTML = storesHtml;
  }
}

function searchStores() {
  var foundStore = [];
  var zipCode = document.getElementById("zip-code-input").value;
  //console.log(zipCode);
  if (zipCode) {
    for (var [index, store] of stores.entries()) {
      var postalCode = store["address"]["postalCode"].substring(0, 5);
      //console.log(postalCode);
      if (postalCode == zipCode) {
        foundStore.push(store);
      }
    }
  }
  else {
    foundStore = stores;
  }
  clearLocations();
  displayStores(foundStore);
  showStoresMarkers(foundStore);
  setOnClickListener();
  //console.log(foundStore);
}
function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}
function setOnClickListener() {
  var storeElements = document.querySelectorAll('.store-container');
  storeElements.forEach(function (elem, index) {
    elem.addEventListener('click', function () {
      new google.maps.event.trigger(markers[index], 'click');
    })
  })
}

function showStoresMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  for (var [index, store] of stores.entries()) {
    var latlng = new google.maps.LatLng(
      store["coordinates"]["latitude"],
      store["coordinates"]["longitude"]
    );
    var name = store["name"];
    var address = store["addressLines"][0];
    var openStatustext = store["openStatusText"];
    var phoneNumber = store["phoneNumber"];
    bounds.extend(latlng);
    createMarker(latlng, name, address, openStatustext, phoneNumber, index + 1);
  }
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, openStatusText, phoneNumber, index) {
  var html = `
    <div class="store-info-window">
      <div class="store-info-name">
      <b>${name}</b>
      </div>
      <div class="store-info-status">
      ${openStatusText}
      </div>
      <div class="store-info-address">
        <div class="circle">
          <i class="fas fa-location-arrow"></i>
        </div>${address}
      </div>
      <div class="store-info-phone">
        <div class="circle">
          <i class="fas fa-phone"></i>
        </div>
          ${phoneNumber}
      </div>
    </div>
  `;
  image='https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: index.toString(),
    icon:image
  });
  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

