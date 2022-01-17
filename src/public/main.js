$(document).ready(function(){
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
})