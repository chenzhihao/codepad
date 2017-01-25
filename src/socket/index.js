const uuid = require('uuid/v4');
const debounce = require('lodash.debounce');

const utils = require('../utils/utils');
const dmpEngine = utils.dmpEngine;
const Changeset = utils.ChangeSet;

const events = require('./events');
const md5 = require('blueimp-md5');

let usersMap = new Map();
let serverText = '';
let lastSyncText = '';
let changeSetStack = [];
let appliedChangeSet;

let handleStack = debounce(function handleStack ({io, socket}) {
  // the idea here is to put all the changeSet from different client in one stack, FILO
  // when we apply one changeSet to serverText, we need to do Inclusion Transformation for other changeSet by "transformAgainst"
  while (changeSetStack.length > 0) {
    let item = changeSetStack[0];
    const changeSet = item.changeSet;
    try {
      serverText = changeSet.apply(serverText);
      appliedChangeSet = item.changeSet;
      changeSetStack.shift();
      changeSetStack.map(changeSetItem => { changeSetItem.changeSet = changeSetItem.changeSet.transformAgainst(appliedChangeSet); });
    } catch (err) {
      console.log(err);
    }
  }

  appliedChangeSet = null;
  console.log(serverText);

  const diff = dmpEngine.diff_main(lastSyncText, serverText);
  const changeSetPack = Changeset.fromDiff(diff).pack();
  io.emit(events.server.dispatchChangeSet, {changeSetPack});
  lastSyncText = serverText;
}, 3000);

module.exports = function (io) {
  io.on(events.system.connection, function (socket) {
    const userId = uuid();
    usersMap.set(userId, {});
    socket.emit(events.server.clientInitialization, {userId, serverText}, function (response) {
      if (!response.md5 === md5(serverText)) {
        socket.emit(events.server.clientInitialization, {userId, serverText});
      }
    });

    socket.on(events.client.uploadChangeSet, function ({changeSetPack, textMd5, from, lastSyncedTextMd5}) {
      if (lastSyncedTextMd5 !== md5(serverText)) {
        socket.emit(events.server.forceSync, serverText);
        return;
      }
      changeSetStack.push({changeSet: Changeset.unpack(changeSetPack), textMd5, from, lastSyncedTextMd5});
      handleStack({io, socket});
    });

    socket.on(events.system.disconnect, function () {
      console.log('user disconnected');
    });
  });

  return {serverText, usersMap};
};
