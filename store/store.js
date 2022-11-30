const Store = require('electron-store');


// string because we are storing a json object
const schema = {
	stack: {
		type: 'string',
	},
	midrunes: {
		type: 'string',
	},
	bountyrunes: {
		type: 'string',
	},
	smoke: {
		type: 'string',
	},
	wards: {
		type: 'string',
	},
	neutral: {
		type: 'string',
	},
};

const store = new Store({schema})

// Assuming that the value will always be an object
function handleStoreSet(_event, key, value) {
  const jsonValue = JSON.stringify(value) 
  store.set(key, jsonValue)
}

// Same assumption as above
function handleStoreGet(_event, key) {
  const value = JSON.parse(store.get(key, null)) 
  return value
}

function getAllData() {
  const parsedData = {}
  for (const key in store.store) {
    parsedData[key] = JSON.parse(store.store[key])
  }
  return parsedData
}


function onStoreChange(callback) {
  store.onDidAnyChange(callback);
}

module.exports = {
  handleStoreGet,
  handleStoreSet,
  getAllData,
  onStoreChange
} 
