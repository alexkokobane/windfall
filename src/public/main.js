$(document).ready(function(){

	$("#TopBar-Nav-Menu").click(function(){
		$("#AppFrameNav").toggle()
	})

	$("#TopBar-Nav-Menu-Two").click(function(){
		$("[data-portal-id='popover-Polarisportal5']").toggle()
	})
	
	$("#logout-link").click(function(e){
		e.preventDefault()
		$.ajax({
			url: "/login/logout",
			type: "POST",
			success: function(){
				location.href="/"
			}
		})
	})

	$.ajax({
		url: '/shop',
		success: function(data){
			$("#to-admin").click(function(){
				location.href="https://"+data.shop+"/admin"
			})
		}
	})
})