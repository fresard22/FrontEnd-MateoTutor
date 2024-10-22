
** ESTE README ES SÓLO PARA DESPLEGAR LA APP EN LOCAL **

***************************************************************************************************************
INSTALACIÓN de archivos necesarios para ejecutar CORRECTAMENTE el PROYECTO en LOCAL
(WINDOWS)(SIN USAR DOCKER)
***************************************************************************************************************
NOTAS:
- "Next.js" y "React" son FRAMEWORKS de desarrollo (ocuparlos es OPCIONAL)
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

***************************************************************************************************************
Desplegar la APP en LOCAL
***************************************************************************************************************

[*] ESTANDO En la carpeta del proyecto, ejecutar en "cmd":
		"npm run dev" o "pnpm dev"

[*] Ver la APP en ejecucion:
	http://localhost:3000/

***************************************************************************************************************
CREDENCIALES para el LOGIN en MateoTutor
***************************************************************************************************************

nicole.navarro@alumnos.uach.cl
123456

***************************************************************************************************************
INSTALAR Subsistema LINUX en Windows (WSL / WSL 2)
(WINDOWS)(Necesario para usar Docker)
***************************************************************************************************************

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

***************************************************************************************************************
INSTALAR DOCKER Desktop (WINDOWS)
***************************************************************************************************************

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

***************************************************************************************************************
Crear IMAGEN Docker del PROYECTO
(WINDOWS)
***************************************************************************************************************
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
		docker build -t mateotutorimg .

***************************************************************************************************************
Ejecutar un NUEVO CONTAINER basado en una IMAGEN Docker
***************************************************************************************************************
NOTA:
- ANTES de ejecutar un container, verificar si ya hay alguno en ejecucion que corresponda al proyecto
- Un contenedor es una instancia en ejecución de una imagen
- Al ejecutar una imagen, se ejecuta un nuevo "contenedor" basado en dicha imagen
- Se pueden ejecutar simultaneamente distintos "contenedores" basados en una misma imagen

[*] INICIAR Docker:
		En WINDOWS simplemente hay que abrir el programa "Docker Desktop"

[*] Ejecutar el Container:
	a) Opción 1: Ejecutar en "cmd":
		docker run --name MateoCont -p 3007:3000 mateotutorimg

		- 3007 Es el puerto de la maquina host (localhost)
		- 3000 Es el puerto dentro del contenedor Docker

	b) Opción 2: (Mediante la interfaz grafica del programa "Docker Desktop")

[*] Ver la APP en ejecucion:
	http://localhost:3007/

***************************************************************************************************************
Comandos útiles DOCKER
(WINDOWS / Linux)
***************************************************************************************************************

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