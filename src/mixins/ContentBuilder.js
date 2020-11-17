import axios from 'axios';

export default {
	methods: {
		contentReady(payload) {
			this.$emit('contentReady', {
				id: payload.id,
			});
		},

		createDomeContent(payload) {
			axios.post('/api/domecontent', {
				name: payload.name,
				contentId: payload.id,
			}).then((result) => {
				console.log(result);
				this.contentReady({
					id: result.data.id,
				})
			});
		}
	}
}