var main = function (UsersObjects) {
	var asdf = 0;
	"use strict";
	var $input = $("<input placeholder='000000'>").addClass("username"),
		$butRegister = $("<button>").text("Зарегистрироваться"),
		$butLogin = $("<button>").text("Войти"),
		$butDestroy = $("<button>").text("Удалить из системы");

	$butRegister.on("click", function() {
		var username = $input.val();

		var example = /^\d{6}(?<!000)$/ui;
		console.log(username);
		var check = example.test(username); // false
		console.log(check);

		if (check) {
			if (username !== null && username.trim() !== "") {
				var newUser = {"username": username};
				$.post("users", newUser, function(result) {
					console.log(result);
					// отправляем на клиент
					UsersObjects.push(newUser);
				}).done(function(responde) {
					console.log(responde);
					alert('Аккаунт успешно создан!');
					$butLogin.trigger("click");
				}).fail(function(jqXHR, textStatus, error) {
					console.log(error);
					if (jqXHR.status === 501) {
						alert("Такой номер уже зарегистрирован в системе!\nВведите другой номер ");
					} else {					
						alert("Произошла ошибка!\n"+jqXHR.status + " " + jqXHR.textStatus);	
					}
				});
			}
		}
		else {
			alert('Номер карты должен состоять из 6 цифр!\nПовторите ввод')
			$input.val("");
		}
	});

	$butLogin.on("click", function() {
		var username = $input.val();
		if (username !== null && username.trim() !== "") {
			var loginUser = {"username": username};

			alert("Вход выполнен!");
			
			$.ajax({
				'url': '/users/'+username,
				'type': 'GET'
			}).done(function(responde) {
				window.location.replace('users/' + username + '/');
			}).fail(function(jqXHR, textStatus, error) {
				console.log(error);
				alert("Произошла ошибка!\n"+jqXHR.status + " " + jqXHR.textStatus);	
			});
		}
	});

	$butDestroy.on("click", function() {
		if ($input.val() !== "") {
			if ($input.val() !== null && $input.val().trim() !== "") {
				var username = $input.val();
				if (confirm("Вы уверены, что хотете удалить профиль " + username + "?")) {
					$.ajax({
						'url': '/users/'+username,
						'type': 'DELETE',
					}).done(function(responde) {
						console.log(responde);
						$input.val("");
						alert('Ваш профиль успешно удален');
					}).fail(function(jqXHR, textStatus, error) {
						console.log(error);
						alert("Произошла ошибка!\n"+jqXHR.status + " " + jqXHR.textStatus);	
					});
				}
			}
		}
	});

	$("main .authorization").append($input);
	$("main .authorization").append($butDestroy);
	$("main .authorization").append($butLogin);
	$("main .authorization").append($butRegister);

}

$(document).ready(function() {
	sessionStorage.setItem('key', 'value');
	$.getJSON("users.json", function (UsersObjects) {
		main(UsersObjects);
	});
});