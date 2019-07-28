 function SharedState({
 	author,
 	storage
 }) {
 	this.author = author;
 	this.storage = new Map(storage || [])
 	this.callHooks('afterCreate')
 }

 SharedState.__proto__.hooks = {
 	afterCreate: [],
 	afterInsert: [],
 	afterSync: [],
 	publish: []
 }

 SharedState.prototype.callHooks = function (hook, data) {
 	SharedState.__proto__.hooks[hook].forEach((fun) => {
 		fun(this, data)
 	})
 }

 SharedState.prototype.insert = function (key, data, bleachTTL = 30, area) {
 	if (bleachTTL === 0) {
 		this.storage.get(area).delete(key)
 		this.changed = true
 		this.callHooks('afterInsert', {
 			key,
 			data,
 			bleachTTL,
 			area
 		})
 		return;
 	};
 	const subStorage = this.storage.get(area)
 	if (!subStorage) {
 		this.storage.set(area, new Map())
 	}
 	this.storage.get(area)
 		.set(
 			key, {
 				author: this.author,
 				bleachTTL,
 				data
 			}
 		)
 	this.changed = true
 	this.callHooks('afterInsert', {
 		key,
 		data,
 		bleachTTL,
 		area
 	})
 }

 SharedState.prototype.show = function (area) {
 	if (!this.storage.get(area)) {
 		this.storage.set(area, new Map())
 	}
 	return this.storage.get(area);
 }

 SharedState.prototype.merge = function (stateSlice, _, area) {
 	if (!this.storage.get(area)) {
 		this.storage.set(area, new Map())
 	}
 	stateSlice.forEach((value, key) => {
 		if (value.bleachTTL <= 0) {
 			console.log("debug", "sharedState.merge got expired entry.")
 			this.changed = true
 		} else {
 			let lv = this.storage.get(area).get(key)
 			if (!lv) {
 				this.storage.get(area).set(key, value)
 			} else if (lv && lv.bleachTTL < value.bleachTTL) {
 				console.log("debug", "Updating entry for: " + key + " older: " + lv.bleachTTL + " newer: " + value.bleachTTL)
 				this.storage.get(area).set(key, value)
 			}
 		}
 	})
 }

 SharedState.prototype.remove = function (key, area) {
 	this.insert(key, {}, 0, area)
 }

 SharedState.prototype.bleach = function (area) {
 	let substancialChange = false;
 	this.storage.get(area).forEach((value, key, storageArea) => {
 		if (value.bleachTTL < 2) {
 			storageArea.delete(key)
 			substancialChange = true
 		} else {
 			storageArea.set(key, {
 				...value,
 				bleachTTL: value.bleachTTL - 1
 			})
 		}
 	})
 	this.changed = substancialChange;
 	return substancialChange;
 }

 module.exports = SharedState