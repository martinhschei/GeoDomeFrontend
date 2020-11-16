<template>
  <div v-cloak class="start-page">
    <div v-if="!hasUserCoordinates && askingForPermission && !fetchingPosition">
      <div class="mt-4 alert alert-success text-center">
        Allow me to fetch your coordinates to use this app.
      </div>
    </div>
    <div v-if="hasUserCoordinates">
      <div id="map" class="mt-4 mx-auto shadow-lg rounded"></div>
      <div class="text-center mt-4 current-coordinates">
        <small class="text-muted">
          {{ userCoordinates.lat }} /
          {{ userCoordinates.lng }}
        </small>
      </div>
      <hr />
      <DomeList
        :domes="domes"
        @domeSelected="onDomeSelected"
        v-if="domes.length > 0"
      />
      <div class="text-right mt-2">
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
import DomeList from "./DomeList";

export default {
  components: {
    DomeList,
  },

  data() {
    return {
      marker: null,
      fetching: false,
      markersLayer: null,
      userHasDeclined: false,
      fetchingPosition: true,
      askingForPermission: true,
    };
  },

  mounted() {
    this.fetchPosition(this.onPositionFetched);
  },

  computed: {
    domes() {
      return this.$store.getters.domes;
    },

    hasUserCoordinates() {
      return this.$store.getters.userCoordinates != null;
    },

    userCoordinates() {
      if (this.hasUserCoordinates) {
        return {
          lat: this.$store.getters.userCoordinates.latitude,
          lng: this.$store.getters.userCoordinates.longitude,
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
      this.marker = L.marker([coords.lat, coords.lng]).addTo(this.markersLayer);
      this.updateMapPosition(
        {
          lat: coords.lat,
          lng: coords.lng,
        },
        zoom
      );
    },

    fetchDomesNearBy({ lat, lng }) {
      fetch(`/api/domes/near-me?latitude=${lat}&longitude=${lng}`)
        .then(async (response) => {
          this.$store.commit("domes", await response.json());
          this.addDomesToMap();
        })
        .catch(() => {
          this.$swal(
            "Ops!",
            "Something prevents me from fetching domes near you. Try to refresh the page.",
            "warning"
          );
        });
    },

    onPositionFetched(position) {
      this.$store.commit("setUserCoordinates", position.coords);
      setTimeout(() => {
        this.loadMap("map");
        this.addMarker(this.userCoordinates, 17);
        this.fetchDomesNearBy(this.userCoordinates);
      }, 500);
    },

    addDomesToMap() {
      this.$store.getters.domes.forEach((dome) => {
        L.circle([dome.latitude, dome.longitude], {
          stroke: false,
          color: dome.color,
          radius: dome.radius,
        })
          .addTo(this.map)
          .on("click", () => {
            this.onDomeSelected(dome);
          });
      });
    },

    onDomeSelected(dome) {
      console.log(dome);
    },

    fetchPosition(callback) {
      this.fetchingPosition = false;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.fetchingPosition = false;
          this.askingForPermission = false;
          callback(position);
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
  height: 300px;
}
</style>