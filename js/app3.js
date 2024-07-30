
var country, tzname, chName, chDate, chTime, chPlace, chZone, chLon, chLat, chStyle, atlasData, chInfo;

        var westernZodiac = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        var indianZodiac = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
        var indianZodiacTamil = ['மேஷம் ', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
        
        var nakshatraNames = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
            "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", 
            "Jyeshta", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", 
            "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
        ];
        
        var nakshatraNamesTamil = [
            "அஸ்வினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசீரிடம்", "திருவாதிரை", "புனர்பூசம்", "பூசம்", "ஆயில்யம்",
            "மகம்", "பூரம்", "உத்திரம்", "ஹஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்",
            "கேட்டை", "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்",
            "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி"
        ];

        var planetsTamil = ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி', 'ராகு', 'கேது', 'லக்னம்'];

        var nakshatraLordsTamil = [
            "கேது", "சுக்கிரன்", "சூரியன்", "சந்திரன்", "செவ்வாய்", "ராகு", "குரு", "சனி", "புதன்",
            "கேது", "சுக்கிரன்", "சூரியன்", "சந்திரன்", "செவ்வாய்", "ராகு", "குரு", "சனி", "புதன்",
            "கேது", "சுக்கிரன்", "சூரியன்", "சந்திரன்", "செவ்வாய்", "ராகு", "குரு", "சனி", "புதன்"
        ];

        function calculateNakshatraPada(degree) {
            const degreesPerNakshatra = 13.33;
            const degreesPerPada = 3.333;

            const nakshatraIndex = Math.floor(degree / degreesPerNakshatra);
            const pada = Math.floor((degree / degreesPerPada)) % 4 + 1;
            const nakshatraName = nakshatraNamesTamil[nakshatraIndex % 27]; // Using modulo 27 to cycle through Nakshatra list
            return { nakshatra: nakshatraName, pada: pada };
        }

        function calculateNavamsaPosition(longitude) {
            // Calculate the Navamsa position
            var sign = Math.floor(longitude / 30);  // Which sign the planet is in
            var posInSign = longitude % 30;  // Position within the sign
            var navamsa = Math.floor(posInSign / 3.333);  // Navamsa division within the sign
            var navamsaSign = (sign * 9 + navamsa) % 12;  // Navamsa sign index
            return navamsaSign;
        }

        var housePositions = [
            {row: 0, col: 1},  // Aries
            {row: 0, col: 2},  // Taurus
            {row: 0, col: 3},  // Gemini
            {row: 1, col: 3},  // Cancer
            {row: 2, col: 3},  // Leo
            {row: 3, col: 3},  // Virgo
            {row: 3, col: 2},  // Libra
            {row: 3, col: 1},  // Scorpio
            {row: 3, col: 0},  // Sagittarius
            {row: 2, col: 0},  // Capricorn
            {row: 1, col: 0},  // Aquarius
            {row: 0, col: 0}   // Pisces
        ];

        function drawSouthChart(x, y, w, h, planetDetails, currentDate, currentTime) {
            var mx = w / 4,  // width of each house
                my = h / 4,  // height of each house
                bw = w / 8;  // offset within each house for the planet text

            var s = "<g>\n";
            var planetCounts = new Array(12).fill(0);  // This will track the number of planets in each house

            // Draw chart houses
            housePositions.forEach((pos, index) => {
                var xd = x + pos.col * mx,
                    yd = y + pos.row * my;
                s += '<rect x="' + xd + '" y="' + yd + '" width="' + mx + '" height="' + my + '" style="fill:none;stroke:black;stroke-width:2"/>\n';
            });

            // Place planets in houses based on their longitude
            planetDetails.forEach((planet) => {
                var houseIndex = Math.floor((planet.longitude % 360) / 30); // Calculate house index from 0 to 11
                var position = housePositions[houseIndex];
                var count = planetCounts[houseIndex];
                var cellX = x + position.col * mx - 10;
                var cellY = y + position.row * my + (count * 15);  // Adjust Y based on count of planets in the same house
                var planetName = planet.name;

                s += '<text x="' + (cellX + bw / 2) + '" y="' + (cellY + my / 2) + '" fill="black" font-size="14" font-family="monospace">' + planetName + '</text>\n';

                planetCounts[houseIndex]++;  // Increment the count of planets in the current house
            });

            // Add text in the middle of the chart
            var centerX = x + w / 2;
            var centerY = y + h / 2;
            s += '<text x="' + centerX + '" y="' + (centerY - 20) + '" fill="black" font-size="12" font-family="monospace" text-anchor="middle">ஸ்ரீ கற்பக விநாயகர் துணை</text>\n';
			s += '<text x="' + centerX + '" y="' + (centerY) + '" fill="black" font-size="16" font-family="monospace" text-anchor="middle">ராசி</text>\n';

            s += '<text x="' + centerX + '" y="' + (centerY + 20) + '" fill="black" font-size="16" font-family="monospace" text-anchor="middle">' + currentDate + '</text>\n';
            s += '<text x="' + centerX + '" y="' + (centerY + 40) + '" fill="black" font-size="16" font-family="monospace" text-anchor="middle">' + currentTime + '</text>\n';

            s += "</g>\n";
            return s;
        }

        function drawNavamsaChart(x, y, w, h, planetDetails) {
            var mx = w / 4,  // width of each house
                my = h / 4,  // height of each house
                bw = w / 8;  // offset within each house for the planet text

            var s = "<g>\n";
            var planetCounts = new Array(12).fill(0);  // This will track the number of planets in each house

            // Draw chart houses
            housePositions.forEach((pos, index) => {
                var xd = x + pos.col * mx,
                    yd = y + pos.row * my;
                s += '<rect x="' + xd + '" y="' + yd + '" width="' + mx + '" height="' + my + '" style="fill:none;stroke:black;stroke-width:2"/>\n';
            });

            // Place planets in houses based on their Navamsa position
            planetDetails.forEach((planet) => {
                var navamsaSign = calculateNavamsaPosition(planet.longitude);
                var position = housePositions[navamsaSign];
                var count = planetCounts[navamsaSign];
                var cellX = x + position.col * mx - 10;
                var cellY = y + position.row * my + (count * 15);  // Adjust Y based on count of planets in the same house
                var planetName = planet.name;

                s += '<text x="' + (cellX + bw / 2) + '" y="' + (cellY + my / 2) + '" fill="black" font-size="14" font-family="monospace">' + planetName + '</text>\n';

                planetCounts[navamsaSign]++;  // Increment the count of planets in the current house
            });

            // Add text in the middle of the chart
            var centerX = x + w / 2;
            var centerY = y + h / 2;
			s += '<text x="' + centerX + '" y="' + (centerY) + '" fill="black" font-size="16" font-family="monospace" text-anchor="middle">நவாம்சம்</text>\n';

            s += "</g>\n";
            return s;
        }

		
		function formatAMPM(hour, minute) {
			var ampm = hour >= 12 ? 'PM' : 'AM';
			hour = hour % 12;
			hour = hour ? hour : 12; // the hour '0' should be '12'
			minute = minute < 10 ? '0' + minute : minute;
			var strTime = hour + ':' + minute + ' ' + ampm;
			return strTime;
		}

        function chPlanets(p) {
            var sg = new Array(10);
            for (i = 0; i < 10; i++) {
                sg[i] = parseInt(Math.floor(p[i]) / 30) + 1;
            }
            return sg;
        }
		
		
function getCityInfo(cityName) {
    const cityData = {
        "Chennai": {
            "latitude": { degrees: 13, minutes: 5, direction: 'N' },
            "longitude": { degrees: 80, minutes: 17, direction: 'E' },
            "timezone": { hours: 5, minutes: 30, direction: 'E' }
        },
        "Tiruchirappalli": {
            "latitude": { degrees: 10, minutes: 49, direction: 'N' },
            "longitude": { degrees: 78, minutes: 42, direction: 'E' },
            "timezone": { hours: 5, minutes: 30, direction: 'E' }
        },
        "Madurai": {
            "latitude": { degrees: 9, minutes: 55, direction: 'N' },
            "longitude": { degrees: 78, minutes: 7, direction: 'E' },
            "timezone": { hours: 5, minutes: 30, direction: 'E' }
        },
        "Hyderabad": {
            "latitude": { degrees: 17, minutes: 23, direction: 'N' },
            "longitude": { degrees: 78, minutes: 27, direction: 'E' },
            "timezone": { hours: 5, minutes: 30, direction: 'E' }
        },
        "Bengaluru": {
            "latitude": { degrees: 12, minutes: 58, direction: 'N' },
            "longitude": { degrees: 77, minutes: 36, direction: 'E' },
            "timezone": { hours: 5, minutes: 30, direction: 'E' }
        },
        "Thiruvananthapuram": {
            "latitude": { degrees: 8, minutes: 29, direction: 'N' },
            "longitude": { degrees: 76, minutes: 57, direction: 'E' },
            "timezone": { hours: 5, minutes: 30, direction: 'E' }
        },
        "New Delhi": {
            "latitude": { degrees: 28, minutes: 38, direction: 'N' },
            "longitude": { degrees: 77, minutes: 13, direction: 'E' },
            "timezone": { hours: 5, minutes: 30, direction: 'E' }
        },
        "New York, NY": {
            "latitude": { degrees: 40, minutes: 43, direction: 'N' },
            "longitude": { degrees: 74, minutes: 0, direction: 'W' },
            "timezone": { hours: 4, minutes: 0, direction: 'W' }
        },
        "Westlake, OH": {
            "latitude": { degrees: 41, minutes: 27, direction: 'N' },
            "longitude": { degrees: 81, minutes: 55, direction: 'W' },
            "timezone": { hours: 4, minutes: 0, direction: 'W' }
        },

		
        // Additional cities can be added here as needed
    };
    return cityData[cityName] || null; // Return null if city not found
}


		// Function to calculate planetary positions
		function calculatePlanetaryPositions(t, timeData, cityInfo) {
			var lon = parseFloat(cityInfo.longitude.degrees) + parseFloat(cityInfo.longitude.minutes / 60);
			if (cityInfo.longitude.direction === 'E') {
				lon *= -1;
			}
			var lat = parseFloat(cityInfo.latitude.degrees) + parseFloat(cityInfo.latitude.minutes / 60);
			if (cityInfo.latitude.direction === 'S') {
				lat *= -1;
			}

			var as = ascendant(t, timeData.time, lon, lat);
			var pp = new Array(10);
			pp[0] = as;
			planets(t, pp, 1);
			var signIndices = chPlanets(pp);

			var planetaryPositions = [];
			var planetsEng = ['Ascendant', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
			var planetsTamil = ['லக்னம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி', 'ராகு', 'கேது'];

			for (var i = 0; i < planetsEng.length; i++) {
				var longitude = (pp[i] !== undefined && !isNaN(pp[i])) ? pp[i].toFixed(1) : 'N/A';
				var degreeInSign = (pp[i] !== undefined && !isNaN(pp[i])) ? (pp[i] % 30).toFixed(1) : 'N/A';
				var zodiacSign = signIndices[i] ? indianZodiacTamil[signIndices[i] - 1] : 'N/A';
				var nakshatraPada = (pp[i] !== undefined && !isNaN(pp[i])) ? calculateNakshatraPada(pp[i]) : { nakshatra: 'N/A', pada: 'N/A' };
				var nakshatraIndex = Math.floor(pp[i] / 13.33);
				var nakshatraLord = nakshatraLordsTamil[nakshatraIndex % 27];
				var houseNumber = (signIndices[i] - signIndices[0] + 12) % 12 + 1;

				planetaryPositions.push({
					name: planetsTamil[i],
					nakshatraPada: nakshatraPada.nakshatra + ' ' + nakshatraPada.pada,
					zodiacSign: zodiacSign,
					degree: degreeInSign,
					longitude: parseFloat(longitude),
					nakshatraLord: nakshatraLord,
					houseNumber: houseNumber
				});
			}

			return planetaryPositions;
		}

		// Function to display the main chart
		function displayChart(planetaryPositions, year, month, day, hour, minutes) {
			var currentDate = day + '-' + month + '-' + year;
			var currentTime = formatAMPM(hour, minutes);
			
			var svgContent = drawSouthChart(0, 0, 400, 400, planetaryPositions, currentDate, currentTime);
			document.getElementById('chartContainer').innerHTML = '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" version="1.1">' + svgContent + '</svg>';
		}

		// Function to calculate Navamsa positions
		function calculateNavamsaPositions(planetaryPositions) {
			return planetaryPositions.map(planet => {
				var navamsaSign = calculateNavamsaPosition(planet.longitude);
				var navamsaSignName = indianZodiacTamil[navamsaSign];
				return { ...planet, navamsaSign: navamsaSignName };
			});
		}

		// Function to display the Navamsa chart
		function displayNavamsaChart(navamsaPositions) {
			navamsaPositions.sort((a, b) => a.longitude - b.longitude);

			var navamsaSvgContent = drawNavamsaChart(0, 0, 400, 400, navamsaPositions);
			document.getElementById('navamsaChartContainer').innerHTML = '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" version="1.1">' + navamsaSvgContent + '</svg>';
		}

		// Function to display the planetary positions table
		function displayPlanetaryTable(planetaryPositions) {
			planetaryPositions.sort((a, b) => a.houseNumber - b.houseNumber || a.longitude - b.longitude);

//			var table = '<table><tr><th>House</th><th>Zodiac Sign</th><th>Planet</th><th>Nakshatra Pada</th><th>Nakshatra Lord</th></tr>';
			var table = '<table><tr><th>House</th><th>Planet</th><th>Nakshatra Pada</th><th>Nakshatra Lord</th><th>Degrees</th></tr>';
			planetaryPositions.forEach((planet) => {
//				table += '<tr><td>' + planet.houseNumber + '</td><td>' + planet.zodiacSign + '(' + planet.degree + ')</td><td>' + planet.name + '</td><td>' + planet.nakshatraPada + '</td><td>' + planet.nakshatraLord + '</td></tr>';

				table += '<tr><td>' + planet.houseNumber + '</td><td>' + planet.name + '</td><td>' + planet.nakshatraPada + '</td><td>' + planet.nakshatraLord + '</td><td>' + Math.floor(planet.longitude) + '</td></tr>';
			});
			table += '</table>';
			document.getElementById('result').innerHTML = table;
		}



function getDashas(jd, nd) {
    var s = '<div style="font-family: monospace">';
    s += "<p>---Vimshottari Doshas---</p>",
    s += "</div>",
    s += '<div><span style="font-family: monospace">';
    for (var yd = 0, xoff = 0, cnt = 0, nt = nd, idx = getdashastart(), i = 0; i < 9; i++) {
        s += dlnam[nt] + " Dasha:<br>";
        for (var j = 0; j < 9 && (s += bhuktistring(nd, idx, jd) + "&nbsp;&nbsp;",
        ++idx % 9 != 0); j++)
            j % 3 == 2 && (s += "<br>");
        s += "<br>",
        9 == ++nt && (nt = 0)
    }
    return s += "</div>"
}
function calcdasha(moonpos) {
    for (var moonmins = Math.floor(60 * moonpos), natal_dasha = Math.floor(moonmins / 800) % 9, rem, elapsed = moonmins % 800 / 800 * dashyr[natal_dasha] * 365.25, m = natal_dasha, idx = 0, days_into = 0, d = 0; d < 9; d++) {
        for (var dlen = 365.25 * dashyr[m], bp = m, b = 0; b < 9; b++) {
            var per, blen = dashyr[bp] / 120 * dlen;
            dlist[idx] = Math.floor(days_into - elapsed),
            idx++,
            days_into += blen,
            9 === ++bp && (bp = 0)
        }
        9 === ++m && (m = 0)
    }
    return natal_dasha
}
function getdashastart() {
    for (var dstart = 0; dlist[dstart] < 0; )
        dstart++;
    return --dstart < 0 && (dstart = 0),
    dstart
}
function calcnavamsha(ppos) {
    for (var darray = new Array(10), i = 0; i < 10; i++) {
        var m = Math.floor(60 * ppos[i]);
        m /= 200,
        darray[i] = Math.floor(m % 12)
    }
    return darray
}
function drawline(x, y, x2, y2) {
    return '<line x1="' + x + '" y1="' + y + '" x2="' + x2 + '" y2="' + y2 + '"/>\n'
}
function drawstring(text, fontsize, color, x, y) {
    return '<text x = "' + x + '" y = "' + y + '" fill="' + color + '" font-size = "' + fontsize + '" font-family = "monospace" >' + text + "</text>\n"
}
function bhuktistring(natal, idx, bd) {
    var bi = dlist[idx];
    dlist[idx] < 0 && (bi = 0);
    var md, bk = (Math.floor(natal + idx / 9) % 9 + idx) % 9;
    return dlstr.substr(2 * bk, 2) + " " + jul2date(bd + bi)
}
function prtdsm(v) {
    var d = Math.floor(v % 30)
      , z = zdstr.substr(2 * Math.floor(v / 30), 2)
      , m = Math.floor(60 * v % 60)
      , str = "0" + d + z;
    return d > 9 && (str = d + z),
    str += m > 9 ? m : "0" + m,
    str += " " + nakstr.substr(3 * Math.floor(60 * v / 800), 3),
    str += " " + dlstr.substr(2 * Math.floor(60 * v / 800 % 9), 2)
}
function pagehdr() {
    var s = "<!DOCTYPE html><html>";
    return s += "<head><style>.left{ float:left; }</style></head>",
    s += "<body>"
}
function pageftr() {
    var s;
    return "</body></html>"
}
function jul2date(jd) {
    var jy, date = new Date(864e5 * (jd - 2440587.5)), m = date.getUTCMonth() + 1, d = date.getUTCDate(), y;
    return date.getUTCFullYear() + "-" + m + "-" + d
}
var sml = !1
  , plstr = "AsSuMoMaMeJuVeSaRaKe"
  , zdstr = "ArTaGeCnLeViLiScSgCpAqPi"
  , nakstr = "AswBhaKriRohMriArdPunPusAslMagP.PU.PHasChiSwaVisAnuJyeMulP.SU.SShrDhaShaP.BU.BRev"
  , dlist = new Array(81)
  , dashyr = [7, 20, 6, 10, 7, 18, 16, 19, 17]
  , dlnam = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
  , dlstr = "KeVeSuMoMaRaJuSaMe"
  , ns = [100, 86, 16, 2, 2, 18, 10, 178, 2, 208, 16, 352, 100, 270, 196, 352, 280, 270, 192, 178, 280, 86, 196, 2]
  , hp = [162, 18, 162, 32, 162, 46, 162, 61, 162, 75, 162, 90, 162, 104, 162, 118, 162, 133, 40, -6, 96, -6, 40, 9, 96, 9, 40, 23, 96, 23, 68, 37, 68, 51, 0, 0, 6, 44, 6, 58, 6, 72, 6, 87, 6, 101, 6, 116, 6, 130, 6, 144, 0, 0, 66, 114, 66, 128, 66, 143, 66, 157, 66, 172, 66, 186, 66, 200, 66, 215, 0, 0, 6, 224, 6, 238, 6, 252, 6, 267, 6, 281, 6, 296, 6, 310, 6, 324, 0, 0, 68, 290, 68, 304, 40, 318, 96, 318, 40, 332, 96, 332, 40, 346, 96, 346, 0, 0, 162, 204, 162, 218, 162, 232, 162, 247, 162, 261, 162, 276, 162, 290, 162, 304, 0, 0, 250, 290, 250, 304, 220, 318, 276, 318, 220, 332, 276, 332, 220, 346, 276, 346, 0, 0, 316, 224, 316, 238, 316, 252, 316, 267, 316, 281, 316, 296, 316, 310, 316, 324, 0, 0, 246, 114, 246, 128, 246, 143, 246, 157, 246, 172, 246, 186, 246, 200, 246, 215, 0, 0, 316, 44, 316, 58, 316, 72, 316, 87, 316, 101, 316, 116, 316, 130, 316, 144, 0, 0, 220, -6, 276, -6, 220, 9, 276, 9, 220, 23, 276, 23, 250, 37, 250, 51, 0, 0]
  , malSA = [[0, 0, 0, 1, 0, 0, 0, 1, 1], [0, 0, 1, 0, 1, 1, 0, 1, 1], [0, 0, 0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 0, 1, 1, 1], [0, 1, 0, 0, 0, 0, 0, 1, 1], [1, 0, 1, 0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 0, 0, 0, 1, 1], [0, 0, 1, 0, 0, 1, 0, 1, 1], [0, 1, 0, 0, 0, 0, 0, 1, 1], [1, 0, 0, 0, 1, 0, 0, 1, 1], [0, 1, 0, 1, 0, 0, 0, 1, 1], [1, 0, 0, 0, 0, 1, 1, 1, 1]]
  , malUp = [];
