# Front-End Mateo Tutor
- v0.2.5.1 (Última versión única correspondiente a esta rama)

## A tener en cuenta:
Este repositorio corresponde a una rama del proyecto original [https://github.com/learner-model-uach/TutorIntegrado.git]
Y todo el trabajo realizado aquí, es bajo el contexto de la asignatura "Taller de Ingeniería de Software (INFO 282)"


## Documentación original del proyecto MATEO TUTOR INTELIGENTE:
[https://docs.lm.inf.uach.cl/instructions/client-side-template]
En el link anterior está TODA la información relacionada a este sistema, desde las instalaciones necesarias, las librerias que se usaron, las tecnologías utilizadas, información de la API, administración, base de datos, etc...

***************************************************************************************************************
### DESPLIEGUE LOCAL
***************************************************************************************************************

## Pasos necesarios para ejecutar localmente sin usar Docker (WINDOWS)

NOTAS:
- "Next.js" y "React" son FRAMEWORKS de desarrollo (Se ocupan en este proyecto)
- "npm" y "pnpm" son administradores de paquetes para proyectos JavaScript

[*] Para VERIFICAR si tenemos instalado "Node" y "npm", ejecutar en "cmd"
	"node -v" y "npm -v"
	
[*] Para INSTALAR "Node.js" (INCLUYE el "npm")
	Descargar e instalar desde el navegador "https://nodejs.org/en"

[*] Para VERIFICAR si tenemos instalado "pnpm", ejecutar en "cmd"
	"pnpm -v"

[*] Para INSTALAR "pnpm" de manera GLOBAL en el sistema, ejecutar en "cmd"
	"npm install -g pnpm"

[*] Para INSTALAR las dependencias necesarias para el proyecto en la carpeta (node_modules)
	ESTANDO EN la carpeta del proyecto, ejecutar en "cmd":
		"pnpm install"

## Desplegar la APP en LOCAL

[*] ESTANDO En la carpeta del proyecto, ejecutar en "cmd":
		"npm run dev" o "pnpm dev"

[*] Ver la APP en ejecucion:
	http://localhost:3000/

## INSTALAR Subsistema LINUX en Windows (WSL / WSL 2)(WINDOWS)(Necesario para usar Docker)

[1] Buscar e instalar desde la "Microsoft Store", "Windows Subsystem for Linux"
[2] Habilita la característica WSL, Abrir una terminal Powershell como admin y ejecutar:
	"dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart"
[3] Habilita la característica de máquina virtual opcional, en PowerShell ejecutar:
	"dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart"
[4] Reiniciar el PC
[5] Descarga "Ubuntu" desde Microsoft Store
[6] Después de la instalación, abre Ubuntu desde el menú de inicio, y configura el usuario y contraseña
[7] Por último ejecutar:
	a) sudo apt update
	b) sudo apt upgrade

## INSTALAR DOCKER Desktop (WINDOWS)

[*] Verificar que tenemos Docker instalado:
NOTA: En una terminal "WSL" es necesario iniciar primero el docker desktop desde WINDOWS por que si no, nos dirá falsamente que no está instalado

	a) En "cmd", ejecutar:
		"docker -v" o "docker --version"

[*] Instalar Docker:
	a) La virtualización tiene que estar activada (Se ve en el admin de Tareas, apartado de "CPU")
	b) Verificar que tengamos "WSL 2" instalado en windows:
		En "PowerShell" ejecutar:
			"wsl -l -v"
		- Verás una lista de las distribuciones instaladas en WSL, en la columna "VERSION" dirá si estás usando WSL 1 o WSL 2
		Para establecer "WSL 2" como version predeterminada ejecutar:
			wsl --set-default-version 2

	c) Descargar Docker desde "https://docs.docker.com/desktop/install/windows-install/"
	d) Durante la instalación, habilitar el "Soporte para WSL 2"
		- Si tenemos Windows Home, no nos aparecerá la opcion
	e) Al terminar de instalar pedirá que cerremos sesión
	f) Iniciar Docker con la "configuración predeterminada"
	g) Crear una cuenta en "Docker" (OPCIONAL)(Usar la de GitHub)

## Crear IMAGEN Docker del PROYECTO (WINDOWS)

NOTAS:
- ANTES de crear una nueva imagen, verificar si ya hay una existente que corresponda al proyecto
- NO es necesario hacer "gitclone" del proyecto, ya que el propio dockerfile lo hace e instala TODO
- Si tienes "Windows Home", Sólo puedes usar imágenes base y contenedores de y para LINUX

[*] Para INICIAR Docker:
		En WINDOWS simplemente hay que abrir el programa "Docker Desktop"

[*] Para Ver las imagenes existentes, ejecutar en "cmd":
		docker images

[*] Para CREAR la imagen:
	Estando en el MISMO directorio del archivo "Docker", ejecutar en "cmd":
        docker build --no-cache -t mtutor-img:tag .

## Ejecutar un NUEVO CONTAINER basado en una IMAGEN Docker

NOTA:
- ANTES de ejecutar un container, verificar si ya hay alguno en ejecucion que corresponda al proyecto
- Un contenedor es una instancia en ejecución de una imagen
- Al ejecutar una imagen, se ejecuta un nuevo "contenedor" basado en dicha imagen
- Se pueden ejecutar simultaneamente distintos "contenedores" basados en una misma imagen

[*] INICIAR Docker:
		En WINDOWS simplemente hay que abrir el programa "Docker Desktop"

[*] Ejecutar el Container:
	a) Opción 1: Ejecutar en "cmd":
		docker run --name MateoCont -p 3007:3000 mtutor-img:tag

		- 3007 Es el puerto de la maquina host (localhost)
		- 3000 Es el puerto dentro del contenedor Docker

	b) Opción 2: (Mediante la interfaz grafica del programa "Docker Desktop")

[*] Ver la APP en ejecucion:
	http://localhost:3007/

## Comandos útiles DOCKER (WINDOWS / Linux)

	[*] Ver las imagenes EXISTENTES
		docker images

	[*] Ver TODOS los contenedores EXISTENTES
		docker ps -a

	[*] Ver SÓLO los contenedores en EJECUCIÓN
		docker ps

	[*] Iniciar la ejecucion de un contenedor EXISTENTE
		docker start Mateo

	[*] Detener la ejecucion de un contenedor
		docker stop Mateo

	[*] Eliminar un contenedor detenido
		docker rm Mateo


***************************************************************************************************************
### DESPLIEGUE EN SERVER (Server del Curso)
***************************************************************************************************************

## INSTALAR y EJECUTAR VPN de la UACh (Para VER la APP o ENTRAR al server del curso)

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

## VER la APP desplegada en el server

NOTAS:
	- NO es necesario conectarse al server mediante SSH para ver la APP desplegada, solo es necesario estar conectado con la VPN
	- Si al ingresar a la url no aparece NADA, es por que NO hay ningun CONTAINER de la imagen EJECUTANDOSE
	
[*] http://146.83.216.166:5007/

	- La APP está corriendo en el puerto 3007, pero se accede mediante el 5007, ya que esa es la ruta con el certificado
	- Se configuró nginx para que la ruta https://146.83.216.166:5007/ mapee al puerto 3007
	- Como el certificado es autogenerado, Cuando entren les va a decir que el sitio no es confiable, pero ingresan de todas maneras

## INSTALAR SSH (WINDOWS)(Para entrar al server del curso)

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

## Conectarse al SERVER/HOST del curso
NOTAS:
	- ssh nombreServer@ipServidor -p nroDePuerto
	- Para conectarse al server NO es necesario especificar un puerto
	- En los puertos 3007 y 4007 se despliega la APP

[*] En "cmd" ejecutar:
		ssh grupo7@146.*******
		password: *****

## Crear IMAGEN Docker del PROYECTO
NOTAS:
	- ANTES de crear una nueva imagen, verificar si ya hay una existente que corresponda al proyecto
	- NO es necesario hacer "gitclone" del proyecto, ya que el propio dockerfile lo hace e instala TODO

	[*] Para Ver las imagenes existentes, ejecutar en "bash":
		sudo docker images

	[*] Para crear una nueva imagen:
		Estando en el MISMO directorio del archivo "Docker", ejecutar en la terminal:
			sudo docker build --no-cache -t mtutor-img:tag .

## Ejecutar un NUEVO CONTAINER basado en una IMAGEN Docker
NOTA:
	- ANTES de ejecutar un container, verificar si ya hay alguno en ejecucion que corresponda al proyecto
	- Un contenedor es una instancia en ejecución de una imagen
	- Al ejecutar una imagen, se ejecuta un nuevo "contenedor" basado en dicha imagen
	- Se pueden ejecutar simultaneamente distintos "contenedores" basados en una misma imagen

[*] Ejecutar en la terminal:
	sudo docker run --name MTutor-app -p 3007:3000 mtutor-img:tag

	- 3007 Es el puerto de la maquina host (server)
	- 3000 Es el puerto dentro del contenedor Docker

[*] Ver la APP en ejecucion:
	http://146.83.216.166:5007/

## Comandos útiles DOCKER

	[*] Ver las imagenes EXISTENTES
		sudo docker images

	[*] Borrar una imagen EXISTENTE
		sudo docker rmi mtutor-img:tag

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
