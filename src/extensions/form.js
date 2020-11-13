import axios from 'axios';

export class Form {

	constructor(fields) {
		this.busy = false;
		this.errors = null;
		this.fields = fields;
	}

	hasError(field) {
		if (this.hasErrors) {
			return field in this.errors.validationErrors;
		}
	}

	getError(field) {
		if (this.hasErrors) {
			return this.errors.validationErrors[field].join(",");
		}
	}

	clearError(field) {
		if (this.hasErrors) {
			delete this.errors.validationErrors[field];
		}
	}

	get hasErrors() {
		return this.errors != null;
	}

	json(url) {
		this.busy = true;

		return new Promise((resolve, reject) => {
			return axios.post(url, this.fields)
				.then((result) => {
					resolve(result.data);
				})
				.catch((errors) => {
					reject(errors);
				});
		})
			.then((result) => {
				return {
					data: result,
					success: true,
				}
			})
			.catch((error) => {
				this.errors = new Error(error.response);
				return {
					success: false,
				}
			})
			.finally(() => {
				this.busy = false;
			});
	}

	get(url) {
		this.busy = true;

		return axios.get(url).catch((errors) => {
			this.errors = new Error(errors.response);
		}).finally(() => {
			this.busy = false;
		});
	}
}

export class Error {
	constructor({ status, data }) {
		this.status = status;
		this.validationErrors = data.errors;
	}

	get isUserSide() {
		return this.status === 400 || this.status === 422;
	}

	get isServerSide() {
		return this.status === 500;
	}

	failedValidations() {
		return this.errors.errors;
	}
}