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
	function formMagic(){
		$("#GiveawayNameInput").on("input", function(){
			console.log($(this).val())
			$("#GiveawayName").text($(this).val())
		})
		$("#SelectInput > option").click(function(){
			console.log($(this).val())
			$("#SelectInputChosen").text($(this).val())
		})
		$("#Equitable").click(function(){
			$("#AllWinnersCard").toggle()
			$("#EachWinnerCard").toggle()
		})
		$("#Hierarchical").click(function(){
			$("#AllWinnersCard").toggle()
			$("#EachWinnerCard").toggle()
		})
	}
	formMagic()
	const winner = `<div class="Polaris-Card__Section">
		<div class="Polaris-Stack Polaris-Stack--vertical">
			<div class="Polaris-Stack__Item">
				<div class="Polaris-Stack distributionFillEvenly">
					<div class="Polaris-Stack__Item"><span aria-label="Farrah" role="img" class="Polaris-Avatar Polaris-Avatar--sizeMedium"><span class="Polaris-Avatar__Initials"><svg class="Polaris-Avatar__Svg" viewBox="0 0 40 40">
									<path fill="currentColor" d="M8.28 27.5A14.95 14.95 0 0120 21.8c4.76 0 8.97 2.24 11.72 5.7a14.02 14.02 0 01-8.25 5.91 14.82 14.82 0 01-6.94 0 14.02 14.02 0 01-8.25-5.9zM13.99 12.78a6.02 6.02 0 1112.03 0 6.02 6.02 0 01-12.03 0z"></path>
								</svg></span></span>
					</div>
					<div class="Polaris-Stack__Item">
						<div class="Polaris-TextContainer">
							<h2 id="WinnerNumber${1}" class="Polaris-Heading">Number ${1}</h2>
						</div>
					</div>
				</div>
			</div>
			<div class="Polaris-Stack__Item">
				<fieldset class="Polaris-ChoiceList" id="WinnerPrizeChoiceList${1}" aria-invalid="false">
					<legend class="Polaris-ChoiceList__Title">Type of prize</legend>
					<ul class="Polaris-ChoiceList__Choices">
						<li><label class="Polaris-Choice" for="Voucher${1}"><span class="Polaris-Choice__Control"><span class="Polaris-RadioButton"><input id="Voucher${1}" name="winner${1}" type="radio" class="Polaris-RadioButton__Input" value="Voucher" checked><span class="Polaris-RadioButton__Backdrop"></span></span></span><span class="Polaris-Choice__Label">Voucher</span></label></li>
						<li><label class="Polaris-Choice" for="Products${1}"><span class="Polaris-Choice__Control"><span class="Polaris-RadioButton"><input id="Products${1}" name="winner${1}" type="radio" class="Polaris-RadioButton__Input" value="Products"><span class="Polaris-RadioButton__Backdrop"></span></span></span><span class="Polaris-Choice__Label">Product</span></label></li>
					</ul>
				</fieldset>
			</div>
			<div id="VoucherFIeldContainer${1}" class="Polaris-Stack__Item">
				<div class="Polaris-Labelled">
					<div class="Polaris-Labelled__LabelWrapper">
						<div class="Polaris-Label"><label id="VoucherInputLabel${1}" for="VoucherInputField${1}" class="Polaris-Label__Text">Voucher amount</label></div>
					</div>
					<div class="Polaris-Connected">
						<div class="Polaris-Connected__Item Polaris-Connected__Item--primary">
							<div class="Polaris-TextField Polaris-TextField--hasValue">
								<div class="Polaris-TextField__Prefix" id="VoucherInputFieldPrefix${1}">$</div><input id="VoucherInputField${1}" autocomplete="off" class="Polaris-TextField__Input" type="number" aria-labelledby="VoucherInputField${1} VoucherInputFieldPrefix${1}" aria-invalid="false" value="100.00">
								<div class="Polaris-TextField__Backdrop"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="ProductsFieldContainer${1}" class="Polaris-Stack__Item">
				<div class="Polaris-Labelled">
					<div class="Polaris-Labelled__LabelWrapper">
						<div class="Polaris-Label"><label id="ProductsFieldLabel${1}" for="ProductsField${1}" class="Polaris-Label__Text">Prizes</label></div>
					</div>
					<div class="Polaris-Connected">
						<div class="Polaris-Connected__Item Polaris-Connected__Item--primary">
							<div class="Polaris-TextField">
								<div class="Polaris-TextField__Prefix" id="ProductsFieldPrefix${1}"><span class="Polaris-Icon Polaris-Icon--applyColor"><span class="Polaris-VisuallyHidden"></span><svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
											<path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm9.707 4.293-4.82-4.82A5.968 5.968 0 0 0 14 8 6 6 0 0 0 2 8a6 6 0 0 0 6 6 5.968 5.968 0 0 0 3.473-1.113l4.82 4.82a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414z"></path>
										</svg></span></div><input id="ProductsField${1}" role="combobox" placeholder="Search products" class="Polaris-TextField__Input" aria-labelledby="ProductsFieldLabel${1} ProductsFieldPrefix${1}" aria-invalid="false" aria-autocomplete="list" aria-expanded="false" value="" tabindex="0" aria-controls="" aria-owns="">
								<div class="Polaris-TextField__Backdrop"></div>
							</div>
						</div>
						<div class="Polaris-Connected__Item">
							<div><button id="ProductsFieldBtn${1}" class="Polaris-Button" type="button"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Browse</span></span></button>
								<div id="PolarisPortalsContainer"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`
})