(function () {
	'use strict';

	const dayAmount = document.querySelector('#daily .amount');
	const dayUsername = document.querySelector('#daily .username');
	const monthAmount = document.querySelector('#monthly .amount');
	const monthUsername = document.querySelector('#monthly .username');

	nodecg.Replicant('streamlabs_tops').on('change', (oldVal, newVal) => {
			if (!newVal) {
				return;
			}

			let dayamt = '$0';
			let dayusr = 'N/A';
			let monthamt = '$0';
			let monthusr = 'N/A';
			const dayTopTip = newVal.daily;
			const monthTopTip = newVal.monthly;

			if (dayTopTip && dayTopTip.amount.amount * 100 > 0) {
				dayamt = dayTopTip.formatted_amount;
				dayusr = dayTopTip.name;
			}

			if (monthTopTip && monthTopTip.amount.amount * 100 > 0) {
				monthamt = monthTopTip.formatted_amount;
				monthusr = monthTopTip.name;
			}

			dayAmount.innerHTML = dayamt;
			dayAmount.setAttribute('title', dayamt);
			dayUsername.innerHTML = dayusr;
			dayUsername.setAttribute('title', dayusr);

			monthAmount.innerHTML = monthamt;
			monthAmount.setAttribute('title', monthamt);
			monthUsername.innerHTML = monthusr;
			monthUsername.setAttribute('title', monthusr);
		});
})();
