'use strict';

const e = React.createElement;

const {useState, useRef} = React

const EventName = () => {
	const [liked, setLiked] = useState(false)

	if (liked) {
		return 'You liked this.';
	}

	return (<div class="Polaris-Card">
		<div class="Polaris-Card__Header">
			<h2 class="Polaris-Heading">Event name</h2>
		</div>
		<div class="Polaris-Card__Section">
			<div class="Polaris-Labelled--hidden">
				<div class="Polaris-Labelled__LabelWrapper">
					<div class="Polaris-Label"><label id="GiveawayNameInputLabel" htmlFor="GiveawayNameInput" className="Polaris-Label__Text">Giveaway name</label></div>
				</div>
				<div class="Polaris-Connected">
					<div class="Polaris-Connected__Item Polaris-Connected__Item--primary">
						<div class="Polaris-TextField"><input id="GiveawayNameInput" placeholder="" autoComplete="off" className="Polaris-TextField__Input" aria-labelledby="GiveawayNameInputLabel" aria-invalid="false" value=""/>
							<div class="Polaris-TextField__Backdrop"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>)
}

const Page = () => {
	return (
		<>
			<a id="SkipToContentTarget" tabIndex="-1"></a>
			<div className="Polaris-Layout__Section Polaris-Layout__Section--primary">
				
			</div>
			<div className="Polaris-Layout__Section Polaris-Layout__Section--fullWidth"></div>
		</>
	)
}

const domContainer = document.querySelector('#NewEvent');
const root = ReactDOM.createRoot(domContainer);
root.render(<Page/>);