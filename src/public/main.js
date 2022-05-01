$(document).ready(function(e){
	//theme
	
	function datePicker(){
		function renderMonth(num){

			function scheduler(num){
				const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
				const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
				const dayNow = toISOLocal(new Date(Date.now()))
				const dayOne = dayNow.substring(0,8)+"01"
				let dater = new Date(dayOne)
				let theDate = new Date(dater.setMonth(num))
				//console.log(num)
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
					data.forEach((item, index, arr) => {
						return arr[index] = new Date(item).toLocaleDateString('en-ZA')
					})
					const weeks = allocateWeeks()
					let one = ""; let two = ""; let three = ""; let four = ""; let five = ""; let six = "";
			
					for(let i = 0; weeks[0].length + i !== 7; i++){
						one = one.concat(`<td class="Polaris-DatePicker__EmptyDayCell"></td>`)
					}
					//console.log(data)
					weeks[0].forEach(function(item){
						//console.log(data.includes(item.date))
						//console.log(item.date)
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
						} else if(chosenDays.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
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
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayChosen" aria-label="${item.date}">
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
						} else if(chosenDays.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
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
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayChosen" aria-label="${item.date}">
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
						} else if(chosenDays.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
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
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayChosen" aria-label="${item.date}">
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
						} else if(chosenDays.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
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
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayChosen" aria-label="${item.date}">
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
						} else if(chosenDays.includes(item.date) && item.date === new Date(Date.now()).toLocaleDateString('en-ZA')){
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
									<button id="${eyedee}" type="button" tabindex="-1" class="Polaris-DatePicker__Day Polaris-DatePicker__Day--hoverRight calendarDayChosen" aria-label="${item.date}">
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
		
		//console.log(dayOne)
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
			const dayNow = toISOLocal(new Date(Date.now()))
			const dayOne = dayNow.substring(0,8)+"01"
			let dater = new Date(dayOne)
			let theDate = new Date(dater.setMonth(num))
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
						data.forEach((item, index, arr) => {
							return arr[index] = new Date(item).toLocaleDateString('en-ZA')
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

	function validateLong(id){
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
		if(id){
			$.ajax({
				url: `/data/long-validator?start=${starts}&end=${ends}&id=${id}`,
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
		} else {
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
		}
	}

	function chooseProducts(){
		const productLoadingStr = `
			<div class="Polaris-Stack Polaris-Stack--alignmentCenter ProductSelectionModalSketch" style="padding: 1.5em;">
				<div class="Polaris-Stack__Item">
					<label class="Polaris-Choice Polaris-Choice--labelHidden" for="PolarisCheckbox2"><span class="Polaris-Choice__Control"><span class="Polaris-Checkbox"><input id="PolarisCheckbox2" type="checkbox" class="Polaris-Checkbox__Input" aria-invalid="false" role="checkbox" aria-checked="false" value=""><span class="Polaris-Checkbox__Backdrop"></span><span class="Polaris-Checkbox__Icon"><span class="Polaris-Icon"><span class="Polaris-VisuallyHidden"></span><svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
					<path d="m8.315 13.859-3.182-3.417a.506.506 0 0 1 0-.684l.643-.683a.437.437 0 0 1 .642 0l2.22 2.393 4.942-5.327a.436.436 0 0 1 .643 0l.643.684a.504.504 0 0 1 0 .683l-5.91 6.35a.437.437 0 0 1-.642 0"></path>
					</svg></span></span></span></span><span class="Polaris-Choice__Label">Loading</span></label>
				</div>
				<div class="Polaris-Stack__Item">
					<div class="Polaris-Stack Polaris-Stack--spaceTight">
						<div class="Polaris-Stack__Item">
							<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
								<div class="Polaris-SkeletonThumbnail Polaris-SkeletonThumbnail--sizeMedium"></div>
							</span>
						</div>
						<div class="Polaris-Stack__Item">
							<div class="Polaris-SkeletonDisplayText__DisplayText Polaris-SkeletonDisplayText--sizeSmall"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="Polaris-Stack Polaris-Stack--alignmentCenter ProductSelectionModalSketch" style="padding: 1.5em;">
				<div class="Polaris-Stack__Item">
					<label class="Polaris-Choice Polaris-Choice--labelHidden" for="PolarisCheckbox2"><span class="Polaris-Choice__Control"><span class="Polaris-Checkbox"><input id="PolarisCheckbox2" type="checkbox" class="Polaris-Checkbox__Input" aria-invalid="false" role="checkbox" aria-checked="false" value=""><span class="Polaris-Checkbox__Backdrop"></span><span class="Polaris-Checkbox__Icon"><span class="Polaris-Icon"><span class="Polaris-VisuallyHidden"></span><svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
					<path d="m8.315 13.859-3.182-3.417a.506.506 0 0 1 0-.684l.643-.683a.437.437 0 0 1 .642 0l2.22 2.393 4.942-5.327a.436.436 0 0 1 .643 0l.643.684a.504.504 0 0 1 0 .683l-5.91 6.35a.437.437 0 0 1-.642 0"></path>
					</svg></span></span></span></span><span class="Polaris-Choice__Label">Loading</span></label>
				</div>
				<div class="Polaris-Stack__Item">
					<div class="Polaris-Stack Polaris-Stack--spaceTight">
						<div class="Polaris-Stack__Item">
							<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
								<div class="Polaris-SkeletonThumbnail Polaris-SkeletonThumbnail--sizeMedium"></div>
							</span>
						</div>
						<div class="Polaris-Stack__Item">
							<div class="Polaris-SkeletonDisplayText__DisplayText Polaris-SkeletonDisplayText--sizeSmall"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="Polaris-Stack Polaris-Stack--alignmentCenter ProductSelectionModalSketch" style="padding: 1.5em;">
				<div class="Polaris-Stack__Item">
					<label class="Polaris-Choice Polaris-Choice--labelHidden" for="PolarisCheckbox2"><span class="Polaris-Choice__Control"><span class="Polaris-Checkbox"><input id="PolarisCheckbox2" type="checkbox" class="Polaris-Checkbox__Input" aria-invalid="false" role="checkbox" aria-checked="false" value=""><span class="Polaris-Checkbox__Backdrop"></span><span class="Polaris-Checkbox__Icon"><span class="Polaris-Icon"><span class="Polaris-VisuallyHidden"></span><svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
					<path d="m8.315 13.859-3.182-3.417a.506.506 0 0 1 0-.684l.643-.683a.437.437 0 0 1 .642 0l2.22 2.393 4.942-5.327a.436.436 0 0 1 .643 0l.643.684a.504.504 0 0 1 0 .683l-5.91 6.35a.437.437 0 0 1-.642 0"></path>
					</svg></span></span></span></span><span class="Polaris-Choice__Label">Loading</span></label>
				</div>
				<div class="Polaris-Stack__Item">
					<div class="Polaris-Stack Polaris-Stack--spaceTight">
						<div class="Polaris-Stack__Item">
							<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
								<div class="Polaris-SkeletonThumbnail Polaris-SkeletonThumbnail--sizeMedium"></div>
							</span>
						</div>
						<div class="Polaris-Stack__Item">
							<div class="Polaris-SkeletonDisplayText__DisplayText Polaris-SkeletonDisplayText--sizeSmall"></div>
						</div>
					</div>
				</div>
			</div>
		`
		let quantity = {
			"products": "all",
			"items": []
		}

		$("#AllProductsBtn").click(function(){
			quantity.products = "all"
			$(this).addClass("Polaris-Button--pressed")
			$("#ChooseCollectionBtn").removeClass("Polaris-Button--pressed")
			$("#ChooseProductsBtn").removeClass("Polaris-Button--pressed")	
			$("#CPCDValue").text("All products qualify as an entry into this giveaway")	
			$("#ChosenProductsWrapper").remove()
		})

		$("#ChooseProductsBtn").click(function(){
			quantity.products = "select"
			$(this).addClass("Polaris-Button--pressed")
			$("#ChooseCollectionBtn").removeClass("Polaris-Button--pressed")
			$("#AllProductsBtn").removeClass("Polaris-Button--pressed")

			$("#ProductSelectionModal").removeClass("disappear")
			$.ajax({
				url: "/data/products",
				type: "GET",
				contentType: "application/json",
				success: function(data){

					const isModalOpen = $("#ProductSelectionModal").hasClass("disappear")

					if(data.length > 0 && !isModalOpen){
						$(".ProductSelectionModalSketch").remove()
						data.forEach(function(item){
							const giv = item.node
							const id = giv.id.split("/")[4]
							//console.log(id)
							$("#ProductsModalListDecoy").after(`
								<div class="Polaris-Stack Polaris-Stack--alignmentCenter ProductSelectionModalItemContainer" style="padding: 1.5em;">
									<div id="${id}label" class="Polaris-Stack__Item">
										<label class="Polaris-Choice Polaris-Choice--labelHidden" for="${id}">
											<span class="Polaris-Choice__Control">
												<span class="Polaris-Checkbox">
													<input id="${id}" type="checkbox" class="Polaris-Checkbox__Input ProductSelectionModalItem" aria-invalid="false" role="checkbox" aria-checked="false" value="${giv.id},${giv.title},${giv.featuredImage.url}">
														<span class="Polaris-Checkbox__Backdrop"></span>
														<span class="Polaris-Checkbox__Icon">
															<span class="Polaris-Icon">
																<span class="Polaris-VisuallyHidden"></span>
																<svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
																		<path d="m8.315 13.859-3.182-3.417a.506.506 0 0 1 0-.684l.643-.683a.437.437 0 0 1 .642 0l2.22 2.393 4.942-5.327a.436.436 0 0 1 .643 0l.643.684a.504.504 0 0 1 0 .683l-5.91 6.35a.437.437 0 0 1-.642 0"></path>
																</svg>
															</span>
														</span>
													</span>
												</span>
											<span class="Polaris-Choice__Label">${giv.title}</span>
										</label>
										</div>
									<div class="Polaris-Stack__Item">
										<div class="Polaris-Stack Polaris-Stack--spaceTight">
											<div class="Polaris-Stack__Item">
												<span aria-label="${giv.featuredImagealtText}" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
													<img src="${giv.featuredImage.url}" alt="${giv.featuredImagealtText} loading="lazy" />
												</span>
											</div>
											<div class="Polaris-Stack__Item">
												<h2 class="Polaris-Heading">${giv.title}</h2>
											</div>
										</div>
									</div>
								</div>
							`)

							$(`#${id}label`).click(function(){
								$(`#${id}`).attr("aria-checked", $(`#${id}`).attr("checked") === "true" ? "true" : "false")
							})
						})
					}
				},
				error: function(data){

				}
			})	

			$("#CPCDValue").text("Only the chosen products qualify as an entry into this giveaway")	
		})

		$("#ProductSelectionModalSave").click(function(){
			let checked = []
			$(".ProductSelectionModalItem:checked").each(function(i){
				checked[i] = $(this).val()
			})

			if(checked.length === 0){
				return alert("Please select at least one item before you save")
			}

			$("#ChosenProductsWrapper").remove()

			let parsedData = []
			checked.forEach(function(giv){
				parsedData.push(giv.split(","))
			})
			$("#ChooseProductsChoiceDescript").after(`
				<div id="ChosenProductsWrapper" class="Polaris-ResourceList__ResourceListWrapper">
					<ul class="Polaris-ResourceList">
						<span id="ChosenProductsDecoy"></span>
					</ul>
				</div>
			`)
			quantity.items = parsedData
			parsedData.forEach(function(giv){
				const title = giv[1]
				const id = giv[0]
				const url = giv[2]

				$("#ChosenProductsDecoy").after(`
					<li class="Polaris-ResourceItem__ListItem">
						<div class="Polaris-ResourceItem__ItemWrapper">
							<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling">
								<div class="Polaris-ResourceItem__Container" id="${id.split("/")[4]}copy">
									<div class="Polaris-ResourceItem__Owned">
										<div class="Polaris-ResourceItem__Media">
											<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
												<img src="${url}" /> 
											</span>
										</div>
									</div>
									<div class="Polaris-ResourceItem__Content">
										<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
											<div class="Polaris-Stack__Item">
												<h3><span class="Polaris-TextStyle--variationStrong">${title}</span></h3>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</li>
				`)
			})

			$(".ProductSelectionModalItemContainer").remove()
			$("#ProductsModalListDecoy").after(productLoadingStr)
			$("#ProductSelectionModal").addClass("disappear")		
		})

		$(".ProductSelectionModalClose").click(function(){
			$(".ProductSelectionModalItemContainer").remove()
			$("#ProductsModalListDecoy").after(productLoadingStr)
			$("#ProductSelectionModal").addClass("disappear")
			//console.log("Clicked")
		})

		return quantity
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
	$("#AnalyticsBtn").click(function(){
		location.href="/analytics"
	})
	$("#ProgressBtn").click(function(){
		location.href="/progress"
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
	$("#GetTutorial").click(function(){
		location.href="#"
	})
	$("#EmailBtn").click(function(){
		location.href="/settings/email"
	})


	$(".ThemeBtn").click(function(){
		$.ajax({
			url: '/shop',
			success: function(data){
				console.log(data)
				location.href="https://"+data.shop+"/admin/themes"
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
	$(".CreateLong").click(function(){
		location.href="/campaign/long/new"
	})
	$(".CreateRapid").click(function(){
		location.href="/campaign/rapid/new"
	})
	$(".ToGiveawayTemplates").click(function(){
		location.href="/campaign/giveaways"
	})

	//url === /
	if(window.location.pathname === "/"){
		$.ajax({
			url: "/analytics/all-revenue",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				$("#HTRSketch").remove()
				$("#HTRText").text(data.total+" "+data.currencyCode)
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
			url: "/data/campaigns/unfinished",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				if(data.length > 0){
					data.forEach(function(giv){
						$("#HomaPageContent").before(`
							<div class="Polaris-Banner Polaris-Banner--statusWarning Polaris-Banner--withinPage" tabindex="0" role="alert" aria-live="polite" aria-labelledby="UnfinishedBanner${giv.id}Heading" aria-describedby="UnfinishedBanner${giv.id}Content">
								<div class="Polaris-Banner__Ribbon">
									<span class="Polaris-Icon Polaris-Icon--colorWarning Polaris-Icon--applyColor">
										<span class="Polaris-VisuallyHidden"></span>
										<svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
														<path fill-rule="evenodd" d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zM9 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V6zm1 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
												</svg>
											</span>
										</div>
								<div class="Polaris-Banner__ContentWrapper">
									<div class="Polaris-Banner__Heading" id="UnfinishedBanner${giv.id}Heading">
										<p id="HUBHead${giv.id}" class="Polaris-Heading"></p>
									</div>
									<div class="Polaris-Banner__Content" id="UnfinishedBanner${giv.id}Content">
										<p>Fill in all the critical fields required in this event, in order for it to run.</p>
										<div class="Polaris-Banner__Actions">
											<div class="Polaris-ButtonGroup">
												<div class="Polaris-ButtonGroup__Item">
													<div class="Polaris-Banner__PrimaryAction">
														<button id="HUBBtn${giv.id}" class="Polaris-Banner__Button" type="button">Edit event</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						`)

						$(`#HUBHead${giv.id}`).text(`"${giv.name}" needs your attention!`)
						if(giv.eventType === "Rapid"){
							$(`#HUBBtn${giv.id}`).click(function(){
								location.href=`/campaign/rapid/${giv.parentId}/edit`
							})
						} else {
							$(`#HUBBtn${giv.id}`).click(function(){
								location.href=`/campaign/long/${giv.id}/edit`
							})
						}
					})
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
			url: "/analytics/top-performing-events",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				//console.log("The template length is "+data.length)
				if(data.length === 0){
					$("#HTPListWrapper").remove()
					return (
						$("#TopPerform").html(`
							<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
								<div class="Polaris-EmptyState__Section">
									<div class="Polaris-EmptyState__DetailsContainer">
										<div class="Polaris-EmptyState__Details">
											<div class="Polaris-TextContainer">
												<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">No top performing events found</p>
												<div class="Polaris-EmptyState__Content">
													<p>Create a long or rapid giveaway event from the buttons on the top right of this page to get started outperforming the competiton.</p>
												</div>
											</div>
										</div>
									</div>
									<div class="Polaris-EmptyState__ImageContainer"></div>
								</div>
							</div>
						`)
					)
				}
				$(".HTPDecoyItem").remove()
				data.reverse().forEach(function(giv){
					const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${55 + 10 * Math.random()}%)`
					$("#HTPDataDecoy").after(`
						<li class="Polaris-ResourceItem__ListItem">
							<div class="Polaris-ResourceItem__ItemWrapper">
								<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling" data-href="/campaign/long/${giv.id}">
									<a id="TopLink${giv.id}"  class="Polaris-ResourceItem__Link" tabindex="0" data-polaris-unstyled="true"></a>
									<div class="Polaris-ResourceItem__Container" id="Top${giv.id}">
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
													<h3><span class="Polaris-TextStyle--variationStrong Polaris-Subheading" id="TopName${giv.id}"></span></h3>
													<div><span class="Polaris-TextStyle--variationStrong">Event type :</span> ${giv.eventType}</div>
													<div><span class="Polaris-TextStyle--variationStrong">Total revenue :</span> ${giv.grossRevenue} ${giv.currencyCode}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</li>
					`)

					$(`#TopName${giv.id}`).text(giv.name)
					$(`#TopLink${giv.id}`).attr("aria-label", `A link to template ${giv.name}`)
					
					if(giv.eventType === "Rapid"){
						$(`#Top${giv.id}`).click(function(){
							location=href=`/campaign/rapid/${giv.parentId}`
						})
						$(`#TopLink${giv.id}`).attr("href", `/campaign/rapid/${giv.parentId}`)
					} else {
						$(`#Top${giv.id}`).click(function(){
							location=href=`/campaign/long/${giv.id}`
						})
						$(`#TopLink${giv.id}`).attr("href", `/campaign/long/${giv.id}`)
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
			url: "/analytics/quota/usage",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				const currentUsage = data.usage
				const maxQuota = data.max
				const percentage = (currentUsage/maxQuota)*100
				//console.log(percentage)
				if(percentage > 80){
					$("#HTRCard").before(`
						<div class="Polaris-Banner Polaris-Banner--statusWarning Polaris-Banner--withinPage" tabindex="0" role="alert" aria-live="polite" aria-labelledby="PlanUpgradeHeading" aria-describedby="PlanUpgradeContent">
							<div class="Polaris-Banner__Ribbon">
								<span class="Polaris-Icon Polaris-Icon--colorWarning Polaris-Icon--applyColor">
									<span class="Polaris-VisuallyHidden"></span>
									<svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
											<path fill-rule="evenodd" d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zM9 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V6zm1 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
									</svg>
								</span>
							</div>
							<div class="Polaris-Banner__ContentWrapper">
								<div class="Polaris-Banner__Heading">
									<p id="PlanUpgradeHeading" class="Polaris-Heading">Quota usage at 80% of your monthly limit.</p>
								</div>
								<div class="Polaris-Banner__Content">
									<p id="PlanUpgradeContent">Over 80% of your monthly usage limit has lapsed, please upgrade to avoid the disruptions of entries to your events.</p>
									<div class="Polaris-Banner__Actions">
										<div class="Polaris-ButtonGroup">
											<div class="Polaris-ButtonGroup__Item">
												<div class="Polaris-Banner__PrimaryAction">
													<button id="UpgradePlan" class="Polaris-Banner__Button" type="button">Upgrade plan</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					`)

					$("#UpgradePlan").click(function(){
						location.href="/billing/change"
					})
				} else if(percentage > 95){
					$("#HTRCard").before(`
						<div class="Polaris-Banner Polaris-Banner--statusWarning Polaris-Banner--withinPage" tabindex="0" role="alert" aria-live="polite" aria-labelledby="PlanUpgradeHeading" aria-describedby="PlanUpgradeContent">
							<div class="Polaris-Banner__Ribbon">
								<span class="Polaris-Icon Polaris-Icon--colorWarning Polaris-Icon--applyColor">
									<span class="Polaris-VisuallyHidden"></span>
									<svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
											<path fill-rule="evenodd" d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zM9 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V6zm1 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
									</svg>
								</span>
							</div>
							<div class="Polaris-Banner__ContentWrapper">
								<div class="Polaris-Banner__Heading">
									<p id="PlanUpgradeHeading" class="Polaris-Heading">Quota usage at 95% of your monthly limit.</p>
								</div>
								<div class="Polaris-Banner__Content">
									<p id="PlanUpgradeContent">Over 95% of your monthly usage limit has lapsed, please upgrade to avoid the disruptions of entries to your events.</p>
									<div class="Polaris-Banner__Actions">
										<div class="Polaris-ButtonGroup">
											<div class="Polaris-ButtonGroup__Item">
												<div class="Polaris-Banner__PrimaryAction">
													<button id="UpgradePlan" class="Polaris-Banner__Button" type="button">Upgrade plan</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					`)

					$("#UpgradePlan").click(function(){
						location.href="/billing/change"
					})
				} else if(percentage >= 100){
					$("#HTRCard").before(`
						<div class="Polaris-Banner Polaris-Banner--statusWarning Polaris-Banner--withinPage" tabindex="0" role="alert" aria-live="polite" aria-labelledby="PlanUpgradeHeading" aria-describedby="PlanUpgradeContent">
							<div class="Polaris-Banner__Ribbon">
								<span class="Polaris-Icon Polaris-Icon--colorWarning Polaris-Icon--applyColor">
									<span class="Polaris-VisuallyHidden"></span>
									<svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
											<path fill-rule="evenodd" d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zM9 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V6zm1 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
									</svg>
								</span>
							</div>
							<div class="Polaris-Banner__ContentWrapper">
								<div class="Polaris-Banner__Heading">
									<p id="PlanUpgradeHeading" class="Polaris-Heading">You have reached your monthly quota usage limit.</p>
								</div>
								<div class="Polaris-Banner__Content">
									<p id="PlanUpgradeContent">You cannot receive any more entries, upgrade now to avoid the disruptions in your events.</p>
									<div class="Polaris-Banner__Actions">
										<div class="Polaris-ButtonGroup">
											<div class="Polaris-ButtonGroup__Item">
												<div class="Polaris-Banner__PrimaryAction">
													<button id="UpgradePlan" class="Polaris-Banner__Button" type="button">Upgrade plan</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					`)

					$("#UpgradePlan").click(function(){
						location.href="/billing/change"
					})

					$(".CreateLong").addClass("Polaris-Button--disabled").removeClass("CreateLong")
					$(".CreateRapid").addClass("Polaris-Button--disabled").removeClass("CreateRapid")
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
										</div>
									</div>
									<div class="Polaris-EmptyState__ImageContainer"></div>
								</div>
							</div>
						`)
					)
				}
				const obj = data[0]
				//console.log(obj)

				$(".HAGSkeleton").remove()
				$("#HomeActiveGiveaways").html(`
					<p>Name: <span id="HAGName" class="Polaris-TextStyle--variationStrong"></span></p>
					<p>Event type: <span id="HAGType" class="Polaris-TextStyle--variationStrong"></span></p>
					<p>Started: <span id="HAGStarted" class="Polaris-TextStyle--variationStrong"></span></p>
					<p>Ends: <span id="HAGEnds" class="Polaris-TextStyle--variationStrong"></span></p>
					<p>Entries: <span id="HAGEntries" class="Polaris-TextStyle--variationStrong"></span></p>
				`)
				$("#HAGName").text(obj.name)
				$("#HAGType").text(obj.eventType)
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
										</div>
									</div>
									<div class="Polaris-EmptyState__ImageContainer"></div>
								</div>
							</div>
						`)
					)
				}
				$(".HUGDecoyItem").remove()
				data.reverse().forEach(function(giv){
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
				//console.log("The template length is "+data.length)
				if(data.length === 0){
					$("#HGTListWrapper").remove()
					return (
						$("#HomeGiveawayTemplates").html(`
							<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
								<div class="Polaris-EmptyState__Section">
									<div class="Polaris-EmptyState__DetailsContainer">
										<div class="Polaris-EmptyState__Details">
											<div class="Polaris-TextContainer">
												<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">No event templates saved</p>
												<div class="Polaris-EmptyState__Content">
													<p>Save the details of any giveaway you would like to use in the future.</p>
												</div>
											</div>
										</div>
									</div>
									<div class="Polaris-EmptyState__ImageContainer"></div>
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
									<a id="TempLink${giv.id}"  class="Polaris-ResourceItem__Link" tabindex="0" data-polaris-unstyled="true"></a>
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
													<div><span class="Polaris-TextStyle--variationStrong">Event type :</span> ${giv.eventType}</div>
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
					
					if(giv.eventType === "Rapid"){
						$(`#Temp${giv.id}`).click(function(){
							location=href=`/campaign/rapid/template/${giv.id}`
						})
						$(`#TempLink${giv.id}`).attr("href", `/campaign/rapid/template/${giv.id}`)
					} else {
						$(`#Temp${giv.id}`).click(function(){
							location=href=`/campaign/template/${giv.id}`
						})
						$(`#TempLink${giv.id}`).attr("href", `/campaign/template/${giv.id}`)
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
		eventCalendar()
	}

	//url === /campaign/long/new
	if(window.location.pathname === "/campaign/long/new"){
		$("#StartDate").attr("min", new Date().toISOString().split('T')[0])
		$("#EndDate").attr("min", new Date().toISOString().split('T')[0])
		$("#ValidateBtn").click(function(){validateLong()})
		let code
		$.ajax({
			url: "/shop",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				$(".CCSketch").remove()
				$(".CurrencyCode").text(data.currency)
				code = data.currency
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
			}
		})

		let qualify = chooseProducts()
		$("#ContinueButton").click(function(e){
			e.preventDefault()
			console.log(qualify)
			let name = $("#GiveawayNameInput").val()
			let startDate = $("#StartDate").val()
			let startTime = $("#StartTime").val()
			let endDate = $("#EndDate").val()
			let endTime = $("#EndTime").val()
			let ofWinners = $("#OfWinners").val()
			let distrubution = $("input[type='radio'][name='distribution']:checked").val()
			let totalRevenue = $("#TotalRevenueInput").val()
			let totalEntries = $("#TotalEntriesInput").val()
			if(isNaN(parseInt(ofWinners)) === true){
				return alert("The number of winners has to be a number")
			}
			if(name === "" || startDate === "" || startTime === "" || endTime === "" || endDate === "" || ofWinners === "" || distrubution === ""){
				return alert("Please fill all fields")
			}
			if(qualify.products === "select" && qualify.items.length === 0){
				return alret("Please select at least one qualifying product")
			}

			if(code.length !== 3){
				return alert("No currency code detected, please reload this page.")
			}

			let qualifying = []
			qualify.items.forEach(function(giv){
				qualifying.push(giv[0].split("/")[4])
			})

			if(totalRevenue){
				if(isNaN(parseInt(totalRevenue)) === true){
					return alert("The Total Revenue has to a number")
				}
			}
			if(totalEntries){
				if(isNaN(parseInt(totalEntries)) === true){
					return alert("The Total Entries has to a number")
				}
			}
			const starting = new Date(startDate+"T"+startTime)
			const ending = new Date(endDate+"T"+endTime)
			let form = {
				"name": name,
				"startDate": starting,
				"endDate": ending,
				"ofWinners": ofWinners,
				"distribution": distrubution,
				"totalRevenue": totalRevenue ? totalRevenue : 0,
				"totalEntries": totalEntries ? totalEntries : 0,
				"qualifying": qualify.products,
				"qualifyingId": qualify.products === "all" ? [] : qualifying,
				"qualifyingItems": qualify.items,
				"currencyCode": code
			}
			//console.log(form)

			$(this).addClass("Polaris-Button--loading")
			$("#ContinueButtonText").before(`
				<span id="ContinueButtonSpinner" class="Polaris-Button__Spinner">
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
				url: "/campaign/long/new",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({form}),
				success: function(data){
					//console.log(data) 
					return location.href=data
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if(data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}

					$("#ContinueButton").removeClass("Polaris-Button--loading")
					$("#ContinueButtonSpinner").remove()
					//console.log(data.responseText)
					return alert(data.responseText)
				}
			})
		})
	}


	//url === /campaign/long/new/hierarchical
	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	let hData = parseInt(params.winners)
	if(isNaN(hData) === false && window.location.pathname === "/campaign/long/new/hierarchical"){
		let render = []
		for(let i = 0; i < hData; i++){
			render.unshift(i)
		}
		let vouchers = {}

		$(".WinnerPlaceholder").remove()
		render.forEach((val) => {
			val++
			//console.log(val)
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
				//console.log(vouchers)
			})
		})
		$("#HCreate").click(function(e){
			e.preventDefault()
			if($.isEmptyObject(vouchers)){
				return alert("Enter voucher amounts for all winners")
			}
			console.log({id: params.id, amounts: vouchers})

			$(this).addClass("Polaris-Button--loading")
			$("#HCreateText").before(`
				<span id="HCreateSpinner" class="Polaris-Button__Spinner">
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
					$("#HCreate").removeClass("Polaris-Button--loading")
					$("#HCreateSpinner").remove()
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

		$(this).addClass("Polaris-Button--loading")
		$("#ECreateText").before(`
			<span id="ECreateSpinner" class="Polaris-Button__Spinner">
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
				$("#ECreate").removeClass("Polaris-Button--loading")
				$("#ECreateSpinner").remove()
				alert(data.responseText)
			}
		})
	})

	//url === /campaign/long/:id
	const path = window.location.pathname
	const idForGiveaway = parseInt(path.split("/")[3])
	if(isNaN(idForGiveaway) === false && window.location.pathname === "/campaign/long/"+idForGiveaway){
		$.ajax({
			url: `/data/campaign/${idForGiveaway}`,
			type: "GET",
			contentType: "application/json",
			success: function(data){
				$("#WinnersSkeleton").remove()
				$(".Polaris-SkeletonBodyText").remove()
				$(".Polaris-SkeletonDisplayText__DisplayText").remove()
				
				let code = data.currencyCode
				dates = []
				let startDate = Number(new Date(data.startDate))
				let endDate = Number(new Date(data.endDate))
				for(let i = 0; startDate <= endDate; i++){
					//console.log(startDate)
					dates.push(new Date(startDate).toLocaleDateString('en-ZA'))
					startDate = Number(new Date(data.startDate))+(1000*60*60*24*i)
				}
				//console.log(dates)
				eventCalendar(dates)
				$("#WinnerBody").html(`
					<p>This is where your winners will display after the run of the giveaway.</p>
				`)
				//console.log(data.id)
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
								
								//Display results
								$("#WinnerBody").html(`
									<p id="WinnerSuccess" class="Polaris-TextStyle--variationStrong" style="color: green;"></p>
								`)
								$("#WinnerSuccess").text(data.responseText)
								location.reload()

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
						<li class="Polaris-List__Item">Number ${item.prizeId} - ${item.voucherPrize} ${code}</li>
					`)
				})
				$("#AGTBtn").click(function(){
					$(this).addClass("Polaris-Button--loading")
					$("#AGTBtnText").before(`
						<span id="AGTBtnSpinner" class="Polaris-Button__Spinner">
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
							$("#AGTBtn").removeClass("Polaris-Button--loading")
							$("#AGTBtnSpinner").remove()
							alert(data.responseText)
						}
					})
				})
				$("#DeleteGiveawayBtn").click(function(){
					let consent = confirm("Are you sure?")
					$(this).addClass("Polaris-Button--loading")
					$("#DeleteGiveawayBtnText").before(`
						<span id="DeleteGiveawayBtnSpinner" class="Polaris-Button__Spinner">
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
								$("#DeleteGiveawayBtn").removeClass("Polaris-Button--loading")
								$("#DeleteGiveawayBtnSpinner").remove()
								alert(data.responseText)
							}
						})
					}
				})

				$("#EditLongBtn").click(function(){
					location.href=`/campaign/long/${data.id}/edit`
				})

				// analytics
				$.ajax({
					url: `/analytics/long/${data.id}`,
					type: "GET",
					contentType: "application/json",
					success: function(data){
						const revCtx = $("#RevGoal")
						const spentCtx = $("#SpreeCount")
						new Chart(revCtx, {
							type: 'bar',
							data: {
								labels: ["Revenue Goal", "Gross Revenue", "Net Revenue"],
								datasets: [
									{
										label: "Revenue (in ZAR)",
										backgroundColor: ["blue", "green", "orange"],
										data: [data.revenueGoal, data.revenueGross, data.revenueNet]
									}
								]
							},
							options: {
								legend: { display: false },
								title: {
									display: false,
									text: 'Predicted world population (millions) in 2050'
								}
							}
						})
						new Chart(spentCtx, {
							type: "bar",
							data: {
								labels: ["Projected Avg Spent", "Average Spent"],
								datasets: [
									{
										label: "Money (in ZAR)",
										backgroundColor: ["violet", "indigo"],
										data: [data.averageSpentProjected, data.averageSpent]
									}
								]
							},
							options: {
								legend: {display: false}
							}
						})
					},
					error: function(data){
						if(data.responseText === "Unauthorized"){
							return location.href="/"
						} else if(data.responseText === "Forbidden"){
							return location.href="/billing/plans"
						}
					}
				})	

				// Qualifying products
				if(data.qualifyingItems.length > 0){
					$("#QPSketch").remove()
					$("#QPSection").html(`
						<div id="ChosenProductsWrapper" class="Polaris-ResourceList__ResourceListWrapper">
							<ul class="Polaris-ResourceList">
								<span id="ChosenProductsDecoy"></span>
							</ul>
						</div>
					`)
					data.qualifyingItems.forEach(function(giv){
						const title = giv[1]
						const id = giv[0]
						const url = giv[2]

						$("#ChosenProductsDecoy").after(`
							<li class="Polaris-ResourceItem__ListItem">
								<div class="Polaris-ResourceItem__ItemWrapper">
									<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling">
										<div class="Polaris-ResourceItem__Container" id="${id.split("/")[4]}copy">
											<div class="Polaris-ResourceItem__Owned">
												<div class="Polaris-ResourceItem__Media">
													<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
														<img src="${url}" /> 
													</span>
												</div>
											</div>
											<div class="Polaris-ResourceItem__Content">
												<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
													<div class="Polaris-Stack__Item">
														<h3><span class="Polaris-TextStyle--variationStrong">${title}</span></h3>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</li>
						`)
					})
				} else if(data.qualifyingItems.length === 0){
					$("#QPSketch").remove()
					$("#QPSection").html(`
						<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
							<div class="Polaris-EmptyState__Section">
								<div class="Polaris-EmptyState__DetailsContainer">
									<div class="Polaris-EmptyState__Details">
										<div class="Polaris-TextContainer">
											<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">All products qualify</p>
											<div class="Polaris-EmptyState__Content">
												<p>Every product in your store store qualify as entry into this giveaway.</p>
											</div>
										</div>
									</div>
								</div>
								<div class="Polaris-EmptyState__ImageContainer">
									<div style="width: 100%; background: pink;"></div>
								</div>
							</div>
						</div>
					`)
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

	//url === /campaign/long/:id/edit
	if(isNaN(idForGiveaway) === false && window.location.pathname === "/campaign/long/"+idForGiveaway+"/edit"){
		$.ajax({
			url: `/data/campaign/${idForGiveaway}`,
			type: "GET",
			contentType: "application/json",
			success: function(data){
				$("#GiveawayNameInput").val(data.title)
				$("#StartDate").val(toISOLocal(new Date(data.startDate)).substring(0, 10))
				$("#StartTime").val(toISOLocal(new Date(data.startDate)).split("T")[1].substring(0, 5))
				$("#EndDate").val(toISOLocal(new Date(data.endDate)).substring(0, 10))
				$("#EndTime").val(toISOLocal(new Date(data.endDate)).split("T")[1].substring(0, 5))
				$("#OfWinners").val(data.winnersTotal)
				data.type === "Equitable" ? $("#Equitable").attr("checked", "true") : $("#Hierarchical").attr("checked", "true")
				$("#EditValidateBtn").click(function(){validateLong(data.id)})
				$("#ContinueEditButton").click(function(e){
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

					$(this).addClass("Polaris-Button--loading")
					$("#ContinueEditButtonText").before(`
						<span id="ContinueEditButtonSpinner" class="Polaris-Button__Spinner">
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
						url: `/campaign/long/${data.id}/edit`,
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

							$("#ContinueEditButton").removeClass("Polaris-Button--loading")
							$("#ContinueEditButtonSpinner").remove()
							console.log(data.responseText)
							return alert(data.responseText)
						}
					})
				})
				$("#DeleteGiveawayBtn").click(function(){
					let consent = confirm("Are you sure?")

					$(this).addClass("Polaris-Button--loading")
					$("#DeleteGiveawayBtnText").before(`
						<span id="DeleteGiveawayBtnSpinner" class="Polaris-Button__Spinner">
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
								$("#DeleteGiveawayBtn").removeClass("Polaris-Button--loading")
								$("#DeleteGiveawayBtnSpinner").remove()
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
													<div class="dp" style="background: ${colour};color:black;">${giv.name.substring(0,1)}</div>
												</span>
											</div>
										</div>
										<div class="Polaris-ResourceItem__Content ">
												<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
													<div class="Polaris-Stack__Item">
														<h3><span class="Polaris-TextStyle--variationStrong" id="Name${giv.id}"></span></h3>
														<div>${giv.eventType} event</div>
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
														<div class="dp" style="background: ${colour};color:black;">${giv.name.substring(0,1)}</div>
													</span>
												</div>
											</div>
											<div class="Polaris-ResourceItem__Content ">
												<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
													<div class="Polaris-Stack__Item">
														<h3><span class="Polaris-TextStyle--variationStrong" id="Name${giv.id}"></span></h3>
														<div>${giv.eventType} event</div>
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
					data.reverse().forEach(function(giv){
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
														<div class="dp" style="background: ${colour};color:black;">${giv.name.substring(0,1)}</div>
													</span>
												</div>
											</div>
											<div class="Polaris-ResourceItem__Content">
												<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
													<div class="Polaris-Stack__Item">
														<h3><span class="Polaris-TextStyle--variationStrong" id="Name${giv.id}"></span></h3>
														<div>${giv.eventType} event</div>
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
														<div class="dp" style="background: ${colour};color:black;">${giv.name.substring(0,1)}</div>
													</span>
												</div>
											</div>
											<div class="Polaris-ResourceItem__Content">
												<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
													<div class="Polaris-Stack__Item">
														<h3><span class="Polaris-TextStyle--variationStrong" id="Name${giv.id}"></span></h3>
														<div>${giv.eventType} event</div>
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
				//console.log(data.duration)
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
						<li class="Polaris-List__Item">Number ${item.prizeId} - ${item.voucherPrize} ${item.currencyCode}</li>
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
					$("#GT0Btn").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--outline")
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
								const decider = data.responseJSON
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

				// Qualifying products
				if(data.qualifyingItems.length > 0){
					$("#QPSketch").remove()
					$("#QPSection").html(`
						<div id="ChosenProductsWrapper" class="Polaris-ResourceList__ResourceListWrapper">
							<ul class="Polaris-ResourceList">
								<span id="ChosenProductsDecoy"></span>
							</ul>
						</div>
					`)
					data.qualifyingItems.forEach(function(giv){
						const title = giv[1]
						const id = giv[0]
						const url = giv[2]

						$("#ChosenProductsDecoy").after(`
							<li class="Polaris-ResourceItem__ListItem">
								<div class="Polaris-ResourceItem__ItemWrapper">
									<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling">
										<div class="Polaris-ResourceItem__Container" id="${id.split("/")[4]}copy">
											<div class="Polaris-ResourceItem__Owned">
												<div class="Polaris-ResourceItem__Media">
													<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
														<img src="${url}" /> 
													</span>
												</div>
											</div>
											<div class="Polaris-ResourceItem__Content">
												<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
													<div class="Polaris-Stack__Item">
														<h3><span class="Polaris-TextStyle--variationStrong">${title}</span></h3>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</li>
						`)
					})
				} else if(data.qualifyingItems.length === 0){
					$("#QPSketch").remove()
					$("#QPSection").html(`
						<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
							<div class="Polaris-EmptyState__Section">
								<div class="Polaris-EmptyState__DetailsContainer">
									<div class="Polaris-EmptyState__Details">
										<div class="Polaris-TextContainer">
											<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">All products qualify</p>
											<div class="Polaris-EmptyState__Content">
												<p>Every product in your store store qualify as entry into this giveaway.</p>
											</div>
										</div>
									</div>
								</div>
								<div class="Polaris-EmptyState__ImageContainer">
									<div style="width: 100%; background: pink;"></div>
								</div>
							</div>
						</div>
					`)
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
		$("#EmailTemplate").click(function(){
			location.href="/settings/email"
		})
		$("#DeleteAllRapidBtn").click(function(){
			$(this).addClass("Polaris-Button--loading")
			$("#DeleteAllRapidBtnText").before(`
				<span id="DeleteAllRapidBtnSpinner" class="Polaris-Button__Spinner">
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
				url: "/campaign/rapid/delete/all",
				type: "POST",
				contentType: "application/json",
				success: function(data){
					$("#DeleteAllRapidBtn").removeClass("Polaris-Button--loading")
					$("#DeleteAllRapidBtnSpinner").remove()
					alert(data)
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if (data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}
					$("#DeleteAllRapidBtn").removeClass("Polaris-Button--loading")
					$("#DeleteAllRapidBtnSpinner").remove()
				}
			})
		})
		$("#DeleteAllLongBtn").click(function(){
			$(this).addClass("Polaris-Button--loading")
			$("#DeleteAllLongBtnText").before(`
				<span id="DeleteAllLongBtnSpinner" class="Polaris-Button__Spinner">
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
				url: "/campaign/long/delete/all",
				type: "POST",
				contentType: "application/json",
				success: function(data){
					$("#DeleteAllLongBtn").removeClass("Polaris-Button--loading")
					$("#DeleteAllLongBtnSpinner").remove()
					alert(data)
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if (data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}
					$("#DeleteAllLongBtn").removeClass("Polaris-Button--loading")
					$("#DeleteAllLongBtnSpinner").remove()
				}
			})
		})
		$("#DeleteAllTemplatesBtn").click(function(){
			$(this).addClass("Polaris-Button--loading")
			$("#DeleteAllTemplatesBtnText").before(`
				<span id="DeleteAllTemplatesBtnSpinner" class="Polaris-Button__Spinner">
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
				url: "/campaign/template/delete/all",
				type: "POST",
				contentType: "application/json",
				success: function(data){
					$("#DeleteAllTemplatesBtn").removeClass("Polaris-Button--loading")
					$("#DeleteAllTemplatesBtnSpinner").remove()
					alert(data)
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if (data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}
					$("#DeleteAllTemplatesBtn").removeClass("Polaris-Button--loading")
					$("#DeleteAllTemplatesBtnSpinner").remove()
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
		let qualify = chooseProducts()
		let code
		$.ajax({
			url: "/shop",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				$(".CCSketch").remove()
				$(".CurrencyCode").text(data.currency)
				code = data.currency
			},
			error: function(data){
				if(data.responseText === "Unauthorized"){
					return location.href="/"
				} else if(data.responseText === "Forbidden"){
					return location.href="/billing/plans"
				}
			}
		})

		$("#RValidateBtn").click(function(){
			let dates = []
			chosenDays.forEach(function(giv){
				console.log(giv)
				dates.push(new Date(giv))
			})
			console.log(dates)
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
			if(dates.length === 0){
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
				data: JSON.stringify({dates: dates}),
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
			let totalRevenue = $("#TotalRevenueInput").val()
			let totalEntries = $("#TotalEntriesInput").val()
			let dates = []
			chosenDays.forEach(function(giv){
				console.log(giv)
				dates.push(new Date(giv))
			})

			if(normal.length === 0 || grand.length === 0 || name.length === 0 || dates.length === 0){
				return alert("Please fill all fields.")
			}

			if(code.length !== 3){
				return alert("No currency code detected, please reload this page.")
			}

			if(qualify.products === "select" && qualify.items.length === 0){
				return alert("Please select at least one qualifying product")
			}

			let qualifying = []
			qualify.items.forEach(function(giv){
				qualifying.push(giv[0].split("/")[4])
			})

			if(totalRevenue){
				if(isNaN(parseInt(totalRevenue)) === true){
					return alert("The Total Revenue has to a number")
				}
			}
			if(totalEntries){
				if(isNaN(parseInt(totalEntries)) === true){
					return alert("The Total Entries has to a number")
				}
			}

			console.log(dates)

			const event = {
				"name": name,
				"normal": normal,
				"grand": grand,
				"dates": dates,
				"totalRevenue": totalRevenue ? totalRevenue : 0,
				"totalEntries": totalEntries ? totalEntries : 0,
				"qualifying": qualify.products,
				"qualifyingId": qualify.products === "all" ? [] : qualifying,
				"qualifyingItems": qualify.items,
				"currencyCode": code
			}

			$(this).addClass("Polaris-Button--loading")
			$("#CreateRapidBtnText").before(`
				<span id="CreateRapidBtnSpinner" class="Polaris-Button__Spinner">
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
					$("#CreateRapidBtn").removeClass("Polaris-Button--loading")
					$("#CreateRapidBtnSpinner").remove()
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
				let code = data.currencyCode
				$("#RapidName").text(data.title)
				$("#TotalWinners").text(data.winnersTotal+" prizes up for grabs, plus a single Grand prize.")
				$("#RegularPrize").text(`
					${data.prizes.normalPrize} ${code}
				`)
				$("#GrandPrize").text(`
					${data.prizes.grandPrize} ${code}
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

				$("#SaveRapidBtn").click(function(){
					$(this).addClass("Polaris-Button--loading")
					$("#SaveRapidBtnText").before(`
						<span id="SaveRapidBtnSpinner" class="Polaris-Button__Spinner">
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
						url: `/campaign/rapid/store?id=${data.id}`,
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
							$("#SaveRapidBtn").removeClass("Polaris-Button--loading")
							$("#SaveRapidBtnSpinner").remove()
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

						$("#RActiveSection").html(`
							<div class="Polaris-TextContainer">
								<div>Ends at : 
									<span id="RAEnds" class="Polaris-TextStyle--variationStrong"></span>
								</div>
								<div>Entries so far : 
									<span id="RAEntries" class="Polaris-TextStyle--variationStrong"></span>
								</div>
							</div>
						`)
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
											<div class="Polaris-EmptyState__ImageContainer"></div>
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
						$("#RGrandButtonSelection").after(`
							<div>Winner : 
								<span id="RGrandWinner" class="Polaris-TextStyle--variationStrong"></span>
							</div>
							<div>Voucher status : 
								<span id="RVoucherStatus" class="Polaris-TextStyle--variationStrong"></span>
							</div>
							<div>Child events complete : 
								<span id="RChildEvents" class="Polaris-TextStyle--variationStrong"></span>
							</div>
						`)
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
				$.ajax({
					url: `/analytics/rapid/${data.id}`,
					type: "GET",
					contentType: "application/json",
					success: function(data){
						const revCtx = $("#RevGoal")
						const spentCtx = $("#SpreeCount")
						new Chart(revCtx, {
							type: 'bar',
							data: {
								labels: ["Revenue Goal", "Gross Revenue", "Net Revenue"],
								datasets: [
									{
										label: "Revenue (in "+code+")",
										backgroundColor: ["blue", "green", "orange"],
										data: [data.revenueGoal, data.revenueGross, data.revenueNet]
									}
								]
							},
							options: {
								legend: { display: false },
								title: {
									display: false,
									text: 'Predicted world population (millions) in 2050'
								}
							}
						})
						new Chart(spentCtx, {
							type: "bar",
							data: {
								labels: ["Projected Avg Spent", "Average Spent"],
								datasets: [
									{
										label: "Money (in "+code+")",
										backgroundColor: ["violet", "indigo"],
										data: [data.averageSpentProjected, data.averageSpent]
									}
								]
							},
							options: {
								legend: {display: false}
							}
						})
					},
					error: function(data){
						if(data.responseText === "Unauthorized"){
							return location.href="/"
						} else if(data.responseText === "Forbidden"){
							return location.href="/billing/plans"
						}
					}
				})

				if(data.qualifyingItems.length > 0){
					$("#QPSketch").remove()
					$("#QPSection").html(`
						<div id="ChosenProductsWrapper" class="Polaris-ResourceList__ResourceListWrapper">
							<ul class="Polaris-ResourceList">
								<span id="ChosenProductsDecoy"></span>
							</ul>
						</div>
					`)
					data.qualifyingItems.forEach(function(giv){
						const title = giv[1]
						const id = giv[0]
						const url = giv[2]

						$("#ChosenProductsDecoy").after(`
							<li class="Polaris-ResourceItem__ListItem">
								<div class="Polaris-ResourceItem__ItemWrapper">
									<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling">
										<div class="Polaris-ResourceItem__Container" id="${id.split("/")[4]}copy">
											<div class="Polaris-ResourceItem__Owned">
												<div class="Polaris-ResourceItem__Media">
													<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
														<img src="${url}" /> 
													</span>
												</div>
											</div>
											<div class="Polaris-ResourceItem__Content">
												<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
													<div class="Polaris-Stack__Item">
														<h3><span class="Polaris-TextStyle--variationStrong">${title}</span></h3>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</li>
						`)
					})
				} else if(data.qualifyingItems.length === 0){
					$("#QPSketch").remove()
					$("#QPSection").html(`
						<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
							<div class="Polaris-EmptyState__Section">
								<div class="Polaris-EmptyState__DetailsContainer">
									<div class="Polaris-EmptyState__Details">
										<div class="Polaris-TextContainer">
											<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">All products qualify</p>
											<div class="Polaris-EmptyState__Content">
												<p>Every product in your store store qualify as entry into this giveaway.</p>
											</div>
										</div>
									</div>
								</div>
								<div class="Polaris-EmptyState__ImageContainer">
									<div style="width: 100%; background: pink;"></div>
								</div>
							</div>
						</div>
					`)
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


	//url == /campaign/rapid/template/:id
	const idForRapidTemplate = parseInt(path.split("/")[4])
	if(!isNaN(idForRapidTemplate) && window.location.pathname === "/campaign/rapid/template/"+idForRapidTemplate){
		$.ajax({
			url: `/data/campaign/rapid/template/${idForRapidTemplate}`,
			type: "GET",
			contentType: "application/json",
			success: function(data){
				console.log(data)
				$(".Polaris-SkeletonBodyText").remove()
				$(".Polaris-SkeletonDisplayText__DisplayText").remove()
				const duration = data.dates.length
				$("#RapidTDuration").text(duration+" days")
				$("#RapidTStandard").text(data.prizes.normalPrize+" "+data.currencyCode)
				$("#RapidTGrand").text(data.prizes.grandPrize+" "+data.currencyCode)
				$("#RapidTEventType").text("Rapid")
				$("#RapidTName").text(data.name)
				$("#RapidTRevenueGoal").text(data.goals.totalRevenue+" "+data.currencyCode)
				$("#RapidTEntriesGoal").text(data.goals.totalEntries)

				$("#RapidTDeleteBtn").click(function(){
					let consent = confirm("Are you sure?")
					$(this).addClass("Polaris-Button--loading")
					$("#RapidTDeleteBtnText").before(`
						<span id="RapidTDeleteBtnSpinner" class="Polaris-Button__Spinner">
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
					if(consent){
						$.ajax({
							url: `/campaign/rapid/template/${data.id}/delete`,
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
								$("#RapidTDeleteBtn").removeClass("Polaris-Button--loading")
								$("#RapidTDeleteBtnSpinner").remove()
								alert(data.responseText)
							}
						})
					}
				})

				let time = []
				data.dates.forEach(function(item){
					time.push(item.durationFrom)
				})
				// Smart scheduling buttons
				if(data.active === false){
					$("#RapidTActivatorBody").html(`
						<p>Choose any of the dates below to schedule your giveaway.</p>
					`)

					$.ajax({
						url: "/data/all-event-dates",
						type: "GET",
						contentType: "application/json",
						success: function(data){
							let oldTime = [], filteredTime = []
							data.forEach((giv) => {
								const now = new Date(Date.now())
								if(new Date(giv) >= now && !filteredTime.includes(giv)){
									filteredTime.push(giv)
								}
							})
							const todayTime =  Number(new Date(new Date().toLocaleDateString('en-ZA')))
							filteredTime.sort((a, b) => new Date(a) - new Date(b)).forEach((giv) => {
								let otChild =  Number(new Date(giv)) - todayTime
								oldTime.push(otChild)
							})
							oldTime.sort((a, b) => new Date(a) - new Date(b))
							let everyDay = []
							let numOne = 0
							for(let i = 0; numOne <= oldTime[oldTime.length - 1]; i++){
								everyDay.push(numOne)
								numOne+=1000*60*60*24
							}
							let crawler = [0, 3, 7, 14, 30] // days into the future
							let final = []	// an array of non clashing full arrays w/o duplicates
							everyDay.sort((a, b) => a - b)
							crawler.forEach((crawl) => {
								everyDay.forEach((item) => {
									item+=1000*60*60*24*crawl // add days into the future to each day
									// only check for days that aren't already obviously clashing
									if(!oldTime.includes(item)){
										let watcher = []
										time.forEach((timer) => {
											let day = timer+item
											if(!oldTime.includes(day)){
												watcher.push(day)
											}
										})
										// check weather it's a full array and it isn't a duplicate									
										if(watcher.length === time.length){
											final.push(watcher)
										}
									}
								})
							})
							// mutate and remove more duplicates
							final = Array.from(new Set(final.map(JSON.stringify)), JSON.parse)
							console.log(final)
							$(".RapidTPHSpinner").remove()
							final.reverse().forEach((item) => {
								const start = item[0]
								$("#RapidTActivatorBody").after(`
									<button id="${start}" class="Polaris-Button Polaris-Button--outline" aria-label="Schedule to ${new Date(Date.now()+start).toDateString()}" type="button">
										<span class="Polaris-Button__Content">
											<span class="Polaris-Button__Text">${new Date(Date.now()+start).toDateString()}</span>
										</span>
									</button>
								`)

								$(`#${start}`).click((giv) => {
									location.href=`/campaign/rapid/template/${idForRapidTemplate}#RapidTEntriesGoal`
									$("#RapidTActivatorBody").html(`
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
										url: `/campaign/rapid/template/${idForRapidTemplate}/activate`,
										type: "POST",
										data: JSON.stringify({"future": item}),
										contentType: "application/json",
										success: function(data){
											$("#RapidTActivatorBody").html(`
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
												$("#RapidTActivatorBody").html(`
													<p id="ValidDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Conflicts found</p>
													<ul class="Polaris-List">
														<span id="RapidTActivatorDecoy"></span>
													</ul>
												`)
												arr.forEach(function(item){
													const begin = new Date(item.startDate).toISOString().split('T')
													const finish = new Date(item.endDate).toISOString().split('T')
													$("#RapidTActivatorDecoy").after(`
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
												$("#RapidTActivatorBody").html(`
													<h3 id="WinnerDanger" class="Polaris-InlineError Polaris-TextStyle--variationStrong">Error</h3>
													<p class="Polaris-InlineError">${data.responseText}</p>
												`)
											}
										}
									})
								})
							})
						},
						error: function(data){
							if(data.responseText === "Unauthorized"){
								return location.href="/"
							} else if(data.responseText === "Forbidden"){
								return location.href="/billing/plans"
							}
						}
					})
				} else {
					$("#RapidTActivatorBody").html(`
						<p>This template currently has a giveaway that is either active, upcoming or awaiting the picking of winners.</p>
					`)
					$(".RapidTPHBtn").remove()
				}

				// Qualifying products
				if(data.qualifyingItems.length > 0){
					$("#QPSketch").remove()
					$("#QPSection").html(`
						<div id="ChosenProductsWrapper" class="Polaris-ResourceList__ResourceListWrapper">
							<ul class="Polaris-ResourceList">
								<span id="ChosenProductsDecoy"></span>
							</ul>
						</div>
					`)
					data.qualifyingItems.forEach(function(giv){
						const title = giv[1]
						const id = giv[0]
						const url = giv[2]

						$("#ChosenProductsDecoy").after(`
							<li class="Polaris-ResourceItem__ListItem">
								<div class="Polaris-ResourceItem__ItemWrapper">
									<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling">
										<div class="Polaris-ResourceItem__Container" id="${id.split("/")[4]}copy">
											<div class="Polaris-ResourceItem__Owned">
												<div class="Polaris-ResourceItem__Media">
													<span aria-label="Solid color thumbnail" role="img" class="Polaris-Thumbnail Polaris-Thumbnail--sizeMedium">
														<img src="${url}" loading="lazy" /> 
													</span>
												</div>
											</div>
											<div class="Polaris-ResourceItem__Content">
												<div class="Polaris-Stack  Polaris-Stack--noWrap Polaris-Stack--alignmentBaseline Polaris-Stack--distributionEqualSpacing">
													<div class="Polaris-Stack__Item">
														<h3><span class="Polaris-TextStyle--variationStrong">${title}</span></h3>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</li>
						`)
					})
				} else if(data.qualifyingItems.length === 0){
					$("#QPSketch").remove()
					$("#QPSection").html(`
						<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
							<div class="Polaris-EmptyState__Section">
								<div class="Polaris-EmptyState__DetailsContainer">
									<div class="Polaris-EmptyState__Details">
										<div class="Polaris-TextContainer">
											<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">All products qualify</p>
											<div class="Polaris-EmptyState__Content">
												<p>Every product in your store store qualify as entry into this giveaway.</p>
											</div>
										</div>
									</div>
								</div>
								<div class="Polaris-EmptyState__ImageContainer">
									<div style="width: 100%; background: pink;"></div>
								</div>
							</div>
						</div>
					`)
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
	}


	//url === /analytics
	if(window.location.pathname === "/analytics"){
		$.ajax({
			url: "/analytics/prize-v-interest",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				const eppCtx = $("#EventPrizesPerformance")
				new Chart(eppCtx, {
					type: "line",
					data: {
						labels: data.dataPoints,
						datasets: [
							{
								label: "Entries",
								backgroundColor: "#00691c",
								fill: true,
								lineTension: 0.4,
								cubicInterpolationMode: 'monotone',
								data: data.dataSetEntries
							},
							{
								label: data.currencyCode,
								fill: true,
								lineTension: 0.4,
								cubicInterpolationMode: 'monotone',
								backgroundColor: "#ff7700",
								data: data.dataSetRevenue
							}
						]
					},
					options: {
						responsive: true,
						plugins: {
							title: {
								display: true,
								text: 'Correlation between event prize amount, entries and revenue',
								color: "#000000"
							}
						},
						scales: {
							x: {
								display: true,
								title: {
									display: true,
									text: "Voucher amount ("+data.currencyCode+")"
								}
							}
						}
					}
				})
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
			url: "/analytics/events-performance",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				const all = data.aggregate
				const rapid = data.rapidPerformance
				const long = data.longPerformance
				$(".Ana-ep-ske").remove()
				$("#Ana-ga").text(`${all.goalsAchieved}/${all.totalEvents}`)
				$("#Ana-hr").text(`${all.highProfitRate}/${all.totalEvents}`)
				$("#Ana-spc").text(`${all.avgSpending} ${data.currencyCode}`)

				$("#Ana-ga-rapid").text(`${rapid.goalsAchievedRapid}/${rapid.totalEvents}`)
				$("#Ana-hr-rapid").text(`${rapid.highProfitRateRapid}/${rapid.totalEvents}`)
				$("#Ana-spc-rapid").text(`${rapid.avgSpendingRapid} ${data.currencyCode}`)

				$("#Ana-ga-long").text(`${long.goalsAchievedLong}/${long.totalEvents}`)
				$("#Ana-hr-long").text(`${long.highProfitRateLong}/${long.totalEvents}`)
				$("#Ana-spc-long").text(`${long.avgSpendingLong} ${data.currencyCode}`)

				const gaCtx = $("#Ana-ga-comp")
				const hrCtx = $("#Ana-hr-comp")
				const spcCtx = $("#Ana-spc-comp")

				new Chart(gaCtx, {
					type: "pie",
					data: {
						labels: ["Rapid events", "Long events"],
						datasets: [
							{
								label: "Percent ( % )",
								backgroundColor: ["#00691c", "#ff7700"],
								data: [rapid.goalsAchievedShare, long.goalsAchievedShare]
							}
						]
					},
					options: {
						responsive: true,
						plugins: {
							title: {
								display: true,
								text: 'Goal achievement',
								color: "#000000"
							}
						}
					}
				})

				new Chart(hrCtx, {
					type: "pie",
					data: {
						labels: ["Rapid events", "Long events"],
						datasets: [
							{
								label: "Percent ( % )",
								backgroundColor: ["#00691c", "#ff7700"],
								data: [rapid.highProfitRateShare, long.highProfitRateShare]
							}
						]
					},
					options: {
						responsive: true,
						plugins: {
							title: {
								display: true,
								text: 'High revenue',
								color: "#000000"
							}
						}
					}
				})

				new Chart(spcCtx, {
					type: "pie",
					data: {
						labels: ["Rapid events", "Long evets"],
						datasets: [
							{
								label: "Percent ( % )",
								backgroundColor: ["#00691c", "#ff7700"],
								data: [rapid.avgSpendingShare, long.avgSpendingShare]
							}
						]
					},
					options: {
						responsive: true,
						plugins: {
							title: {
								display: true,
								text: 'Spending per customer',
								color: "#000000"
							}
						}
					}
				})
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
			url: `/analytics/long-distribution`,
			type: "GET",
			contentType: "application/json",
			success: function(data){
				console.log(data)
				const totalCtx = $("#HvETotal")
				const goalsCtx = $("#HvEGoals")
				const revenueCtx = $("#HvERevenue")
				const spendingCtx = $("#HvESpending")
				new Chart(totalCtx, {
					type: "bar",
					data: {
						labels: ["Hierarchical", "Equitable"],
						datasets: [
							{
								label: "Points",
								backgroundColor: ["#00691c", "#ff7700"],
								data: [data.totalPerformance.hiTotal, data.totalPerformance.eqTotal]
							}
						]
					},
					options: {
						indexAxis: 'y',
						responsive: true,
						legend: {display: false},
						plugins: {
							title: {
								display: true,
								text: 'Distribution models performance',
								color: "#000000"
							}
						}
					}
				})

				new Chart(goalsCtx, {
					type: "bar",
					data: {
						labels: ["Hierarchical", "Equitable"],
						datasets: [
							{
								label: "Percentage ( % )",
								backgroundColor: ["#00691c", "#ff7700"],
								data: [data.goalSuccess.hiRate, data.goalSuccess.eqRate]
							}
						]
					},
					options: {
						indexAxis: 'y',
						responsive: true,
						plugins: {
							title: {
								display: true,
								text: 'Goal achievement success rate ( % )',
								color: "#000000"
							}
						}
					}
				})

				new Chart(revenueCtx, {
					type: "bar",
					data: {
						labels: ["Hierarchical", "Equitable"],
						datasets: [
							{
								label: "Percentage ( % )",
								backgroundColor: ["#00691c", "#ff7700"],
								data: [data.revenueSuccess.hiRate, data.revenueSuccess.eqRate]
							}
						]
					},
					options: {
						indexAxis: 'y',
						responsive: true,
						legend: {display: false},
						plugins: {
							title: {
								display: true,
								text: 'Outstanding net revenue rate ( % )',
								color: "#000000"
							}
						}
					}
				})

				new Chart(spendingCtx, {
					type: "bar",
					data: {
						labels: ["Hierarchical", "Equitable"],
						datasets: [
							{
								label: "Money per customer ("+data.currencyCode+")",
								backgroundColor: ["#00691c", "#ff7700"],
								data: [data.spendingAverage.hiRate, data.spendingAverage.eqRate]
							}
						]
					},
					options: {
						indexAxis: 'y',
						responsive: true,
						plugins: {
							title: {
								display: true,
								text: 'The average customer spending',
								color: "#000000"
							}
						}
					}
				})
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
			url: "/analytics/lucky-days",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				const daysCtx = $("#TotalRevenueByWeekDays")
				const monthsCtx = $("#TotalRevenueByMonths")

				new Chart(daysCtx, {
					type: "line",
					data: {
						labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
						datasets: [
							{
								label: "Money ("+data.currencyCode+")",
								backgroundColor: "#00691c",
								fill: true,
								lineTension: 0.4,
								cubicInterpolationMode: 'monotone',
								data: [
									data.days.Sunday, 
									data.days.Monday, 
									data.days.Tuesday, 
									data.days.Wednesday, 
									data.days.Thursday, 
									data.days.Friday, 
									data.days.Saturday
								]
							}
						]
					},
					options: {
						responsive: true,
						legend: {display: false},
						plugins: {
							title: {
								display: true,
								text: 'Total revenue by days of the week',
								color: "#000000"
							}
						}
					}
				})

				new Chart(monthsCtx, {
					type: "line",
					data: {
						labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
						datasets: [
							{
								label: "Money ("+data.currencyCode+")",
								backgroundColor: "#00691c",
								fill: true,
								lineTension: 0.4,
								cubicInterpolationMode: 'monotone',
								data: [
									data.months.jan,
									data.months.feb,
									data.months.mar,
									data.months.apr,
									data.months.may,
									data.months.jun,
									data.months.jul,
									data.months.aug,
									data.months.sep,
									data.months.oct,
									data.months.nov,
									data.months.dec
								]
							}
						]
					},
					options: {
						responsive: true,
						legend: {display: false},
						plugins: {
							title: {
								display: true,
								text: 'Total revenue by months of the year',
								color: "#000000"
							}
						}
					}
				})
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
			url: "/analytics/lucrative-templates",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				if(data.status === false){
					$("#HTPListWrapper").remove()
					return (
						$("#TopPerform").html(`
							<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
								<div class="Polaris-EmptyState__Section">
									<div class="Polaris-EmptyState__DetailsContainer">
										<div class="Polaris-EmptyState__Details">
											<div class="Polaris-TextContainer">
												<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">No templates found</p>
												<div class="Polaris-EmptyState__Content">
													<p>Save a template of one your events and use it to repeat run the event in the future with just a single button.</p>
												</div>
											</div>
										</div>
									</div>
									<div class="Polaris-EmptyState__ImageContainer"></div>
								</div>
							</div>
						`)
					)
				}
				$(".HTPDecoyItem").remove()
				data.results.reverse().forEach(function(giv){
					const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${55 + 10 * Math.random()}%)`
					$("#HTPDataDecoy").after(`
						<li class="Polaris-ResourceItem__ListItem">
							<div class="Polaris-ResourceItem__ItemWrapper">
								<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling">
									<a id="TopLink${giv.id}"  class="Polaris-ResourceItem__Link" tabindex="0" data-polaris-unstyled="true"></a>
									<div class="Polaris-ResourceItem__Container" id="Top${giv.id}">
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
													<h3><span class="Polaris-TextStyle--variationStrong Polaris-Subheading" id="TopName${giv.id}"></span></h3>
													<div><span class="Polaris-TextStyle--variationStrong">Event type :</span> ${giv.eventType}</div>
													<div><span class="Polaris-TextStyle--variationStrong">Total revenue :</span> ${giv.revenue} ${giv.currencyCode}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</li>
					`)

					$(`#TopName${giv.id}`).text(giv.name)
					$(`#TopLink${giv.id}`).attr("aria-label", `A link to template ${giv.name}`)
					
					if(giv.eventType === "Rapid"){
						$(`#Top${giv.id}`).click(function(){
							location=href=`/campaign/rapid/template/${giv.id}`
						})
						$(`#TopLink${giv.id}`).attr("href", `/campaign/rapid/template/${giv.id}`)
					} else {
						$(`#Top${giv.id}`).click(function(){
							location=href=`/campaign/template/${giv.id}`
						})
						$(`#TopLink${giv.id}`).attr("href", `/campaign/template/${giv.id}`)
					}
				})
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
			url: "/analytics/overall-impact",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				$(".Ana-is-ske").remove()
				$("#Ana-tp-yr").text(`${data.payoutThisYear}  ${data.currencyCode}`)
				$("#Ana-tw-yr").text(`${data.winnersThisYear}`)
				$("#Ana-tp-at").text(`${data.payoutAllTime}  ${data.currencyCode}`)
				$("#Ana-tw-at").text(`${data.winnersAllTime}`)
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

	//url === /billing
	if(window.location.pathname === "/billing"){
		$.ajax({
			url: "/analytics/quota/usage",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				$(".Polaris-SkeletonDisplayText__DisplayText").remove()
				$("#MonthlyLimit").text(data.max)
				$("#MonthlyUsage").text(data.usage+"%")
				let xLabels = []
				let yData = []
				data.entries.forEach(function(giv){
					xLabels.push(giv.month)
					yData.push(giv.value)
				})
				//console.log("Anything")
				//console.log(xLabels)
				//console.log(yData)
				const usageCtx = $("#QuotaUsage")
				new Chart(usageCtx, {
					type: "bar",
					data: {
						labels: xLabels,
						datasets: [
							{
								label: "Entries",
								backgroundColor: "#00691c",
								data: yData
							}
						]
					},
					options: {
						legend: {display: false}
					}
				})
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

	//url === /progress
	if(window.location.pathname === "/progress"){
		$.ajax({
			url: "/analytics/long-term-goals",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				if(data.status === false){
					$("#GoalsHeading").empty()
					$("#GoalsBtn").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--primary")
					$("#GoalsBtnText").empty().text("Save")
					$("#GoalsHeading").text(`Set your goals for ${data.thisYear}`)
					$("#GoalsDetails").html(`
						<div class="Polaris-Card__SectionHeader">
							<h3 class="Polaris-Subheading">Set a revenue goal for the year (in ${data.currencyCode})</h3>
						</div>
						<form>						
							<div class="Polaris-Labelled--hidden">
								<div class="Polaris-Labelled__LabelWrapper">
									<div class="Polaris-Label"><label id="TotalRevenueInputLabel" for="TotalRevenueInput" class="Polaris-Label__Text">Set a revenue goal for the year</label></div>
								</div>
								<div class="Polaris-Connected">
									<div class="Polaris-Connected__Item Polaris-Connected__Item--primary">
										<div class="Polaris-TextField">
											<input id="TotalRevenueInput" type="number" placeholder="" autocomplete="off" class="Polaris-TextField__Input" aria-labelledby="TotalRevenueInputLabel" value="">
											<div class="Polaris-TextField__Backdrop"></div>
										</div>
									</div>
								</div>
							</div>							
						</form>			
					`)
					//$("#GoalsCardFooter").addClass("disappear")
					$("#GoalsBtn").click(function(){
						const setRevenueGoal = $("#TotalRevenueInput").val()
						if(setRevenueGoal <= 0){
							return alert("Your revenue goal cannot be zero or less.")
						}

						$(this).addClass("Polaris-Button--loading")
						$("#GoalsBtnText").before(`
							<span id="GoalsBtnSpinner" class="Polaris-Button__Spinner">
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
							url: "/analytics/long-term-goals/set",
							type: "POST",
							contentType: "application/json",
							data: JSON.stringify({setRevenueGoal}),
							success: function(data){
								location.reload()
							},
							error: function(data){
								if(data.responseText === "Unauthorized"){
									return location.href="/"
								} else if(data.responseText === "Forbidden"){
									return location.href="/billing/plans"
								}
								$("#GoalsBtn").removeClass("Polaris-Button--loading")
								$("#GoalsBtnSpinner").remove()
								alert(data.responseText)
							}
						})
					})
					$("#CurrentForecast").html(`
						<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
							<div class="Polaris-EmptyState__Section">
								<div class="Polaris-EmptyState__DetailsContainer">
									<div class="Polaris-EmptyState__Details">
										<div class="Polaris-TextContainer">
											<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">No data.</p>
										</div>
									</div>
								</div>
								<div class="Polaris-EmptyState__ImageContainer"></div>
							</div>
						</div>
					`)	
					$("#ScenarioOne").html(`
						<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
							<div class="Polaris-EmptyState__Section">
								<div class="Polaris-EmptyState__DetailsContainer">
									<div class="Polaris-EmptyState__Details">
										<div class="Polaris-TextContainer">
											<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">No data.</p>
										</div>
									</div>
								</div>
								<div class="Polaris-EmptyState__ImageContainer"></div>
							</div>
						</div>
					`)
					$("#ScenarioTwo").html(`
						<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
							<div class="Polaris-EmptyState__Section">
								<div class="Polaris-EmptyState__DetailsContainer">
									<div class="Polaris-EmptyState__Details">
										<div class="Polaris-TextContainer">
											<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">No data.</p>
										</div>
									</div>
								</div>
								<div class="Polaris-EmptyState__ImageContainer"></div>
							</div>
						</div>
					`)				
				} else {
					$("#GoalsHeading").empty()
					$("#GoalsBtn").removeClass("Polaris-Button--disabled").addClass("Polaris-Button--outline")
					$("#GoalsBtnText").empty().text("Edit")
					$("#GoalsHeading").text(`Your ${data.thisYear} goals`)
					$("#GoalsDetails").html(`
						<div class="Polaris-Card__SectionHeader">
							<h3 class="Polaris-Subheading">Total revenue goal</h3>
						</div>
						<div class="Polaris-TextContainer">
							<p id="TotalRevenueGoal" class="Polaris-DisplayText Polaris-DisplayText--sizeLarge"></p>
						</div>
					`)
					$("#TotalRevenueGoal").text(data.totalRevenueGoal+" "+data.currencyCode)
					$("#GoalsBtn").click(function(){
						$(this).addClass("Polaris-Button--loading")
						$("#GoalsBtnText").before(`
							<span id="GoalsBtnSpinner" class="Polaris-Button__Spinner">
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
							url: "/analytics/long-term-goals/unset",
							type: "POST",
							contentType: "application/json",
							success: function(data){
								location.reload()
							},
							error: function(data){
								if(data.responseText === "Unauthorized"){
									return location.href="/"
								} else if(data.responseText === "Forbidden"){
									return location.href="/billing/plans"
								}
								$("#GoalsBtn").removeClass("Polaris-Button--loading")
								$("#GoalsBtnSpinner").remove()
								alert(data.responseText)
							}
						})
					})
					$.ajax({
						url: "/analytics/forecast",
						type: "GET",
						contentType: "application/json",
						success: function(data){
							// current
							if(data.realistic.eventsRequired >= 1){
								$("#CurrentForecast").html(`
									<div class="Polaris-Stack Polaris-Stack--distributionEqualSpacing">
										<div class="Polaris-Stack__Item">
											<div class="Polaris-Stack Polaris-Stack--vertical">
												<div class="Polaris-Stack__Item">
													<h3 class="Polaris-Subheading">Average event revenue</h3>
												</div>
												<div class="Polaris-Stack__Item">
													<p class="Polaris-DisplayText Polaris-DisplayText--sizeMedium">
														${data.realistic.avgGrossRevenue} ${data.currencyCode}
													</p>
												</div>
											</div>
										</div>
										<div class="Polaris-Stack__Item">
											<div class="Polaris-Stack Polaris-Stack--vertical">
												<div class="Polaris-Stack__Item">
													<h3 class="Polaris-Subheading">Items to sell per event</h3>
												</div>
												<div class="Polaris-Stack__Item">
													<p class="Polaris-DisplayText Polaris-DisplayText--sizeMedium">
														${data.realistic.avgProductsSoldRequired}
													</p>
												</div>
											</div>
										</div>
										<div class="Polaris-Stack__Item">
											<div class="Polaris-Stack Polaris-Stack--vertical">
												<div class="Polaris-Stack__Item">
													<h3 class="Polaris-Subheading">Events required</h3>
												</div>
												<div class="Polaris-Stack__Item">
													<p class="Polaris-DisplayText Polaris-DisplayText--sizeLarge">
														${data.realistic.eventsRequired}
													</p>
												</div>
											</div>
										</div>
									</div>
								`)
							} else {
								$("#CurrentForecast").html(`
									<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
										<div class="Polaris-EmptyState__Section">
											<div class="Polaris-EmptyState__DetailsContainer">
												<div class="Polaris-EmptyState__Details">
													<div class="Polaris-TextContainer">
														<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">Congratulations!! You have achieved your goal.</p>
													</div>
												</div>
											</div>
											<div class="Polaris-EmptyState__ImageContainer"></div>
										</div>
									</div>
								`)
							}

							// 10x
							if(data.tenfold.eventsRequired >= 1){
								$("#ScenarioOne").html(`
									<div class="Polaris-Stack Polaris-Stack--distributionEqualSpacing">
										<div class="Polaris-Stack__Item">
											<div class="Polaris-Stack Polaris-Stack--vertical">
												<div class="Polaris-Stack__Item">
													<h3 class="Polaris-Subheading">Average event revenue</h3>
												</div>
												<div class="Polaris-Stack__Item">
													<p class="Polaris-DisplayText Polaris-DisplayText--sizeMedium">
														${data.tenfold.avgGrossRevenue} ${data.currencyCode}
													</p>
												</div>
											</div>
										</div>
										<div class="Polaris-Stack__Item">
											<div class="Polaris-Stack Polaris-Stack--vertical">
												<div class="Polaris-Stack__Item">
													<h3 class="Polaris-Subheading">Items to sell per event</h3>
												</div>
												<div class="Polaris-Stack__Item">
													<p class="Polaris-DisplayText Polaris-DisplayText--sizeMedium">
														${data.tenfold.avgProductsSoldRequired}
													</p>
												</div>
											</div>
										</div>
										<div class="Polaris-Stack__Item">
											<div class="Polaris-Stack Polaris-Stack--vertical">
												<div class="Polaris-Stack__Item">
													<h3 class="Polaris-Subheading">Events required</h3>
												</div>
												<div class="Polaris-Stack__Item">
													<p class="Polaris-DisplayText Polaris-DisplayText--sizeLarge">
														${data.tenfold.eventsRequired}
													</p>
												</div>
											</div>
										</div>
									</div>
								`)
							} else {
								$("#ScenarioOne").html(`
									<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
										<div class="Polaris-EmptyState__Section">
											<div class="Polaris-EmptyState__DetailsContainer">
												<div class="Polaris-EmptyState__Details">
													<div class="Polaris-TextContainer">
														<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">Achieved! Your goal would be achieved at this scenario.</p>
													</div>
												</div>
											</div>
											<div class="Polaris-EmptyState__ImageContainer"></div>
										</div>
									</div>
								`)
							}

							// 50x
							if(data.fiftyfold.eventsRequired >= 1){
								$("#ScenarioTwo").html(`
									<div class="Polaris-Stack Polaris-Stack--distributionEqualSpacing">
										<div class="Polaris-Stack__Item">
											<div class="Polaris-Stack Polaris-Stack--vertical">
												<div class="Polaris-Stack__Item">
													<h3 class="Polaris-Subheading">Average event revenue</h3>
												</div>
												<div class="Polaris-Stack__Item">
													<p class="Polaris-DisplayText Polaris-DisplayText--sizeMedium">
														${data.fiftyfold.avgGrossRevenue} ${data.currencyCode}
													</p>
												</div>
											</div>
										</div>
										<div class="Polaris-Stack__Item">
											<div class="Polaris-Stack Polaris-Stack--vertical">
												<div class="Polaris-Stack__Item">
													<h3 class="Polaris-Subheading">Items to sell per event</h3>
												</div>
												<div class="Polaris-Stack__Item">
													<p class="Polaris-DisplayText Polaris-DisplayText--sizeMedium">
														${data.fiftyfold.avgProductsSoldRequired}
													</p>
												</div>
											</div>
										</div>
										<div class="Polaris-Stack__Item">
											<div class="Polaris-Stack Polaris-Stack--vertical">
												<div class="Polaris-Stack__Item">
													<h3 class="Polaris-Subheading">Events required</h3>
												</div>
												<div class="Polaris-Stack__Item">
													<p class="Polaris-DisplayText Polaris-DisplayText--sizeLarge">
														${data.fiftyfold.eventsRequired}
													</p>
												</div>
											</div>
										</div>
									</div>
								`)
							} else {
								$("#ScenarioTwo").html(`
									<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
										<div class="Polaris-EmptyState__Section">
											<div class="Polaris-EmptyState__DetailsContainer">
												<div class="Polaris-EmptyState__Details">
													<div class="Polaris-TextContainer">
														<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">Achieved! Your goal would be achieved at this scenario.</p>
													</div>
												</div>
											</div>
											<div class="Polaris-EmptyState__ImageContainer"></div>
										</div>
									</div>
								`)
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
	}

	//url === /settings/email
	if(window.location.pathname === "/settings/email"){
		const shopNameStyles = "margin-top:0; font-size: 26px; line-height: 32px;"

		const template = $("#template-frame").contents()
		const whole = template.find("html").html()
		const title = template.find("#email-title")
		const shopNameHead = template.find("#email-name-head")
		const shopNameBody = template.find("#email-name-body")
		const logoLink = template.find("#email-logo-href")
		//const logoImg = template.find("#email-logo-img")
		const heading = template.find("#email-heading")
		//const bannerLink = template.find("#email-banner-href")
		//const bannerImg = template.find("#email-banner-img")
		const salutations = template.find("#email-salutations")
		const body = template.find("#email-body")
		const discountCode = template.find("#email-discount-code")
		//const logoImgSmall = template.find("#email-logo-img-small")
		const aboutShop = template.find("#email-about-text")
		const shopLink = template.find("#email-button-href")
		const addressBar = template.find("#email-address-bar")


		// chunks
		const chunk1 = `<!DOCTYPE html><html lang="en" xmlns="https://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
			<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
			<meta name="x-apple-disable-message-reformatting"><title id="email-title">`
		const chunk2 = `</title><!--[if mso]><style>table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
			div, td {padding:0;}div {margin:0 !important;}</style><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch>
			</o:OfficeDocumentSettings></xml></noscript><![endif]--><style>table, td, div, h1, p {font-family: Arial, sans-serif;
			}div.col-sml {font-family:Arial,sans-serif;font-size:14px;color:#363636;}div.col-lge {font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;
			}@media screen and (max-width: 530px) {.unsub {display: block;padding: 8px;margin-top: 14px;border-radius: 6px;background-color: #555555;text-decoration: none !important;
			font-weight: bold;}	.col-lge {max-width: 100% !important;}}	@media screen and (min-width: 531px) {.col-sml {max-width: 27% !important;
			}.col-lge {	max-width: 73% !important;}}/*table, td {border:2px solid #000000 !important;}*/</style></head><body style="margin:0;padding:0;word-spacing:normal;background-color:#ffffff;">
			<div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#ffffff;">
			<table role="presentation" style="width:100%;border:none;border-spacing:0;"><tr><td align="center" style="padding:0;">
			<!--[if mso]><table role="presentation" align="center" style="width:600px;"><tr><td><![endif]-->
			<table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
			<tr><td align="center" style="padding:0;"><table role="presentation" style="width:100%;border:none;border-spacing:0; background-color: #ffffff;">
			<tr><td align="left" style="padding:20px 0px 5px 30px;text-align:left; width: 160px; max-width:95%;"><a id="email-logo-href" href="`
		const chunk3 = `" style="text-decoration:none;"><p id="email-name-head" style="margin-top:0; font-size: 26px; line-height: 32px; color: #363636;">`
		const chunk4 = `</p></a></td><td align="right" style="padding:10px 5px 5px 5px;margin: 0; width: 5%;font-size:13 px; line-height:1.5em;">
			<p style="margin:0;text-align:center; font-size:2.5em;font-weight:bold;">&nbsp;</p></td>
			</tr></table></td></tr><tr><td style="padding:30px 30px 10px 30px;background-color:#ffffff;">
			<h1 id="email-heading" style="margin-top:0;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">`
		const chunk5 = `</h1></td></tr><tr><td style="padding:30px;background-color:#ffffff;"><p id="email-salutations" style="margin:0;">`
		const chunk6 = `</p><br><p id="email-body" style="margin:0;">`
		const chunk7 = `</p></td></tr><tr><td align="center" style="padding: 15px 30px 15px 30px;margin:0;background-color: #ffffff;">
			<p style="margin:0;text-align: center;font-size: 1em; line-height: 1.5em;color: #000000; padding: 10px;">Your discount code</p>
			<p id="email-discount-code" style="margin:0;font-size:32px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;padding: 10px;border: 1px #111111 solid; background-color: #fefefa;">`
		const chunk8 = `</p></td></tr><tr><td style="padding:35px 30px 11px 30px;font-size:0;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">
			<!--[if mso]><table role="presentation" width="100%"><tr><td style="width:145px;" align="left" valign="top">
			<![endif]--><div class="col-sml" style="display:inline-block;width:100%;max-width:145px;vertical-align:top;text-align:left;">
			<p id="email-name-body" style="margin-top:0; font-size: 22px; line-height: 28px;">`
		const chunk9 = `</p></div><!--[if mso]></td><td style="width:395px;padding-bottom:20px;" valign="top"><![endif]-->
			<div class="col-lge" style="display:inline-block;width:100%;max-width:395px;vertical-align:top;padding-bottom:20px;">
			<p id="email-about-text" style="margin-top:0;margin-bottom:12px;">`
		const chunk10 = `</p><p style="margin:0;"><a id="email-button-href" href="`
		const chunk11 = `" style="text-decoration: none; padding: 10px 25px; color: #000000; border-radius: 4px; border: 2px #000000 solid; display:inline-block; mso-padding-alt:0;text-underline-color:#ff3884">
			<!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%;mso-text-raise:20pt">&nbsp;</i><![endif]--><span style="mso-text-raise:10pt;font-weight:bold;">Shop now</span><!--[if mso]>
			<i style="letter-spacing: 25px;mso-font-width:-100%">&nbsp;</i><![endif]--></a></p>
			</div><!--[if mso]></td></tr></table><![endif]--></td></tr><tr><td style="padding:30px;text-align:left;font-size:12px;color:#0f0f0f;">
			<p id="email-address-bar" style="margin:0;line-height:20px;padding: 10px 0px 0px 0px">`
		const chunk12 = `</p></td></tr></table><!--[if mso]></td></tr></table><![endif]--></td></tr></table></div></body></html>`


		//console.log(aboutShop.text())
		setTimeout(function(){
			$.ajax({
				url: "/data/email/settings",
				type: "GET",
				contentType: "application/json",
				success: function(data){
					$(".ETLUSketch").remove()
					$("#EmailTemplateLastUpdate").text(data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString()+" "+new Date(data.lastUpdated).toLocaleTimeString() : "Never")
					//console.log(data.heading)
					if(data.heading){
						heading.text(data.heading+"  [voucher amount].")
					}
					if(data.body){
						body.text(data.body)
					}
					if(data.aboutShop){
						aboutShop.text(data.aboutShop)
					}
					shopNameHead.text(data.name)
					shopNameBody.text("About "+data.name)
					title.text(data.name)
					logoLink.attr("href", data.url ? data.url : `https://${data.shopDomain}`)
					shopLink.attr("href", data.url ? data.url : `https://${data.shopDomain}`)
					aboutShop.text(data.description)
					addressBar.empty().html(`
						${data.address.address1}
						<br>
						${data.address.address2}
						${data.address.address2 ? "<br>" : ""}
						${data.address.city}
						<br>
						${data.address.zip}
						<br>
						${data.address.country}
					`)
					$("#HeadingInput").val(heading.text().split("[")[0]).on("input", function(){
						heading.text($(this).val()+" [voucher amount].")
					})
					$("#BodyInput").val(body.text()).on("input", function(){
						body.text($(this).val())
					})
					$("#AboutInput").val(aboutShop.text()).on("input", function(){
						aboutShop.text($(this).val())
					})

					//console.log(shopLink.attr("href"))

					$("#SaveEmailTempBtn").click(function(e){
						e.preventDefault()

						$(this).addClass("Polaris-Button--loading")
						$("#SaveEmailTempBtnText").before(`
							<span id="SaveEmailTempBtnSpinner" class="Polaris-Button__Spinner">
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
						
						const dynamicEmail = {
							"chunk1": chunk1,
							"title": title.text(),
							"chunk2": chunk2,
							"link1": logoLink.attr("href"),
							"chunk3": chunk3,
							"nameHead": shopNameHead.text(),
							"chunk4": chunk4,
							"heading": heading.text().split("[")[0],
							"chunk5": chunk5,
							"salutations": "Hi,",
							"chunk6": chunk6,
							"body": body.text(),
							"chunk7": chunk7,
							"discountCode": "",
							"chunk8": chunk8,
							"nameBody": shopNameBody.text(),
							"chunk9": chunk9,
							"aboutShop": aboutShop.text(),
							"chunk10": chunk10,
							"link2": shopLink.attr("href"),
							"chunk11": chunk11,
							"address": addressBar.html(),
							"chunk12": chunk12
						}

						$.ajax({
							url: "/settings/email/template/save",
							type: "POST",
							contentType: "application/json",
							data: JSON.stringify({dynamicEmail}),
							success: function(data){
								$("#SaveEmailTempBtn").removeClass("Polaris-Button--loading")
								$("#SaveEmailTempBtnSpinner").remove()
								alert(data)
								location.reload()
							},
							error: function(data){
								if(data.responseText === "Unauthorized"){
									return location.href="/"
								} else if(data.responseText === "Forbidden"){
									return location.href="/billing/plans"
								}
								$("#SaveEmailTempBtn").removeClass("Polaris-Button--loading")
								$("#SaveEmailTempBtnSpinner").remove()
								return alert(data.responseText)
							}
						})
					})
				},
				error: function(data){
					if(data.responseText === "Unauthorized"){
						return location.href="/"
					} else if(data.responseText === "Forbidden"){
						return location.href="/billing/plans"
					}	
				}
			})
		}, 2000)
	}

})
