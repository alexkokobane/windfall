$(document).ready(function(e){
	//theme
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
			success: function(){
				location.href="/"
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
	$.ajax({
		url: '/shop',
		success: function(data){
			$("#ToShopifyBtn").click(function(){
				location.href="https://"+data.shop+"/admin"
			})
		}
	})

	//url == /
	$(".CreateGiveaway").click(function(){
		location.href="/campaign/new"
	})
	if(window.location.pathname === "/"){
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
			},
			error: function(data){
				alert(data.responseText)
			}
		})
		$.ajax({
			url: "/data/campaigns/upcoming",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				if(data.length === 0){
					$("#HUGListWrapper")
					return (`
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
				}
				$(".HUGDecoyItem").remove()
				data.forEach(function(giv){
					const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${55 + 10 * Math.random()}%)`
					$("#HUGDataDecoy").after(`
						<li class="Polaris-ResourceItem__ListItem">
							<div class="Polaris-ResourceItem__ItemWrapper">
								<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling" data-href="/campaign/${giv.id}">
									<a aria-describedby="100" aria-label="View details for ${giv.name}" class="Polaris-ResourceItem__Link" tabindex="0" id="" href="/campaign/${giv.id}" data-polaris-unstyled="true"></a>
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
												<div class="Polaris-Stack__Item Polaris-TextContainer">
													<h3><span class="Polaris-TextStyle--variationStrong">${giv.name}</span></h3>
													<div><span class="Polaris-TextStyle--variationStrong">Begins on</span> ${new Date(giv.startDate).toDateString()}</div>
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
				alert(data.responseText)
			}
		})
		$.ajax({
			url: "/data/giveaway-templates",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				if(data.length === 0){
					$("#HGTListWrapper").remove()
					return (`
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
												<div class="Polaris-Stack__Item"><button class="Polaris-Button Polaris-Button--primary CreateGiveaway" type="button"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Add template</span></span></button></div>
												<div class="Polaris-Stack__Item"><a class="Polaris-Button" href="#" data-polaris-unstyled="true"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Learn more</span></span></a></div>
											</div>
										</div>
									</div>
								</div>
								<div class="Polaris-EmptyState__ImageContainer"><img src="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" role="presentation" alt="" class="Polaris-EmptyState__Image"></div>
							</div>
						</div>
					`)
				}
				$(".HGTDecoyItem").remove()
				data.forEach(function(giv){
					const colour = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${55 + 10 * Math.random()}%)`
					$("#HGTDataDecoy").after(`
						<li class="Polaris-ResourceItem__ListItem">
							<div class="Polaris-ResourceItem__ItemWrapper">
								<div class="Polaris-ResourceItem Polaris-Scrollable Polaris-Scrollable--horizontal Polaris-Scrollable--horizontalHasScrolling" data-href="/campaign/${giv.id}">
									<a aria-describedby="100" aria-label="View details for ${giv.name}" class="Polaris-ResourceItem__Link" tabindex="0" id="" href="/campaign/${giv.id}" data-polaris-unstyled="true"></a>
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
												<div class="Polaris-Stack__Item Polaris-TextContainer">
													<h3><span class="Polaris-TextStyle--variationStrong">${giv.name}</span></h3>
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
				})
			},
			error: function(data){
				alert(data.responseText)
			}
		})
	}
	//url == /campaign/new
	console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
	console.log(new Date().toISOString().split('T')[1].substring(0,5))
	$("#StartDate").attr("min", new Date().toISOString().split('T')[0])
	$("#StartTime").attr("min", new Date().toISOString().split('T')[1].substring(0,5))
	$("#EndDate").attr("min", new Date().toISOString().split('T')[0])
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
		if(name === "" || startDate === "" || startTime === "" || endDate === "" || endTime === "" || ofWinners === "" || distrubution === ""){
			return alert("Please fill all fields")
		}
		let form = {
			"name": name,
			"startDate": startDate,
			"startTime": startTime,
			"endDate": endDate,
			"endTime": endTime,
			"ofWinners": ofWinners,
			"distribution": distrubution
		}
		console.log(form)
		$.ajax({
			url: "/campaign/new",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({form}),
			success: function(data){
				console.log(data) 
				return location.href=data
			},
			error: function(data){
				console.log(data.responseText)
				return alert(data.responseText)
			}
		})
	})

	//url === /campaign/new/hierarchical
	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	let hData = parseInt(params.winners)
	console.log(params.winners)
	console.log(hData)
	let render = []
	for(let i = 0; i < hData; i++){
		render.unshift(i)
	}
	console.log(render)
	if(hData !== null){
		let vouchers = {}
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
											<div class="Polaris-TextField__Prefix" id="VoucherInputFieldPrefix${val}">$</div><input id="VoucherInputField${val}" autocomplete="off" class="Polaris-TextField__Input" type="number" aria-labelledby="VoucherInputField${val} VoucherInputFieldPrefix${val}" aria-invalid="false" value="">
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
				url: "/campaign/new/hierarchical/create",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({id: parseInt(params.id), amounts: vouchers}),
				success: function(data){
					location.href=data
				},
				error: function(data){
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
			url: "/campaign/new/equitable/create",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({id: parseInt(params.id), amounts: parseInt(voucher)}),
			success: function(data){
				location.href=data
			},
			error: function(data){
				alert(data.responseText)
			}
		})
	})

	//url === /campaign/:id
	console.log(window.location.pathname)
	const path = window.location.pathname
	const idForGiveaway = parseInt(path.split("/")[2])
	console.log(idForGiveaway)
	if(isNaN(idForGiveaway) === false){
		$.ajax({
			url: `/data/campaign/${idForGiveaway}`,
			type: "GET",
			contentType: "application/json",
			success: function(data){
				$("#WinnersSkeleton").remove()
				$(".Polaris-SkeletonBodyText").remove()
				console.log(data)
				$("#GiveawayName").text(data.title)
				$("#ForTotalEntries").text(data.entriesTotal)
				$("#ForActiveDates").text(`From ${new Date(data.startDate).toLocaleString()} to ${new Date(data.endDate).toLocaleString()}`)
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
							alert(data)
						},
						error: function(data){
							alert(data.responseText)
						}
					})
				})
			},
			error: function(data){
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
									<a aria-describedby="100" aria-label="View details for ${giv.name}" class="Polaris-ResourceItem__Link" tabindex="0" id="" href="/campaign/${giv.id}" data-polaris-unstyled="true"></a>
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
														<h3><span class="Polaris-TextStyle--variationStrong">${giv.name}</span></h3>
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
					$(`#${giv.id}`).click(function(){
						location.href=`/campaign/${giv.id}`
					})
				})
			},
			error: function(data){
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
										<a aria-describedby="100" aria-label="View details for ${giv.name}" class="Polaris-ResourceItem__Link" tabindex="0" id="" href="/campaign/${giv.id}" data-polaris-unstyled="true"></a>
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
														<h3><span class="Polaris-TextStyle--variationStrong">${giv.name}</span></h3>
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
						$(`#${giv.id}`).click(function(){
							location.href=`/campaign/${giv.id}`
						})
					})
				},
				error: function(data){
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
										<a aria-describedby="100" aria-label="View details for ${giv.name}" class="Polaris-ResourceItem__Link" tabindex="0" id="" href="/campaign/${giv.id}" data-polaris-unstyled="true"></a>
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
														<h3><span class="Polaris-TextStyle--variationStrong">${giv.name}</span></h3>
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
						$(`#${giv.id}`).click(function(){
							location.href=`/campaign/${giv.id}`
						})
					})
				},
				error: function(data){
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
										<a aria-describedby="100" aria-label="View details for ${giv.name}" class="Polaris-ResourceItem__Link" tabindex="0" id="" href="/campaign/${giv.id}" data-polaris-unstyled="true"></a>
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
														<h3><span class="Polaris-TextStyle--variationStrong">${giv.name}</span></h3>
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
						$(`#${giv.id}`).click(function(){
							location.href=`/campaign/${giv.id}`
						})
					})
				},
				error: function(data){
					alert(data.responseText)
				}
			})
		})
	}

})
