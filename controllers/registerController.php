<?php 

	// crea el objeto con la vista
	$tpl = new Kiwi("register");

	// carga la vista
	$tpl->loadTPL();

	// crea el array con variables a reemplazar en la vista
	$vars = ["MSG_REGISTER_ERROR" => ""];

	// si se presiono el botón del formulario
	if(isset($_POST['btn_register'])){

		// crea un usuario
		$usuario = new User();

		// quitamos del array de post el boton
		unset($_POST['btn_register']);

		// procede a intentar el registro
		$response = $usuario->register($_POST);

		// el registro fue valido
		if($response["errno"]==200 || $response["errno"]==201){

			// se pasa el objeto de usuario a Session
			$_SESSION["estacion"]['user'] = $usuario;

			// redirecciona al perfil
			header("Location: perfil");
		}

		// Si hubo cualquier error se carga el mensaje de error de la vista
		$vars = ["MSG_REGISTER_ERROR" => $response["error"]];
	}

	// se pasan las variables a la vista
	$tpl->setVarsTPL($vars);

	// imprime en pantalla la página
	$tpl->printTPL();


 ?>