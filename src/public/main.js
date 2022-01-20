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
	$("#EndTime").attr("min", new Date().toISOString().split('T')[1].substring(0,5))
	function formMagic(){
		let ofWinners
		let manyWinners = []
		$("#GiveawayNameInput").on("input", function(){
			console.log($(this).val())
			//$("#GiveawayName").text($(this).val())
		})
		$("#OfWinners").on("input", function(){
			// not if statement
			ofWinners = $(this).val()
			$("#AllWinnersCard").addClass("disappear")
			$("#EachWinnerCard").addClass("disappear")
			$("#DistributionCard") ? $("#DistributionCard").remove() : null
			$("#OfWinnersCard").after(`
				<div id="DistributionCard" class="Polaris-Card">
						<div class="Polaris-Card__Header">
							<h2 class="Polaris-Heading">Prize distribution</h2>
						</div>
						<div class="Polaris-Card__Section">
							<div class="Polaris-Stack Polaris-Stack--vertical">
								<div class="Polaris-Stack__Item">
									<div><label class="Polaris-Choice" for="Equitable"><span class="Polaris-Choice__Control"><span class="Polaris-RadioButton"><input id="Equitable" name="distribution" type="radio" class="Polaris-RadioButton__Input" aria-describedby="EquitableHelpText" value="Equitable"><span class="Polaris-RadioButton__Backdrop"></span></span></span><span class="Polaris-Choice__Label">Equitable</span></label>
										<div class="Polaris-Choice__Descriptions">
											<div class="Polaris-Choice__HelpText" id="EquitableHelpText">All winners get the same prize, there is no hierarchy.</div>
										</div>
									</div>
								</div>
								<div class="Polaris-Stack__Item">
									<div><label class="Polaris-Choice" for="Hierarchical"><span class="Polaris-Choice__Control"><span class="Polaris-RadioButton"><input id="Hierarchical" name="distribution" type="radio" class="Polaris-RadioButton__Input" aria-describedby="HierachicalHelpText" value="Hierarchical"><span class="Polaris-RadioButton__Backdrop"></span></span></span><span class="Polaris-Choice__Label">Hierarchical</span></label>
										<div class="Polaris-Choice__Descriptions">
											<div class="Polaris-Choice__HelpText" id="HierarchicalHelpText">Each winner's prize will reflect on their rank as chosen by you.</div>
										</div>
									</div>
								</div>
							</div>
						</div>
				</div>
				`)
			$("#Equitable").click(function(){
				const one = $("#AllWinnersCard").hasClass("disappear")
				const many = $("#EachWinnerCard").hasClass("disappear")
				if(one === false){
					many === false ? $("#EachWinnerCard").addClass("disappear") : null
				} else if (one === true) {
					$("#AllWinnersCard").removeClass("disappear")
					many === true ? null : $("#EachWinnerCard").addClass("disappear")
				}
			})
			$("#Hierarchical").click(function(){
				const one = $("#AllWinnersCard").hasClass("disappear")
				const many = $("#EachWinnerCard").hasClass("disappear")
				if(many === false){
					one === false ? $("#AllWinnersCard").addClass("disappear") : null
				} else if (many === true) {
					$("#EachWinnerCard").removeClass("disappear")
					one === true ? null : $("#AllWinnersCard").addClass("disappear")
				}
			})
			$("#EachWinnerCard").empty()
			$("#EachWinnerCard").html(`<div id="EachWinnerHeader"  class="Polaris-Card__Header">
					<h2 class="Polaris-Heading">Each winner's prize</h2>
				</div>
				<div id="EachWinnerCardEmptyState" class="Polaris-Card__Section">
					<div class="Polaris-EmptyState Polaris-EmptyState--withinContentContainer">
						<div class="Polaris-EmptyState__Section">
							<div class="Polaris-EmptyState__DetailsContainer">
								<div class="Polaris-EmptyState__Details">
									<div class="Polaris-TextContainer">
										<p class="Polaris-DisplayText Polaris-DisplayText--sizeSmall">Choose an amount of winners</p>
										<div class="Polaris-EmptyState__Content">
											<p>Go back to input number to choose an amount of winners you would like.</p>
										</div>
									</div>
								</div>
							</div>
							<div class="Polaris-EmptyState__ImageContainer"><img src="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" role="presentation" alt="" class="Polaris-EmptyState__Image"></div>
						</div>
					</div>
				</div>
			`)
			//if statement
			if(ofWinners > 1) {
				manyWinners.length = 0
				console.log(ofWinners)
				for (let i = 0; i < ofWinners; i++){
					manyWinners.push(i)
				}
				console.log(manyWinners)
				const emptyState = $("#EachWinnerCardEmptyState")
				manyWinners.forEach(function(val){
					emptyState ? $("#EachWinnerCardEmptyState").remove() : null
					val++
					$("#EachWinnerHeader").after(`<div class="Polaris-Card__Section">
						<div class="Polaris-Stack Polaris-Stack--vertical">
							<div class="Polaris-Stack__Item">
								<div class="Polaris-Stack distributionFillEvenly">
									<div class="Polaris-Stack__Item"><span aria-label="Farrah" role="img" class="Polaris-Avatar Polaris-Avatar--sizeMedium"><span class="Polaris-Avatar__Initials"><svg class="Polaris-Avatar__Svg" viewBox="0 0 40 40">
													<path fill="currentColor" d="M8.28 27.5A14.95 14.95 0 0120 21.8c4.76 0 8.97 2.24 11.72 5.7a14.02 14.02 0 01-8.25 5.91 14.82 14.82 0 01-6.94 0 14.02 14.02 0 01-8.25-5.9zM13.99 12.78a6.02 6.02 0 1112.03 0 6.02 6.02 0 01-12.03 0z"></path>
												</svg></span></span>
									</div>
									<div class="Polaris-Stack__Item">
										<div class="Polaris-TextContainer">
											<h2 id="WinnerNumber${val}" class="Polaris-Heading">Number ${val}</h2>
										</div>
									</div>
								</div>
							</div>
							<div class="Polaris-Stack__Item">
								<fieldset class="Polaris-ChoiceList" id="WinnerPrizeChoiceList${val}" aria-invalid="false">
									<legend class="Polaris-ChoiceList__Title">Type of prize</legend>
									<ul class="Polaris-ChoiceList__Choices">
										<li><label class="Polaris-Choice" for="Voucher${val}"><span class="Polaris-Choice__Control"><span class="Polaris-RadioButton"><input id="Voucher${val}" name="winner${val}" type="radio" class="Polaris-RadioButton__Input" value="Voucher" checked><span class="Polaris-RadioButton__Backdrop"></span></span></span><span class="Polaris-Choice__Label">Voucher</span></label></li>
										<li><label class="Polaris-Choice" for="Products${val}"><span class="Polaris-Choice__Control"><span class="Polaris-RadioButton"><input id="Products${val}" name="winner${val}" type="radio" class="Polaris-RadioButton__Input" value="Products"><span class="Polaris-RadioButton__Backdrop"></span></span></span><span class="Polaris-Choice__Label">Product</span></label></li>
									</ul>
								</fieldset>
							</div>
							<div id="VoucherFIeldContainer${val}" class="Polaris-Stack__Item">
								<div class="Polaris-Labelled">
									<div class="Polaris-Labelled__LabelWrapper">
										<div class="Polaris-Label"><label id="VoucherInputLabel${val}" for="VoucherInputField${val}" class="Polaris-Label__Text">Voucher amount</label></div>
									</div>
									<div class="Polaris-Connected">
										<div class="Polaris-Connected__Item Polaris-Connected__Item--primary">
											<div class="Polaris-TextField Polaris-TextField--hasValue">
												<div class="Polaris-TextField__Prefix" id="VoucherInputFieldPrefix${val}">$</div><input id="VoucherInputField${val}" autocomplete="off" class="Polaris-TextField__Input" type="number" aria-labelledby="VoucherInputField${val} VoucherInputFieldPrefix${val}" aria-invalid="false" value="100.00">
												<div class="Polaris-TextField__Backdrop"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div id="ProductsFieldContainer${val}" class="Polaris-Stack__Item disappear">
								<div class="Polaris-Labelled">
									<div class="Polaris-Labelled__LabelWrapper">
										<div class="Polaris-Label"><label id="ProductsFieldLabel${val}" for="ProductsField${val}" class="Polaris-Label__Text">Prizes</label></div>
									</div>
									<div class="Polaris-Connected">
										<div class="Polaris-Connected__Item Polaris-Connected__Item--primary">
											<div class="Polaris-TextField">
												<div class="Polaris-TextField__Prefix" id="ProductsFieldPrefix${val}"><span class="Polaris-Icon Polaris-Icon--applyColor"><span class="Polaris-VisuallyHidden"></span><svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
															<path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm9.707 4.293-4.82-4.82A5.968 5.968 0 0 0 14 8 6 6 0 0 0 2 8a6 6 0 0 0 6 6 5.968 5.968 0 0 0 3.473-1.113l4.82 4.82a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414z"></path>
														</svg></span></div><input id="ProductsField${val}" role="combobox" placeholder="Search products" class="Polaris-TextField__Input" aria-labelledby="ProductsFieldLabel${val} ProductsFieldPrefix${val}" aria-invalid="false" aria-autocomplete="list" aria-expanded="false" value="" tabindex="0" aria-controls="" aria-owns="">
												<div class="Polaris-TextField__Backdrop"></div>
											</div>
										</div>
										<div class="Polaris-Connected__Item">
											<div><button id="ProductsFieldBtn${val}" class="Polaris-Button" type="button"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Browse</span></span></button>
												<div id="PolarisPortalsContainer"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>`)
					$(`#Voucher${val}`).click(function(){
						const voucher = $(`#VoucherFIeldContainer${val}`).hasClass("disappear")
						const products = $(`#ProductsFieldContainer${val}`).hasClass("disappear")
						if(voucher === false){
							products === false ? $(`#ProductsFieldContainer${val}`).addClass("disappear") : null
						} else if (voucher === true){
							$(`#VoucherFIeldContainer${val}`).removeClass("disappear")
							products === true ? null : $(`#ProductsFieldContainer${val}`).addClass("disappear")
						}
					})
					$(`#Products${val}`).click(function(){
						const voucher = $(`#VoucherFIeldContainer${val}`).hasClass("disappear")
						const products = $(`#ProductsFieldContainer${val}`).hasClass("disappear")
						if(products === false){
							voucher === false ? $(`#VoucherFIeldContainer${val}`).addClass("disappear") : null
						} else if (products === true){
							$(`#ProductsFieldContainer${val}`).removeClass("disappear")
							voucher === true ? null : $(`#VoucherFIeldContainer${val}`).addClass("disappear")
						}
					})
				})
			} else if (ofWinners <= 1 && ofWinners > 0 ){
				return null
			}
		})
		
		$("#VoucherChoice").click(function(){
			const voucher = $("#VoucherInputFieldContainer").hasClass("disappear")
			const products = $("#ProductSearchFieldContainer").hasClass("disappear")
			if(voucher === false){
				products === false ? $("#ProductSearchFieldContainer").addClass("disappear") : null
			} else if (voucher === true){
				$("#VoucherInputFieldContainer").removeClass("disappear")
				products === true ? null : $("#ProductSearchFieldContainer").addClass("disappear")
			}
		})
		$("#ProductsChoice").click(function(){
			const voucher = $("#VoucherInputFieldContainer").hasClass("disappear")
			const products = $("#ProductSearchFieldContainer").hasClass("disappear")
			if(products === false){
				voucher === false ? $("#VoucherInputFieldContainer").addClass("disappear") : null
			} else if (products === true){
				$("#ProductSearchFieldContainer").removeClass("disappear")
				voucher === true ? null : $("#VoucherInputFieldContainer").addClass("disappear")
			}
		})
	}
	formMagic()
})