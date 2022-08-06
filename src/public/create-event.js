// const { createApp } = Vue

// //console.log(createApp)

// createApp({
// 	data(){
// 		return {
// 			continuous: true
// 		}
// 	}
// }).mount("#NewEvent")
'use strict';

const e = React.createElement;

const {useState} = React

const LikeButton = () => {
	const [liked, setLiked] = useState(false)

	if (liked) {
		return 'You liked this.';
	}

	return (`<div class="Polaris-Card">
						<div class="Polaris-Card__Header">
							<h2 class="Polaris-Heading">Event name</h2>
						</div>
						<div class="Polaris-Card__Section">
							<div class="Polaris-Labelled--hidden">
								<div class="Polaris-Labelled__LabelWrapper">
									<div class="Polaris-Label"><label id="GiveawayNameInputLabel" for="GiveawayNameInput" class="Polaris-Label__Text">Giveaway name</label></div>
								</div>
								<div class="Polaris-Connected">
									<div class="Polaris-Connected__Item Polaris-Connected__Item--primary">
										<div class="Polaris-TextField"><input id="GiveawayNameInput" placeholder="" autocomplete="off" class="Polaris-TextField__Input" aria-labelledby="GiveawayNameInputLabel" aria-invalid="false" value="">
											<div class="Polaris-TextField__Backdrop"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>`)
}  

const domContainer = document.querySelector('#NewEvent');
const root = ReactDOM.createRoot(domContainer);
root.render(<LikeButton/>);