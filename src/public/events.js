'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var e = React.createElement;

var _React = React,
    useState = _React.useState,
    useRef = _React.useRef;


var LikeButton = function LikeButton() {
	var _useState = useState(false),
	    _useState2 = _slicedToArray(_useState, 2),
	    liked = _useState2[0],
	    setLiked = _useState2[1];

	if (liked) {
		return 'You liked this.';
	}

	return React.createElement(
		'div',
		{ 'class': 'Polaris-Card' },
		React.createElement(
			'div',
			{ 'class': 'Polaris-Card__Header' },
			React.createElement(
				'h2',
				{ 'class': 'Polaris-Heading' },
				'Event name'
			)
		),
		React.createElement(
			'div',
			{ 'class': 'Polaris-Card__Section' },
			React.createElement(
				'div',
				{ 'class': 'Polaris-Labelled--hidden' },
				React.createElement(
					'div',
					{ 'class': 'Polaris-Labelled__LabelWrapper' },
					React.createElement(
						'div',
						{ 'class': 'Polaris-Label' },
						React.createElement(
							'label',
							{ id: 'GiveawayNameInputLabel', 'for': 'GiveawayNameInput', 'class': 'Polaris-Label__Text' },
							'Giveaway name'
						)
					)
				),
				React.createElement(
					'div',
					{ 'class': 'Polaris-Connected' },
					React.createElement(
						'div',
						{ 'class': 'Polaris-Connected__Item Polaris-Connected__Item--primary' },
						React.createElement(
							'div',
							{ 'class': 'Polaris-TextField' },
							React.createElement('input', { id: 'GiveawayNameInput', placeholder: '', autocomplete: 'off', 'class': 'Polaris-TextField__Input', 'aria-labelledby': 'GiveawayNameInputLabel', 'aria-invalid': 'false', value: '' }),
							React.createElement('div', { 'class': 'Polaris-TextField__Backdrop' })
						)
					)
				)
			)
		)
	);
};

var domContainer = document.querySelector('#NewEvent');
var root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(LikeButton, null));