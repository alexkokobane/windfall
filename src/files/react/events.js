'use strict';

const e = React.createElement;

const {useState, useRef, useEffect} = React

const eyedee = new Date(item.date).toISOString().split("T")[0]
						if(data.includes(item.date) && new Date(item.date) < new Date(Date.now())){
							one = one.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--disabled calendarDayInUse" aria-label="Disabled date, ${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(data.includes(item.date)){
							one = one.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayInUse" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(chosenDays.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
							one = one.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today calendarDayChosen" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(chosenDays.includes(item.date)){
							one = one.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayChosen" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
							one = one.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(new Date(item.date) < new Date(Date.now())){
							one = one.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--disabled" aria-label="Disabled date, ${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else {
							one = one.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						}

// important functions
function toISOLocal(d) {
	let z  = n =>  ('0' + n).slice(-2);
	let zz = n => ('00' + n).slice(-3);
	let off = d.getTimezoneOffset();
	let sign = off > 0? '-' : '+';
	off = Math.abs(off);

	return d.getFullYear() + '-'
					+ z(d.getMonth()+1) + '-' +
					z(d.getDate()) + 'T' +
					z(d.getHours()) + ':'  + 
					z(d.getMinutes()) + ':' +
					z(d.getSeconds()) + '.' +
					zz(d.getMilliseconds()) +
					sign + z(off/60|0) + ':' + z(off%60); 
}

// partial components
const LoadingMonth = () => {
	return (
		<tbody className="calendarBody">
			<tr className="Polaris-DatePicker__Week">
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
			</tr>
			<tr className="Polaris-DatePicker__Week">
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
			</tr>
			<tr className="Polaris-DatePicker__Week">
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
			</tr>
			<tr className="Polaris-DatePicker__Week">
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
			</tr>
			<tr className="Polaris-DatePicker__Week">
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
				<td className="Polaris-DatePicker__DayCell"><button className="Polaris-DatePicker__Day"><div className="Polaris-SkeletonBodyText"></div></button></td>
			</tr>
		</tbody>
	)
}

const DaySwitcher = ({item, events, selected, onSelect}) => {
  	let component;

  	const eyedee = new Date(item.date).toISOString().split("T")[0]
	if(events.includes(item.date) && new Date(item.date) < new Date(Date.now())){
		component = (
			<td className="Polaris-DatePicker__DayCell">
				<button type="button" tabindex="-1" className="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--disabled calendarDayInUse" aria-label="Disabled date, ${item.date}">
					{new Date(item.date).getDate()}
				</button>
			</td>
		)
	} else if(events.includes(item.date)){
		component = (
			<td className="Polaris-DatePicker__DayCell">
				<button id="${eyedee}" onClick={onSelect} type="button" tabindex="-1" className="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayInUse" aria-label="${item.date}">
					{new Date(item.date).getDate()}
				</button>
			</td>
		)
	} else if(selected.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
		component = (
			<td className="Polaris-DatePicker__DayCell">
				<button id="${eyedee}" onClick={onSelect} type="button" tabindex="-1" className={selected.includes(item.date) ? "Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today calendarDayChosen" : "Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today"} aria-label="${item.date}">
					{new Date(item.date).getDate()}
				</button>
			</td>
		)
	} else if(selected.includes(item.date)){
		component = (
			<td className="Polaris-DatePicker__DayCell">
				<button id="${eyedee}" onClick={onSelect} type="button" tabindex="-1" className={selected.includes(item.date) ? "Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayChosen" : "Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight"} aria-label="${item.date}">
					{new Date(item.date).getDate()}
				</button>
			</td>
		)
	} else if(item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
		component = (
			<td className="Polaris-DatePicker__DayCell">
				<button id="${eyedee}" onClick={onSelect} type="button" tabindex="-1" className="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
					{new Date(item.date).getDate()}
				</button>
			</td>
		)
	} else if(new Date(item.date) < new Date(Date.now())){
		component = (
			<td className="Polaris-DatePicker__DayCell">
				<button type="button" tabindex="-1" className="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--disabled" aria-label="Disabled date, ${item.date}">
					{new Date(item.date).getDate()}
				</button>
			</td>
		)
	} else {
		component = (
			<td className="Polaris-DatePicker__DayCell">
				<button id="${eyedee}" onClick={onSelect} type="button" tabindex="-1" className="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
					{new Date(item.date).getDate()}
				</button>
			</td>
		)
	}
  	return component
}

const CalendarMutable = ({picked}) => {

	const [count, setCount] = useState(new Date(Date.now()).getMonth())
	const [loading, setLoading] = useState(true)
	const [events, setEvents] = useState([])
	const [selected, setSelected] = useState([])

	const onSelect = () => {

	}

	useEffect(async () => {
		try{
			const res = await fetch('/data/all-event-dates')
			const data = res.json()
			data.forEach((item, index, arr) => {
				return arr[index] = new Date(item).toLocaleDateString('en-ZA')
			})
			setEvents(data)
			setLoading(false)
		} catch(err){
			setLoading(false)
		}
	}, [])

	const nextMonth = () => setCount++
	const prevMonth = () => setCount--
	const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
	const dater = new Date(toISOLocal(new Date(Date.now())).substring(0,8)+"01")
	const anyMonth = new Date(dater.setMonth(count))

	function calendar(){
		let daySoFar = 0
		let firstDay = new Date(Number(anyMonth))
		let aMonth = []
		for(let i = 2; anyMonth.getMonth() === firstDay.getMonth(); i++){
	
			aMonth.push({
				"day": firstDay.getDay(),
				"date": firstDay.toLocaleDateString('en-ZA')
			})
			daySoFar++
			firstDay = new Date(Number(anyMonth)+(1000*60*60*24*daySoFar))
		}
		
		return aMonth
	}

	let fullMonth = calendar()
			
	function allocateWeeks() {
		let fromWeekend = 7 - fullMonth[0].day
		let week1 = fullMonth.slice(0,fromWeekend)
		let week2 = fullMonth.slice(fromWeekend, fromWeekend+7)
		let week3 = fullMonth.slice(fromWeekend+7, fromWeekend+14)
		let week4 = fullMonth.slice(fromWeekend+14, fromWeekend+21)
		let week5 = fullMonth.slice(fromWeekend+21, fromWeekend+28)
		let week6 = fullMonth.slice(fromWeekend+28, fromWeekend+35)
				
		return[week1, week2, week3, week4, week5, week6]
	}

	let rowEmpty = [], row1 = [], row2 = [], row3 = [], row4 = [], row5 = [], row6 = []
	for(let i = 0; weeks[0].length + i !== 7; i++){
		rowEmpty.push(<td key={i} class="Polaris-DatePicker__EmptyDayCell"></td>)
	}

	return (
		<div class="Polaris-DatePicker">
			<div class="Polaris-DatePicker__Header">
				<button class="Polaris-Button Polaris-Button--plain Polaris-Button--iconOnly" onClick={prevMonth} aria-label="Show previous month, January 2018" type="button">
					<span class="Polaris-Button__Content">
						<span class="Polaris-Button__Icon">
							<span class="Polaris-Icon">
								<span class="Polaris-VisuallyHidden"></span>
								<svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
									<path d="M17 9H5.414l3.293-3.293a.999.999 0 1 0-1.414-1.414l-5 5a.999.999 0 0 0 0 1.414l5 5a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L5.414 11H17a1 1 0 1 0 0-2z"></path>
								</svg>
							</span>
						</span>
					</span>
				</button>
				<button class="Polaris-Button Polaris-Button--plain Polaris-Button--iconOnly" onClick={nextMonth} aria-label="Show next month, March 2018" type="button">
					<span class="Polaris-Button__Content">
						<span class="Polaris-Button__Icon">
							<span class="Polaris-Icon">
								<span class="Polaris-VisuallyHidden"></span>
								<svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
									<path d="m17.707 9.293-5-5a.999.999 0 1 0-1.414 1.414L14.586 9H3a1 1 0 1 0 0 2h11.586l-3.293 3.293a.999.999 0 1 0 1.414 1.414l5-5a.999.999 0 0 0 0-1.414z"></path>
								</svg>
							</span>
						</span>
					</span>
				</button>
			</div>
			<div class="Polaris-DatePicker__MonthLayout">
				<div class="Polaris-DatePicker__MonthContainer">
					<table role="grid" class="Polaris-DatePicker__Month">
						<caption class="calendarCaption Polaris-DatePicker__Title">{anyMonth ? monthNames[anyMonth.getMonth()]+" "+anyMonth.getFullYear() : "Month, Year"}</caption>
						<thead>
							<tr>
								<th aria-label="Sunday" scope="col" class="Polaris-DatePicker__Weekday">Su</th>
								<th aria-label="Monday" scope="col" class="Polaris-DatePicker__Weekday">Mo</th>
								<th aria-label="Tuesday" scope="col" class="Polaris-DatePicker__Weekday">Tu</th>
								<th aria-label="Wednesday" scope="col" class="Polaris-DatePicker__Weekday">We</th>
								<th aria-label="Thursday" scope="col" class="Polaris-DatePicker__Weekday">Th</th>
								<th aria-label="Friday" scope="col" class="Polaris-DatePicker__Weekday">Fr</th>
								<th aria-label="Saturday" scope="col" class="Polaris-DatePicker__Weekday">Sa</th>
							</tr>
						</thead>
						<LoadingMonth/>
					</table>
				</div>
			</div>
		</div>
	)
}

// form field components
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

const Qualifiers = (props) => {
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

const EventType = (props) => {
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
								<span className="Polaris-Button__Text">Episodic</span>
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

const Goals = (props) => {
	return (
		<div className="Polaris-Card">
			<div className="Polaris-Card__Header">
				<h2 className="Polaris-Heading">Set goals</h2>
			</div>
			<div className="Polaris-Card__Section">
				<div className="Polaris-Card__SectionHeader">
					<h3 className="Polaris-Subheading">Total revenue</h3>
				</div>
				<div className="Polaris-Labelled--hidden">
					<div className="Polaris-Labelled__LabelWrapper">
						<div className="Polaris-Label">
							<label id="TotalRevenueInputLabel" htmlFor="TotalRevenueInput" className="Polaris-Label__Text">Total revenue</label>
						</div>
					</div>
					<div className="Polaris-Connected">
						<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
							<div className="Polaris-TextField">
								<input id="TotalRevenueInput" type="number" placeholder="" autocomplete="off" className="Polaris-TextField__Input" aria-labelledby="TotalRevenueInputLabel" aria-invalid="false" value=""/>
								<div className="Polaris-TextField__Backdrop"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="Polaris-Card__Section">
				<div className="Polaris-Card__SectionHeader">
					<h3 className="Polaris-Subheading">Total entries</h3>
				</div>
				<div className="Polaris-Labelled--hidden">
					<div className="Polaris-Labelled__LabelWrapper">
						<div className="Polaris-Label">
							<label id="TotalEntriesInputLabel" htmlFor="TotalEntriesInput" className="Polaris-Label__Text">Total entries</label></div>
					</div>
					<div className="Polaris-Connected">
						<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
							<div className="Polaris-TextField">
								<input id="TotalEntriesInput" type="number" placeholder="" autocomplete="off" className="Polaris-TextField__Input" aria-labelledby="TotalEntriesInputLabel" aria-invalid="false" value=""/>
								<div className="Polaris-TextField__Backdrop"></div>
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

// continous event fields
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

const NumberOfWinners = (props) => {
	return (
		<div id="OfWinnersCard" className="Polaris-Card">
			<div className="Polaris-Card__Header">
				<h2 className="Polaris-Heading">Number of winners</h2>
			</div>
			<div className="Polaris-Card__Section">
				<div className="Polaris-Labelled--hidden">
					<div className="Polaris-Labelled__LabelWrapper">
						<div className="Polaris-Label">
							<label id="OfWinnersLabel" htmlFor="OfWinners" className="Polaris-Label__Text">Number of winners</label>
						</div>
					</div>
					<div className="Polaris-Connected">
						<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
							<div className="Polaris-TextField Polaris-TextField--hasValue">
								<input id="OfWinners" autocomplete="off" className="Polaris-TextField__Input" type="number" aria-labelledby="VoucherInputFieldLabel" aria-invalid="false" max="50" value=""/>
								<div clasNames="Polaris-TextField__Backdrop"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const PrizeDistribution = (props) => {
	return (
		<div id="DistributionCard" className="Polaris-Card">
			<div className="Polaris-Card__Header">
				<h2 className="Polaris-Heading">Prize distribution</h2>
			</div>
			<div className="Polaris-Card__Section">
				<div className="Polaris-Stack Polaris-Stack--vertical">
					<div className="Polaris-Stack__Item">
						<div>
							<label className="Polaris-Choice" htmlFor="Equitable">
								<span className="Polaris-Choice__Control">
									<span className="Polaris-RadioButton">
										<input id="Equitable" name="distribution" type="radio" className="Polaris-RadioButton__Input" aria-describedby="EquitableHelpText" value="Equitable"/>
										<span className="Polaris-RadioButton__Backdrop"></span>
									</span>
								</span>
								<span className="Polaris-Choice__Label">Equitable</span>
							</label>
							<div className="Polaris-Choice__Descriptions">
								<div className="Polaris-Choice__HelpText" id="EquitableHelpText">All winners get the same prize, there is no hierarchy.</div>
							</div>
						</div>
					</div>
					<div className="Polaris-Stack__Item">
						<div>
							<label className="Polaris-Choice" htmlFor="Hierarchical">
								<span className="Polaris-Choice__Control">
									<span className="Polaris-RadioButton">
										<input id="Hierarchical" name="distribution" type="radio" className="Polaris-RadioButton__Input" aria-describedby="HierachicalHelpText" value="Hierarchical"/>
										<span className="Polaris-RadioButton__Backdrop"></span>
									</span>
								</span>
								<span className="Polaris-Choice__Label">Hierarchical</span>
							</label>
							<div className="Polaris-Choice__Descriptions">
								<div className="Polaris-Choice__HelpText" id="HierarchicalHelpText">Each winner's prize will reflect on their rank as chosen by you.</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const ContinuousPrizes = (props) => {


	return (
		<div id="AllWinnersCard" className="Polaris-Card">
			<div className="Polaris-Card__Header">
				<h2 className="Polaris-Heading">All winners' prize</h2>
			</div>
			{/* equitable */}
			<div className="Polaris-Card__Section">
				<div className="Polaris-Stack Polaris-Stack--vertical">
					<div id="VoucherInputFieldContainer" className="Polaris-Stack__Item">
						<div className="Polaris-Labelled">
							<div className="Polaris-Labelled__LabelWrapper">
								<div className="Polaris-Label">
									<label id="VoucherInpuFieldtLabel" htmlFor="VoucherInputField" className="Polaris-Label__Text">Voucher amount</label>
								</div>
							</div>
							<div className="Polaris-Connected">
								<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
									<div className="Polaris-TextField Polaris-TextField--hasValue">
										<input id="VoucherInputField" autocomplete="off" className="Polaris-TextField__Input" type="number" aria-labelledby="VoucherInputFieldLabel VoucherInputFieldPrefix" aria-invalid="false" value=""/>
										<div className="Polaris-TextField__Backdrop"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* hierarchical */}
			<div className="Polaris-Card__Section WinnerPlaceholder">
				<div className="Polaris-Stack Polaris-Stack--vertical">
					<div className="Polaris-Stack__Item">
						<div className="Polaris-Stack distributionFillEvenly">
							<div className="Polaris-Stack__Item">
								<span aria-label="Farrah" role="img" className="Polaris-Avatar Polaris-Avatar--sizeMedium">
									<span className="Polaris-Avatar__Initials">
										<svg className="Polaris-Avatar__Svg" viewBox="0 0 40 40">
											<path fill="currentColor" d="M8.28 27.5A14.95 14.95 0 0120 21.8c4.76 0 8.97 2.24 11.72 5.7a14.02 14.02 0 01-8.25 5.91 14.82 14.82 0 01-6.94 0 14.02 14.02 0 01-8.25-5.9zM13.99 12.78a6.02 6.02 0 1112.03 0 6.02 6.02 0 01-12.03 0z"></path>
										</svg>
									</span>
								</span>
							</div>
							<div className="Polaris-Stack__Item">
								<div className="Polaris-Card__SectionHeader">
									<h2 className="Polaris-Subheading">Number 1</h2>
								</div>
								<div className="Polaris-TextContainer">
									<div className="Polaris-SkeletonBodyText"></div>
									<div className="Polaris-SkeletonBodyText"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="Polaris-Card__Footer">
				<button id="ECreate" className="Polaris-Button Polaris-Button--primary">
					<span className="Polaris-Button__Content">
						<span id="ECreateText" className="Polaris-Button__Text">Create</span>
					</span>
				</button>
			</div>
		</div>
	)
}

// episodic event fields
const DatePicker = (props) => {
	return (
		<div class="Polaris-Card">
			<div class="Polaris-Card__Header">
				<h2 class="Polaris-Heading">Set dates</h2>
			</div>
			<div class="Polaris-Card__Section">
				<CalendarMutable/>
			</div>
			<div class="Polaris-CalloutCard__Container">
				<div class="Polaris-Card__Section">
					<div class="Polaris-CalloutCard">
						<div class="Polaris-CalloutCard__Content">
							<div class="Polaris-CalloutCard__Title">
								<h2 id="RValidHeading" class="Polaris-Heading">Validate scheduling</h2>
							</div>
							<div id="RValidBody" class="Polaris-TextContainer">
								<p>Press the validator button to check for scheduling conflicts with existing giveaways.</p>
							</div>
							<div class="Polaris-CalloutCard__Buttons">
								<button id="RValidateBtn" class="Polaris-Button Polaris-Button--outline" aria-label="Validate" type="button"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Validate</span></span></button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const EpisodicPrizes = (props) => {
	return (
		<div id="OfWinnersCard" className="Polaris-Card">
			<div className="Polaris-Card__Header">
				<h2 className="Polaris-Heading">Prizes</h2>
			</div>
			<div className="Polaris-Card__Section">
				<div className="Polaris-Card__SectionHeader">
					<h3 className="Polaris-Subheading">Standard prize voucher amount</h3>
				</div>
				<div className="Polaris-Labelled--hidden">
					<div className="Polaris-Labelled__LabelWrapper">
						<div className="Polaris-Label">
							<label id="NormalPrizeLabel" htmlFor="NormalPrize" className="Polaris-Label__Text">Standard prize voucher amout</label>
						</div>
					</div>
					<div className="Polaris-Connected">
						<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
							<div className="Polaris-TextField Polaris-TextField--hasValue">
								<input id="NormalPrize" autocomplete="off" className="Polaris-TextField__Input" type="number" aria-labelledby="NormalPrizeLabel" value=""/>
								<div className="Polaris-TextField__Backdrop"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="Polaris-Card__Section">
				<div className="Polaris-Card__SectionHeader">
					<h3 className="Polaris-Subheading">Grand prize voucher amount</h3>
				</div>
				<div className="Polaris-Labelled--hidden">
					<div className="Polaris-Labelled__LabelWrapper">
						<div className="Polaris-Label">
							<label id="GrandPrizeLabel" htmlFor="GrandPrize" className="Polaris-Label__Text">Grand prize voucher amout</label>
						</div>
					</div>
					<div className="Polaris-Connected">
						<div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
							<div className="Polaris-TextField Polaris-TextField--hasValue">
								<input id="GrandPrize" autocomplete="off" className="Polaris-TextField__Input" type="number" aria-labelledby="GrandPrizeLabel" value=""/>
								<div className="Polaris-TextField__Backdrop"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

// page render
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