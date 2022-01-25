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
})
