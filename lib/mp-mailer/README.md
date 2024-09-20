MP-Mailer
=========
Proyecto simple para el envio de emails desde PHP, utiliza la libreria PHPMailer la cual esta incluida.

Se utiliza para su desarollo y pruebas:

- HTML.
- CSS.
- Javascript.
- PHP.
- PHPMailer.

Temas que se aplican
====================

- Manejo correcto de etiquetas HTML5.
- Uso de reglas CSS3.
- Lógica de programación en PHP y buenas prácticas.
- Diseño de formularios.
- Uso de libreria PHPMailer.

Uso
===

- Colocar el proyecto dentro del servidor.
- Abrir un navegador web, colocar la url del proyecto junto al archivo "demo-send.html", ejemplo: localhost/mp-mailer/demo-send.html
- Abrir la consola de desarrollador del navegador web, ir a la pestaña "consola", colocar en las cajas de texto los datos solicitados, luego presionar el botón "Enviar Mail", se debe ver en la consola lo siguiente: Object { errno: 1, error: "No se pudo enviar." }.
- Abrir con tu editor de código preferido el archivo "credenciales.php", reemplazar el valor de las constantes "REMITENTE/NOMBRE/PASSWORD" con los datos correspondientes a la cuenta "gmail" que se utilizará para enviar los emails, guardar.
- Volver al navegador web, volver a probar el envio de email, volverá a mostrar error pero ahora debemos ir a la cuenta de gmail para habilitar el acceso de aplicaciones de terceros a ella.
- Una vez que se haya habilitado el acceso volver a probar el envio de email, ahora debería ver en la consola que se envío correctamente.

* Para mostrar un aviso en el DOM podes utilizar la respuesta que genera sendMail desde "funciones.js".

Autor
=====
- Matias Baez
- @matt_profe
- mbcorp.matias@gmail.com
- https://mattprofe.com.ar
