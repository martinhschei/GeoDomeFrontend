export default {
	methods: {
		saveContent(payload) {
			this.$emit('contentReady', {
				name: payload.name,
				content: payload.content,
			});
		}
	}
}