'use strict';

const activitypubCore = require('..');
const assert = require('assert').strict;

assert.strictEqual(activitypubCore(), 'Hello from activitypubCore');
console.info("activitypubCore tests passed");
