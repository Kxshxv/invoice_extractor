import * as pdfjsLib from 'https://mozilla.github.io/pdf.js/build/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc =
	'https://mozilla.github.io/pdf.js/build/pdf.worker.mjs';

function extractText(pdfUrl) {
	return pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
		var totalPageCount = pdf.numPages;
		var countPromises = [];
		for (
			var currentPage = 1;
			currentPage <= totalPageCount;
			currentPage++
		) {
			var page = pdf.getPage(currentPage);
			countPromises.push(
				page.then(function (page) {
					var textContent = page.getTextContent();
					return textContent.then(function (text) {
						return text.items
							.map(function (s) {
								return s.str;
							})
							.join('');
					});
				}),
			);
		}

		return Promise.all(countPromises).then(function (texts) {
			return texts.join('');
		});
	});
}

const url =
	'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';

extractText(url).then(
	function (text) {
		console.log('parse ' + text);
	},
	function (reason) {
		console.error(reason);
	},
);