var liaWithEditOrDeleteOnClick = function (Receipt, callback) {
	var $ReceiptListItem = $("<li>").text(Receipt.description),
		$ReceiptEditLink = $("<a>").attr("href", "Receipts/" + Receipt._id),
		$ReceiptRemoveLink = $("<a>").attr("href", "Receipts/" + Receipt._id);

	$ReceiptEditLink.addClass("linkEdit");
	$ReceiptRemoveLink.addClass("linkRemove");



	if (Receipt.status === 'В желаемом') {
		$ReceiptEditLink.text("Арендовать");
		$ReceiptEditLink.on("click", function() {

			var newDescription = Receipt.description + "[В аренде]";

			if (newDescription !== null && newDescription.trim() !== "") {
				$.ajax({
					"url": "/Receipts/" + Receipt._id,
					"type": "PUT",
					"data": { "description": newDescription, "status": 'В аренде' },
				}).done(function (responde) {
					Receipt.status = 'В аренде';
					callback();
				}).fail(function (err) {
					console.log("Произошла ошибка: " + err);
				});
			}

			return false;
		});	
		$ReceiptListItem.append($ReceiptEditLink);
	}
	else {
		$ReceiptRemoveLink.text("Удалить из списка");
		$ReceiptRemoveLink.on("click", function () {
			$.ajax({
				url: "/Receipts/" + Receipt._id,
				type: "DELETE"
			}).done(function (responde) {
				callback();
			}).fail(function (err) {
				console.log("error on delete 'Receipt'!");
			});
			return false;
		});
		$ReceiptListItem.append($ReceiptRemoveLink);
	}

	return $ReceiptListItem;
}

var main = function (ReceiptObjects) {
	"use strict";
	// создание пустого массива с вкладками
	var tabs = [];
	// добавляем вкладку История покупок
	tabs.push({
		"name": "История аренды",
		// создаем функцию content
		// так, что она принимает обратный вызов
		"content": function(callback) {
			$.getJSON("Receipts.json", function (ReceiptObjects) {
				var $content = $("<ul>");
				for (var i = ReceiptObjects.length-1; i>=0; i--) {
					var $ReceiptListItem = liaWithEditOrDeleteOnClick(ReceiptObjects[i], function() {
						$(".tabs a:first-child span").trigger("click");
					});
					$content.append($ReceiptListItem);
				}
				callback(null, $content);
			}).fail(function (jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});

	// добавляем вкладку Список желаемого
	tabs.push({
		"name": "Список желаемого",
		"content": function(callback) {
			$.getJSON("Receipts.json", function (ReceiptObjects) {
				var $content, i;
				$content = $("<ul>");
				for (i = 0; i < ReceiptObjects.length; i++) {
					if (ReceiptObjects[i].status === 'В желаемом') {
						var $ReceiptListItem = liaWithEditOrDeleteOnClick(ReceiptObjects[i], function() {
							$(".tabs a:nth-child(2) span").trigger("click");
						});
						$content.append($ReceiptListItem);
					}
				}
				callback(null, $content);
			}).fail(function(jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});

	// создаем вкладку Добавить в желаемое
	tabs.push({
		"name": "Добавить в желаемое",
		"content":function () {
			$.get("Receipts.json", function (ReceiptObjects) {	
				// создание $content для Добавить 
				var $place = $("<h3>").text("Введите вид носителя и название: "),
					$input = $("<input>").addClass("description"), 
					$button = $("<button>").text("Добавить"),
					$content1 = $("<ul>");

				$content1.append($input);
				$("main .content").append($place);
				$("main .content").append($content1);
				$("main .content").append($button); 
				
				function btnfunc() {
					var price = Math.floor(Math.random() * (500 - 100)) + 100;
					console.log(price);
					var description = ('Название: ' + $input.val() + ' ; Цена: ' + price +'руб '),
						// создаем новый элемент списка задач
						newReceipt = {"description":description, "status": 'В желаемом'};
					$.post("Receipts", newReceipt, function(result) {
						$input.val("");
						$(".tabs a:first-child span").trigger("click");
					});
				}
				$button.on("click", function() {
					btnfunc();
				});
				$input.on('keydown',function(e){
					if (e.which === 13) {
						btnfunc();
					}
				});
			});
		}
	});

	tabs.push ({
		"name": "Выйти",
		"content":function() {
			// $(".title").trigger("click");
			document.location.href = "/index.html";
		}
	});

	tabs.forEach(function (tab) {
		var $aElement = $("<a>").attr("href",""),
			$spanElement = $("<span>").text(tab.name);
		$aElement.append($spanElement);
		$("main .tabs").append($aElement);

		$spanElement.on("click", function () {
			var $content;
			$(".tabs a span").removeClass("active");
			$spanElement.addClass("active");
			$("main .content").empty();
			tab.content(function (err, $content) {
				if (err !== null) {
					alert ("Возникла проблема при обработке запроса: " + err);
				} else {
					$("main .content").append($content);
				}
			});
			return false;
		});
	});

	$(".tabs a:first-child span").trigger("click");
}

$(document).ready(function() {
	$.getJSON("Receipts.json", function (ReceiptObjects) {
		main(ReceiptObjects);
	});
});
