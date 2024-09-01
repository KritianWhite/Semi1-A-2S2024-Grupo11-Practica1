# Manual técnico

## Objetivos

* Crear una guía acerca de como se configuran y se administran los servicios de AWS para implementar una solución óptima.

* Describir la arquitectura utilizada para el entorno de desarrollo, la aplicación web, la configuración e integración con los servicios AWS.

* Mostrar instrucciones paso a paso de como replicar esta solución desde la creación de los usuarios IAM hasta la configuración de servicios.

## Arquitectura del proyecto

* Descripción: Esta arquitectura está diseñada para manejar solicitudes simultáneamente, distribuyendo el tráfico entre los servidores backend, asegurando que la aplicación web pueda atender a varios usuarios al mismo tiempo y el rendimiento sea óptimo. Esta arquitectura utiliza servicios de AWS para garantizar alta disponibilidad, escalabilidad y seguridad.

![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/arquitectura.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/arquitectura.jpg)

La arquitectura consiste en varias capas, mediante el siguiente flujo con la solicitud desde el cliente hasta la base de datos o almacenamiento en la nube.

* El cliente reproduce una canción(envía solicitud al frontend).
* Reproductor(frontend) recibe la solicitud la envía al balanceador de carga.
* El balanceador de carga recibe la solicitud y la distribuye a uno de los servidores disponibles.
* Backend procesa la solicitud y obtiene datos del bucket S3 o la base de datos para consulta u obtención de datos.
* El backend envía la respuesta al balanceador de carga.
* El balanceador dirige la respuesta al frontend.
* Reproductor(frontend) muestra la cancion o respuesta solicitada por el cliente.

### Frontend
    npm i
    npm start


### Backend

    backend-node:
    npm i
    npm run dev

    backend-python:
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    flask run --debug

    ENVS:

    .env nodejs:
    PORT=8000

    .env python:
    PORT=5000

## Diagrama Entidad Relación

* Descripción: Este Diagrama representa de forma gráfica las principales entidades dentro del sistema y las relaciones entre ellas. Este modelo se utilizó para estructurar y organizar la base de datos, permitiendo comprender como interactúan los datos y se relacionan. 

![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/er.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/er.jpg)

El diagrama adjunto muestra las principales entidades del sistema y cómo están relacionadas. 

Entidades:

* **Usuario** representa un perfil único y puede tener un rol diferente.
* **Cancion** representa la disponibilidad en el reproductor multimedia y puede estar asociada a un lista de favoritos o una playlist personalizada.
* **Playlist** representa las listas de reproducción personalizadas por los usuarios.

Relaciones:

* Las líneas que conectan las entidades indican las relaciones, con la cardinalidad especifica (1 - 1:N). 
* Las llaves primarias se destacan en negrita y el distintivo **PK**.
* Las claves foráneas se destacan por la relación (1:N) en cada entidad donde corresponda. 

## Usuarios IAM y políticas asociadas

* **Administrador-Seminario1**: Este usuario tiene acceso total a todos los recursos y servicios de AWS permite una gestión completa del entorno.
* **Política asociada**: AdministratorAccess

![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/admin1.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/admin1.jpg)

* S3
    * **Usuario-S3**: El usuario S3 esta dedicado a la gestion y acceso completo a los buckets y objetos almacenados en Amazon S3
    * **Política asociada**: AmazonS3FullAccess

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/user_S31.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/user_S31.jpg)

* EC2
    *  **Backend-node**: El usuario backend-node tiene acceso completo a los recursos de EC2 es utilizado principalmente para lanzar instancias EC2 que ejecuten un backend en este caso un backend node .js.
    * **Política asociada**: AmazonEC2FullAccess

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/user_node1.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/user_node1.jpg)

    * **Backend-python**: El usuario backend-python tiene acceso completo a los recursos de EC2 es utilizado principalmente para lanzar instancias EC2 que ejecuten un backend en este caso un backend python.
    * **Política asociada**: AmazonEC2FullAccess

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/user_python1.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/user_python1.jpg)

* Balanceador de carga
    * **Usuario-CBL**: Este usuario es se encarga de gestionar y configurar los balanceadores de carga (Elastic Load Balancers) en AWS.
    * **Política asociada**: ElasticLoadBalancingFullAccess

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/user_CBL1.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/user_CBL1.jpg)

* RDS
    * **Usuario-RDS**: Es el usuario encargado de la gestión total de las bases de datos relacionales en Amazon RDS en este caso en la creación de una base de datos MYSQL.
    * **Política asociada**: AmazonRDSFullAccess

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/user_RDS1.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/user_RDS1.jpg)

## Configuración de cada servicio


### S3

* Descripción: Amazon S3 (Simple Storage Service) es un servicio de almacenamiento en la nube que permite guardar y recuperar cualquier cantidad de datos en cualquier momento y desde cualquier lugar.
* Configuración: Definir nombre de bucket
    * **sound-stream-semi1-seccion-g11 (Sitio web estático)**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/S30.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/S30.jpg)

    * **multimedia-semi1-seccion-g11 (Multimedia)**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/S300.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/S300.jpg)
    
    * **Bucket público**

        ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/S31.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/S31.jpg)

        ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/S32.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/S32.jpg)

### EC2

* Descripción: Amazon EC2 (Elastic Compute Cloud) es un servicio que proporciona capacidad de cómputo en la nube de manera escalable. Permite lanzar y administrar instancias de servidores virtuales, ofreciendo control de infraestructura, desde selección del sistema operativo hasta la configuración de la red, facilitando la ejecución de aplicaciones y servicios en la nube.
* Configuración: 
    * **backend-node**

        **Definir nombre**

        ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/node0.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/node0.jpg)

        **Definir AMI**

        ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/node1.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/node1.jpg)

        **Crear llaves de acceso SSH**

        ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/nodekey.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/nodekey.jpg)

        **Seleccionar llaves de acceso**

        ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/node2.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/node2.jpg)

        **Seleccionar grupo de seguridad**

        ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/node3.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/node3.jpg)

    * **backend-python**

        **Definir nombre**

        ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/python0.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/python0.jpg)

        **Definir AMI**

        ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/python1.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/python1.jpg)

        **Crear llaves de acceso SSH**

        ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/pythonkey.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/pythonkey.jpg)

        **Seleccionar llaves de acceso y grupo de seguridad**

        ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/python2.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/python2.jpg)        

### Balanceador de carga

* Descripción: El Balanceador de Carga (Elastic Load Balancer - ELB) en AWS distribuye automáticamente el tráfico de red o de aplicación entrante entre múltiples instancias de EC2, mejorando la disponibilidad y tolerancia a fallos de las aplicaciones.
* Configuración: 
    **Definir tipo**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/load0.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/load0.jpg)

    **Definir nombre**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/load1.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/load1.jpg)

    **Seleccionar grupo de seguridad y definir agente de escucha**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/load2.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/load2.jpg)

    **Comprobación de estado**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/load3.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/load3.jpg)

    **Seleccionar instancias**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/load4.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/load4.jpg)

    **Verificar resumen y crear**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/load5.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/load5.jpg)


### RDS

* Descripción: Amazon RDS (Relational Database Service) es un servicio gestionado que facilita la configuración, operación y escalado de bases de datos relacionales en la nube. Soporta varias bases de datos como MySQL, PostgreSQL, Oracle, y SQL Server.
* Configuración: 
    **Seleccionar método de creación y motor**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS0.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS0.jpg) 

    **Seleccionar versión del motor de base de datos**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS1.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS1.jpg) 

    **Seleccionar plantilla**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS2.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS2.jpg) 

    **Definir identificador de la instancia RDS y credenciales**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS3.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS3.jpg) 

    **Seleccionar clase de instancia**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS4.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS4.jpg) 

    **Definir tipo de almacenamiento y capacidad**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS5.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS5.jpg) 

    **Seleccionar grupo de seguridad**

    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS6.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS6.jpg) 

    **Seleccionar autenticación a la base de datos**
    
    ![https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS7.jpg](https://raw.githubusercontent.com/fernandofalla/Img/main/semi1p1/RDS7.jpg) 

## Conclusiones

* Este manual técnico proporciona una guía completa sobre la arquitectura y configuración de un sistema utilizando servicios AWS, diseñado para soportar una aplicación web en línea. Se proporciona una descripción detallada de cada servicio, desde el almacenamiento en S3 hasta la gestión de instancias EC2, asegurando que cualquier desarrollador o administrador pueda comprender, implementar y mantener este entorno. La integración de servicios clave como el balanceador de carga, RDS, y S3 garantiza una arquitectura escalable.

* El uso de Amazon S3 para almacenamiento, EC2 para procesamiento y RDS para gestión y almacenamiento de datos, permite manejar múltiples solicitudes eficientemente y manteniendo cierta seguridad en los datos. El balanceador de carga es importante para la distribución del tráfico de solicitudes, asegurando estabilidad en la aplicación web. Las configuraciones y políticas detalladas en este manual, permiten un entorno AWS seguro, util para atender a futuras necesidades del proyecto.