var sliding = document.getElementById("sliding");
var item = document.querySelectorAll("a");
function indicator(e) {
  sliding.style.left = e.offsetLeft + "px";
}
item.forEach((link) => {
  link.addEventListener("mouseover", (e) => {
    indicator(e.target);
  });
});
mapboxgl.accessToken =
  "pk.eyJ1Ijoia2FuZWtpcml0bzEyNzciLCJhIjoiY2t1MGphMm4wMHV4eDJvczhzMmp3Z2dwNyJ9.lXjaIHaVdGyfuKN_aXZI_g";
// Create a new map.
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [106.660172, 10.762622],
  zoom: 10,
});
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());
var tinh;
var huyen;
var xa;
fetch("vietnam_tinh.geojson")
  .then((response) => response.json())
  .then((text) => (tinh = text));
fetch("vietnam_huyen.geojson")
  .then((response) => response.json())
  .then((text1) => (huyen = text1));
fetch("vietnam.geojson")
  .then((response) => response.json())
  .then((text1) => (xa = text1));
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  })
    .setHTML(
      `<div id="popup">
                <h3></h3>
                <p class="left">Tổng ca dương tính:</p>
                <p class="right" id="cases">${16}</p>
                <p class="left">Ca dương tính trong ngày:</p>
                <p class="right" id="casesToday">${16}</p>
                <p class="left">Tỷ lệ vùng xanh:</p>
                <p class="right">${16}</p>
                <p class="left">Tử vong:</p>
                <p class="right" id="casesDeath">${16}</p>
                </div>
                `
    );
function addDataLayer(){
    map.addSource("states", {
        type: "geojson",
        data: tinh,
      });
    
      //Add a layer showing the state polygons.
      map.addLayer({
        id: "states-layer",
        type: "fill",
        source: "states",
        paint: {
          "fill-color": "rgba(200, 100, 240, 0.4)",
          "fill-outline-color": "red",
        },
      });
      map.addLayer({
        id: "states-layer-hover1",
        type: "fill",
        source: "states",
        paint: {
          "fill-color": "rgba(200, 100, 240, 0.6)",
        },
        filter: ["==", "NAME_1", ""],
      });
      map.addLayer({
        id: "states-layer-hover",
        type: "line",
        source: "states",
        paint: {
          "line-color": "white",
          "line-width": 2,
        },
        filter: ["==", "NAME_1", ""],
      });
}
function loadmap(trangthai){
    map.on(trangthai, () => {
    // Add a source for the state polygons.
    addDataLayer();
    var click = 0;
    // When a click event occurs on a feature in the states layer,
    // open a popup at the location of the click, with description
    // HTML from the click event's properties.
    
      //.addTo(map);
    let currentPositon;
    let lastPositon = "";
    let currentPositon1;
    let currentPositon2;
    map.on("mousemove", "states-layer", (e) => {
      currentPositon = e.features[0].properties.NAME_1;
      currentPositon1 = e.features[0].properties.NAME_2;
      currentPositon2 = e.features[0].properties.NAME_3;
      if (click == 0) {
        if (currentPositon != lastPositon) {
          fetch(
            `https://provinces.open-api.vn/api/p/search/?q=${e.features[0].properties.NAME_1}`
          )
            .then((response) => response.json())
            .then((text) => {
              document.querySelector("#popup h3").innerHTML = text[0].name;
            });
          let tenTinh = e.features[0].properties.NAME_1;
          fetch("https://static.pipezero.com/covid/data.json")
            .then((response) => response.json())
            .then((text) => {
              for (let i = 0; i < 63; i++) {
                let name = text.locations[i].name;
                if (name.includes(tenTinh)) {
                  document.querySelector("#cases").innerHTML =
                    text.locations[i].cases;
                  document.querySelector("#casesToday").innerHTML =
                    text.locations[i].casesToday;
                  document.querySelector("#casesDeath").innerHTML =
                    text.locations[i].death;
                  break;
                }
              }
            });
        }
        lastPositon = currentPositon;
        popup.setLngLat(e.lngLat);
        if (popup != null) popup.addTo(map);
  
        map.setFilter("states-layer-hover", [
          "==",
          "NAME_1",
          e.features[0].properties.NAME_1,
        ]);
        map.setFilter("states-layer-hover1", [
          "==",
          "NAME_1",
          e.features[0].properties.NAME_1,
        ]);
      }
      if (click == 1) {
        if (currentPositon1 != lastPositon) {
          fetch(
            `https://provinces.open-api.vn/api/d/search/?q=${e.features[0].properties.NAME_2}`
          )
            .then((response) => response.json())
            .then((text) => {
              document.querySelector("#popup h3").innerHTML = text[0].name;
            });
        }
        lastPositon = currentPositon1;
        popup.setLngLat(e.lngLat);
        if (popup != null) popup.addTo(map);
        map.setFilter("states-layer-hover", [
          "all",
          ["==", "NAME_1", e.features[0].properties.NAME_1],
          ["==", "NAME_2", e.features[0].properties.NAME_2],
        ]);
        map.setFilter("states-layer-hover1", [
          "all",
          ["==", "NAME_1", e.features[0].properties.NAME_1],
          ["==", "NAME_2", e.features[0].properties.NAME_2],
        ]);
      }
      if (click == 2) {
        if (currentPositon2 != lastPositon) {
          fetch(
            `https://provinces.open-api.vn/api/w/search/?q=${e.features[0].properties.NAME_3}`
          )
            .then((response) => response.json())
            .then((text) => {
              document.querySelector("#popup h3").innerHTML = text[0].name;
            });
        }
        lastPositon = currentPositon2;
        popup.setLngLat(e.lngLat);
        if (popup != null) popup.addTo(map);
        map.setFilter("states-layer-hover", [
          "all",
          ["==", "NAME_2", e.features[0].properties.NAME_2],
          ["==", "NAME_3", e.features[0].properties.NAME_3],
        ]);
        map.setFilter("states-layer-hover1", [
          "all",
          ["==", "NAME_2", e.features[0].properties.NAME_2],
          ["==", "NAME_3", e.features[0].properties.NAME_3],
        ]);
      }
    });
    map.on("click", "states-layer", (e) => {
      if (click == 0) {
        map.getSource("states").setData(huyen);
        map.setFilter("states-layer", [
          "==",
          "NAME_1",
          e.features[0].properties.NAME_1,
        ]);
        map.flyTo({
          center: e.lngLat,
          zoom: 8.9,
        });
      }
      if (click == 1) {
        map.getSource("states").setData(xa);
        map.setFilter("states-layer", [
          "all",
          ["==", "NAME_1", e.features[0].properties.NAME_1],
          ["==", "NAME_2", e.features[0].properties.NAME_2],
        ]);
        map.flyTo({
          center: e.lngLat,
          zoom: 10,
        });
      }
      if (click == 2) {
        map.flyTo({
          center: e.lngLat,
          zoom: 11.9,
        });
      }
      if (click < 2) click = click + 1;
    });
    // Change the cursor to a pointer when
    // the mouse is over the states layer.
    map.on("mouseenter", "states-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });
  
    // Change the cursor back to a pointer
    // when it leaves the states layer.
    map.on("mouseleave", "states-layer", () => {
      map.getCanvas().style.cursor = "";
      if (popup != null) popup.remove();
      if (click == 0) {
        map.setFilter("states-layer-hover", ["==", "NAME_1", ""]);
        map.setFilter("states-layer-hover1", ["==", "NAME_1", ""]);
      }
      if (click == 1) {
        map.setFilter("states-layer-hover", ["==", "NAME_2", ""]);
        map.setFilter("states-layer-hover1", ["==", "NAME_2", ""]);
      }
      if (click == 2) {
        map.setFilter("states-layer-hover", ["==", "NAME_3", ""]);
        map.setFilter("states-layer-hover1", ["==", "NAME_3", ""]);
      }
    });
  });
}
loadmap("load");
const layers = document.querySelectorAll('.img');
var lastClick;
var currentClick;
var lastClick_p;
var currentClick_p;
layers.forEach(el=>el.addEventListener('click',event=>{
    if (event.target.tagName!="P"){
        var p =document.querySelector(`#${event.target.id} + p`);

        if (lastClick_p!=undefined)
        {
            lastClick_p.style.color="black";
            lastClick_p.style.fontWeight="none";
    }
    currentClick_p=p;

    p.style.color="blue";
    p.style.fontWeight="bold";
    if (lastClick!=undefined)
        lastClick.style.border="none";
    currentClick=event.target;
    currentClick.style.border="3px solid blue";
    lastClick=currentClick;
    lastClick_p=currentClick_p;
    const layerId = event.target.id;
    map.setStyle("mapbox://styles/mapbox/" + layerId);
    loadmap('styledata');
}
}));
    
