# LITHEUM Coruña

The configuration present on this folder allows you to run LITHEUM specifically for the city of A Coruña using Docker Compose. This setup simplifies the application run process, enabling you to start all necessary services with a single command.


## Running the Application
To launch the application using Docker Compose, execute the following command in your terminal:
```
docker compose up -d --build
```
This command will build the Docker images and start the containers in detached mode.

With the default configuration, the application will be available at the following URL [litheum-coruña](http://localhost:1234/coruna/demo).