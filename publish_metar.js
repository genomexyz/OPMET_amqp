/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Solace AMQP Node.js Examples: QueueProducer
 */

/* jshint node: true, esversion: 6 */

var QueueProducer = function() {
	'use strict';
	var self = {};
	var AMQP = require('amqp10');
	// don't support subjects in the link names
	var amqpClient = new AMQP.Client(AMQP.Policy.merge({
		defaultSubjects : false
	}));

	self.host = function(hostname) {
		self.hostname = hostname;
		return self;
	};

	self.queue = function(queueName) {
		self.queueName = queueName;
		return self;
	};

	self.log = function(line) {
		var time = new Date().toTimeString().split(' ')[0];
		console.log(`[${time}]`, line);
	};

	self.error = function(error) {
		self.log(`Error: ${JSON.stringify(error)}`);
		process.exit();
	};

	self.send = function(message) {
		self.log(`Connecting to ${self.hostname}`);
		amqpClient.connect(self.hostname).then(() => {
			// create a sender to the queue
			return amqpClient.createSender(self.queueName);
		}).then((amqpSender) => {
			self.log(`Sending message '${message}'...`);
			return amqpSender.send(message).then(() => {
				self.log('Message sent successfully.');
				self.exit();
			}, (error) => {
				self.error(error);
			});
		});
	};

	self.exit = function() {
		setTimeout(() => {
			amqpClient.disconnect().then(() => {
				self.log('Finished.');
				process.exit();
			});
		}, 2000); // wait for 2 seconds to exit
	};

	return self;
};

process.on('unhandledRejection', (reason, promise) => {
	console.log('QueueProducer Unhandled Rejection: promise ', promise, ', reason: ', reason);
});

var url = require('url');
var http = require('http');
var https = require('https');
var fs = require('fs');

//setting
var recent_metar_dir = "recent_metar";

var dateObj = new Date();
var tahun = dateObj.getUTCFullYear();
var bulan = dateObj.getUTCMonth() + 1; //months from 1-12
var hari = dateObj.getUTCDate();
var jam = dateObj.getUTCHours();
var menit = dateObj.getUTCMinutes();

console.log(tahun, bulan, hari, jam, menit);

var array_wilayah = [];
var path = process.cwd();
var buffer = fs.readFileSync(`${path}/wilayah.dat`);
var buffer_str = buffer.toString().split("\n");
for (i = 0; i < buffer_str.length; i++) {
	if (buffer_str[i] == "") {
		continue;
	}
	array_wilayah.push(buffer_str[i]);
}

for (i = 0; i < array_wilayah.length; i++) {
	fs.stat(`${path}/${recent_metar_dir}/${array_wilayah[i]}`, function (err, stats) {
		if (err) {
			if (err['code'] == 'ENOENT') {
				// writeFile function with filename, content and callback function
				fs.writeFile(`${path}/${recent_metar_dir}/${array_wilayah[i]}`, '', function (err) {
					if (err) throw err;
					console.log('File is created successfully.');
				}); 
			}
		}
		console.log(stats)
	});
}

console.log(array_wilayah);



//var contoh = {
//	'WIII' : 'contoh',
//	'WAAA' : 'contoh2'
//};

//console.log(contoh['WIII']);

//var options = {
//	host: '202.90.199.57',
//	port: 5000,
//	path: '/sigmetserver?tahun=2019&bulan=09&hari=1&jam=20'
//}

//var request = http.request(options, function (res) {
//	var data = '';
//	res.on('data', function (chunk) {
//		data += chunk;
//	});
//	res.on('end', function () {
//		console.log(data);

//	});
//});
//request.on('error', function (e) {
//	console.log(e.message);
//});
//request.end();
