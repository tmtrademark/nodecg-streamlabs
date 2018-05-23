'use strict';

const async = require('async');

module.exports.queryTops = function (request, access, log, callback) {
	const now = new Date();
	var options = { method: 'GET',
	  url: 'https://streamlabs.com/api/v1.0/donations',
	  qs: { access_token: access } };
	/* eslint-disable camelcase */
	async.parallel({
		daily(cb) {
			// get all freaking donations
			// parseInt((new Date('2012.08.10').getTime() / 1000).toFixed(0)) unix timestamp

			// sort stuff and just return the top value
			var today_in_unix = parseInt((new Date(now.getFullYear(), now.getMonth(), now.getDate()) / 1000).toFixed(0));
			// limit to 200 for now
			request(options, function (error, response, donations) {
				log.info(donations);
				if (error) {
					cb(err,false);
				} else {
					var today_donations = donations.data.filter( donation => {
						return parseInt(donation.created_at) > today_in_unix;
					});
					var today_top = today_donations.sort(function(a, b){
						// Use toUpperCase() to ignore character casing
						const amountA = parseInt(a.amount) * 100;
						const amountB = parseInt(b.amount) * 100;

						let comparison = 0;
						if (amountA > amountB) {
							comparison = 1;
						} else if (amountA < amountB) {
							comparison = -1;
						}
						return comparison;
					}).shift();
					cb(err, today_top.amount);
				}
			});
		},
		monthly(cb) {
			var month_in_unix = parseInt((new Date(now.getFullYear(), now.getMonth(), 1) / 1000).toFixed(0));

			request(options, function (error, response, donations) {
				if (error) {
					cb(err,false);
				} else {
					var month_donations = donations.data.filter( donation => {
						return parseInt(donation.created_at) > month_in_unix;
					});
					var month_top = month_donations.sort(function(a, b){
						// Use toUpperCase() to ignore character casing
						const amountA = parseInt(a.amount) * 100;
						const amountB = parseInt(b.amount) * 100;

						let comparison = 0;
						if (amountA > amountB) {
							comparison = 1;
						} else if (amountA < amountB) {
							comparison = -1;
						}
						return comparison;
					}).shift();
					cb(err, month_top.amount);
				}
			});
		}
	}, (err, results) => {
		const ret = {daily: null, monthly: null};

		if (err) {
			log.warn('Unable to query donations from StreamLabs!');
			log.warn(err);
			return callback(ret);
		}

		ret.daily = results.daily.length === 1 ? results.daily[0] : null;
		ret.monthly = results.monthly.length === 1 ? results.monthly[0] : null;

		callback(ret);
	});
	/* eslint-enable camelcase */
};

module.exports.compareTops = function (tip, tops) {
	const ret = {monthly: null, daily: null};
	Object.keys(tops).forEach(period => {
		console.log(tops[period]);
		if ( ( Object.keys(tops[period]).length === 0 && tops[period].constructor === Object ) || tip.amount.amount * 100 > tops[period].amount.amount * 100) {
			ret[period] = tip;
		}
	});

	return ret;
};
