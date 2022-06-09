'use strict';

const e = React.createElement;

const {useState, useRef} = React

const EventName = (props) => {
	const [liked, setLiked] = useState(false)

	if (liked) {
		return 'You liked this.';
	}

	return (
		<div className="Polaris-Card">
			<div className="Polaris-Card__Header">
				<h2 className="Polaris-Heading">Event name</h2>
			</div>
			<div className="Polaris-Card__Section">
				<div className="Polaris-Labelled--hidden">
					<div className="Polaris-Labelled__LabelWrapper">
						<div className="Polaris-Label"><label id="GiveawayNameInputLabel" htmlFor="GiveawayNameInput" className="Polaris-Label__Text">Giveaway name</label></div>
					</div>
					<div className="Polaris-Connected">
						<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
							<div className="Polaris-TextField"><input id="GiveawayNameInput" placeholder="" autoComplete="off" className="Polaris-TextField__Input" aria-labelledby="GiveawayNameInputLabel" aria-invalid="false" defaultValue=""/>
								<div className="Polaris-TextField__Backdrop"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const EventDescription = (props) => {
	return (
		<div className="Polaris-Card">
			<div className="Polaris-Card__Header">
				<h2 className="Polaris-Heading">Description</h2>
			</div>
			<div className="Polaris-Card__Section">
				<div className="Polaris-Labelled--hidden">
					<div className="Polaris-Labelled__LabelWrapper">
						<div className="Polaris-Label">
							<label id="EventDescriptionInputLabel" htmlFor="EventDescriptionInput" className="Polaris-Label__Text">Description</label>
						</div>
					</div>
					<div className="Polaris-Connected">
						<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
							<div className="Polaris-TextField Polaris-TextField--hasValue Polaris-TextField--multiline">
								<textarea id="EventDescriptionInput" onChange={props.description} autoComplete="off" className="Polaris-TextField__Input" rows="6" aria-labelledby="EventDescriptionInputLabel" aria-multiline="true" style={{"height": "105px"}}></textarea>
								<div className="Polaris-TextField__Backdrop"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const CurrencyCode = () => {
	return (
		<div className="Polaris-Card">
			<div className="Polaris-Card__Header">
				<h2 className="Polaris-Heading">Currency Code</h2>
			</div>
			<div className="Polaris-Card__Section">
				<div className="Polaris-TextContainer">
					<p className="CurrencyCode">
						<span className="Polaris-SkeletonDisplayText__DisplayText Polaris-SkeletonDisplayText--sizeSmall CCSketch"></span>
					</p>
				</div>
			</div>						
		</div>
	)
}

const Qualifiers = () => {
	return (
		<div className="Polaris-Card">
			<div className="Polaris-Card__Header">
				<h2 className="Polaris-Heading">Qualifying products</h2>
			</div>
			<div className="Polaris-Card__Section">
				<div className="Polaris-ButtonGroup">
					<div className="Polaris-ButtonGroup__Item">
						<button id="AllProductsBtn" className="Polaris-Button Polaris-Button--pressed" aria-label="All products" type="button">
							<span className="Polaris-Button__Content">
								<span className="Polaris-Button__Text">All products</span>
							</span>
						</button>
					</div>
					<div className="Polaris-ButtonGroup__Item">
						<button id="ChooseProductsBtn" className="Polaris-Button" aria-label="Choose products" type="button">
							<span className="Polaris-Button__Content">
								<span className="Polaris-Button__Text">Choose products</span>
							</span>
						</button>
					</div>
				</div>
			</div>
			<div className="Polaris-Card__Section">
				<div id="ChooseProductsChoiceDescript" className="Polaris-TextContainer">
					<div id="CPCDValue" className="Polaris-TextStyle--variationStrong">All products qualify as an entry into this giveaway</div>
				</div>
			</div>
		</div>
	)
}

const EventType = () => {
	return (
		<div className="Polaris-Card">
			<div className="Polaris-Card__Header">
				<h2 className="Polaris-Heading">Giveaway type</h2>
			</div>
			<div className="Polaris-Card__Section">
				<div className="Polaris-ButtonGroup">
					<div className="Polaris-ButtonGroup__Item">
						<button className="Polaris-Button Polaris-Button--pressed" aria-label="All products" type="button">
							<span className="Polaris-Button__Content">
								<span className="Polaris-Button__Text">Continuous</span>
							</span>
						</button>
					</div>
					<div className="Polaris-ButtonGroup__Item">
						<button className="Polaris-Button" aria-label="Choose products" type="button">
							<span className="Polaris-Button__Content">
								<span className="Polaris-Button__Text">Recurring</span>
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

const ActiveDates = () => {
	return (
		<div className="Polaris-Card">
			<div className="Polaris-Card__Header">
				<h2 className="Polaris-Heading">Active dates</h2>
			</div>
			<div className="Polaris-Card__Section">
				<div className="Polaris-FormLayout">
					<div role="group" className="Polaris-FormLayout--grouped">
						<div className="Polaris-FormLayout__Items">
							<div className="Polaris-FormLayout__Item">
								<div className="Polaris-Labelled">
									<div className="Polaris-Labelled__LabelWrapper">
										<div className="Polaris-Label">
											<label id="StartDateLabel" htmlFor="StartDate" className="Polaris-Label__Text">Start date</label>
										</div>
									</div>
									<div className="Polaris-Connected">
										<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
											<div className="Polaris-TextField Polaris-TextField--hasValue">
												<input id="StartDate" type="date" autoComplete="off" className="Polaris-TextField__Input" placeholder="yyyy-mm-dd" aria-labelledby="" aria-invalid="false" defaulValue=""/>
												<div className="Polaris-TextField__Backdrop"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="Polaris-FormLayout__Item">
								<div className="Polaris-Labelled">
									<div className="Polaris-Labelled__LabelWrapper">
										<div className="Polaris-Label">
											<label id="StartTimeLabel" for="StartTime" className="Polaris-Label__Text">Start time</label>
										</div>
									</div>
									<div className="Polaris-Connected">
										<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
											<div className="Polaris-TextField Polaris-TextField--hasValue">
												<input id="StartTime" type="time" autoComplete="off" class="Polaris-TextField__Input" placeholder="Enter time" aria-labelledby="" aria-invalid="false" defaultValue=""/>
												<div className="Polaris-TextField__Backdrop"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="Polaris-FormLayout">
					<div role="group" className="Polaris-FormLayout--grouped">
						<div className="Polaris-FormLayout__Items">
							<div className="Polaris-FormLayout__Item">
								<div className="Polaris-Labelled">
									<div className="Polaris-Labelled__LabelWrapper">
										<div className="Polaris-Label">
											<label id="EndDateLabel" htmlFor="EndDate" className="Polaris-Label__Text">End date</label>
										</div>
									</div>
									<div className="Polaris-Connected">
										<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
											<div className="Polaris-TextField Polaris-TextField--hasValue">
												<input id="EndDate" type="date" autoComplete="off" className="Polaris-TextField__Input" placeholder="yyyy-mm-dd" aria-labelledby="" aria-invalid="false" defaultValue=""/>
												<div className="Polaris-TextField__Backdrop"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="Polaris-FormLayout__Item">
								<div className="Polaris-Labelled">
									<div className="Polaris-Labelled__LabelWrapper">
										<div className="Polaris-Label">
											<label id="EndTimeLabel" htmlFor="EndTime" className="Polaris-Label__Text">End time</label>
										</div>
									</div>
									<div className="Polaris-Connected">
										<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
											<div className="Polaris-TextField Polaris-TextField--hasValue">
												<input id="EndTime" type="time" autoComplete="off" className="Polaris-TextField__Input" aria-labelledby="" aria-invalid="false" defaultValue="" placeholder="Enter time"/>
												<div className="Polaris-TextField__Backdrop"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="Polaris-CalloutCard__Container">
				<div className="Polaris-Card__Section">
					<div className="Polaris-CalloutCard">
						<div className="Polaris-CalloutCard__Content">
							<div className="Polaris-CalloutCard__Title">
								<h2 id="ValidHeading" className="Polaris-Heading">Validate scheduling</h2>
							</div>
							<div id="ValidBody" class="Polaris-TextContainer">
								<p>Press the validator button to check for scheduling conflicts with existing giveaways.</p>
							</div>
							<div className="Polaris-CalloutCard__Buttons">
								<button id="ValidateBtn" className="Polaris-Button Polaris-Button--outline" aria-label="Validate" type="button">
									<span className="Polaris-Button__Content">
										<span className="Polaris-Button__Text">Validate</span>
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const ActionButtons = (props) => {
	//console.log()
	return (
		<div className="Polaris-Stack Polaris-Stack--distributionEqualSpacing">
			<div className="Polaris-Stack__Item">
				<button className="Polaris-Button DiscardAny" aria-label="discard" type="button">
					<span className="Polaris-Button__Content">
						<span className="Polaris-Button__Text">Discard</span>
					</span>
				</button>
			</div>
			<div className="Polaris-Stack__Item">
				<button className="Polaris-Button Polaris-Button--primary" aria-label="Save giveaway" onClick={props.fn} type="button">
					<span className="Polaris-Button__Content">
						<span className="Polaris-Button__Text">Continue</span>
					</span>
				</button>
			</div>
		</div>
	)
}

const Page = () => {

	const continueButton = () => {
		return console.log("Pressed continue")
	}

	return (
		<form onSubmit={continueButton}>
			<div className="Polaris-Layout">
				<a id="SkipToContentTarget" tabIndex="-1"></a>
				<div className="Polaris-Layout__Section Polaris-Layout__Section--primary">
					<EventName/>
					<EventDescription/>
					<CurrencyCode/>
					<Qualifiers/>
					<EventType/>
					<ActiveDates/>
				</div>
				<div className="Polaris-Layout__Section Polaris-Layout__Section--fullWidth">
					<ActionButtons fn={continueButton}/>
				</div>
			</div>
		</form>
	)
}

const domContainer = document.getElementById('NewEvent');
const root = ReactDOM.createRoot(domContainer);
root.render(<Page/>);