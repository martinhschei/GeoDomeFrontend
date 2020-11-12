<template>
  <div v-cloak class="start-page">
    <div v-if="!hasUserCoordinates && askingForPermission">
      <div class="mt-4 alert alert-success">
        Allow me to fetch your coordinates to use this app.
      </div>
    </div>
    <div v-if="hasUserCoordinates">
      <div id="map" class="mt-4 mx-auto shadow-lg rounded"></div>
      <div class="text-left mt-4 current-coordinates">
        <small class="text-muted">
          {{ userCoordinates.latitude }} /
          {{ userCoordinates.longitude }}
        </small>
      </div>
      <hr />
      <div class="text-right">
        <router-link to="/create-dome" class="btn btn-success">
          <i class="fas fa-plus-circle"></i> Create new dome at my location
        </router-link>
      </div>
    </div>
    <div
      v-if="!hasUserCoordinates && userHasDeclined"
      class="mt-4 text-center alert alert-warning"
    >
      You can't use this app without your allowing me to fetch the your
      coordinates.
    </div>
  </div>
</template>

<script>
var L = require("leaflet");

export default {
  data() {
    return {
      domes: [],
      marker: null,
      fetching: false,
      markersLayer: null,
      userCoordinates: null,
      userHasDeclined: false,
      fetchingPosition: true,
      askingForPermission: true,
    };
  },

  mounted() {
    this.fetchPosition();

    setTimeout(() => {
      this.loadMap("map");
    }, 500);

    setTimeout(() => {
      this.fetchDomesNearBy();
    }, 500);
  },

  computed: {
    hasUserCoordinates() {
      return this.userCoordinates != null;
    },

    coordinates() {
      if (this.hasUserCoordinates) {
        return {
          lat: this.userCoordinates.latitude,
          lng: this.userCoordinates.longitude,
        };
      }

      return {};
    },
  },

  methods: {
    updateMapPosition(position, zoom) {
      this.map.setView([position.lat, position.lng], zoom);
    },

    addMarker(coords, zoom) {
      this.markersLayer.clearLayers();

      if (coords.lat && coords.lng) {
        this.marker = L.marker([coords.lat, coords.lng]).addTo(
          this.markersLayer
        );
        this.updateMapPosition(
          {
            lat: coords.lat,
            lng: coords.lng,
          },
          zoom
        );
      } else {
        this.marker = L.marker(coords.latlng).addTo(this.markersLayer);
        this.updateMapPosition(
          {
            lat: coords.latlng.lat,
            lng: coords.latlng.lng,
          },
          zoom
        );
      }
    },

    fetchDomesNearBy() {
      fetch(
        `/api/domes/near-me?latitude=${this.userCoordinates.latitude}&longitude=${this.userCoordinates.longitude}`
      ).then(async (response) => {
        this.domes = await response.json();
        this.addMarker(
          {
            lat: this.userCoordinates.latitude,
            lng: this.userCoordinates.longitude,
          },
          16
        );
      });
    },

    fetchPosition() {
      this.fetchingPosition = false;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.fetchingPosition = false;
          this.askingForPermission = false;
          this.userCoordinates = position.coords;
        },
        () => {
          this.userHasDeclined = true;
          this.fetchingPosition = false;
          this.askingForPermission = false;
        },
        {
          timeout: 5000,
          maximumAge: 0,
          enableHighAccuracy: true,
        }
      );
    },

    loadMap(el) {
      if (this.map) {
        this.map.remove();
      }

      this.map = L.map(el).setView([63.430515, 10.395053], 5);

      this.markersLayer = new L.LayerGroup();
      this.markersLayer.addTo(this.map);

      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFydGluaHNjaGVpIiwiYSI6ImNrZThsdG45cjFvNTMyeWw2MzJhbW4wdzYifQ.bIlMboQXxqmLMYWuQigEDA",
        {
          maxZoom: 23,
          tileSize: 512,
          zoomOffset: -1,
          id: "mapbox/streets-v11",
          accessToken:
            "pk.eyJ1IjoibWFydGluaHNjaGVpIiwiYSI6ImNrZThsdG45cjFvNTMyeWw2MzJhbW4wdzYifQ.bIlMboQXxqmLMYWuQigEDA",
        }
      ).addTo(this.map);
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 350px;
}
</style>