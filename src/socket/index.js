const uuid = require('uuid/v4');

let usersMap = new Map();
let text = '';

const events = require('./events');
const changesets = require('changesets');
const Changeset = changesets.Changeset;
const md5 = require('blueimp-md5');

module.exports = function (io) {
  io.on(events.system.connection, function (socket) {
    const userId = uuid();
    usersMap.set(userId, {});
    socket.emit(events.server.clientInitialization, {userId, text});

    socket.on(events.client.uploadChangeSet, function (changeSetPack) {
      const changeSet = Changeset.unpack(changeSetPack);
      text = changeSet.apply(text);
      console.log(text);
      socket.broadcast.emit(events.server.dispatchChangeSet, {changeSetPack, from: userId});
    });

    socket.on(events.system.disconnect, function () {
      console.log('user disconnected');
    });

    socket.on(events.client.initializationDone, function (md5) {
      console.log('client:initializationDone', md5)
    });
  });

  return {text, usersMap};
};