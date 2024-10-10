# LITHEUM Java Server

This is the backend service responsible for managing data and providing the necessary APIs to serve energy model information to the web platform. It handles database operations and serves data to the frontend components. The server is built using Java 17, so you must ensure that Java 17 is installed and properly configured on your machine before running the server.

## Database Connection

To connect the Java server to your PostgreSQL database:
1. Create a new PostgreSQL database where the server will store and retrieve data. Make sure that PostGIS is installed in your PostgreSQL instance.
2. Once the database is created, run the following command to enable the PostGIS extension:
    ```
    CREATE EXTENSION postgis;
    ```
3. Update the [application.yml](./src/main/resources/application.yml) file with your database connection details. This configuration file is located in the server's resources directory and should contain the URL, username, and password for the database.
    Example:
    ```
    host: localhost
    port: 5432
    database: litheum
    username: user
    password: password
    ```

## Execute gradle

Once the database is set up and the connection details are correctly configured, you can run the Java server using Gradle:

```
./gradlew[.bat] bootRun
```
This command will build the project and launch the application. The server will start listening for requests and will be ready to serve data to the web client and other services.