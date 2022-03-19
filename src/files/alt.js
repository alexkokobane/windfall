$(document).ready(function(){
	
	$("#LoginButtonOne").click(function(e){
		e.preventDefault()

		$(this).addClass("Polaris-Button--loading")
		$("#LoginBtnText").before(`
			<span id="LoginBtnSpinner" class="Polaris-Button__Spinner">
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

		const name = $("#DomainField").val()
		console.log(name)
		$.ajax({
			url: "/login",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({"shop": name}),
			success: function(data){
				location.href = data
			},
			error: function(data){
				$("#LoginButtonOne").removeClass("Polaris-Button--loading")
				$("#LoginBtnSpinner").remove()
				alert(data.responseText)
			}
		})
	})

	$("#Standard").click(function(){
		location.href="/billing/plans/subscribe?plan=Standard"
	})
	$("#Ultimate").click(function(){
		location.href="/billing/plans/subscribe?plan=Ultimate"
	})
	$("#Starter").click(function(){
		location.href="/billing/plans/subscribe?plan=Starter"
	})
})