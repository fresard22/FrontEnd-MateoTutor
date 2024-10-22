
** ESTE README ES SÓLO PARA VER O DESPLEGAR LA APP EN EL SERVER DEL CURSO **

***************************************************************************************************************
INSTALAR y EJECUTAR VPN de la UACh
(Para VER la APP o ENTRAR al server del curso)
***************************************************************************************************************

[1] Ingresar a https://www.fortinet.com/support/product-downloads
[2] Seleccionar "FortiClient VPN Only"
[3] Seleccionar Windows/Downloads
[4] Ejecutar el archivo descargado y esperar a que termine la instalación

[5] Ejecutar acceso directo creado en el escritorio
[6] Ingresar a configurar VPN
[7] Ingresar los siguientes datos:
    Nombre de Conexión: VPN UACh
    Descripción: Conexión UACh
    Gateway Remoto: vpn.uach.cl
    Método de Autenticación: Clave pre-compartida
    Clave pre-compartida: uaustral.,2016
[8] Presionar el botón guardar

[9] Ingresar con credenciales de "infoalumnos" o "siveducmd"
    - Así debe ingresarse el Rut: 20123456-7

[*] Para desconectar la VPN:
    a) buscar el icono de FortiClient en la bandeja de apps ocultas (de la barra inferior)
    b) click derecho y darle a "Desconectar VPN UACh"

***************************************************************************************************************
VER la APP desplegada en el server
***************************************************************************************************************
NOTAS:
	- NO es necesario conectarse al server mediante SSH para ver la APP desplegada, solo es necesario estar conectado con la VPN
	- Si al ingresar a la url no aparece NADA, es por que NO hay ningun CONTAINER de la imagen EJECUTANDOSE
	
[*] http://146.83.216.166:5007/

	- La APP está corriendo en el puerto 3007, pero se accede mediante el 5007, ya que esa es la ruta con el certificado
	- Seba Configuró nginx para que la ruta https://146.83.216.166:5007/ mapee al puerto 3007
	- Como el certificado es autogenerado, Cuando entren les va a decir que el sitio no es confiable, pero ingresan de todas maneras

***************************************************************************************************************
INSTALAR SSH (WINDOWS)
(Para entrar al server del curso)
***************************************************************************************************************

[*] Verificar si tenemos instalado SSH:
	a) En "cmd" escribir "ssh" y presionar enter
	b) Si SSH está instalado verás algo como: "usage: ssh [-46AaCfGgKkMN ..."
	c) Si NO está instalado verás algo como: "ssh is not recognized as ..."

[*] Instalar el CLIENTE SSH:
	a) Configuracion -> Sistema -> Características opcionales -> Agregar una característica opcional
	b) En el cuadro de búsqueda, escribe "Cliente de OpenSSH"
	c) Seleccionalo y haz clic en "Siguiente" y luego en "Agregar"

[*] Instalar el SERVIDOR SSH (Para recibir conexiones SSH)(OPCIONAL):
	a) Configuracion -> Sistema -> Características opcionales -> Agregar una característica opcional
	b) En el cuadro de búsqueda, escribe "Servidor de OpenSSH"
	c) Seleccionalo y haz clic en "Siguiente" y luego en "Agregar"

***************************************************************************************************************
Conectarse al SERVER/HOST del curso
***************************************************************************************************************
NOTAS:
	- ssh nombreServer@ipServidor -p nroDePuerto
	- Para conectarse al server NO es necesario especificar un puerto
	- En los puertos 3007 y 4007 se despliega la APP

[*] En "cmd" ejecutar:
		ssh grupo7@146.83.216.166
		password: 8Go9hjhP

***************************************************************************************************************
Crear IMAGEN Docker del PROYECTO
***************************************************************************************************************
NOTAS:
	- ANTES de crear una nueva imagen, verificar si ya hay una existente que corresponda al proyecto
	- NO es necesario hacer "gitclone" del proyecto, ya que el propio dockerfile lo hace e instala TODO

	[*] Para Ver las imagenes existentes, ejecutar en "bash":
		docker images

	[*] Para crear una nueva imagen:
		Estando en el MISMO directorio del archivo "Docker", ejecutar en la terminal:
			docker build -t mateotutorimg . cmd

***************************************************************************************************************
Ejecutar un NUEVO CONTAINER basado en una IMAGEN Docker
***************************************************************************************************************
NOTA:
	- ANTES de ejecutar un container, verificar si ya hay alguno en ejecucion que corresponda al proyecto
	- Un contenedor es una instancia en ejecución de una imagen
	- Al ejecutar una imagen, se ejecuta un nuevo "contenedor" basado en dicha imagen
	- Se pueden ejecutar simultaneamente distintos "contenedores" basados en una misma imagen

[*] Ejecutar en la terminal:
	docker run --name MateoCont -p 3007:3000 mateotutorimg

	- 3007 Es el puerto de la maquina host (server)
	- 3000 Es el puerto dentro del contenedor Docker

[*] Ver la APP en ejecucion:
	http://146.83.216.166:5007/

***************************************************************************************************************
Comandos útiles DOCKER
***************************************************************************************************************

	[*] Ver las imagenes EXISTENTES
		sudo docker images

	[*] Ver TODOS los contenedores EXISTENTES
		sudo docker ps -a

	[*] Ver SÓLO los contenedores en EJECUCIÓN
		sudo docker ps

	[*] Iniciar la ejecucion de un contenedor EXISTENTE
		sudo docker start Mateo

	[*] Detener la ejecucion de un contenedor
		sudo docker stop Mateo

	[*] Eliminar un contenedor detenido
		sudo docker rm Mateo

***************************************************************************************************************
CREDENCIALES para el LOGIN en MateoTutor
***************************************************************************************************************

nicole.navarro@alumnos.uach.cl
123456