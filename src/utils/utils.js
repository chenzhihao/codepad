const dmp = require('diff_match_patch');
const dmpEngine = new dmp.diff_match_patch();
const ChangeSet = require('changesets').Changeset;

module.exports = {
  ChangeSet: ChangeSet,
  dmpEngine: dmpEngine,
};