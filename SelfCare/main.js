<script>
$(document).ready(function() {
	function ren() {
		// render the page -- in case you're wondering, 
		// nothing will work without javascript!
		$("#tit").html('<font face="Garamond"><h1>&nbsp;&nbsp;<i>sleepyti.me <font color="#33CC33">beta 3</font></i></h1></font>');
		var mrend = '';
		mrend = mrend +
		'<table><tr width="100%">' +
		'<td width="20%"></td>' +
		'<td><span class="intro"><font face="Garamond" size=5>I have to wake up at <span class="waketime" style="display:none;"></span>&nbsp;</td>' +
		'<td>' +
		'<select id="hour">' +
		'<option>(hour)</option>';
		
		// populate our lists
		for(var h = 1; h <= 12; h++) {
			mrend = mrend + '<option>' + h + '</option>';	
		}
		
		mrend = mrend + '</select></td><td><select id="minute"><option>(minute)</option>';
		
		for(var m = 0; m <= 55; m += 5) {
			if(m < 10) {
				mrend = mrend + '<option value="' + m + '">0' + m + '</option>';
			}
			else {
				mrend = mrend + '<option>' + m + '</option>';
			}
			
		}
		
		mrend = mrend + '</select></td><td><select id="ampm">' + 
		'<option>AM</option><option>PM</option></select></td></tr>' +
		'<tr><td><hr color="white"></td></tr>' +
		'<tr valign=TOP><td></td><td align="center"><span id="nowtop"><hr color="white" width="25%"><big><font color="#666666"><i>or, find out when to wake up<br/>if you go to bed now</i></font></big></td><td align="center"><hr color="white" width="25%"><input type="button" value="zzz" id="sleepnow"/></span></td>' +
		'<td></td></span>' +
		'<td></tr><tr><span class="results" style="display:none;"></span></td>' + 
		'</tr></table>';
		$('#main').html(mrend);
	}
	ren();
	
	// calculates an hour and a half back
	function sleepback(hr, min, an) {
                var rmin = 0;
                var rhr = 0;
                var a = an;
                if(min < 30) {
                        rmin = (min * 1) + (30 * 1);
                        rhr = hr - 2;
                }
                else if(min >= 30) {
                        rmin = min - 30;
                        rhr = hr - 1;
                }
                if(rhr < 1) {
                        rhr = 12 + rhr;
                        
			if(a == "AM") {
				a = "PM";
			}
			else {
				a = "AM";
			}
			
                }
                
		var r = [rhr, rmin, a];
		return r;
	}
	
	// knockout takes a date object and returns a
	// string with wake times!
	// time + :14 + (multiples of 90 mins)
	function knockout(rightnow) {
		var r = ''; // return string
		var hr = rightnow.getHours();
		var dhr = 0; // separate variable to display because (24 hr clock)
		var ap = '';
		
		
		// it takes 14 minutes to fall asleep
		var min = rightnow.getMinutes() + 14;
		if(min > 60) {
			min = min - 60;
			hr = hr + 1;
			
			if(hr >= 24) {
				if(hr == 24) {
					hr = 0; // midnight, must adjust!
				}
				else if(hr == 25) {
					hr = 1;
				}
			}
		}
		
		r = '<table><tr><td width="5%"></td><td><font size="5"><p>It takes the average human <b>fourteen minutes</b> to fall asleep.</p><p>If you head to bed right now, you should try to wake up at one of the following times:</p><h2><font color="#666666">';
		for(var ctr = 0; ctr < 6; ctr++) { // normal sleep schedule
			// add an hour and a half
			if(min < 30) {
				min = min + 30;
			}
			else {
				min = min - 30;
				hr = hr + 1
			}
			hr = hr + 1;
			
			if(hr == 24) {
				hr = 0;
			}
			if(hr == 25) {
				hr = 1;
			}
			
			if(hr < 12) {
				ap = ' AM';
				dhr = hr;
				if(hr == 0) {
					dhr = "12";
				}
			}
			else {
				ap = ' PM';
				dhr = hr - 12;	
			}
			if(dhr == 0) {
				dhr = 12;
			}
			if(ctr == 0) {
				if(min > 9) {
					r = r  + dhr + ':' + min + ap;
				}
				else {
					r = r + dhr + ':0' + min + ap;
				}
			}
			else if(ctr == 4 || ctr == 5) {
				if(min > 9) {
					r = r + ' <i>or</i> <font color="#00CC33">' + dhr + ':' + min + ap + '</font>';
				}
				else {
					r = r + ' <i>or</i> <font color="#00CC33">' + dhr + ':0' + min + ap;
				}
			}
			else if(ctr == 3) {
				if(min > 9) {
					r = r + ' <i>or</i> <font color="#99CC66">' + dhr + ':' + min + ap + '</font>';
				}
				else {
					r = r + ' <i>or</i> <font color="#99CC66">' + dhr + ':0' + min + ap + '</font>';
				}	
			}
			else {
				if(min > 9) {
					r = r + ' <i>or</i> ' + dhr + ':' + min + ap;
				}
				else {
					r = r + ' <i>or</i> ' + dhr + ':0' + min + ap;
				}
			}	
		}
		r = r + '</h2></font><p>A good night\'s sleep consists of 5-6 complete sleep cycles.</p>';
		r = r + '<center><a href="index.html"><h3>back</h3></a></center>';
		return r;
	}
	
	// handle "sleep now" requests
	// this currently fades out the #main id,
	// and works in a totally separate div
	$("#sleepnow").click(function() {
		var st = '';
		var answ = ''; // this is the text we return
		var d = new Date();
		answ = knockout(d); // knockout takes a Date() and returns a string of wake times
		st = '<span id="bit" style=display:none><font face="Garamond" size=5>' +
		answ + '</font></span>';
		$('#main').hide();
		$('#instant').html(st);
		$('#instant').show()
		$('#bit').show(250);
		putads()
	});
	
	// user changes the list, so we calculate times!
	$("#main select").change(function () {
		if($("#hour").val() == '(hour)' || $("#minute").val() == '(minute)') {
			return false;
		}
		
		$('#nowtop').fadeOut(500); // ???
		var ampm = $("#ampm").val();	
		var hr = $("#hour").val();
		var min = $("#minute").val();
		var orig = [hr, min, ampm];
		
		if(hr == 12) {
			if(ampm == "AM") {
				ampm = "PM";
			}
			else {
				ampm = "AM";
			}
		}
		
		var txt = '<table><tr><td width="5%"></td><td><font face="Garamond" size=5>You should try to <b>fall asleep</b> at one of the following times:<br/><br/><font size=6>';
		var first = true;
		var times = new Array();
		for(var c = 1; c <= 10; c++) {
			var back = sleepback(hr, min, ampm);
			var nhr = back[0];
			var nmin = back[1];
			ampm = back[2];
			var ampmt = "";
			ampmt = back[2];
			
			// countdown from 12, but that's not
			// how am/pm system works... whoops!
			if(nhr == 12) {
				if(ampm == "AM") {
					ampmt = "PM";
				}
				else {
					ampmt = "AM";
				}
			}
			// TODO: reverse display order
			if(c == 6 || c == 4 || c == 5 || c == 3) {
				var temp = '';
				if(nmin > 9) {
					if(c == 6) {
						temp = '<font color="#01DF74" size="7">' + nhr + ':' + nmin + ' ' + ampmt + '</font>';
						times.push(temp);
					}
					else {
						temp = ' <i>or</i> ' + '<font color="#01DF74" size="7">' + nhr + ':' + nmin + ' ' + ampmt + '</font>';
						times.push(temp);
					}
				}
				else { // insert 0
					if(c == 6) {
						temp = '<font color="#01DF74" size="7">' + nhr + ':0' + nmin + ' ' + ampmt + '</font>';
						times.push(temp);
					}
					else {
						temp = ' <i>or</i> ' + '<font color="#01DF74" size="7">' + nhr + ':0' + nmin + ' ' + ampmt + '</font>';
						times.push(temp);
					}
				
				}
			}
			hr = nhr;
			min = nmin;
		}
		for(i = 3; i >= 0; i--) {
			txt = txt + times[i];
		}
		
		txt = txt + '</font>'; 
		
		txt = txt + '<br/><br/><font color="#0080FF">Please keep in mind that you should be <i>falling asleep</i> at these times.<br/><br/> The average adult human takes <b>fourteen minutes</b> to fall asleep, so plan accordingly!</font>';
		txt = txt + '<br/></br><font color="#9966CC">sleepyti.me works by counting backwards in <b>sleep cycles</b>. Sleep cycles typically last <b>90 minutes</b>.<br/><br/>Waking up in the middle of a sleep cycle leaves you feeling tired and groggy, but waking up <i>in between</i> cycles lets you wake up feeling refreshed and alert!</font>';
		txt = txt + '<br/><br/><center><a href="index.html"><h3>back</h3></a></center>';
		$('#main').hide();
		$('#instant').html(txt)
		$('#instant').show(500)
		
		var wtime = "";
		if(orig[1] > 9) {
			wtime = '<b>' + orig[0] + ':' + orig[1] + ' ' + orig[2] + '</b>';	
		}
		else {
			wtime = '<b>' + orig[0] + ':0' + orig[1] + ' ' + orig[2] + '</b>';
		}
		$('.waketime').html(wtime);
		$('.waketime').fadeIn(1000);
		putads();
	});
});
</script>