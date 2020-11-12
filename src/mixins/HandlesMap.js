export default {
	data() {
		return {
			map: null,
			marker: null,
			coords: null,
			markersLayer: null,
			fetchingPosition: true,
		}
	},

	methods: {
		updateMapPosition(position, zoom) {
			this.map.setView(
				[position.lat, position.lng],
				zoom,
			);
		},

		addMarker(coords, zoom) {
			this.markersLayer.clearLayers();

			if (coords.lat && coords.lng) {
				this.marker = L.marker([coords.lat, coords.lng]).addTo(this.markersLayer);
				this.updateMapPosition({
					lat: coords.lat,
					lng: coords.lng,
				}, zoom);
			} else {
				this.marker = L.marker(coords.latlng).addTo(this.markersLayer);
				this.updateMapPosition({
					lat: coords.latlng.lat,
					lng: coords.latlng.lng,
				}, zoom);
			}
		},

		fetch() {
			this.fetching = true;

			navigator.geolocation.getCurrentPosition(
				(position) => {
					this.coords = position.coords;
					fetch.get(`/api/by-location?lat=${this.coords.latitude}&lng=${this.coords.longitude}`).then(response => {
						setTimeout(() => {
							this.checkins = response.data;
							this.fetching = false;
							this.fetchingPosition = false;
							setTimeout(() => {
								this.loadMap('map');
								this.addMarker({
									lat: this.coords.latitude,
									lng: this.coords.longitude,
								}, 16);
							}, 500);
						}, 500);
					})
				},
				() => {
					this.canGetPosition = false;
					this.fetchingPosition = false;
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

			this.map = L.map(el).setView(
				[63.430515, 10.395053],
				5,
			);

			this.markersLayer = new L.LayerGroup();
			this.markersLayer.addTo(this.map);

			L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFydGluaHNjaGVpIiwiYSI6ImNrZThsdG45cjFvNTMyeWw2MzJhbW4wdzYifQ.bIlMboQXxqmLMYWuQigEDA', {
				maxZoom: 23,
				tileSize: 512,
				zoomOffset: -1,
				id: 'mapbox/streets-v11',
				accessToken: 'pk.eyJ1IjoibWFydGluaHNjaGVpIiwiYSI6ImNrZThsdG45cjFvNTMyeWw2MzJhbW4wdzYifQ.bIlMboQXxqmLMYWuQigEDA',
			}).addTo(this.map);
		},
	},
}