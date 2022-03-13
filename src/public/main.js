$(document).ready(function(e){
	//theme
	function datePicker(){
		function renderMonth(num){

			function scheduler(num){
				const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
				const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
				let dateNow = new Date(Date.now())
				let theDate = new Date(dateNow.setMonth(num))
				return {
					"day": days[theDate.getDay()],
					"month": months[theDate.getMonth()],
					"year": theDate.getFullYear(),
					"raw": new Date(theDate),
					"which": 2
				}
			}

			function calendar(num){
				let today = scheduler(num)
				let daySoFar = today.raw.getDate()-1
				let firstDay = new Date(Number(today.raw)-(1000*60*60*24*daySoFar))
				let aMonth = []
				for(let i = 2; today.raw.getMonth() === firstDay.getMonth(); i++){
	
					aMonth.push({
						"day": firstDay.getDay(),
						"date": firstDay.toLocaleDateString('en-ZA')
					})
					daySoFar = today.raw.getDate()-i
					firstDay = new Date(Number(today.raw)-(1000*60*60*24*daySoFar))
				}
				
				return aMonth
			}

			let fullMonth = calendar(num)
			if(fullMonth.length === 0){
				alert("The error.")
			}
			
			function allocateWeeks() {
				const firstDay = fullMonth[0].day
				let fromWeekend = 7 - firstDay
				let week1 = fullMonth.slice(0,fromWeekend)
				let week2 = fullMonth.slice(fromWeekend, fromWeekend+7)
				let week3 = fullMonth.slice(fromWeekend+7, fromWeekend+14)
				let week4 = fullMonth.slice(fromWeekend+14, fromWeekend+21)
				let week5 = fullMonth.slice(fromWeekend+21, fromWeekend+28)
				let week6 = fullMonth.slice(fromWeekend+28, fromWeekend+35)
				
				return[week1, week2, week3, week4, week5, week6]
			}
			
			$.ajax({
				url: "/data/all-event-dates",
				type: "GET",
				contentType: "application/json",
				success: function(data){
					const weeks = allocateWeeks()
					let one = ""; let two = ""; let three = ""; let four = ""; let five = ""; let six = "";
			
					for(let i = 0; weeks[0].length + i !== 7; i++){
						one = one.concat(`<td class="Polaris-DatePicker__EmptyDayCell"></td>`)
					}
					data
					console.log(data)
					weeks[0].forEach(function(item){
						console.log(data.includes(item.date))
						console.log(item.date)
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
						} else if(chosenDays.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString()){
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
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(item.date === new Date(Date.now()).toLocaleDateString()){
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
					})
					weeks[1].forEach(function(item){
						const eyedee = new Date(item.date).toISOString().split("T")[0]
						if(data.includes(item.date) && new Date(item.date) < new Date(Date.now())){
							two = two.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--disabled calendarDayInUse" aria-label="Disabled date, ${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(data.includes(item.date)){
							two = two.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayInUse" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(chosenDays.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString()){
							two = two.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today calendarDayChosen" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(chosenDays.includes(item.date)){
							two = two.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(item.date === new Date(Date.now()).toLocaleDateString()){
							two = two.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(new Date(item.date) < new Date(Date.now())){
							two = two.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--disabled" aria-label="Disabled date, ${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else {
							two = two.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						}
					})
					weeks[2].forEach(function(item){
						const eyedee = new Date(item.date).toISOString().split("T")[0]
						if(data.includes(item.date) && new Date(item.date) < new Date(Date.now())){
							three = three.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--disabled calendarDayInUse" aria-label="Disabled date, ${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(data.includes(item.date)){
							three = three.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayInUse" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(chosenDays.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString()){
							three = three.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today calendarDayChosen" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(chosenDays.includes(item.date)){
							three = three.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(item.date === new Date(Date.now()).toLocaleDateString()){
							three = three.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(new Date(item.date) < new Date(Date.now())){
							three = three.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--disabled" aria-label="Disabled date, ${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else {
							three = three.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						}
					})
					weeks[3].forEach(function(item){
						const eyedee = new Date(item.date).toISOString().split("T")[0]
						if(data.includes(item.date) && new Date(item.date) < new Date(Date.now())){
							four = four.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--disabled calendarDayInUse" aria-label="Disabled date, ${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(data.includes(item.date)){
							four = four.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayInUse" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(chosenDays.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString()){
							four = four.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today calendarDayChosen" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(chosenDays.includes(item.date)){
							four = four.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(item.date === new Date(Date.now()).toLocaleDateString()){
							four = four.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(new Date(item.date) < new Date(Date.now())){
							four = four.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--disabled" aria-label="Disabled date, ${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else {
							four = four.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						}
					})
					weeks[4].forEach(function(item){
						const eyedee = new Date(item.date).toISOString().split("T")[0]
						if(data.includes(item.date) && new Date(item.date) < new Date(Date.now())){
							five = five.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--disabled calendarDayInUse" aria-label="Disabled date, ${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(data.includes(item.date)){
							five = five.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayInUse" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(chosenDays.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString()){
							five = five.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today calendarDayChosen" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(chosenDays.includes(item.date)){
							five = five.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(item.date === new Date(Date.now()).toLocaleDateString()){
							five = five.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(new Date(item.date) < new Date(Date.now())){
							five = five.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--disabled" aria-label="Disabled date, ${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else {
							five = five.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						}
					})
					weeks[5].forEach(function(item){
						const eyedee = new Date(item.date).toISOString().split("T")[0]
						if(data.includes(item.date) && new Date(item.date) < new Date(Date.now())){
							six = six.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--disabled calendarDayInUse" aria-label="Disabled date, ${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(data.includes(item.date)){
							six = six.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayInUse" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(chosenDays.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString()){
							six = six.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today calendarDayChosen" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(chosenDays.includes(item.date)){
							six = six.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(item.date === new Date(Date.now()).toLocaleDateString()){
							six = six.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else if(new Date(item.date) < new Date(Date.now())){
							six = six.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--disabled" aria-label="Disabled date, ${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						} else {
							six = six.concat(`
								<td class="Polaris-DatePicker__DayCell">
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
										${new Date(item.date).getDate()}
									</button>
								</td>
							`)
						}
					})

					let tableRowOne = `<tr class="Polaris-DatePicker__Week">${one}</tr>`
					let tableRowTwo = `<tr class="Polaris-DatePicker__Week">${two}</tr>`
					let tableRowThree = `<tr class="Polaris-DatePicker__Week">${three}</tr>`
					let tableRowFour = `<tr class="Polaris-DatePicker__Week">${four}</tr>`
					let tableRowFive = `<tr class="Polaris-DatePicker__Week">${five}</tr>`
					let tableRowSix = `<tr class="Polaris-DatePicker__Week">${six}</tr>`

					$(".calendarCaption").text(scheduler(num).month+" "+scheduler(num).year)
					$(".calendarBody").html(tableRowOne.concat(tableRowTwo, tableRowThree, tableRowFour, tableRowFive, tableRowSix))

					calendar(num).forEach(function(item){
						const eyedee = new Date(item.date).toISOString().split("T")[0]
						//console.log($("#"+eyedee).text())
						$("#"+eyedee).click(function(){
							const isChosen = $(this).hasClass("calendarDayChosen")
							const isInUse = $(this).hasClass("calendarDayInUse")
							console.log(`${item.date} was clicked`)
							if(isInUse){
								alert("This date is already in use, try another date")
							} else if(isChosen){
								$(this).removeClass("calendarDayChosen")
								const index = chosenDays.indexOf(item.date)
								if(index > -1){
									chosenDays.splice(index, 1)
								}
								console.log(chosenDays)
							} else if(!isChosen){
								$(this).addClass("calendarDayChosen")
								chosenDays.push(item.date)
								console.log(chosenDays)
							}
						})
					})
				}
			})
		}
		let chosenDays = []
		let counter = [new Date(Date.now()).getMonth()]
		$(".calendarPrev").click(function(total){
			counter.push(-1)
			//console.log(counter)
			total = counter.reduce(function(sum, num){
				return sum+num
			}, 0)
			
			$(".calendarBody").html(`
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
			`)
			//console.log(total)
			
			renderMonth(total)
		})
		$(".calendarNext").click(function(){
			counter.push(1)
			//console.log(counter)
			total = counter.reduce(function(sum, num){
				return sum+num
			}, 0)
			$(".calendarBody").html(`
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
			`)
			//console.log(total)
			renderMonth(total)
		})
		
		renderMonth(new Date(Date.now()).getMonth())

		$("#DDays").click(function(){
			console.log(chosenDays)
		})

		return chosenDays
	}

	function eventCalendar(str){
		function scheduler(num){
			const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
			const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
			let dateNow = new Date(Date.now())
			let theDate = new Date(dateNow.setMonth(num))
			//console.log(theDate)
			return {
				"day": days[theDate.getDay()],
				"month": months[theDate.getMonth()],
				"year": theDate.getFullYear(),
				"raw": new Date(theDate),
				"which": 2
			}
		}
		function calendar(num){
			let today = scheduler(num)
			let daySoFar = today.raw.getDate()-1
			let firstDay = new Date(Number(today.raw)-(1000*60*60*24*daySoFar))
			let aMonth = []
			for(let i = 2; today.raw.getMonth() === firstDay.getMonth(); i++){
				aMonth.push({
					"day": firstDay.getDay(),
					"date": firstDay.toLocaleDateString('en-ZA')
				})
				daySoFar = today.raw.getDate()-i
				firstDay = new Date(Number(today.raw)-(1000*60*60*24*daySoFar))
			}
			
			return aMonth			
		}
		function renderMonth(num){
			let fullMonth = calendar(num)
			
			function allocateWeeks() {
				const firstDay = fullMonth[0].day
				let fromWeekend = 7 - firstDay
				let week1 = fullMonth.slice(0,fromWeekend)
				let week2 = fullMonth.slice(fromWeekend, fromWeekend+7)
				let week3 = fullMonth.slice(fromWeekend+7, fromWeekend+14)
				let week4 = fullMonth.slice(fromWeekend+14, fromWeekend+21)
				let week5 = fullMonth.slice(fromWeekend+21, fromWeekend+28)
				let week6 = fullMonth.slice(fromWeekend+28, fromWeekend+35)
				//console.log(week6)
				return[week1, week2, week3, week4, week5, week6]
			}
			const weeks = allocateWeeks()

			let one = ""; let two = ""; let three = ""; let four = ""; let five = ""; let six = "";
			
			for(let i = 0; weeks[0].length + i !== 7; i++){
				one = one.concat(`<td class="Polaris-DatePicker__EmptyDayCell"></td>`)
			}
			if(str){
				let data = str.map(function(item){
					return new Date(item).toLocaleDateString('en-ZA')
				})
				//console.log(data)
				weeks[0].forEach(function(item){
					//console.log(data.includes(item.date))
					//console.log(item.date)
					const eyedee = new Date(item.date).toISOString().split("T")[0]
					if(data.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
						one = one.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--selected" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else if(data.includes(item.date)){
						one = one.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--selected" aria-label="${item.date}">
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
					} else {
						one = one.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					}
				})
				weeks[1].forEach(function(item){
					const eyedee = new Date(item.date).toISOString().split("T")[0]
					if(data.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
						two = two.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--selected" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else if(data.includes(item.date)){
						two = two.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--selected" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else if(item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
						two = two.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else {
						two = two.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					}
				})
				weeks[2].forEach(function(item){
					const eyedee = new Date(item.date).toISOString().split("T")[0]
					if(data.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
						three = three.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--selected" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else if(data.includes(item.date)){
						three = three.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--selected" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else if(item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
						three = three.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else {
						three = three.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					}
				})
				weeks[3].forEach(function(item){
					const eyedee = new Date(item.date).toISOString().split("T")[0]
					if(data.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
						four = four.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--selected" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else if(data.includes(item.date)){
						four = four.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--selected" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else if(item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
						four = four.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else {
						four = four.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					}
				})
				weeks[4].forEach(function(item){
					const eyedee = new Date(item.date).toISOString().split("T")[0]
					if(data.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
						five = five.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--selected" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else if(data.includes(item.date)){
						five = five.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--selected" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else if(item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
						five = five.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else {
						five = five.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					}
				})
				weeks[5].forEach(function(item){
					const eyedee = new Date(item.date).toISOString().split("T")[0]
					if(data.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
						six = six.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--selected" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else if(data.includes(item.date)){
						six = six.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--selected" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else if(item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
						six = six.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					} else {
						six = six.concat(`
							<td class="Polaris-DatePicker__DayCell">
								<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
									${new Date(item.date).getDate()}
								</button>
							</td>
						`)
					}
				})

				let tableRowOne = `<tr class="Polaris-DatePicker__Week">${one}</tr>`
						let tableRowTwo = `<tr class="Polaris-DatePicker__Week">${two}</tr>`
						let tableRowThree = `<tr class="Polaris-DatePicker__Week">${three}</tr>`
						let tableRowFour = `<tr class="Polaris-DatePicker__Week">${four}</tr>`
						let tableRowFive = `<tr class="Polaris-DatePicker__Week">${five}</tr>`
						let tableRowSix = `<tr class="Polaris-DatePicker__Week">${six}</tr>`

						$(".eventCalendarCaption").text(scheduler(num).month+" "+scheduler(num).year)
						$(".eventCalendarBody").html(tableRowOne.concat(tableRowTwo, tableRowThree, tableRowFour, tableRowFive, tableRowSix))
			} else{
				$.ajax({
					url: "/data/all-event-dates",
					type: "GET",
					contentType: "application/json",
					success: function(data){
						data
						//console.log(data)
						weeks[0].forEach(function(item){
							//console.log(data.includes(item.date))
							//console.log(item.date)
							const eyedee = new Date(item.date).toISOString().split("T")[0]
							if(data.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
								one = one.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--selected" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else if(data.includes(item.date)){
								one = one.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--selected" aria-label="${item.date}">
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
							} else {
								one = one.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							}
						})
						weeks[1].forEach(function(item){
							const eyedee = new Date(item.date).toISOString().split("T")[0]
							if(data.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
								two = two.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--selected" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else if(data.includes(item.date)){
								two = two.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--selected" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else if(item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
								two = two.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else {
								two = two.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							}
						})
						weeks[2].forEach(function(item){
							const eyedee = new Date(item.date).toISOString().split("T")[0]
							if(data.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
								three = three.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--selected" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else if(data.includes(item.date)){
								three = three.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--selected" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else if(item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
								three = three.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else {
								three = three.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							}
						})
						weeks[3].forEach(function(item){
							const eyedee = new Date(item.date).toISOString().split("T")[0]
							if(data.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
								four = four.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--selected" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else if(data.includes(item.date)){
								four = four.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--selected" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else if(item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
								four = four.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else {
								four = four.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							}
						})
						weeks[4].forEach(function(item){
							const eyedee = new Date(item.date).toISOString().split("T")[0]
							if(data.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
								five = five.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--selected" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else if(data.includes(item.date)){
								five = five.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--selected" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else if(item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
								five = five.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else {
								five = five.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							}
						})
						weeks[5].forEach(function(item){
							const eyedee = new Date(item.date).toISOString().split("T")[0]
							if(data.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
								six = six.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today Polaris-DatePicker__Day--selected" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else if(data.includes(item.date)){
								six = six.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--selected" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else if(item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
								six = six.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight Polaris-DatePicker__Day--today" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							} else {
								six = six.concat(`
									<td class="Polaris-DatePicker__DayCell">
										<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight" aria-label="${item.date}">
											${new Date(item.date).getDate()}
										</button>
									</td>
								`)
							}
						})

						let tableRowOne = `<tr class="Polaris-DatePicker__Week">${one}</tr>`
						let tableRowTwo = `<tr class="Polaris-DatePicker__Week">${two}</tr>`
						let tableRowThree = `<tr class="Polaris-DatePicker__Week">${three}</tr>`
						let tableRowFour = `<tr class="Polaris-DatePicker__Week">${four}</tr>`
						let tableRowFive = `<tr class="Polaris-DatePicker__Week">${five}</tr>`
						let tableRowSix = `<tr class="Polaris-DatePicker__Week">${six}</tr>`

						$(".eventCalendarCaption").text(scheduler(num).month+" "+scheduler(num).year)
						$(".eventCalendarBody").html(tableRowOne.concat(tableRowTwo, tableRowThree, tableRowFour, tableRowFive, tableRowSix))
						//console.log(tableRowOne.concat(tableRowTwo, tableRowThree, tableRowFour, tableRowFive, tableRowSix))
					}
				})
			}
		}
		//let chosenDays = []
		let counter = [new Date(Date.now()).getMonth()]
		$(".eventCalendarPrev").click(function(total, nav){
			counter.push(-1)
			total = counter.reduce(function(sum, num){
				return sum+num
			}, 0)

			$(".eventCalendarBody").html(`
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
			`)
			
			//console.log(calendar(0, true))
			renderMonth(total)
		})
		$(".eventCalendarNext").click(function(){
			counter.push(1)
			//console.log(counter)
			total = counter.reduce(function(sum, num){
				return sum+num
			}, 0)
			$(".eventCalendarBody").html(`
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
				<tr class="Polaris-DatePicker__Week">
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
					<td class="Polaris-DatePicker__DayCell"><button class="Polaris-DatePicker__Day"><div class="Polaris-SkeletonBodyText"></div></button></td>
				</tr>
			`)

			renderMonth(total)
		})
		
		renderMonth(new Date(Date.now()).getMonth())
		$("#DDays").click(function(){
			console.log(chosenDays)
		})
	}
	////////////
	$("#BurgerMenu").click(function(){
		$("#AppFrameNav").toggle()
		$("#AppFrameNavBackdrop").toggle()
		$("#AppFrameNavDismissButton").toggle()
	})
	$("#AppFrameNavBackdrop").click(function(){
		$("#AppFrameNav").toggle()
		$("#AppFrameNavDismissButton").toggle()
		$("#AppFrameNavBackdrop").toggle()
	})
	$("#AppFrameNavDismissButton").click(function(){
		$("#AppFrameNav").toggle()
		$("#AppFrameNavBackdrop").toggle()
		$("#AppFrameNavDismissButton").toggle()
	})
	
	$("#LogoutButton").click(function(e){
		e.preventDefault()
		$.ajax({
			url: "/login/logout",
			type: "POST",
			success: function(data){
				location.href=data
			}
		})
	})
	$("#HomeBtn").click(function(){
		location.href="/"
	})
	$("#BillingBtn").click(function(){
		location.href="/billing"
	})
	$("#SettingsBtn").click(function(){
		location.href="/settings"
	})
	$("#ParticipantsBtn").click(function(){
		location.href="/participants"
	})
	$("#GiveawaysBtn").click(function(){
		location.href="/campaign/giveaways"
	})
	$("#ToShopifyLinkBtn").click(function(){
		$.ajax({
			url: '/shop',
			success: function(data){
				console.log(data)
				location.href="https://"+data.shop+"/admin"
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
			}
		})		
	})

	//url == /
	$(".CreateLong").click(function(){
		location.href="/campaign/long/new"
	})
	$(".CreateRapid").click(function(){
		location.href="/campaign/rapid/new"
	})
	$(".ToGiveawayTemplates").click(function(){
		location.href="/campaign/giveaways"
	})
	if(window.location.pathname === "/"){
		$.ajax({
			url: "/data/awaiting",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				if(data.length === 0){
					const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${55 + 10 * Math.random()}%)`
					return (
						$("#HAwaiting").html(`
							<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
								<div class="Polaris-EmptyState__Section">
									<div class="Polaris-EmptyState__DetailsContainer">
										<div class="Polaris-EmptyState__Details">
											<div class="Polaris-TextContainer">
												<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">No actions needed</p>
												<div class="Polaris-EmptyState__Content">
													<p>This action center for any outstanding actions required from expired giveaways.</p>
												</div>
											</div>
										</div>
									</div>
									<div class="Polaris-EmptyState__ImageContainer">
										<div style="width: 100%; background: ${colour};"></div>
									</div>
								</div>
							</div>
						`)
					)
				}

				$("#HAwaitingHeader").html(`
					<span>Awaiting</span>
					<span style="color: green;" id="AwaitLength"></span>
				`)
				$("#AwaitLength").text(` (${data.length})`)
				$("#HAwaiting").html(`
					<ul class="Polaris-ResourceList">
						<span id="HAwaitingDecoy"></span>
					</ul>
				`)
				data.forEach(function(giv){
					const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${15 + 10 * Math.random()}%)`
					$("#HAwaitingDecoy").after(`
						<li class="Polaris-ResourceItem__ListItem">
							<div class="Polaris-ResourceItem__ItemWrapper">
								<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling" data-href="/campaign/long/${giv.id}">
									<a id="AwaitLink${giv.id}" class="Polaris-ResourceItem__Link" tabindex="0" id="" href="/campaign/long/${giv.id}" data-polaris-unstyled="true"></a>
									<div class="Polaris-ResourceItem__Container" id="Await${giv.id}">
										<div class="Polaris-ResourceItem__Owned">
											<div class="Polaris-ResourceItem__Media">
												<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
													<div style="background: ${colour}; font-size: 5em; color: white; display: flex; flex-direction: row; align-items: center;">${giv.name.substring(0,1)}</div>
												</span>
											</div>
										</div>
										<div class="Polaris-ResourceItem__Content">
											<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
												<div class="Polaris-Stack__Item">
													<h3 class="Polaris-TextStyle--variationStrong Polaris-Subheading" style="color: green;" id="AwaitName${giv.id}"></h3>
													<div><span class="Polaris-TextStyle--variationStrong">${giv.entriesTotal}</span> customers waiting for you to pick winners and send them a gift.</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</li>
					`)
					$(`#AwaitName${giv.id}`).text(giv.name)
					$(`#AwaitLink${giv.id}`).attr("aria-label", `A link to ${giv.name}, an event waiting for you to perform actions`)
			
					if(giv.eventType === "Rapid"){
						$(`#Await${giv.id}`).click(function(){
							location.href=`/campaign/rapid/${giv.parentId}`
						})
					} else {
						$(`#Await${giv.id}`).click(function(){
							location.href=`/campaign/long/${giv.id}`
						})
					}
				})
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
				alert(data.responseText)
			}
		})
		$.ajax({
			url: "/data/campaigns/active",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				if(data.length === 0){
					$("#HomeActiveGiveawaysSkeleton").remove()
					return (
						$("#HomeActiveGiveaways").html(`
							<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
								<div class="Polaris-EmptyState__Section">
									<div class="Polaris-EmptyState__DetailsContainer">
										<div class="Polaris-EmptyState__Details">
											<div class="Polaris-TextContainer">
												<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">Create a new giveaway</p>
												<div class="Polaris-EmptyState__Content">
													<p>Incentivize customers to spend more in your store.</p>
												</div>
											</div>
											<div class="Polaris-EmptyState__Actions">
												<div class="Polaris-Stack Polaris-Stack--spacingTight Polaris-Stack--distributionCenter Polaris-Stack--alignmentCenter">
													<div class="Polaris-Stack__Item"><button class="Polaris-Button Polaris-Button--primary CreateGiveaway" type="button"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Create a giveaway</span></span></button></div>
													<div class="Polaris-Stack__Item"><a class="Polaris-Button" href="#" data-polaris-unstyled="true"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Learn more</span></span></a></div>
												</div>
											</div>
										</div>
									</div>
									<div class="Polaris-EmptyState__ImageContainer"><img src="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" role="presentation" alt="" class="Polaris-EmptyState__Image"></div>
								</div>
							</div>
						`)
					)
				}
				const obj = data[0]
				console.log(obj)
				$(".HAGSkeleton").remove()
				$("#HAGName").text(obj.name)
				$("#HAGType").text(obj.type)
				$("#HAGStarted").text(new Date(obj.startDate).toDateString())
				$("#HAGEnds").text(new Date(obj.endDate).toDateString())
				$("#HAGEntries").text(obj.entriesTotal)
				$("#HAGViewBtn").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--outline").click(function(){
					location.href=`/campaign/${obj.id}`
				})
				if(obj.eventType === "Rapid"){
					$("#HAGViewBtn").click(function(){
						location.href=`/campaign/rapid/${obj.parentId}`
					})
				} else {
					$("#HAGViewBtn").click(function(){
						location.href=`/campaign/long/${obj.id}`
					})
				}
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
				alert(data.responseText)
			}
		})
		$.ajax({
			url: "/data/campaigns/upcoming",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				//console.log("The upcoming length is "+data.length)
				if(data.length === 0){
					$("#HUGListWrapper").remove()
					return (
						$("#HomeUpcomingGiveAways").html(`
							<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
								<div class="Polaris-EmptyState__Section">
									<div class="Polaris-EmptyState__DetailsContainer">
										<div class="Polaris-EmptyState__Details">
											<div class="Polaris-TextContainer">
												<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">Create a new giveaway</p>
												<div class="Polaris-EmptyState__Content">
													<p>Incentivize customers to spend more in your store.</p>
												</div>
											</div>
											<div class="Polaris-EmptyState__Actions">
												<div class="Polaris-Stack Polaris-Stack--spacingTight Polaris-Stack--distributionCenter Polaris-Stack--alignmentCenter">
													<div class="Polaris-Stack__Item"><a href="/campaign/new" class="Polaris-Button Polaris-Button--primary CreateGiveaway" type="button"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Create a giveaway</span></span></a></div>
													<div class="Polaris-Stack__Item"><a class="Polaris-Button" href="#" data-polaris-unstyled="true"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Learn more</span></span></a></div>
												</div>
											</div>
										</div>
									</div>
									<div class="Polaris-EmptyState__ImageContainer"><img src="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" role="presentation" alt="" class="Polaris-EmptyState__Image"></div>
								</div>
							</div>
						`)
					)
				}
				$(".HUGDecoyItem").remove()
				data.forEach(function(giv){
					const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${55 + 10 * Math.random()}%)`
					$("#HUGDataDecoy").after(`
						<li class="Polaris-ResourceItem__ListItem">
							<div class="Polaris-ResourceItem__ItemWrapper">
								<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling" data-href="/campaign/long/${giv.id}">
									<a id="UpcomingLink${giv.id}" class="Polaris-ResourceItem__Link" tabindex="0" id="" href="/campaign/long/${giv.id}" data-polaris-unstyled="true"></a>
									<div class="Polaris-ResourceItem__Container" id="Upcoming${giv.id}">
										<div class="Polaris-ResourceItem__Owned">
											<div class="Polaris-ResourceItem__Media">
												<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
													<div class="dp" style="background: ${colour}; color: black;">${giv.name.substring(0,1)}</div>
												</span>
											</div>
										</div>
										<div class="Polaris-ResourceItem__Content">
											<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
												<div class="Polaris-Stack__Item">
													<h3><span class="Polaris-TextStyle--variationStrong" id="UpcomingName${giv.id}"></span></h3>
													<div><span class="Polaris-TextStyle--variationStrong">Begins on</span> ${new Date(giv.startDate).toDateString()}</div>
													<div><span class="Polaris-TextStyle--variationStrong">At</span> ${new Date(giv.startDate).toLocaleTimeString()}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</li>
					`)
					$(`#UpcomingName${giv.id}`).text(giv.name)
					$(`#UpcomingLink${giv.id}`).attr("aria-label", `A link to an upcoming event named, ${giv.name}`)
					if(giv.eventType === "Rapid"){
						$(`#Upcoming${giv.id}`).click(function(){
							location.href=`/campaign/rapid/${giv.parentId}`
						})
					} else {
						$(`#Upcoming${giv.id}`).click(function(){
							location.href=`/campaign/long/${giv.id}`
						})
					}
				})
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				}	else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
				alert(data.responseText)
			}
		})
		$.ajax({
			url: "/data/giveaway-templates",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				console.log("The template length is "+data.length)
				if(data.length === 0){
					$("#HGTListWrapper").remove()
					return (
						$("#HomeGiveawayTemplates").html(`
							<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
								<div class="Polaris-EmptyState__Section">
									<div class="Polaris-EmptyState__DetailsContainer">
										<div class="Polaris-EmptyState__Details">
											<div class="Polaris-TextContainer">
												<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">Display your saved giveaway templates</p>
												<div class="Polaris-EmptyState__Content">
													<p>Save the settings of any giveaway you would like to use in the future.</p>
												</div>
											</div>
											<div class="Polaris-EmptyState__Actions">
												<div class="Polaris-Stack Polaris-Stack--spacingTight Polaris-Stack--distributionCenter Polaris-Stack--alignmentCenter">
													<div class="Polaris-Stack__Item"><a href="/campaign/giveaways" class="Polaris-Button Polaris-Button--primary ToGiveawayTemplates" type="button"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Add template</span></span></a></div>
													<div class="Polaris-Stack__Item"><a class="Polaris-Button" href="#" data-polaris-unstyled="true"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Learn more</span></span></a></div>
												</div>
											</div>
										</div>
									</div>
									<div class="Polaris-EmptyState__ImageContainer"><img src="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" role="presentation" alt="" class="Polaris-EmptyState__Image"></div>
								</div>
							</div>
						`)
					)
				}
				$(".HGTDecoyItem").remove()
				data.forEach(function(giv){
					const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${55 + 10 * Math.random()}%)`
					$("#HGTDataDecoy").after(`
						<li class="Polaris-ResourceItem__ListItem">
							<div class="Polaris-ResourceItem__ItemWrapper">
								<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling" data-href="/campaign/long/${giv.id}">
									<a id="TempLink${giv.id}"  class="Polaris-ResourceItem__Link" tabindex="0" id="" href="/campaign/long/${giv.id}" data-polaris-unstyled="true"></a>
									<div class="Polaris-ResourceItem__Container" id="Temp${giv.id}">
										<div class="Polaris-ResourceItem__Owned">
											<div class="Polaris-ResourceItem__Media">
												<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
													<div class="dp" style="background: ${colour}; color: black;">${giv.name.substring(0,1)}</div>
												</span>
											</div>
										</div>
										<div class="Polaris-ResourceItem__Content">
											<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
												<div class="Polaris-Stack__Item">
													<h3><span class="Polaris-TextStyle--variationStrong Polaris-Subheading" id="TempName${giv.id}"></span></h3>
													<div><span class="Polaris-TextStyle--variationStrong">Prize distribution type :</span> ${giv.type}</div>
													<div><span class="Polaris-TextStyle--variationStrong">Total winners :</span> ${giv.winnersTotal}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</li>
					`)

					$(`#TempName${giv.id}`).text(giv.name)
					$(`#TempLink${giv.id}`).attr("aria-label", `A link to template ${giv.name}`)
					$(`#Temp${giv.id}`).click(function(){
						location=href=`/campaign/template/${giv.id}`
					})
				})
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
				alert(data.responseText)
			}
		})
		eventCalendar()
	}

	//url == /campaign/long/new
	$("#StartDate").attr("min", new Date().toISOString().split('T')[0])
	$("#EndDate").attr("min", new Date().toISOString().split('T')[0])
	$("#ValidateBtn").click(function(){
		let starts = $("#StartDate").val()+"T"+$("#StartTime").val()
		let ends = $("#EndDate").val()+"T"+$("#EndTime").val()
		console.log(`${starts} and ${ends}`)
		console.log(`${new Date(starts)} and ${new Date(ends)}`)
		$("#ValidBody").html(`
			<div>
				<span class="Polaris-Spinner Polaris-Spinner--sizeLarge">
					<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
						<path d="M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z"></path>
					</svg>
				</span>
				<span role="status">
					<span class="Polaris-VisuallyHidden">Spinner</span>
				</span>
			</div>
		`)
		if(starts.length !== 16 || ends.length !== 16){
			return (
				$("#ValidBody").html(`
					<p>Both the date fields must be filled accordinlgy.</p>
				`)
			)
		}
		if(new Date(ends) < new Date(starts)){
			return (
				$("#ValidBody").html(`
					<p>The end date cannot be in the past relative to the start date.</p>
				`)
			)
		}
		if(new Date(starts) === new Date(ends)){
			return (
				$("#ValidBody").html(`
					<p>The start date and the end date cannot be on the same day</p>
				`)
			)
		}
		
		$.ajax({
			url: `/data/long-validator?start=${starts}&end=${ends}`,
			type: "GET",
			contentType: "application/json",
			success: function(data){
				if(data.length === 0){
					return (
						$("#ValidBody").html(`
							<p class="Polaris-TextStyle--variationStrong" style="color: green;">Successful! No scheduling conflicts found.</p>
						`)
					)
				}
				$("#ValidBody").html(`
					<p id="ValidDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Conflicts found</p>
					<ul class="Polaris-List">
						<span id="ValidDecoy"></span>
					</ul>
				`)
				data.forEach(function(item){
					const begin = new Date(item.startDate).toISOString().split('T')
					const finish = new Date(item.endDate).toISOString().split('T')
					$("#ValidDecoy").after(`
						<li class="Polaris-List__Item" aria-label="${item.name}">
							<span class="Polaris-TextStyle--variationStrong">
								${item.name}
							</span>, active from
							<span class="Polaris-TextStyle--variationStrong">${begin[0]} at ${begin[1].substring(0, 5)}</span> to 
							<span class="Polaris-TextStyle--variationStrong">${finish[0]} at ${finish[1].substring(0, 5)}</span>
						</li>
					`)
				})
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
				$("#ValidBody").html(`
					<p>Press the validator button to check for scheduling conflicts with existing giveaways.</p>
				`)
				alert(data.responseText)
			}
		})
	})

	$("#ContinueButton").click(function(e){
		e.preventDefault()
		console.log($("input[type='radio'][name='distribution']:checked").val())
		let name = $("#GiveawayNameInput").val()
		let startDate = $("#StartDate").val()
		let startTime = $("#StartTime").val()
		let endDate = $("#EndDate").val()
		let endTime = $("#EndTime").val()
		let ofWinners = $("#OfWinners").val()
		let distrubution = $("input[type='radio'][name='distribution']:checked").val()
		if(isNaN(parseInt(ofWinners)) === true){
			return alert("The number of winners has to be a number")
		}
		if(name === "" || startDate === "" || startTime === "" || endTime === "" || endDate === "" || ofWinners === "" || distrubution === ""){
			return alert("Please fill all fields")
		}
		const starting = new Date(startDate+"T"+startTime)
		const ending = new Date(endDate+"T"+endTime)
		let form = {
			"name": name,
			"startDate": starting,
			"endDate": ending,
			"ofWinners": ofWinners,
			"distribution": distrubution
		}
		console.log(form)
		$.ajax({
			url: "/campaign/long/new",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({form}),
			success: function(data){
				console.log(data) 
				return location.href=data
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
				console.log(data.responseText)
				return alert(data.responseText)
			}
		})
	})

	//url === /campaign/long/new/hierarchical
	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	let hData = parseInt(params.winners)	
	
	//console.log(render)
	if(isNaN(hData) === false && window.location.pathname === "/campaign/long/new/hierarchical"){
		let render = []
		for(let i = 0; i < hData; i++){
			render.unshift(i)
		}
		let vouchers = {}

		console.log(render)
		render.forEach((val) => {
			val++
			console.log(val)
			$("#EachWinnerHeader").after(
				`<div class="Polaris-Card__Section">
					<div class="Polaris-Stack Polaris-Stack--vertical">
						<div class="Polaris-Stack__Item">
							<div class="Polaris-Stack distributionFillEvenly">
								<div class="Polaris-Stack__Item"><span aria-label="Farrah" role="img" class="Polaris-Avatar Polaris-Avatar--sizeMedium"><span class="Polaris-Avatar__Initials"><svg class="Polaris-Avatar__Svg" viewBox="0 0 40 40">
												<path fill="currentColor" d="M8.28 27.5A14.95 14.95 0 0120 21.8c4.76 0 8.97 2.24 11.72 5.7a14.02 14.02 0 01-8.25 5.91 14.82 14.82 0 01-6.94 0 14.02 14.02 0 01-8.25-5.9zM13.99 12.78a6.02 6.02 0 1112.03 0 6.02 6.02 0 01-12.03 0z"></path>
											</svg></span></span>
								</div>
								<div class="Polaris-Stack__Item">
									<div class="Polaris-Card__SectionHeader">
										<h2 id="WinnerNumber${val}" class="Polaris-Subheading">Number ${val}</h2>
									</div>
								</div>
							</div>
						</div>
						<div id="VoucherFIeldContainer${val}" class="Polaris-Stack__Item">
							<div class="Polaris-Labelled">
								<div class="Polaris-Labelled__LabelWrapper">
									<div class="Polaris-Label"><label id="VoucherInputLabel${val}" for="VoucherInputField${val}" class="Polaris-Label__Text">Voucher amount</label></div>
								</div>
								<div class="Polaris-Connected">
									<div class="Polaris-Connected__Item Polaris-Connected__Item--primary">
										<div class="Polaris-TextField Polaris-TextField--hasValue">
											<div class="Polaris-TextField__Prefix" id="VoucherInputFieldPrefix${val}">$</div>
											<input id="VoucherInputField${val}" autocomplete="off" class="Polaris-TextField__Input" type="number" aria-labelledby="VoucherInputField${val} VoucherInputFieldPrefix${val}" aria-invalid="false" value="">
											<div class="Polaris-TextField__Backdrop"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>`
			)

			$(`#VoucherInputField${val}`).on("input", function(){
				vouchers[val] = $(this).val()
				console.log(vouchers)
			})
		})
		$("#HCreate").click(function(e){
			e.preventDefault()
			if($.isEmptyObject(vouchers)){
					return alert("Enter voucher amounts for all winners")
			}
			console.log({id: params.id, amounts: vouchers})
			$.ajax({
				url: "/campaign/long/new/hierarchical/create",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({id: parseInt(params.id), amounts: vouchers}),
				success: function(data){
					location.href=data
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if(data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}
					alert(data.responseText)
				}
			})
		})
	}

	//url === /campaign/new/equitable
	$("#ECreate").click(function(e){
		e.preventDefault()
		const voucher = $("#VoucherInputField").val()
		if(voucher === "" && parseInt(voucher) == null){
			return alert("Enter voucher amount and make sure they are number")
		}
		$.ajax({
			url: "/campaign/long/new/equitable/create",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({id: parseInt(params.id), amounts: parseInt(voucher)}),
			success: function(data){
				location.href=data
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
				alert(data.responseText)
			}
		})
	})

	//url === /campaign/long/:id
	//console.log(window.location.pathname)
	const path = window.location.pathname
	const idForGiveaway = parseInt(path.split("/")[3])
	//console.log(idForGiveaway)
	if(isNaN(idForGiveaway) === false && window.location.pathname === "/campaign/long/"+idForGiveaway){
		$.ajax({
			url: `/data/campaign/${idForGiveaway}`,
			type: "GET",
			contentType: "application/json",
			success: function(data){
				$("#WinnersSkeleton").remove()
				$(".Polaris-SkeletonBodyText").remove()
				$(".Polaris-SkeletonDisplayText__DisplayText").remove()
				

				dates = []
				let startDate = Number(new Date(data.startDate))
				let endDate = Number(new Date(data.endDate))
				for(let i = 0; startDate <= endDate; i++){
					//console.log(startDate)
					dates.push(new Date(startDate).toLocaleDateString('en-ZA'))
					startDate = startDate+(1000*60*60*24*i)
				}
				console.log(dates)
				eventCalendar(dates)
				$("#WinnerBody").html(`
					<p>This is where your winners will display after the run of the giveaway.</p>
				`)
				console.log(data.id)
				if(data.winnersGifted === false && data.winnersChosen === true){
					$("#GiftBtn").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--outline")
					$("#GiftBtn").click(function(){
						console.log("Clicked")
						$.ajax({
							url: `/campaign/${data.id}/gift`,
							type: "GET",
							contentType: "application/json",
							success: function(data){
								alert(data)
							},
							error: function(data){
								if(data.responseText === "Unauthorized"){
									return location.href="/"
								} else if(data.responseText === "Forbidden"){
									return location.href="/billing/plans"
								}
								alert(data.responseText)
							}
						})
					})
				}
				if(data.winnersChosen === true){
					$.ajax({
						url: `/data/${data.id}/winners`,
						type: "GET",
						contentType: "application/json",
						success: function(data){
							if(data.length === 0){
								return (
									$("#WinnerBody").html(`
										<p>Press the pick winners button to run an automatic winner selection process.</p>
									`)
								)
							} else if(data.length !== 0){
								$("#WinnerBody").html(`
									<div class="Polaris-ResourceList__ResourceListWrapper">
										<ul class="Polaris-ResourceList">
											<span id="WinnerDecoy"></span>
										</ul>
									</div>
								`)
								data.reverse().forEach(function(winner){
									const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${15 + 10 * Math.random()}%)`
									$("#WinnerDecoy").after(`
										<li class="Polaris-ResourceItem__ListItem">
											<div class="Polaris-ResourceItem__ItemWrapper">
												<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling">
													<div class="Polaris-ResourceItem__Container" id="${winner.prizeId}">
														<div class="Polaris-ResourceItem__Owned">
															<div class="Polaris-ResourceItem__Media">
																<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
																	<div style="color: ${colour}; font-size: 5em; display: flex; flex-direction: row; align-items: center">${winner.prizeId}</div>
																</span>
															</div>
														</div>
														<div class="Polaris-ResourceItem__Content">
															<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
																<div class="Polaris-Stack__Item">
																	<h3><span class="Polaris-TextStyle--variationStrong">${winner.entrantName}</span></h3>
																	<div><span class="Polaris-TextStyle--variationStrong">Email:</span> ${winner.entrantEmail}</div>
																	<div><span class="Polaris-TextStyle--variationStrong">Voucher amount:</span> ${winner.voucherPrize}</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</li>
									`)
								})
							}
						},
						error: function(data){
							if(data.responseText === "Unauthorized"){
								return location.href="/"
							} else if(data.responseText === "Forbidden"){
								return location.href="/billing/plans"
							}
							//alert(data.responseText)
							$("#WinnerBody").html(`
								<h3 id="WinnerDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Error</h3>
								<p class="Polaris-InlineError">${data.responseText}</p>
							`)
						}
					})
				}
				if(new Date(data.endDate) < new Date() && data.winnersChosen === false && data.winnersGifted === false){
					// Choose cutomers
					$(".ChooseWinners").removeClass("Polaris-Button--disabled")
					$(".ChooseWinners").addClass("Polaris-Button--primary")
					$("#WinnerBody").html(`
						<p>Press the pick winners button to run an automatic winner selection process.</p>
					`)
					$(".ChooseWinners").click(function(e){
						e.preventDefault()

						$("#WinnerBody").html(`
							<div>
								<span class="Polaris-Spinner Polaris-Spinner--sizeLarge">
									<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
										<path d="M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z"></path>
									</svg>
								</span>
								<span role="status">
									<span class="Polaris-VisuallyHidden">Spinner</span>
								</span>
							</div>
						`)
						$.ajax({
							url: `/campaign/long/${data.id}/choose-winners`,
							type: "POST",
							contentType: "application/json",
							success: function(data){
								// Gift winners
								$("#GiftBtn").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--outline")
								$("#GiftBtn").click(function(){
									$.ajax({
										url: `/campaign/${data.id}/gift`,
										type: "POST",
										contentType: "application/json",
										success: function(data){
											alert(data)
										},
										error: function(data){
											if(data.responseText === "Unauthorized"){
												return location.href="/"
											} else if(data.responseText === "Forbidden"){
												return location.href="/billing/plans"
											}
											alert(data.responseText)
										}
									})
								})
								//Display results
								if(data.length === 0){
									return (
										$("#WinnerBody").html(`
											<p class="Polaris-TextStyle--variationStrong" >No winners found!</p>
										`)
									)
								}
								$("#WinnerBody").html(`
									<div class="Polaris-ResourceList__ResourceListWrapper">
										<ul class="Polaris-ResourceList">
											<span id="WinnerDecoy"></span>
										</ul>
									</div>
								`)
								data.reverse().forEach(function(winner){
									const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${15 + 10 * Math.random()}%)`
									$("#WinnerDecoy").after(`
										<li class="Polaris-ResourceItem__ListItem">
											<div class="Polaris-ResourceItem__ItemWrapper">
												<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling">
													<div class="Polaris-ResourceItem__Container" id="${winner.prizeId}">
														<div class="Polaris-ResourceItem__Owned">
															<div class="Polaris-ResourceItem__Media">
																<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
																	<div style="color: ${colour}; font-size: 5em; display: flex; flex-direction: row; align-items: center">${winner.prizeId}</div>
																</span>
															</div>
														</div>
														<div class="Polaris-ResourceItem__Content">
															<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
																<div class="Polaris-Stack__Item">
																	<h3><span class="Polaris-TextStyle--variationStrong">${winner.entrantName}</span></h3>
																	<div><span class="Polaris-TextStyle--variationStrong">Email:</span> ${winner.entrantEmail}</div>
																	<div><span class="Polaris-TextStyle--variationStrong">Voucher amount:</span> ${winner.voucherPrize}</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</li>
									`)
								})
							},
							error: function(data){
								if(data.responseText === "Unauthorized"){
									return location.href="/"
								} else if(data.responseText === "Forbidden"){
									return location.href="/billing/plans"
								}
								//alert(data.responseText)
								$("#WinnerBody").html(`
									<h3 id="WinnerDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Error</h3>
									<p class="Polaris-InlineError">${data.responseText}</p>
								`)
							}
						})
					})
				}
				$("#GiveawayName").text(data.title)
				$("#ForTotalEntries").text(data.entriesTotal)
				//$("#ForActiveDates").text(`From ${new Date(data.startDate).toDateString()} to ${new Date(data.endDate).toDateString()}`)
				$("#ForType").text(data.type)
				data.winners.reverse().forEach(function(item){
					$("#GiveawayWinnerListDecoy").after(`
						<li class="Polaris-List__Item">Number ${item.prizeId} - $${item.voucherPrize} store voucher</li>
					`)
				})
				$(".Add-Giveaway-Template").click(function(){
					$.ajax({
						url: `/campaign/store?id=${data.id}`,
						type: "POST",
						success: function(data){
							location.href=data
						},
						error: function(data){
							if(data.responseText === "Unauthorized"){
								return location.href="/"
							} else if(data.responseText === "Forbidden"){
								return location.href="/billing/plans"
							}
							alert(data.responseText)
						}
					})
				})
				$("#DeleteGiveawayBtn").click(function(){
					let consent = confirm("Are you sure?")
					if(consent){
						$.ajax({
							url: `/campaign/${data.id}/delete`,
							type: "POST",
							contentType: "application/json",
							success: function(data){
								location.href=data
							},
							error: function(data){
								if(data.responseText === "Unauthorized"){
									return location.href="/"
								} else if(data.responseText === "Forbidden"){
									return location.href="/billing/plans"
								}
								alert(data.responseText)
							}
						})
					}
				})
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
				alert(data.responseText)
			}
		})
	}

	//url === /campaign/giveaways
	if(window.location.pathname === "/campaign/giveaways"){
		$.ajax({
			url: "/data/campaigns/active",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				$("#ActiveContentSkeleton").remove()
				if(data.length === 0){
					return (
						$("#ActiveContentHeader").after(`
							<div class="Polaris-EmptyState Polaris-EmptyState--fullWidth Polaris-EmptyState--withinContentContainer">
								<div class="Polaris-EmptyState__Section">
									<div class="Polaris-EmptyState__DetailsContainer">
										<div class="Polaris-EmptyState__Details">
											<div class="Polaris-TextContainer">
												<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">Create a new giveaway </p>
												<div class="Polaris-EmptyState__Content">
													<p>Get started with creating your first giveaway rightaway.</p>
												</div>
											</div>
											<div class="Polaris-EmptyState__Actions">
												<div class="Polaris-Stack Polaris-Stack--spacingTight Polaris-Stack--distributionCenter Polaris-Stack--alignmentCenter">
													<div class="Polaris-Stack__Item">
														<button class="Polaris-Button Polaris-Button--primary" type="button">
															<span class="Polaris-Button__Content">
																<span class="Polaris-Button__Text">Create</span>
															</span>
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="Polaris-EmptyState__ImageContainer">
										<img src="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" role="presentation" alt="Empty State Image" class="Polaris-EmptyState__Image">
									</div>
								</div>
							</div>
						`)
					)
				}
				$("#ActiveContentHeader").after(`
					<div class="Polaris-ResourceList__ResourceListWrapper">
						<ul class="Polaris-ResourceList" aria-live="polite">
							<span id="ActiveContentDataDecoy"></span>
						</ul>
					</div>
				`)
				data.forEach(function(giv){
					const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${55 + 10 * Math.random()}%)`
					$("#ActiveContentDataDecoy").after(`
						<li class="Polaris-ResourceItem__ListItem">
							<div class="Polaris-ResourceItem__ItemWrapper ">
								<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling" data-href="/campaign/${giv.id}">
									<a id="Link${giv.id}" class="Polaris-ResourceItem__Link" tabindex="0" id="" href="/campaign/${giv.id}" data-polaris-unstyled="true"></a>
									<div class="Polaris-ResourceItem__Container" id="${giv.id}">
										<div class="Polaris-ResourceItem__Owned">
											<div class="Polaris-ResourceItem__Media">
												<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
													<div style="background: ${colour};"></div>
												</span>
											</div>
										</div>
										<div class="Polaris-ResourceItem__Content ">
												<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
													<div class="Polaris-Stack__Item">
														<h3><span class="Polaris-TextStyle--variationStrong" id="Name${giv.id}"></span></h3>
														<div>${giv.type} distribution</div>
														<div>Received <span class="Polaris-TextStyle--variationStrong">${giv.entriesTotal}</span> entries</div>
													</div>
													<div class="Polaris-Stack__Item">
														<div class="Polaris-TextStyle--variationStrong">Began</div>
														<div>${new Date(giv.startDate).toDateString()}</div>
													</div>
													<div class="Polaris-Stack__Item">
														<div class="Polaris-TextStyle--variationStrong">Ends</div>
														<div>${new Date(giv.endDate).toDateString()}</div>
													</div>
												</div>
											</div>
									</div>
								</div>
							</div>
						</li>
					`)
					$(`#Name${giv.id}`).text(giv.name)
					$(`#Link${giv.id}`).attr("aria-label", `A link to event titled: ${giv.name}`)
					if(giv.eventType === "Rapid"){
						$(`#${giv.id}`).click(function(){
							location.href=`/campaign/rapid/${giv.parentId}`
						})
					} else {
						$(`#${giv.id}`).click(function(){
							location.href=`/campaign/long/${giv.id}`
						})
					}
				})
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
				alert(data.responseText)
			}
		})
		$("#ActiveGiveawaysTab").click(function(){
			// Toggle content
			const active = $("#ActiveGiveawaysTabContent").hasClass("Polaris-Tabs__Panel--hidden")
			const upcoming = $("#UpcomingGiveawaysTabContent").hasClass("Polaris-Tabs__Panel--hidden")
			const expired = $("#ExpiredGiveawaysTabContent").hasClass("Polaris-Tabs__Panel--hidden")
			if(active === false){
				upcoming === false ? $("#UpcomingGiveawaysTabContent").addClass("Polaris-Tabs__Panel--hidden") : null
				expired === false ? $("#ExpiredGiveawaysTabContent").addClass("Polaris-Tabs__Panel--hidden") : null
			} else if(active === true){
				$("#ActiveGiveawaysTabContent").removeClass("Polaris-Tabs__Panel--hidden")
				upcoming === true ? null :  $("#UpcomingGiveawaysTabContent").addClass("Polaris-Tabs__Panel--hidden")
				expired === true ? null : $("#ExpiredGiveawaysTabContent").addClass("Polaris-Tabs__Panel--hidden")
			}
			// Toggle greenbar
			const activeBar = $("#ActiveGiveawaysTab").hasClass("Polaris-Tabs__Tab--selected")
			const upcomingBar = $("#UpcomingGiveawaysTab").hasClass("Polaris-Tabs__Tab--selected")
			const expiredBar = $("#ExpiredGiveawaysTab").hasClass("Polaris-Tabs__Tab--selected")
			if(activeBar === false){
				$("#ActiveGiveawaysTab").addClass("Polaris-Tabs__Tab--selected")
				upcomingBar === false ? null : $("#UpcomingGiveawaysTab").removeClass("Polaris-Tabs__Tab--selected")
				expiredBar === false ? null : $("#ExpiredGiveawaysTab").removeClass("Polaris-Tabs__Tab--selected")
			} else if(activeBar === true){
				upcomingBar === true ? $("#UpcomingGiveawaysTab").removeClass("Polaris-Tabs__Tab--selected") : null
				expiredBar === true ? $("#ExpiredGiveawaysTab").removeClass("Polaris-Tabs__Tab--selected") : null
			}
			if(document.getElementById("ActiveContentSkeleton") == null){
				return
			}
			$.ajax({
				url: "/data/campaigns/active",
				type: "GET",
				contentType: "application/json",
				success: function(data){
					$("#ActiveContentSkeleton").remove()
					if(data.length === 0){
						return (
							$("#ActiveContentHeader").after(`
								<div id="ActiveEmptyState" class="Polaris-EmptyState Polaris-EmptyState--fullWidth Polaris-EmptyState--withinContentContainer">
									<div class="Polaris-EmptyState__Section">
										<div class="Polaris-EmptyState__DetailsContainer">
											<div class="Polaris-EmptyState__Details">
												<div class="Polaris-TextContainer">
													<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">Create a new giveaway </p>
													<div class="Polaris-EmptyState__Content">
														<p>Get started with creating your first giveaway rightaway.</p>
													</div>
												</div>
												<div class="Polaris-EmptyState__Actions">
													<div class="Polaris-Stack Polaris-Stack--spacingTight Polaris-Stack--distributionCenter Polaris-Stack--alignmentCenter">
														<div class="Polaris-Stack__Item">
															<button class="Polaris-Button Polaris-Button--primary" type="button">
																<span class="Polaris-Button__Content">
																	<span class="Polaris-Button__Text">Create</span>
																</span>
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div class="Polaris-EmptyState__ImageContainer">
											<img src="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" role="presentation" alt="Empty State Image" class="Polaris-EmptyState__Image">
										</div>
									</div>
								</div>
							`)
						)
					}
					$("#ActiveContentHeader").after(`
						<div id="ActiveListWrapper" class="Polaris-ResourceList__ResourceListWrapper ">
							<ul class="Polaris-ResourceList" aria-live="polite">
								<span id="ActiveContentDataDecoy"></span>
							</ul>
						</div>
					`)
					data.forEach(function(giv){
						const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${55 + 10 * Math.random()}%)`
						$("#ActiveContentDataDecoy").after(`
							<li class="Polaris-ResourceItem__ListItem">
								<div class="Polaris-ResourceItem__ItemWrapper">
									<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling" data-href="/campaign/${giv.id}">
										<a id="Link${giv.id}" class="Polaris-ResourceItem__Link" tabindex="0" id="" href="/campaign/${giv.id}" data-polaris-unstyled="true"></a>
										<div class="Polaris-ResourceItem__Container" id="${giv.id}">
											<div class="Polaris-ResourceItem__Owned">
												<div class="Polaris-ResourceItem__Media">
													<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
														<div style="background: ${colour};"></div>
													</span>
												</div>
											</div>
											<div class="Polaris-ResourceItem__Content ">
												<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
													<div class="Polaris-Stack__Item">
														<h3><span class="Polaris-TextStyle--variationStrong" id="Name${giv.id}"></span></h3>
														<div>${giv.type} distribution</div>
														<div>Received <span class="Polaris-TextStyle--variationStrong">${giv.entriesTotal}</span> entries</div>
													</div>
													<div class="Polaris-Stack__Item">
														<div class="Polaris-TextStyle--variationStrong">Began</div>
														<div>${new Date(giv.startDate).toDateString()}</div>
													</div>
													<div class="Polaris-Stack__Item">
														<div class="Polaris-TextStyle--variationStrong">Ends</div>
														<div>${new Date(giv.endDate).toDateString()}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</li>
						`)
						$(`#Name${giv.id}`).text(giv.name)
						$(`#Link${giv.id}`).attr("aria-label", `A link to event titled: ${giv.name}`)
						if(giv.eventType === "Rapid"){
							$(`#${giv.id}`).click(function(){
								location.href=`/campaign/rapid/${giv.parentId}`
							})
						} else {
							$(`#${giv.id}`).click(function(){
								location.href=`/campaign/long/${giv.id}`
							})
						}
					})
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if(data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}
					alert(data.responseText)
				}
			})
		})
		$("#UpcomingGiveawaysTab").click(function(){
			// Toggle content
			const active = $("#ActiveGiveawaysTabContent").hasClass("Polaris-Tabs__Panel--hidden")
			const upcoming = $("#UpcomingGiveawaysTabContent").hasClass("Polaris-Tabs__Panel--hidden")
			const expired = $("#ExpiredGiveawaysTabContent").hasClass("Polaris-Tabs__Panel--hidden")
			if(upcoming === false){
				active === false ? $("#ActiveGiveawaysTabContent").addClass("Polaris-Tabs__Panel--hidden") : null
				expired === false ? $("#ExpiredGiveawaysTabContent").addClass("Polaris-Tabs__Panel--hidden") : null
			} else if(upcoming ===  true){
				$("#UpcomingGiveawaysTabContent").removeClass("Polaris-Tabs__Panel--hidden")
				active === true ? null : $("#ActiveGiveawaysTabContent").addClass("Polaris-Tabs__Panel--hidden")
				expired === true ? null : $("#ExpiredGiveawaysTabContent").addClass("Polaris-Tabs__Panel--hidden")
			}
			// Toggle greenbar
			const activeBar = $("#ActiveGiveawaysTab").hasClass("Polaris-Tabs__Tab--selected")
			const upcomingBar = $("#UpcomingGiveawaysTab").hasClass("Polaris-Tabs__Tab--selected")
			const expiredBar = $("#ExpiredGiveawaysTab").hasClass("Polaris-Tabs__Tab--selected")
			if(upcomingBar === false){
				$("#UpcomingGiveawaysTab").addClass("Polaris-Tabs__Tab--selected")
				activeBar === true ? $("#ActiveGiveawaysTab").removeClass("Polaris-Tabs__Tab--selected") : null
				expiredBar === true ? $("#ExpiredGiveawaysTab").removeClass("Polaris-Tabs__Tab--selected") : null
			} else if(upcomingBar ===  true){
				activeBar === false ? null : $("#ActiveGiveawaysTab").removeClass("Polaris-Tabs__Tab--selected")
				expiredBar === false ? null : $("#ExpiredGiveawaysTab").removeClass("Polaris-Tabs__Tab--selected")
			}
			if(document.getElementById("UpcomingContentSkeleton") == null){
				return
			}
			$.ajax({
				url: "/data/campaigns/upcoming",
				type: "GET",
				contentType: "application/json",
				success: function(data){
					$("#UpcomingContentSkeleton").remove()
					if(data.length === 0){
						return (
							$("#UpcomingContentHeader").after(`
								<div id="UpcomingEmptyState" class="Polaris-EmptyState Polaris-EmptyState--fullWidth Polaris-EmptyState--withinContentContainer">
									<div class="Polaris-EmptyState__Section">
										<div class="Polaris-EmptyState__DetailsContainer">
											<div class="Polaris-EmptyState__Details">
												<div class="Polaris-TextContainer">
													<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">Create a new giveaway </p>
													<div class="Polaris-EmptyState__Content">
														<p>Get started with creating your first giveaway rightaway.</p>
													</div>
												</div>
												<div class="Polaris-EmptyState__Actions">
													<div class="Polaris-Stack Polaris-Stack--spacingTight Polaris-Stack--distributionCenter Polaris-Stack--alignmentCenter">
														<div class="Polaris-Stack__Item">
															<button class="Polaris-Button Polaris-Button--primary" type="button">
																<span class="Polaris-Button__Content">
																	<span class="Polaris-Button__Text">Create</span>
																</span>
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div class="Polaris-EmptyState__ImageContainer">
											<img src="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" role="presentation" alt="Empty State Image" class="Polaris-EmptyState__Image">
										</div>
									</div>
								</div>
							`)
						)
					}
					$("#UpcomingContentHeader").after(`
						<div id="UpcomingListWrapper" class="Polaris-ResourceList__ResourceListWrapper">
							<ul class="Polaris-ResourceList" aria-live="polite">
								<span id="UpcomingContentDataDecoy"></span>
							</ul>
						</div>
					`)
					data.forEach(function(giv){
						const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${55 + 10 * Math.random()}%)`
						$("#UpcomingContentDataDecoy").after(`
							<li class="Polaris-ResourceItem__ListItem">
								<div class="Polaris-ResourceItem__ItemWrapper">
									<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling" data-href="/campaign/${giv.id}">
										<a id="Link${giv.id}" class="Polaris-ResourceItem__Link" tabindex="0" id="" href="/campaign/${giv.id}" data-polaris-unstyled="true"></a>
										<div class="Polaris-ResourceItem__Container" id="${giv.id}">
											<div class="Polaris-ResourceItem__Owned">
												<div class="Polaris-ResourceItem__Media">
													<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
														<div style="background: ${colour};"></div>
													</span>
												</div>
											</div>
											<div class="Polaris-ResourceItem__Content">
												<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
													<div class="Polaris-Stack__Item">
														<h3><span class="Polaris-TextStyle--variationStrong" id="Name${giv.id}"></span></h3>
														<div>${giv.type} distribution</div>
														<div>Received <span class="Polaris-TextStyle--variationStrong">${giv.entriesTotal}</span> entries</div>
													</div>
													<div class="Polaris-Stack__Item">
														<div class="Polaris-TextStyle--variationStrong">Begins</div>
														<div>${new Date(giv.startDate).toDateString()}</div>
													</div>
													<div class="Polaris-Stack__Item">
														<div class="Polaris-TextStyle--variationStrong">Ends</div>
														<div>${new Date(giv.endDate).toDateString()}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</li>
						`)
						$(`#Name${giv.id}`).text(giv.name)
						$(`#Link${giv.id}`).attr("aria-label", `A link to event titled: ${giv.name}`)
						
						if(giv.eventType === "Rapid"){
							$(`#${giv.id}`).click(function(){
								location.href=`/campaign/rapid/${giv.parentId}`
							})
						} else {
							$(`#${giv.id}`).click(function(){
								location.href=`/campaign/long/${giv.id}`
							})
						}
					})
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if(data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}
					alert(data.responseText)
				}
			})
		})
		$("#ExpiredGiveawaysTab").click(function(){
			// Toggle content
			const active = $("#ActiveGiveawaysTabContent").hasClass("Polaris-Tabs__Panel--hidden")
			const upcoming = $("#UpcomingGiveawaysTabContent").hasClass("Polaris-Tabs__Panel--hidden")
			const expired = $("#ExpiredGiveawaysTabContent").hasClass("Polaris-Tabs__Panel--hidden")
			if(expired === false){
				active === false ? $("#ActiveGiveawaysTabContent").addClass("Polaris-Tabs__Panel--hidden") : null
				upcoming === false ? $("#UpcomingGiveawaysTabContent").addClass("Polaris-Tabs__Panel--hidden") : null
			} else if(expired === true){
				$("#ExpiredGiveawaysTabContent").removeClass("Polaris-Tabs__Panel--hidden")
				active === true ? null : $("#ActiveGiveawaysTabContent").addClass("Polaris-Tabs__Panel--hidden")
				upcoming === true ? null :  $("#UpcomingGiveawaysTabContent").addClass("Polaris-Tabs__Panel--hidden")
			}
			// Toggle greembar
			const activeBar = $("#ActiveGiveawaysTab").hasClass("Polaris-Tabs__Tab--selected")
			const upcomingBar = $("#UpcomingGiveawaysTab").hasClass("Polaris-Tabs__Tab--selected")
			const expiredBar = $("#ExpiredGiveawaysTab").hasClass("Polaris-Tabs__Tab--selected")
			if(expiredBar === false){
				$("#ExpiredGiveawaysTab").addClass("Polaris-Tabs__Tab--selected")
				activeBar === true ? $("#ActiveGiveawaysTab").removeClass("Polaris-Tabs__Tab--selected") : null
				upcomingBar === true ? $("#UpcomingGiveawaysTab").removeClass("Polaris-Tabs__Tab--selected") : null
			} else if(expiredBar === true){
				activeBar === false ? null : $("#ActiveGiveawaysTab").removeClass("Polaris-Tabs__Tab--selected")
				upcomingBar === false ? null :  $("#UpcomingGiveawaysTab").removeClass("Polaris-Tabs__Tab--selected")
			}
			if(document.getElementById("ExpiredContentSkeleton") == null){
				return
			}
			$.ajax({
				url: "/data/campaigns/expired",
				type: "GET",
				contentType: "application/json",
				success: function(data){
					$("#ExpiredContentSkeleton").remove()
					if(data.length === 0){
						return (
							$("#ExpiredContentHeader").after(`
								<div id="ExpiredEmptyState" class="Polaris-EmptyState Polaris-EmptyState--fullWidth Polaris-EmptyState--withinContentContainer">
									<div class="Polaris-EmptyState__Section">
										<div class="Polaris-EmptyState__DetailsContainer">
											<div class="Polaris-EmptyState__Details">
												<div class="Polaris-TextContainer">
													<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">Create a new giveaway </p>
													<div class="Polaris-EmptyState__Content">
														<p>Get started with creating your first giveaway rightaway.</p>
													</div>
												</div>
												<div class="Polaris-EmptyState__Actions">
													<div class="Polaris-Stack Polaris-Stack--spacingTight Polaris-Stack--distributionCenter Polaris-Stack--alignmentCenter">
														<div class="Polaris-Stack__Item">
															<button class="Polaris-Button Polaris-Button--primary" type="button">
																<span class="Polaris-Button__Content">
																	<span class="Polaris-Button__Text">Create</span>
																</span>
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div class="Polaris-EmptyState__ImageContainer">
											<img src="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" role="presentation" alt="Empty State Image" class="Polaris-EmptyState__Image">
										</div>
									</div>
								</div>
							`)
						)
					}
					$("#ExpiredContentHeader").after(`
						<div id="ExpiredListWrapper" class="Polaris-ResourceList__ResourceListWrapper">
							<ul class="Polaris-ResourceList" aria-live="polite">
								<span id="ExpiredContentDataDecoy"></span>
							</ul>
						</div>
					`)
					data.forEach(function(giv){
						const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${55 + 10 * Math.random()}%)`
						$("#ExpiredContentDataDecoy").after(`
							<li class="Polaris-ResourceItem__ListItem">
								<div class="Polaris-ResourceItem__ItemWrapper">
									<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling" data-href="/campaign/${giv.id}">
										<a id="Link${giv.id}" class="Polaris-ResourceItem__Link" tabindex="0" id="" href="/campaign/${giv.id}" data-polaris-unstyled="true"></a>
										<div class="Polaris-ResourceItem__Container" id="${giv.id}">
											<div class="Polaris-ResourceItem__Owned">
												<div class="Polaris-ResourceItem__Media">
													<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
														<div style="background: ${colour};"></div>
													</span>
												</div>
											</div>
											<div class="Polaris-ResourceItem__Content">
												<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
													<div class="Polaris-Stack__Item">
														<h3><span class="Polaris-TextStyle--variationStrong" id="Name${giv.id}"></span></h3>
														<div>${giv.type} distribution</div>
														<div>Received <span class="Polaris-TextStyle--variationStrong">${giv.entriesTotal}</span> entries</div>
													</div>
													<div class="Polaris-Stack__Item">
														<div class="Polaris-TextStyle--variationStrong">Began</div>
														<div>${new Date(giv.startDate).toDateString()}</div>
													</div>
													<div class="Polaris-Stack__Item">
														<div class="Polaris-TextStyle--variationStrong">Ended</div>
														<div>${new Date(giv.endDate).toDateString()}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</li>
						`)
						$(`#Name${giv.id}`).text(giv.name)
						$(`#Link${giv.id}`).attr("aria-label", `A link to event titled: ${giv.name}`)
						if(giv.eventType === "Rapid"){
							$(`#${giv.id}`).click(function(){
								location.href=`/campaign/rapid/${giv.parentId}`
							})
						} else {
							$(`#${giv.id}`).click(function(){
								location.href=`/campaign/long/${giv.id}`
							})
						}
					})
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if(data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}
					alert(data.responseText)
				}
			})
		})
	}

	//url === /campaign/template/:id
	const idForTemplate = parseInt(path.split("/")[3])
	if(isNaN(idForTemplate) === false && window.location.pathname === "/campaign/template/"+idForTemplate){
		$.ajax({
			url: `/data/template/${idForTemplate}`,
			type: "GET",
			contentType: "application/json",
			success: function(data){
				console.log(data.duration)
				$(".Polaris-SkeletonBodyText").remove()
				$(".Polaris-SkeletonDisplayText__DisplayText").remove()
				$("#GTName").text(data.name)
				$("#GTDuration").text(`${Math.round((data.duration/(1000*60*60))*10)/10} Hour(s)`)
				$("#GTForType").text(data.distributionType)
				$("#DeleteGTBtn").click(function(){
					$.ajax({
						url: `/campaign/template/${data.id}/delete`,
						type: "POST",
						contentType: "application/json",
						success: function(data){
							location.href=data
						},
						error: function(data){
							if(data.responseText === "Unauthorized"){
								return location.href="/"
							} else if(data.responseText === "Forbidden"){
								return location.href="/billing/plans"
							}
							alert(data.responseText)
						}
					})
				})
				data.winners.reverse().forEach((item) => {
					$("#GTWinnerListDecoy").after(`
						<li class="Polaris-List__Item">Number ${item.prizeId} - ${item.voucherPrize} USD voucher</li>
					`)
				})
				if(data.active === true){
					$("#ActivatorBody").html(`
						<p>This template currently has a giveaway that is either active, upcoming or awaiting the picking of winners.</p>
					`)
				}
				if(data.active === false){
					$("#ActivatorBody").html(`
						<p>Press any of the buttons below to schedule your giveaway.</p>
					`)
					$("#GT0Btn").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--primary")
					$("#GT1Btn").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--outline")
					$("#GT3Btn").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--outline")
					$("#GT7Btn").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--outline")
					$("#GT14Btn").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--outline")
					$("#GT30Btn").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--outline")

					$("#GT0Btn").click(function(){
						$("#ActivatorBody").html(`
							<div>
								<span class="Polaris-Spinner Polaris-Spinner--sizeLarge">
									<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
										<path d="M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z"></path>
									</svg>
								</span>
								<span role="status">
									<span class="Polaris-VisuallyHidden">Spinner</span>
								</span>
							</div>
						`)
						$.ajax({
							url: `/campaign/template/${data.id}/activate`,
							type: "POST",
							data: JSON.stringify({"future": 0}),
							contentType: "application/json",
							success: function(data){
								$("#ActivatorBody").html(`
									<h3 class="Polaris-TextStyle--variationStrong" style="color: green;">Success!</h3>
									<p>${data}</p>
								`)
							},
							error: function(data){
								if(data.responseText === "Unauthorized"){
									return location.href="/"
								} else if(data.responseText === "Forbidden"){
									return location.href="/billing/plans"
								}
								const decider = data instanceof Array
								if(decider) {
									$("#ActivatorBody").html(`
										<p id="ValidDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Conflicts found</p>
										<ul class="Polaris-List">
											<span id="ActivatorDecoy"></span>
										</ul>
									`)
									decider.forEach(function(item){
										const begin = new Date(item.startDate).toISOString().split('T')
										const finish = new Date(item.endDate).toISOString().split('T')
										$("#ActivatorDecoy").after(`
											<li class="Polaris-List__Item" aria-label="${item.name}">
												<span class="Polaris-TextStyle--variationStrong">
													${item.name}
												</span>, active from
												<span class="Polaris-TextStyle--variationStrong">${begin[0]} at ${begin[1].substring(0, 5)}</span> to 
												<span class="Polaris-TextStyle--variationStrong">${finish[0]} at ${finish[1].substring(0, 5)}</span>
											</li>
										`)
									})
								} else {
									$("#ActivatorBody").html(`
										<h3 id="WinnerDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Error</h3>
										<p class="Polaris-InlineError">${data.responseText}</p>
									`)
								}
							}
						})
					})
					$("#GT1Btn").click(function(){
						$("#ActivatorBody").html(`
							<div>
								<span class="Polaris-Spinner Polaris-Spinner--sizeLarge">
									<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
										<path d="M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z"></path>
									</svg>
								</span>
								<span role="status">
									<span class="Polaris-VisuallyHidden">Spinner</span>
								</span>
							</div>
						`)
						$.ajax({
							url: `/campaign/template/${data.id}/activate`,
							type: "POST",
							data: JSON.stringify({"future": 1}),
							contentType: "application/json",
							success: function(data){
								$("#ActivatorBody").html(`
									<h3 id="WinnerDanger" class="Polaris-TextStyle--variationStrong" style="color: green;">Success</h3>
									<p>${data}</p>
								`)
							},
							error: function(data){
								if(data.responseText === "Unauthorized"){
									return location.href="/"
								} else if(data.responseText === "Forbidden"){
									return location.href="/billing/plans"
								}
								let decider = data.responseJSON
								console.log(decider)
								console.log(data)
								if(decider) {
									let arr = data.responseJSON
									$("#ActivatorBody").html(`
										<p id="ValidDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Conflicts found</p>
										<ul class="Polaris-List">
											<span id="ActivatorDecoy"></span>
										</ul>
									`)
									arr.forEach(function(item){
										const begin = new Date(item.startDate).toISOString().split('T')
										const finish = new Date(item.endDate).toISOString().split('T')
										$("#ActivatorDecoy").after(`
											<li class="Polaris-List__Item" aria-label="${item.name}">
												<span class="Polaris-TextStyle--variationStrong">
													${item.name}
												</span>, active from
												<span class="Polaris-TextStyle--variationStrong">${begin[0]} at ${begin[1].substring(0, 5)}</span> to 
												<span class="Polaris-TextStyle--variationStrong">${finish[0]} at ${finish[1].substring(0, 5)}</span>
											</li>
										`)
									})
								} else {
									$("#ActivatorBody").html(`
										<h3 id="WinnerDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Error</h3>
										<p class="Polaris-InlineError">${data.responseText}</p>
									`)
								}
							}
						})
					})
					$("#GT3Btn").click(function(){
						$("#ActivatorBody").html(`
							<div>
								<span class="Polaris-Spinner Polaris-Spinner--sizeLarge">
									<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
										<path d="M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z"></path>
									</svg>
								</span>
								<span role="status">
									<span class="Polaris-VisuallyHidden">Spinner</span>
								</span>
							</div>
						`)
						$.ajax({
							url: `/campaign/template/${data.id}/activate`,
							type: "POST",
							data: JSON.stringify({"future": 3}),
							contentType: "application/json",
							success: function(data){
								$("#ActivatorBody").html(`
									<h3 id="WinnerDanger" class="Polaris-TextStyle--variationStrong" style="color: green;">Success</h3>
									<p>${data}</p>
								`)
							},
							error: function(data){
								if(data.responseText === "Unauthorized"){
									return location.href="/"
								} else if(data.responseText === "Forbidden"){
									return location.href="/billing/plans"
								}
								let decider = data.responseJSON
								if(decider) {
									$("#ActivatorBody").html(`
										<p id="ValidDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Conflicts found</p>
										<ul class="Polaris-List">
											<span id="ActivatorDecoy"></span>
										</ul>
									`)
									decider.forEach(function(item){
										const begin = new Date(item.startDate).toISOString().split('T')
										const finish = new Date(item.endDate).toISOString().split('T')
										$("#ActivatorDecoy").after(`
											<li class="Polaris-List__Item" aria-label="${item.name}">
												<span class="Polaris-TextStyle--variationStrong">
													${item.name}
												</span>, active from
												<span class="Polaris-TextStyle--variationStrong">${begin[0]} at ${begin[1].substring(0, 5)}</span> to 
												<span class="Polaris-TextStyle--variationStrong">${finish[0]} at ${finish[1].substring(0, 5)}</span>
											</li>
										`)
									})
								} else {
									$("#ActivatorBody").html(`
										<h3 id="WinnerDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Error</h3>
										<p class="Polaris-InlineError">${data.responseText}</p>
									`)
								}
							}
						})
					})
					$("#GT7Btn").click(function(){
						$("#ActivatorBody").html(`
							<div>
								<span class="Polaris-Spinner Polaris-Spinner--sizeLarge">
									<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
										<path d="M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z"></path>
									</svg>
								</span>
								<span role="status">
									<span class="Polaris-VisuallyHidden">Spinner</span>
								</span>
							</div>
						`)
						$.ajax({
							url: `/campaign/template/${data.id}/activate`,
							type: "POST",
							data: JSON.stringify({"future": 7}),
							contentType: "application/json",
							success: function(data){
								$("#ActivatorBody").html(`
									<h3 id="WinnerDanger" class="Polaris-TextStyle--variationStrong" style="color: green;">Success</h3>
									<p>${data}</p>
								`)
							},
							error: function(data){
								if(data.responseText === "Unauthorized"){
									return location.href="/"
								} else if(data.responseText === "Forbidden"){
									return location.href="/billing/plans"
								}
								let decider = data.responseJSON
								if(decider) {
									$("#ActivatorBody").html(`
										<p id="ValidDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Conflicts found</p>
										<ul class="Polaris-List">
											<span id="ActivatorDecoy"></span>
										</ul>
									`)
									decider.forEach(function(item){
										const begin = new Date(item.startDate).toISOString().split('T')
										const finish = new Date(item.endDate).toISOString().split('T')
										$("#ActivatorDecoy").after(`
											<li class="Polaris-List__Item" aria-label="${item.name}">
												<span class="Polaris-TextStyle--variationStrong">
													${item.name}
												</span>, active from
												<span class="Polaris-TextStyle--variationStrong">${begin[0]} at ${begin[1].substring(0, 5)}</span> to 
												<span class="Polaris-TextStyle--variationStrong">${finish[0]} at ${finish[1].substring(0, 5)}</span>
											</li>
										`)
									})
								} else {
									$("#ActivatorBody").html(`
										<h3 id="WinnerDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Error</h3>
										<p class="Polaris-InlineError">${data.responseText}</p>
									`)
								}
							}
						})
					})
					$("#GT14Btn").click(function(){
						$("#ActivatorBody").html(`
							<div>
								<span class="Polaris-Spinner Polaris-Spinner--sizeLarge">
									<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
										<path d="M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z"></path>
									</svg>
								</span>
								<span role="status">
									<span class="Polaris-VisuallyHidden">Spinner</span>
								</span>
							</div>
						`)
						$.ajax({
							url: `/campaign/template/${data.id}/activate`,
							type: "POST",
							data: JSON.stringify({"future": 14}),
							contentType: "application/json",
							success: function(data){
								$("#ActivatorBody").html(`
									<h3 id="WinnerDanger" class="Polaris-TextStyle--variationStrong" style="color: green;">Success</h3>
									<p>${data}</p>
								`)
							},
							error: function(data){
								if(data.responseText === "Unauthorized"){
									return location.href="/"
								} else if(data.responseText === "Forbidden"){
									return location.href="/billing/plans"
								}
								let decider = data.responseJSON
								if(decider) {
									$("#ActivatorBody").html(`
										<p id="ValidDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Conflicts found</p>
										<ul class="Polaris-List">
											<span id="ActivatorDecoy"></span>
										</ul>
									`)
									decider.forEach(function(item){
										const begin = new Date(item.startDate).toISOString().split('T')
										const finish = new Date(item.endDate).toISOString().split('T')
										$("#ActivatorDecoy").after(`
											<li class="Polaris-List__Item" aria-label="${item.name}">
												<span class="Polaris-TextStyle--variationStrong">
													${item.name}
												</span>, active from
												<span class="Polaris-TextStyle--variationStrong">${begin[0]} at ${begin[1].substring(0, 5)}</span> to 
												<span class="Polaris-TextStyle--variationStrong">${finish[0]} at ${finish[1].substring(0, 5)}</span>
											</li>
										`)
									})
								} else {
									$("#ActivatorBody").html(`
										<h3 id="WinnerDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Error</h3>
										<p class="Polaris-InlineError">${data.responseText}</p>
									`)
								}
							}
						})
					})
					$("#GT30Btn").click(function(){
						$("#ActivatorBody").html(`
							<div>
								<span class="Polaris-Spinner Polaris-Spinner--sizeLarge">
									<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
										<path d="M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z"></path>
									</svg>
								</span>
								<span role="status">
									<span class="Polaris-VisuallyHidden">Spinner</span>
								</span>
							</div>
						`)
						$.ajax({
							url: `/campaign/template/${data.id}/activate`,
							type: "POST",
							data: JSON.stringify({"future": 30}),
							contentType: "application/json",
							success: function(data){
								$("#ActivatorBody").html(`
									<h3 id="WinnerDanger" class="Polaris-TextStyle--variationStrong" style="color: green;">Success</h3>
									<p>${data}</p>
								`)
							},
							error: function(data){
								if(data.responseText === "Unauthorized"){
									return location.href="/"
								} else if(data.responseText === "Forbidden"){
									return location.href="/billing/plans"
								}
								let decider = data.responseJSON
								if(decider) {
									$("#ActivatorBody").html(`
										<p id="ValidDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Conflicts found</p>
										<ul class="Polaris-List">
											<span id="ActivatorDecoy"></span>
										</ul>
									`)
									decider.forEach(function(item){
										const begin = new Date(item.startDate).toISOString().split('T')
										const finish = new Date(item.endDate).toISOString().split('T')
										$("#ActivatorDecoy").after(`
											<li class="Polaris-List__Item" aria-label="${item.name}">
												<span class="Polaris-TextStyle--variationStrong">
													${item.name}
												</span>, active from
												<span class="Polaris-TextStyle--variationStrong">${begin[0]} at ${begin[1].substring(0, 5)}</span> to 
												<span class="Polaris-TextStyle--variationStrong">${finish[0]} at ${finish[1].substring(0, 5)}</span>
											</li>
										`)
									})
								} else {
									$("#ActivatorBody").html(`
										<h3 id="WinnerDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Error</h3>
										<p class="Polaris-InlineError">${data.responseText}</p>
									`)
								}
							}
						})
					})
				}
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
				alert(data.responseText)
			}
		})
	}

	//url === /settings
	if(window.location.pathname === "/settings"){
		$("#ChangePlan").click(function(){
			location.href="/billing/change"
		})
		$("#DeleteAllRapidBtn").click(function(){
			$.ajax({
				url: "/campaign/rapid/delete/all",
				type: "POST",
				contentType: "application/json",
				success: function(data){
					alert(data)
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if (data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}
				}
			})
		})
		$("#DeleteAllLongBtn").click(function(){
			$.ajax({
				url: "/campaign/long/delete/all",
				type: "POST",
				contentType: "application/json",
				success: function(data){
					alert(data)
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if (data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}
				}
			})
		})
		$("#DeleteAllTemplatesBtn").click(function(){
			$.ajax({
				url: "/campaign/template/delete/all",
				type: "POST",
				contentType: "application/json",
				success: function(data){
					alert(data)
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if (data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}
				}
			})
		})
		$("#ExportJSON").click(function(){
			$(this).addClass("Polaris-Button--loading")
			$("#ExportJSONText").before(`
				<span id="ExportJSONSpinner" class="Polaris-Button__Spinner">
					<span class="Polaris-Spinner Polaris-Spinner--sizeSmall">
						<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"></path>
						</svg>
					</span>
					<span role="status">
						<span class="Polaris-VisuallyHidden">Loading</span>
					</span>
				</span>
			`)
			$.ajax({
				url: "/data/customers/export-json",
				type: "GET",
				contentType: "application/json",
				success: function(data){
					$("#ExportJSON").removeClass("Polaris-Button--loading")
					$("#ExportJSONSpinner").remove()
					let filename = "customers.json";
					let contentType = "application/json;charset=utf-8;";
					if (window.navigator && window.navigator.msSaveOrOpenBlob) {
						let blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(data, null, 2)))], { type: contentType });
						navigator.msSaveOrOpenBlob(blob, filename);
					} else {
						let a = document.createElement('a');
						a.download = filename;
						a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(data, null, 2));
						a.target = '_blank';
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
					}
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if(data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}
					$("#ExportJSON").removeClass("Polaris-Button--loading")
					$("#ExportJSONSpinner").remove()
				}
			})
		})
		$.ajax({
			url: '/shop',
			success: function(data){
				$(".BillSketch").remove()
				if(data.plan === "Starter"){
					$("#PlanDetails").text("You are currently on the Starter plan for 19 USD per month.")
				}
				if(data.plan === "Standard"){
					$("#PlanDetails").text("You are currently on the Standard plan for 39 USD per month.")
				}
				if(data.plan === "Ultimate"){
					$("#PlanDetails").text("You are currently on the Ultimate plan for 79 USD per month.")
				}
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
			}
		})
		$.ajax({
			url: "/data/customers/counter",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				$(".CustomersSketch").remove()
				$("#CustomersBody").text(`You email list currently has a total of ${data} customers. These are individuals who have participated in all of your giveaway events.`)
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
			}
		})
	}

	//url === /campaign/rapid/new
	if(window.location.pathname === "/campaign/rapid/new"){

		let chosenDays = datePicker()

		$("#RValidateBtn").click(function(){
			console.log(chosenDays)
			$("#RValidBody").html(`
				<div>
					<span class="Polaris-Spinner Polaris-Spinner--sizeLarge">
						<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
							<path d="M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z"></path>
						</svg>
					</span>
					<span role="status">
						<span class="Polaris-VisuallyHidden">Spinner</span>
					</span>
				</div>
			`)
			if(chosenDays.length === 0){
				return (
					$("#RValidBody").html(`
						<p class="Polaris-InlineError">Error! Please choose at least one date.</p>
					`)
				)
			}
			
			$.ajax({
				url: `/campaign/rapid/validator`,
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({dates: chosenDays}),
				success: function(data){
					if(data.length === 0){
						return (
							$("#RValidBody").html(`
								<p class="Polaris-TextStyle--variationStrong" style="color: green;">Successful! No scheduling conflicts found.</p>
							`)
						)
					}
					$("#RValidBody").html(`
						<p id="RValidDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Conflicts found</p>
						<ul class="Polaris-List">
							<span id="RValidDecoy"></span>
						</ul>
					`)
					data.forEach(function(item){
						$("#RValidDecoy").after(`
							<li class="Polaris-List__Item" aria-label="Date ${item} clashes with an existing event.">
								<span class="Polaris-TextStyle--variationStrong">
									${new Date(item).toLocaleDateString()}
								</span>, clashes with an existing event.
							</li>
						`)
					})
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if(data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}
					$("#RValidBody").html(`
						<p>Press the validator button to check for scheduling conflicts with existing giveaways.</p>
					`)
					alert(data.responseText)
				}
			})
		})

		$("#CreateRapidBtn").click(function(){
			const normal = $("#NormalPrize").val()
			const grand = $("#GrandPrize").val()
			const name = $("#RapidEventName").val()
			const dates = chosenDays
			if(normal.length === 0 || grand.length === 0 || name.length === 0 || dates.length === 0){
				return alert("Please fill all fields.")
			}

			const event = {
				"name": name,
				"normal": normal,
				"grand": grand,
				"dates": dates
			}

			$.ajax({
				url: "/campaign/rapid/new",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({event}),
				success: function(data){
					location.href=data
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if(data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}
					alert(data.responseText)
				}
			})
		})
	}

	//url == /campaign/rapid/:id
	if(!isNaN(idForGiveaway) && window.location.pathname === "/campaign/rapid/"+idForGiveaway){
		$.ajax({
			url: `/data/campaign/rapid/${idForGiveaway}`,
			type: "GET",
			contentType: "application/json",
			success: function(data){
				$(".FirstSketch").remove()
				eventCalendar(data.dates)
				$("#RapidName").text(data.title)
				$("#TotalWinners").text(data.winnersTotal+" prizes up for grabs, plus a single Grand prize.")
				$("#RegularPrize").text(`
					${data.prizes.normalPrize} USD
				`)
				$("#GrandPrize").text(`
					${data.prizes.grandPrize} USD
				`)

				$("#DeleteRapidBtn").click(function(){
					$(this).addClass("Polaris-Button--loading")
					$("#DeleteRapidBtnText").before(`
						<span id="DeleteRapidBtnSpinner" class="Polaris-Button__Spinner">
							<span class="Polaris-Spinner Polaris-Spinner--sizeSmall">
								<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
										<path d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"></path>
								</svg>
							</span>
							<span role="status">
								<span class="Polaris-VisuallyHidden">Loading</span>
							</span>
						</span>
					`)

					$.ajax({
						url: `/campaign/rapid/${data.id}/delete`,
						type: "POST",
						contentType: "application/json",
						success: function(data){
							location.href=data
						},
						error: function(data){
							if(data.responseText === "Unauthorized"){
								return location.href="/"
							} else if(data.responseText === "Forbidden"){
								return location.href="/billing/plans"
							}
							$("#DeleteRapidBtn").removeClass("Polaris-Button--loading")
							$("#DeleteRapidBtnSpinner").remove()
							alert(data.responseText)
						}
					})
				})

				$.ajax({
					url: `/data/campaign/rapid/${idForGiveaway}/active`,
					type: "GET",
					contentType: "application/json",
					success: function(data){
						$(".ActiveSketch").remove()
						if(data.id === 404){
							return (
								$("#RActiveSection").html(`
									<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
										<div class="Polaris-EmptyState__Section">
											<div class="Polaris-EmptyState__DetailsContainer">
												<div class="Polaris-EmptyState__Details">
													<div class="Polaris-TextContainer">
														<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">No event active today</p>
														<div class="Polaris-EmptyState__Content">
															<p>You currently do not have an event for today.</p>
														</div>
													</div>
												</div>
											</div>
											<div class="Polaris-EmptyState__ImageContainer">
												<div style="width: 100%; background: white;"></div>
											</div>
										</div>
									</div>
								`)
							)
						}
						$("#RAEnds").text(new Date(data.endDate).toDateString())
						$("#RAEntries").text(data.entriesTotal)
					},
					error: function(data){
						if(data.responseText === "Unauthorized"){
							return location.href="/"
						} else if(data.responseText === "Forbidden"){
							return location.href="/billing/plans"
						}
						alert(data.responseText)
					}
				})
				$.ajax({
					url: `/data/campaign/rapid/${idForGiveaway}/upcoming`,
					type: "GET",
					contentType: "application/json",
					success: function(data){
						$(".UpcomingSketch").remove()
						if(data.length === 0){
							$("#RUListWrapper").remove()
							return (
								$("#RU").html(`
									<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
										<div class="Polaris-EmptyState__Section">
											<div class="Polaris-EmptyState__DetailsContainer">
												<div class="Polaris-EmptyState__Details">
													<div class="Polaris-TextContainer">
														<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">Create a new giveaway</p>
														<div class="Polaris-EmptyState__Content">
															<p>Incentivize customers to spend more in your store.</p>
														</div>
													</div>
													<div class="Polaris-EmptyState__Actions">
														<div class="Polaris-Stack Polaris-Stack--spacingTight Polaris-Stack--distributionCenter Polaris-Stack--alignmentCenter">
															<div class="Polaris-Stack__Item"><a href="/campaign/new" class="Polaris-Button Polaris-Button--primary CreateGiveaway" type="button"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Create a giveaway</span></span></a></div>
															<div class="Polaris-Stack__Item"><a class="Polaris-Button" href="#" data-polaris-unstyled="true"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Learn more</span></span></a></div>
														</div>
													</div>
												</div>
											</div>
											<div class="Polaris-EmptyState__ImageContainer"><img src="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" role="presentation" alt="" class="Polaris-EmptyState__Image"></div>
										</div>
									</div>
								`)
							)
						}
						$(".RUDecoyItem").remove()
						data.reverse().forEach(function(giv){
							const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${55 + 10 * Math.random()}%)`
							$("#RUDataDecoy").after(`
								<li class="Polaris-ResourceItem__ListItem">
									<div class="Polaris-ResourceItem__ItemWrapper">
										<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling">
											<div class="Polaris-ResourceItem__Container" id="Upcoming${giv.id}">
												<div class="Polaris-ResourceItem__Owned">
													<div class="Polaris-ResourceItem__Media">
														<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
															<div class="dp" style="background: ${colour}; color: black;">${giv.name.substring(0,1)}</div>
														</span>
													</div>
												</div>
												<div class="Polaris-ResourceItem__Content">
													<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
														<div class="Polaris-Stack__Item">
															<h3><span class="Polaris-TextStyle--variationStrong">${giv.name}</span></h3>
															<div><span class="Polaris-TextStyle--variationStrong">Begins on</span> ${new Date(giv.startDate).toDateString()}</div>
															<div><span class="Polaris-TextStyle--variationStrong">At</span> ${new Date(giv.startDate).toLocaleTimeString()}</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</li>
							`)
						})
					},
					error: function(data){
						if(data.responseText === "Unauthorized"){
							return location.href="/"
						} else if(data.responseText === "Forbidden"){
							return location.href="/billing/plans"
						}
						alert(data.responseText)
					}
				})
				$.ajax({
					url: `/data/campaign/rapid/${idForGiveaway}/awaiting`,
					type: "GET",
					contentType: "application/json",
					success: function(data){
						
						if(data.length === 0){
							const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${55 + 10 * Math.random()}%)`
							return (
								$("#AwaitingSketch").html(`
									<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
										<div class="Polaris-EmptyState__Section">
											<div class="Polaris-EmptyState__DetailsContainer">
												<div class="Polaris-EmptyState__Details">
													<div class="Polaris-TextContainer">
														<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">No actions needed</p>
														<div class="Polaris-EmptyState__Content">
															<p>This action center for any outstanding actions required from expired giveaways.</p>
														</div>
													</div>
												</div>
											</div>
											<div class="Polaris-EmptyState__ImageContainer">
												<div style="width: 100%; background: ${colour};"></div>
											</div>
										</div>
									</div>
								`)
							)
						}
						$("#RAwaitingHeader").html(`
							<span>Awaiting</span>
							<span style="color: green;">(${data.length})</span>
						`)
						$("#AwaitingSketch").remove()
						data.reverse().forEach(function(giv){
							$("#RAwaitingHeaderWr").after(`
								<div id="AwaitingSketch" class="Polaris-Card__Section">
									<div class="Polaris-Card__SectionHeader">
										<h3 class="Polaris-Subheading" style="color: green;">${new Date(giv.endDate).toDateString()} - Event</h3>
									</div>
									<div class="Polaris-TextContainer">
										<div class="Polaris-ButtonGroup">
											<div class="Polaris-ButtonGroup__Item">
												<button id="chooseWinner${giv.id}" class="Polaris-Button ${giv.winnersChosen === true ? "Polaris-Button--disabled" : "Polaris-Button--outline"}" type="button">
													<span class="Polaris-Button__Content">
														<span id="chooseWinner${giv.id}text" class="Polaris-Button__Text">Choose a winner</span>
													</span>
												</button>
											</div>
											<div class="Polaris-ButtonGroup__Item">
												<button id="sendVoucher${giv.id}" class="Polaris-Button ${giv.winnersGifted === false && giv.winnersChosen === true ? "Polaris-Button--outline" : "Polaris-Button--disabled"}" type="button">
													<span class="Polaris-Button__Content">
														<span id="sendVoucher${giv.id}text" class="Polaris-Button__Text">Sent voucher to winner</span>
													</span>
												</button>
											</div>
										</div>
										<div>Winner : 
											<span class="Polaris-TextStyle--variationStrong">
												${giv.winnersChosen === true ? giv.winner.entrantEmail : "Not chosen yet"}
											</span>
										</div>
										<div>Voucher status : 
											<span class="Polaris-TextStyle--variationStrong">
												${giv.winnersGifted === true ? "Send" : "Not Send"}
											</span>
										</div>
										<div>Total entries : 
											<span class="Polaris-TextStyle--variationStrong">
												${giv.entriesTotal}
											</span>
										</div>
									</div>
								</div>
							`)
							if(giv.winnersChosen === false && giv.winnersGifted === false){
								$(`#chooseWinner${giv.id}`).click(function(){
									$(this).addClass("Polaris-Button--loading")
									$(`#chooseWinner${giv.id}text`).before(`
										<span id="chooseWinner${giv.id}spinner" class="Polaris-Button__Spinner">
											<span class="Polaris-Spinner Polaris-Spinner--sizeSmall">
												<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
																						<path d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"></path>
																				</svg>
																			</span>
																			<span role="status">
																				<span class="Polaris-VisuallyHidden">Loading</span>
																			</span>
																		</span>
																	`)
																	$.ajax({
																		url: `/campaign/rapid/${giv.id}/choose-winners`,
																		type: "POST",
																		contentType: "application/json",
																		success: function(data){
																			alert(data)
																			location.reload()
																		},
																		error: function(data){
																			if(data.responseText === "Unauthorized"){
												return location.href="/"
											} else if(data.responseText === "Forbidden"){
												return location.href="/billing/plans"
											}
											$(`#chooseWinner${giv.id}`).removeClass("Polaris-Button--loading")
											$(`#chooseWinner${giv.id}spinner`).remove()
											alert(data.responseText)
																		}
																	})
								})
							}
							if(giv.winnersChosen === true && giv.winnersGifted === false){
								$(`#sendVoucher${giv.id}`).click(function(){
									$(this).addClass("Polaris-Button--loading")
									$(`#sendVoucher${giv.id}text`).before(`
										<span id="sendVoucher${giv.id}spinner" class="Polaris-Button__Spinner">
											<span class="Polaris-Spinner Polaris-Spinner--sizeSmall">
												<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
																						<path d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"></path>
																				</svg>
																			</span>
																			<span role="status">
																				<span class="Polaris-VisuallyHidden">Loading</span>
																			</span>
																		</span>
																	`)
																	$.ajax({
																		url: `/campaign/rapid/${giv.id}/gift`,
																		type: "GET",
																		contentType: "application/json",
																		success: function(data){
																			alert(data)
																			location.reload()
																		},
																		error: function(data){
																			if(data.responseText === "Unauthorized"){
												return location.href="/"
											} else if(data.responseText === "Forbidden"){
												return location.href="/billing/plans"
											}
											$(`#sendVoucher${giv.id}`).removeClass("Polaris-Button--loading")
											$(`#sendVoucher${giv.id}spinner`).remove()
											alert(data.responseText)
																		}
																	})
								})
							}							
						})
					},
					error: function(data){
						if(data.responseText === "Unauthorized"){
							return location.href="/"
						} else if(data.responseText === "Forbidden"){
							return location.href="/billing/plans"
						}
						alert(data.responseText)
					}
				})
				$.ajax({
					url: `/data/campaign/grand/${data.grandPrize.id}`,
					type: "GET",
					contentType: "application/json",
					success: function(data){
						$(".GrandSketch").remove()
						$("#RGrandWinner").text(data.winnersChosen === true ? data.winner.entrantEmail : "Not yet chosen")
						$("#RVoucherStatus").text(data.winnersGifted === true ? "Sent" : "Not sent")
						$("#RChildEvents").text(`${data.completedEvents} of ${data.allEvents} completed participating events`)
						if(data.winnersChosen === true && data.winnersGifted === false && data.completedEvents === data.allEvents){
							$("#GsendVoucher").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--outline")
							$("#GsendVoucher").click(function(){
								$(this).addClass("Polaris-Button--loading")
								$(`#GsendVouchertext`).before(`
									<span id="GsendVoucherSpinner" class="Polaris-Button__Spinner">
										<span class="Polaris-Spinner Polaris-Spinner--sizeSmall">
											<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
																					<path d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"></path>
																			</svg>
																		</span>
																		<span role="status">
																			<span class="Polaris-VisuallyHidden">Loading</span>
																		</span>
																	</span>
																`)

																$.ajax({
																	url: `/campaign/grand/${data.id}/gift`,
																	type: "GET",
																	contentType: "application/json",
																	success: function(data){
																		alert(data)
																		location.reload()
																	},
																	error: function(data){
																		if(data.responseText === "Unauthorized"){
											return location.href="/"
										} else if(data.responseText === "Forbidden"){
											return location.href="/billing/plans"
										}
										$("#GsendVoucher").removeClass("Polaris-Button--loading")
										$("#GsendVoucherSpinner").remove()
										alert(data.responseText)
																	}
																})
							})
						} else if(data.winnersChosen === false && data.winnersGifted === false && data.completedEvents === data.allEvents){
							$("#GchooseWinner").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--outline")
							$("#GchooseWinner").click(function(){
								$(this).addClass("Polaris-Button--loading")
								$(`#GchooseWinnertext`).before(`
									<span id="GchooseWinnerSpinner" class="Polaris-Button__Spinner">
										<span class="Polaris-Spinner Polaris-Spinner--sizeSmall">
											<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
																					<path d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"></path>
																			</svg>
																		</span>
																		<span role="status">
																			<span class="Polaris-VisuallyHidden">Loading</span>
																		</span>
																	</span>
																`)

																$.ajax({
																	url: `/campaign/grand/${data.id}/choose-winners`,
																	type: "POST",
																	contentType: "application/json",
																	success: function(data){
																		alert(data)
																		location.reload()
																	},
																	error: function(data){
																		if(data.responseText === "Unauthorized"){
											return location.href="/"
										} else if(data.responseText === "Forbidden"){
											return location.href="/billing/plans"
										}
										$("#GchooseWinner").removeClass("Polaris-Button--loading")
										$("#GchooseWinnerSpinner").remove()
										alert(data.responseText)
																	}
																})
							})
						}
					},
					error: function(data){
						if(data.responseText === "Unauthorized"){
							return location.href="/"
						} else if(data.responseText === "Forbidden"){
							return location.href="/billing/plans"
						}
						alert(data.responseText)
					}
				})
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
				alert(data.responseText)
			}
		})
	}
})
