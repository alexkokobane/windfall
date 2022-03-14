$(document).ready(function(){
	
	$("#LoginButtonOne").click(function(e){
		e.preventDefault()
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