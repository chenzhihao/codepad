module.exports = {
  system: {
    connection: 'connection',
    disconnect: 'disconnect',
  },
  client: {
    initializationDone: 'client.initialization',
    uploadChangeSet: 'client.uploadChangeSet',
  },
  server: {
    clientInitialization: 'server:clientInitialization',
    dispatchChangeSet: 'server:dispatchChangeSet',
  }
};