# LITHEUM CLIENT

The LITHEUM Client is a web application built using Vue.js that provides an interactive interface for users to visualize energy data and interact with the Urban Building Energy Model. The client connects to the backend services, allowing users to access energy maps, view demand estimates, and explore potential savings from building renovations.

### Change Node Version to the Required One

The project currently uses Node.js version 16.20.2. While other versions above this may also work, it is recommended to specify the exact version required by the project. To set the correct version, run the following command:

- Windows:
```
nvm use $(cat .\.nvmrc)
```

- Linux:
```
nvm use
```

### Install Required Dependencies

Before running the client, you need to install the necessary dependencies. To achieve this execute the next command: 

```
npm install
```

This command will install all the libraries and packages required for the application to function properly.

### Run the Client

Once the dependencies are installed, you can start the client application. Running the following command will launch the development server, and you will see the link where the client is accessible:

```
npm run serve
```

After executing this command, you can open your web browser and navigate to the provided link to start using the application.

