'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var e = React.createElement;

var _React = React,
    useState = _React.useState,
    useRef = _React.useRef;


var EventName = function EventName(props) {
	var _useState = useState(false),
	    _useState2 = _slicedToArray(_useState, 2),
	    liked = _useState2[0],
	    setLiked = _useState2[1];

	if (liked) {
		return 'You liked this.';
	}

	return React.createElement(
		'div',
		{ className: 'Polaris-Card' },
		React.createElement(
			'div',
			{ className: 'Polaris-Card__Header' },
			React.createElement(
				'h2',
				{ className: 'Polaris-Heading' },
				'Event name'
			)
		),
		React.createElement(
			'div',
			{ className: 'Polaris-Card__Section' },
			React.createElement(
				'div',
				{ className: 'Polaris-Labelled--hidden' },
				React.createElement(
					'div',
					{ className: 'Polaris-Labelled__LabelWrapper' },
					React.createElement(
						'div',
						{ className: 'Polaris-Label' },
						React.createElement(
							'label',
							{ id: 'GiveawayNameInputLabel', htmlFor: 'GiveawayNameInput', className: 'Polaris-Label__Text' },
							'Giveaway name'
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'Polaris-Connected' },
					React.createElement(
						'div',
						{ className: 'Polaris-Connected__Item Polaris-Connected__Item--primary' },
						React.createElement(
							'div',
							{ className: 'Polaris-TextField' },
							React.createElement('input', { id: 'GiveawayNameInput', placeholder: '', autoComplete: 'off', className: 'Polaris-TextField__Input', 'aria-labelledby': 'GiveawayNameInputLabel', 'aria-invalid': 'false', defaultValue: '' }),
							React.createElement('div', { className: 'Polaris-TextField__Backdrop' })
						)
					)
				)
			)
		)
	);
};

var EventDescription = function EventDescription(props) {
	return React.createElement(
		'div',
		{ className: 'Polaris-Card' },
		React.createElement(
			'div',
			{ className: 'Polaris-Card__Header' },
			React.createElement(
				'h2',
				{ className: 'Polaris-Heading' },
				'Description'
			)
		),
		React.createElement(
			'div',
			{ className: 'Polaris-Card__Section' },
			React.createElement(
				'div',
				{ className: 'Polaris-Labelled--hidden' },
				React.createElement(
					'div',
					{ className: 'Polaris-Labelled__LabelWrapper' },
					React.createElement(
						'div',
						{ className: 'Polaris-Label' },
						React.createElement(
							'label',
							{ id: 'EventDescriptionInputLabel', htmlFor: 'EventDescriptionInput', className: 'Polaris-Label__Text' },
							'Description'
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'Polaris-Connected' },
					React.createElement(
						'div',
						{ className: 'Polaris-Connected__Item Polaris-Connected__Item--primary' },
						React.createElement(
							'div',
							{ className: 'Polaris-TextField Polaris-TextField--hasValue Polaris-TextField--multiline' },
							React.createElement('textarea', { id: 'EventDescriptionInput', onChange: props.description, autoComplete: 'off', className: 'Polaris-TextField__Input', rows: '6', 'aria-labelledby': 'EventDescriptionInputLabel', 'aria-multiline': 'true', style: { "height": "105px" } }),
							React.createElement('div', { className: 'Polaris-TextField__Backdrop' })
						)
					)
				)
			)
		)
	);
};

var CurrencyCode = function CurrencyCode() {
	return React.createElement(
		'div',
		{ className: 'Polaris-Card' },
		React.createElement(
			'div',
			{ className: 'Polaris-Card__Header' },
			React.createElement(
				'h2',
				{ className: 'Polaris-Heading' },
				'Currency Code'
			)
		),
		React.createElement(
			'div',
			{ className: 'Polaris-Card__Section' },
			React.createElement(
				'div',
				{ className: 'Polaris-TextContainer' },
				React.createElement(
					'p',
					{ className: 'CurrencyCode' },
					React.createElement('div', { className: 'Polaris-SkeletonDisplayText__DisplayText Polaris-SkeletonDisplayText--sizeSmall CCSketch' })
				)
			)
		)
	);
};

var Qualifiers = function Qualifiers() {
	return React.createElement(
		'div',
		{ className: 'Polaris-Card' },
		React.createElement(
			'div',
			{ className: 'Polaris-Card__Header' },
			React.createElement(
				'h2',
				{ className: 'Polaris-Heading' },
				'Qualifying products'
			)
		),
		React.createElement(
			'div',
			{ className: 'Polaris-Card__Section' },
			React.createElement(
				'div',
				{ className: 'Polaris-ButtonGroup' },
				React.createElement(
					'div',
					{ className: 'Polaris-ButtonGroup__Item' },
					React.createElement(
						'button',
						{ id: 'AllProductsBtn', className: 'Polaris-Button Polaris-Button--pressed', 'aria-label': 'All products', type: 'button' },
						React.createElement(
							'span',
							{ className: 'Polaris-Button__Content' },
							React.createElement(
								'span',
								{ className: 'Polaris-Button__Text' },
								'All products'
							)
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'Polaris-ButtonGroup__Item' },
					React.createElement(
						'button',
						{ id: 'ChooseProductsBtn', className: 'Polaris-Button', 'aria-label': 'Choose products', type: 'button' },
						React.createElement(
							'span',
							{ className: 'Polaris-Button__Content' },
							React.createElement(
								'span',
								{ className: 'Polaris-Button__Text' },
								'Choose products'
							)
						)
					)
				)
			)
		),
		React.createElement(
			'div',
			{ className: 'Polaris-Card__Section' },
			React.createElement(
				'div',
				{ id: 'ChooseProductsChoiceDescript', className: 'Polaris-TextContainer' },
				React.createElement(
					'div',
					{ id: 'CPCDValue', className: 'Polaris-TextStyle--variationStrong' },
					'All products qualify as an entry into this giveaway'
				)
			)
		)
	);
};

var EventType = function EventType() {
	return React.createElement(
		'div',
		{ className: 'Polaris-Card' },
		React.createElement(
			'div',
			{ className: 'Polaris-Card__Header' },
			React.createElement(
				'h2',
				{ className: 'Polaris-Heading' },
				'Giveaway type'
			)
		),
		React.createElement(
			'div',
			{ className: 'Polaris-Card__Section' },
			React.createElement(
				'div',
				{ className: 'Polaris-ButtonGroup' },
				React.createElement(
					'div',
					{ className: 'Polaris-ButtonGroup__Item' },
					React.createElement(
						'button',
						{ className: 'Polaris-Button Polaris-Button--pressed', 'aria-label': 'All products', type: 'button' },
						React.createElement(
							'span',
							{ className: 'Polaris-Button__Content' },
							React.createElement(
								'span',
								{ className: 'Polaris-Button__Text' },
								'Continuous'
							)
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'Polaris-ButtonGroup__Item' },
					React.createElement(
						'button',
						{ className: 'Polaris-Button', 'aria-label': 'Choose products', type: 'button' },
						React.createElement(
							'span',
							{ className: 'Polaris-Button__Content' },
							React.createElement(
								'span',
								{ className: 'Polaris-Button__Text' },
								'Recurring'
							)
						)
					)
				)
			)
		)
	);
};

var ActiveDates = function ActiveDates() {
	return React.createElement(
		'div',
		{ className: 'Polaris-Card' },
		React.createElement(
			'div',
			{ className: 'Polaris-Card__Header' },
			React.createElement(
				'h2',
				{ className: 'Polaris-Heading' },
				'Active dates'
			)
		),
		React.createElement(
			'div',
			{ className: 'Polaris-Card__Section' },
			React.createElement(
				'div',
				{ className: 'Polaris-FormLayout' },
				React.createElement(
					'div',
					{ role: 'group', className: 'Polaris-FormLayout--grouped' },
					React.createElement(
						'div',
						{ className: 'Polaris-FormLayout__Items' },
						React.createElement(
							'div',
							{ className: 'Polaris-FormLayout__Item' },
							React.createElement(
								'div',
								{ className: 'Polaris-Labelled' },
								React.createElement(
									'div',
									{ className: 'Polaris-Labelled__LabelWrapper' },
									React.createElement(
										'div',
										{ className: 'Polaris-Label' },
										React.createElement(
											'label',
											{ id: 'StartDateLabel', htmlFor: 'StartDate', className: 'Polaris-Label__Text' },
											'Start date'
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'Polaris-Connected' },
									React.createElement(
										'div',
										{ className: 'Polaris-Connected__Item Polaris-Connected__Item--primary' },
										React.createElement(
											'div',
											{ className: 'Polaris-TextField Polaris-TextField--hasValue' },
											React.createElement('input', { id: 'StartDate', type: 'date', autoComplete: 'off', className: 'Polaris-TextField__Input', placeholder: 'yyyy-mm-dd', 'aria-labelledby': '', 'aria-invalid': 'false', defaulValue: '' }),
											React.createElement('div', { className: 'Polaris-TextField__Backdrop' })
										)
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'Polaris-FormLayout__Item' },
							React.createElement(
								'div',
								{ className: 'Polaris-Labelled' },
								React.createElement(
									'div',
									{ className: 'Polaris-Labelled__LabelWrapper' },
									React.createElement(
										'div',
										{ className: 'Polaris-Label' },
										React.createElement(
											'label',
											{ id: 'StartTimeLabel', 'for': 'StartTime', className: 'Polaris-Label__Text' },
											'Start time'
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'Polaris-Connected' },
									React.createElement(
										'div',
										{ className: 'Polaris-Connected__Item Polaris-Connected__Item--primary' },
										React.createElement(
											'div',
											{ className: 'Polaris-TextField Polaris-TextField--hasValue' },
											React.createElement('input', { id: 'StartTime', type: 'time', autoComplete: 'off', 'class': 'Polaris-TextField__Input', placeholder: 'Enter time', 'aria-labelledby': '', 'aria-invalid': 'false', defaultValue: '' }),
											React.createElement('div', { className: 'Polaris-TextField__Backdrop' })
										)
									)
								)
							)
						)
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'Polaris-FormLayout' },
				React.createElement(
					'div',
					{ role: 'group', className: 'Polaris-FormLayout--grouped' },
					React.createElement(
						'div',
						{ className: 'Polaris-FormLayout__Items' },
						React.createElement(
							'div',
							{ className: 'Polaris-FormLayout__Item' },
							React.createElement(
								'div',
								{ className: 'Polaris-Labelled' },
								React.createElement(
									'div',
									{ className: 'Polaris-Labelled__LabelWrapper' },
									React.createElement(
										'div',
										{ className: 'Polaris-Label' },
										React.createElement(
											'label',
											{ id: 'EndDateLabel', htmlFor: 'EndDate', className: 'Polaris-Label__Text' },
											'End date'
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'Polaris-Connected' },
									React.createElement(
										'div',
										{ className: 'Polaris-Connected__Item Polaris-Connected__Item--primary' },
										React.createElement(
											'div',
											{ className: 'Polaris-TextField Polaris-TextField--hasValue' },
											React.createElement('input', { id: 'EndDate', type: 'date', autoComplete: 'off', className: 'Polaris-TextField__Input', placeholder: 'yyyy-mm-dd', 'aria-labelledby': '', 'aria-invalid': 'false', defaultValue: '' }),
											React.createElement('div', { className: 'Polaris-TextField__Backdrop' })
										)
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'Polaris-FormLayout__Item' },
							React.createElement(
								'div',
								{ className: 'Polaris-Labelled' },
								React.createElement(
									'div',
									{ className: 'Polaris-Labelled__LabelWrapper' },
									React.createElement(
										'div',
										{ className: 'Polaris-Label' },
										React.createElement(
											'label',
											{ id: 'EndTimeLabel', htmlFor: 'EndTime', className: 'Polaris-Label__Text' },
											'End time'
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'Polaris-Connected' },
									React.createElement(
										'div',
										{ className: 'Polaris-Connected__Item Polaris-Connected__Item--primary' },
										React.createElement(
											'div',
											{ className: 'Polaris-TextField Polaris-TextField--hasValue' },
											React.createElement('input', { id: 'EndTime', type: 'time', autoComplete: 'off', className: 'Polaris-TextField__Input', 'aria-labelledby': '', 'aria-invalid': 'false', defaultValue: '', placeholder: 'Enter time' }),
											React.createElement('div', { className: 'Polaris-TextField__Backdrop' })
										)
									)
								)
							)
						)
					)
				)
			)
		),
		React.createElement(
			'div',
			{ className: 'Polaris-CalloutCard__Container' },
			React.createElement(
				'div',
				{ className: 'Polaris-Card__Section' },
				React.createElement(
					'div',
					{ className: 'Polaris-CalloutCard' },
					React.createElement(
						'div',
						{ className: 'Polaris-CalloutCard__Content' },
						React.createElement(
							'div',
							{ className: 'Polaris-CalloutCard__Title' },
							React.createElement(
								'h2',
								{ id: 'ValidHeading', className: 'Polaris-Heading' },
								'Validate scheduling'
							)
						),
						React.createElement(
							'div',
							{ id: 'ValidBody', 'class': 'Polaris-TextContainer' },
							React.createElement(
								'p',
								null,
								'Press the validator button to check for scheduling conflicts with existing giveaways.'
							)
						),
						React.createElement(
							'div',
							{ className: 'Polaris-CalloutCard__Buttons' },
							React.createElement(
								'button',
								{ id: 'ValidateBtn', className: 'Polaris-Button Polaris-Button--outline', 'aria-label': 'Validate', type: 'button' },
								React.createElement(
									'span',
									{ className: 'Polaris-Button__Content' },
									React.createElement(
										'span',
										{ className: 'Polaris-Button__Text' },
										'Validate'
									)
								)
							)
						)
					)
				)
			)
		)
	);
};

var ActionButtons = function ActionButtons(props) {
	//console.log()
	return React.createElement(
		'div',
		{ className: 'Polaris-Stack Polaris-Stack--distributionEqualSpacing' },
		React.createElement(
			'div',
			{ className: 'Polaris-Stack__Item' },
			React.createElement(
				'button',
				{ className: 'Polaris-Button DiscardAny', 'aria-label': 'discard', type: 'button' },
				React.createElement(
					'span',
					{ className: 'Polaris-Button__Content' },
					React.createElement(
						'span',
						{ className: 'Polaris-Button__Text' },
						'Discard'
					)
				)
			)
		),
		React.createElement(
			'div',
			{ className: 'Polaris-Stack__Item' },
			React.createElement(
				'button',
				{ className: 'Polaris-Button Polaris-Button--primary', 'aria-label': 'Save giveaway', onClick: props.fn, type: 'button' },
				React.createElement(
					'span',
					{ className: 'Polaris-Button__Content' },
					React.createElement(
						'span',
						{ className: 'Polaris-Button__Text' },
						'Continue'
					)
				)
			)
		)
	);
};

var Page = function Page() {

	var continueButton = function continueButton() {
		return console.log("Pressed continue");
	};

	return React.createElement(
		'form',
		{ onSubmit: continueButton },
		React.createElement(
			'div',
			{ className: 'Polaris-Layout' },
			React.createElement('a', { id: 'SkipToContentTarget', tabIndex: '-1' }),
			React.createElement(
				'div',
				{ className: 'Polaris-Layout__Section Polaris-Layout__Section--primary' },
				React.createElement(EventName, null),
				React.createElement(EventDescription, null),
				React.createElement(CurrencyCode, null),
				React.createElement(Qualifiers, null),
				React.createElement(EventType, null),
				React.createElement(ActiveDates, null)
			),
			React.createElement(
				'div',
				{ className: 'Polaris-Layout__Section Polaris-Layout__Section--fullWidth' },
				React.createElement(ActionButtons, { fn: continueButton })
			)
		)
	);
};

var domContainer = document.getElementById('NewEvent');
var root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(Page, null));