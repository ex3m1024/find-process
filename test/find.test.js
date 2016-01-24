/*
* @Author: zoujie.wzj
* @Date:   2016-01-24 10:35:16
* @Last Modified by:   Zoujie
* @Last Modified time: 2016-01-24 15:46:02
*/

'use strict';

const assert = require('assert');
const path = require('path');
const cp = require('child_process');
const find = require('..');
const listen = require('./fixtures/listen_port');

describe('Find process test', function () {
  it('should find process of listenning port', function () {
    return listen(12345)
      .then(function () {
        return find('port', 12345)
          .then(function (list) {
            assert(list.length === 1);
            assert.equal(process.pid, list[0].pid);

            listen.close();
          }, function (err) {
            assert(false, err.stack || err);

            listen.close();
          });
      });
  });

  it('should find process of pid', function (done) {
    let file = path.join(__dirname, 'fixtures/child_process.js');
    let cps = cp.spawn(process.execPath, [file]);

    cps.on('exit', function () {
      done();
    });

    find('pid', cps.pid)
      .then(function (list) {
        assert(list.length === 1);
        assert.equal(cps.pid, list[0].pid);

        cps.kill();
      }, function (err) {
        assert(false, err.stack || err);
      });
  });

  it('should find process list matched given name', function (done) {
    let file = path.join(__dirname, 'fixtures/child_process.js');
    let cps = cp.spawn(process.execPath, [file, 'AAABBBCCC']);

    cps.on('exit', function () {
      done();
    });

    find('name', 'AAABBBCCC')
      .then(function (list) {
        assert(list.length === 1);
        assert.equal(cps.pid, list[0].pid);

        cps.kill();
      }, function (err) {
        assert(false, err.stack || err);
      });
  });
});
