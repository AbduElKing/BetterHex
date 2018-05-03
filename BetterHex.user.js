// ==UserScript==
// @name         Better HEx by Logfro
// @namespace    https://logfro.de/
// @version      0.58
// @description  Better HEx adds useful functions to the legacy hacker experience
// @author       Logfro
// @match        *://*.hackerexperience.com/*
// @updateURL    https://gitcdn.xyz/repo/Logfro/BetterHex/master/BetterHex.meta.js
// @downloadURL  https://gitcdn.xyz/repo/Logfro/BetterHex/master/BetterHex.user.js
// @grant        none
// ==/UserScript==

// BetterIPChecker Include
$.getScript("https://gitcdn.xyz/repo/R34P3R5/BetterHex/master/BetterIPChecker.js");

(function() {
    'use strict';
    function clearLogs(){
            var elm = document.getElementsByName("log")[0];
            var x = elm.value;
            var ownIP = document.getElementsByClassName("header-ip-show")[0].innerHTML;
            var button = $("input.btn-inverse").get(1);
			if(x.search(ownIP) == -1){
				alert("Your IP ("+ownIP+") isnt present in this log!");
				return false;
			}
            x = x.replaceAll(ownIP,"");
            elm.value = x;
            button.click();
    }
    String.prototype.replaceAll = function(search, replacement) {
    var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

	function submitBuyForm(times){
		if(times.length < 1){
			alert("You need to type in a number!");
			return false;
		}
		if(isNaN(times)){
			alert("Not a number!");
			return false;
		}
		var x = 0;
        var val = setInterval(function(){
            if(x == times){
                clearInterval(val);
            } else {
                x++;
                $("form")[1].submit();
            }
        },300);
	}

	function openPopUp(url, name){
		var w = window.open(url, name, "width=600,height=400,status=yes,scrollbars=yes,resizable=yes");
		return w;
	}
	
	function clearOwnLogs(){
		$.post("https://legacy.hackerexperience.com/logEdit", { id: "1", log:""}, function(result){
			var w = openPopUp("https://legacy.hackerexperience.com/","logEdit");
			w.document.open();
			w.document.write(result);
			w.document.close();
			var realConfirm=w.confirm;
				w.confirm=function(){
				w.confirm=realConfirm;
				return true;
			};
			var seconds;
			$(w.document).ready(function(){
				setTimeout(function(){
					var a = w.$(".elapsed")[0].innerText;
					a = a.replace("h","");
					a = a.replace("m","");
					a = a.replace("s","");
					a = a.split(':');
					seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]) * 1000 + 1000;
					console.log(seconds);
					setTimeout(function(){
						w.close();
					},seconds);
				},500);
			});
		});
	}
	function addBarBtn(name, btnId, spanId){
		var parentElem = document.getElementsByClassName("btn-group")[0];
		var li = document.createElement("li");
		var a = document.createElement("a");
		var span = document.createElement("span");
		$(li).addClass("btn btn-inverse");
		li.id = btnId;
		$(li).addClass("text");
		span.id = spanId;
		span.innerText = name;
		a.appendChild(span);
		li.appendChild(a);
		parentElem.insertBefore(li, parentElem.children[1]);
	}

	function addNavButton(name, id){
		var li = document.createElement("li");
		var a = document.createElement("a");
		var span = document.createElement("span");
		var text = document.createTextNode(name);
		span.className = "hide-phone";
		a.id = id;
		li.appendChild(a);
		a.appendChild(span);
		span.appendChild(text);
		li.className = "link";
		document.getElementsByClassName("nav nav-tabs")[0].appendChild(li);
	}
    function loadLogFunc(){
		addNavButton("Remove your entries","LogfroLogClickID");
		$(document).ready(function(){
			$("#LogfroLogClickID").on("click", function(){clearLogs();});
        });
    }
	
	function loadUpgradeCPUOfServer(){
		addNavButton("Auto Upgrade CPU","LogfroHWAutoUpgradeCPU");
		$(document).ready(function(){
			$("#LogfroHWAutoUpgradeCPU").on("click",function(){
				if(localStorage.getItem("running") != "true"){
                    localStorage.setItem("running","true");
                    localStorage.setItem("type","cpu");
					upgradeCPU();
                }
			});
		});
	}
	
	function loadUpgradeHDDOfServer(){
		addNavButton("Auto Upgrade HDD","LogfroHWAutoUpgradeHDD");
		$(document).ready(function(){
			$("#LogfroHWAutoUpgradeHDD").on("click",function(){
                if(localStorage.getItem("running") != "true"){
                	localStorage.setItem("running","true");
                    localStorage.setItem("type","hdd");
                    upgradeHDD();
                }
			});
		});
	}
	
	function loadClearOwnLogBtn(){
		$(document).ready(function(){
			addBarBtn("Clear own logs","LogfroClearOwnLogsBtn","LogfroClearOwnLogsBtnSpan");
			$("#LogfroClearOwnLogsBtn").on("click", function(){clearOwnLogs();});
        });
	}

	function loadHDDBuyBtn(){
		$(document).ready(function(){
			var btn = document.createElement("input");
			var input = document.createElement("input");
			input.type = "text";
			input.id = "LogfroHDDBuyBtnTimes";
			input.style = "margin: 10px;";
			input.placeholder = "How many times?";
			btn.className = "btn btn-success";
			btn.id = "LogfroHDDBuyBtn";
			btn.value = "Buy x times";
			btn.type = "button";
            $("#buy .modal-footer form")[0].appendChild(btn);
            $("#buy .modal-footer form")[0].appendChild(input);
			$("#LogfroHDDBuyBtn").on("click", function(){submitBuyForm($("#LogfroHDDBuyBtnTimes")[0].value);});
		});
	}

    function loadServerBuyBtn(){
        $(document).ready(function(){
            var btn = document.createElement("input");
            var input = document.createElement("input");
            input.type = "text";
            input.id = "LogfroServerBuyBtnTimes";
            input.style = "margin: 10px;";
            input.placeholder = "How many times?";
            btn.className = "btn btn-success";
            btn.id = "LogfroServerBuyBtn";
            btn.value = "Buy x times";
            btn.type = "button";
            $("#buy .modal-footer form")[0].appendChild(btn);
            $("#buy .modal-footer form")[0].appendChild(input);
            $("#LogfroServerBuyBtn").on("click", function(){submitBuyForm($("#LogfroServerBuyBtnTimes")[0].value);});
        });
    }

	loadClearOwnLogBtn();
	$(document).ready(function(){
		switch(window.location.href){
			case "https://legacy.hackerexperience.com/internet?view=logs":
				if(document.getElementsByName("log").length > 0){
					loadLogFunc();
				}
				break;
			case "https://legacy.hackerexperience.com/internet":
				if(document.getElementsByName("log").length > 0){
					loadLogFunc();
				}
				break;
			case "https://legacy.hackerexperience.com/internet?ip=7.28.21.234":
				if($(".alert-success").length > 1 && $("#btc-login").length < 1 && $(".alert-success")[0].innerText.indexOf("You logged in to the address") > -1){
					clearOwnLogs();
				}
				break;
			case "https://legacy.hackerexperience.com/list?action=collect&show=last":
				clearOwnLogs();
				break;
			default:
				break;

		}

		if(window.location.href.indexOf("https://legacy.hackerexperience.com/hardware?opt=xhd&acc=") > -1){
            loadHDDBuyBtn();
		}

        if(window.location.href.indexOf("https://legacy.hackerexperience.com/hardware?opt=buy&acc=") > -1){
            loadServerBuyBtn();
        }

		var realConfirm=window.confirm;
			window.confirm=function(){
			window.confirm=realConfirm;
			return true;
		};
    });
})();
