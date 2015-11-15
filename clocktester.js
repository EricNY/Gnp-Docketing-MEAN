'use strict';

var nodemailer = require('nodemailer');
var moment = require('moment-timezone');
var transporter = nodemailer.createTransport();

var createEmail = function(patentCheck, patentContent, trademarkCheck, trademarkContent ){

	if (patentCheck && trademarkCheck) {
		var content = 'The following patents have due dates over the next two weeks: \n' +
			patentContent + '\n\n' +
			'The following trademarks have due dates over the next two weeks: \n' +
			trademarkContent;

		console.log( content );

		transporter.sendMail({
			from: 'info@gandplaw.com',
			to: 'ericabt@gmail.com, docketing@gandplaw.com',
			subject: 'docketing reminder',
			text: content
		});

		return content;
	}

	return 0;

};

// remember to close db!
// also will we still get reminder for past dates?
var clockLogger = function() {

	var MongoClient = require('mongodb').MongoClient;

	// Open the connection to the server
	MongoClient.connect('mongodb://heroku_ckn8tvb3:e057opa9lgj1t46omej85urd1n@ds047642.mongolab.com:47642/heroku_ckn8tvb3', function(err, db) {
		var patentFilings = [],
				trademarkFilings = [],
				emailContent = "ec",
				patentCheck = false,
				trademarkCheck = false;

		if(err) throw err;

		db.collection('patents').find().toArray(function (err, docs) {

			var today = new Date(),
					monthFromToday = today.getTime() + 2419200000;
			// docs is an Array of documents here
			for (var i = 0; i <= docs.length -1; i++) {

				var dueDateMilliseconds = docs[i].dueDate,
						secondDueDateMilliseconds = docs[i].secondDueDate,
						thirdDueDateMilliseconds = docs[i].thirdDueDate,
						dueDateFormatted = moment(docs[i].dueDate).tz('America/New_York').format('LLL'),
						secondDueDateFormatted = moment(docs[i].secondDueDate).tz('America/New_York').format('LLL'),
						thirdDueDateFormatted = moment(docs[i].thirdDueDate).tz('America/New_York').format('LLL');

				if ( dueDateMilliseconds && dueDateMilliseconds.getTime() < monthFromToday && dueDateMilliseconds.getTime() >= today.getTime() ) {

					patentFilings.push( docs[i].owner + ' ' + docs[i].nature + ' ' + docs[i].applicationNumber + ' ' + dueDateFormatted );

				}
				// Mon Aug 24 2015
				if ( secondDueDateMilliseconds && secondDueDateMilliseconds.getTime() < monthFromToday && secondDueDateMilliseconds.getTime() >= today.getTime() ) {

					patentFilings.push( docs[i].owner + ' ' + docs[i].nature + ' ' + docs[i].applicationNumber + ' ' + secondDueDateFormatted );

				}
				// Fri Sep 18 2015
				if ( thirdDueDateMilliseconds && thirdDueDateMilliseconds.getTime() < monthFromToday && thirdDueDateMilliseconds.getTime() >= today.getTime() ) {

					patentFilings.push( docs[i].owner + ' ' + docs[i].nature + ' ' + docs[i].applicationNumber + ' ' + thirdDueDateFormatted );

				}

			}

			patentCheck = true;
			createEmail( patentCheck, patentFilings.join('\n'), trademarkCheck, trademarkFilings.join('\n') );
			if (trademarkCheck) {
				db.close();
			};
		});


		db.collection('trademarks').find().toArray(function (err, docs) {

			var today = new Date(),
					monthFromToday = today.getTime() + 2419200000;
			// docs is an Array of documents here
			for (var i = 0; i <= docs.length -1; i++) {

				var dueDateMilliseconds = docs[i].dueDate,
						secondDueDateMilliseconds = docs[i].secondDueDate,
						dueDateFormatted = moment(docs[i].dueDate).tz('America/New_York').format('LLL'),
						secondDueDateFormatted = moment(docs[i].secondDueDate).tz('America/New_York').format('LLL');

				if ( dueDateMilliseconds && dueDateMilliseconds.getTime() < monthFromToday && dueDateMilliseconds.getTime() >= today.getTime() ) {

					trademarkFilings.push(  docs[i].owner + ' ' + docs[i].mark + ' ' + docs[i].applicationNumber + ' ' + dueDateFormatted );

				}
				// Mon Aug 24 2015
				if ( secondDueDateMilliseconds && secondDueDateMilliseconds.getTime() < monthFromToday && secondDueDateMilliseconds.getTime() >= today.getTime() ) {

					trademarkFilings.push( docs[i].owner + ' ' + docs[i].mark + ' ' + docs[i].applicationNumber + ' ' + secondDueDateFormatted );

				}

			}

			trademarkCheck = true;
			createEmail( patentCheck, patentFilings.join('\n'), trademarkCheck, trademarkFilings.join('\n') );
			if (patentCheck) {
				db.close();
			}

		});


		// Declare success
		console.dir("success!");
	});

};

clockLogger();

setInterval( clockLogger, 86400000 );




