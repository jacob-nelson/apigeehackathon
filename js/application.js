$(document).ready(function(){
	/*
	DATAWEAVE_API = "e3428409767bde1684f54002eafb9f528a8b274f";
	START_DATE = "20111201";
	END_DATE = "20111202";
	PER_PAGE = 10;
	URL = "http://api.dataweave.in/v1/commodities/findByCommodity/";
	*/
	
	var commodityData, selectedCommodity;
	states = ["kerala", "karnataka", "tamilnadu", "andhrapradesh", "maharashtra", "gujarat", "madhyapradesh", "chattisgarh", "jharkhand", "westbengal", "orissa", "bihar", "uttarpradesh", "rajastan", "haryana", "delhi", "uttarakhand", "punjab", "jammukashmir", "himachalpradesh", "nagaland", "manipur", "mizoram", "tripura", "arunachalpradesh", "assam", "meghalaya", "sikkim"];		
	min_price = [];
	max_price = [];
	Arrivals_Tonnes = [];
	Total_Arrivals_Tonnes = [];
	details = [];
	var r = Raphael("chart");
    chart=r.barchart(0, 0, 250, 100, [0,0], {})	
	
	$(".commodity-list li").on("click", function(){
		// this is to remove the highlighting of the previously selected list item
		$(".commodity-list li").attr("class", "");
		// this is to highlight the current list item
		$(this).attr("class", "active");
		selectedCommodity = $(this).text();
		$(".pin").hide();
		
		$.getJSON("get-data.php", 
			{
				"commodity": encodeURIComponent(selectedCommodity)
			}, 
			function(data){
				commodityData = data;
				loopthrough = (commodityData.count <= 10) ? commodityData.count : 10;
				for(var x = 0; x < states.length; x++){
				    details[states[x]] = [];    
				}	
				
				for(i=0;i<loopthrough;i++){
					state = commodityData.data[i].state.toLowerCase().replace(/\s/g, '');
					cData = commodityData.data[i];
					details[state].push([cData.market, cData.Arrivals_Tonnes, cData.Minimum_Price,cData.Maximum_Price,cData.Modal_Price]);
					
					if(min_price[state] != "undefined" ||  commodityData.data[i].Minimum_Price < min_price[state])
						min_price[state] = commodityData.data[i].Minimum_Price;
					if (max_price[state] != "undefined" || commodityData.data[i].Maximum_Price > max_price[state])
						max_price[state] = commodityData.data[i].Maximum_Price;
					if(typeof(Total_Arrivals_Tonnes[state]) == "undefined"){
						Total_Arrivals_Tonnes[state] = commodityData.data[i].Arrivals_Tonnes;
					}
					else if(IsNumeric(commodityData.data[i].Arrivals_Tonnes)){
						Total_Arrivals_Tonnes[state] = parseFloat(Total_Arrivals_Tonnes[state])+parseFloat(commodityData.data[i].Arrivals_Tonnes);
					}
					$(".pin."+state).show();
				}
				for(state in min_price){
					$(".info."+state+" .minp").text("Rs. "+min_price[state]);
				}
				for(state in max_price){
					$(".info."+state+" .maxp").text("Rs. "+max_price[state]);
				}		
				for(state in Total_Arrivals_Tonnes){
					$(".info."+state+" .arrivals").text(Total_Arrivals_Tonnes[state]+" Quintals");
				}	
			})
			.error(function(error) { console.log("Error => "+error); });
	});
	showInfo();
	$(".pin").on("click", function(){
		$(this).siblings().show("slow");
		$(this).siblings().css({"top": $(this).css("top"), "left": $(this).css("left")})
	});
	
	$(".closeinfo").on("click", function(){
		$(this).parent().parent().hide("slow");
	});
	
	//show the modal window
	$(".popout .btn").on("click", function(){
		modalDataHTML = "";
		state = $(this).parent().parent().attr("class").replace("info ", "");
		modalHeading = "Information about "+selectedCommodity+" @ "+state;
		$("#myModalLabel").text(modalHeading);
		data_min_price = [];
		data_max_price = [];
		for(i=0;i<details[state].length;i++){
			modalDataHTML += '<div class="row data-row">';
			modalDataHTML += '	<div class="span2">'+details[state][i][0]+'</div>';
			modalDataHTML += '	<div class="span2">'+details[state][i][1]+'</div>';
			modalDataHTML += '	<div class="span1">'+details[state][i][2]+'</div>';
			modalDataHTML += '	<div class="span1">'+details[state][i][3]+'</div>';
			modalDataHTML += '</div>';
			data_min_price.push(details[state][i][2]);
			data_max_price.push(details[state][i][3]);
		}
		$(".modal-body .data-row").remove();
		$(".modal-body .data-header").after(modalDataHTML);
		chart.remove();
        chart=r.barchart(0, 0, 250, 100, [data_min_price, data_max_price], {})	
	});
});

function IsNumeric(input)
{
    return (input - 0) == input && input.length > 0;
}

function showInfo(){

	for(i=0;i<states.length;i++){
		var infoHTML = '';
		infoHTML += '<div class="popout">';
		infoHTML += '	<div class="pin '+states[i]+'"></div>';
		infoHTML += '	<div class="info '+states[i]+'">';
		infoHTML += '		<header>'+states[i]+'<img class="closeinfo" src="close.png" /></header>'; 
		infoHTML += '			<div><strong>Minimum Price: </strong><span class="minp"><span></div>';
		infoHTML += '			<div><strong>Maximum Price: </strong><span class="maxp"><span></div>';
		infoHTML += '			<div><strong>Was Available: </strong><span class="arrivals"><span></div>';
		infoHTML += '			<div align="right"><a href="#myModal" data-toggle="modal" class="btn btn-primary">Details</a></div>';
		infoHTML += '	</div>';
		infoHTML += '</div>';	
		$("#state-data").append(infoHTML);
	}
}
