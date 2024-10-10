# LITHEUM

The LITHEUM project has developed a comprehensive Urban Building Energy Model (UBEM) that accounts for urban morphology, construction specifications, and user behavior. This model enables meaningful analysis of energy demand, considering factors like heating, cooling, and lighting across entire cities or specific buildings. The model is integrated into a dynamic online digital platform that offers interactive Geographic Information System (GIS) maps, allowing users to visualize current energy demand and potential savings from building renovations. Additionally, the platform enables users to interact with the model, recalculate energy demands, and assess the impact of interventions in real-time, offering valuable insights for both policymakers and the general public.

A fully operational version of the project is available at [LITHEUM](https://litheum.citic.udc.es/).

## Repository Structure

- **/server**: Contains the Java server, which manages backend operations and serves data to the web interface.
- **/flask**: Acts as a wrapper for the UBEM, implemented using Python Flask. This server allows users to interact with the UBEM, process inputs, and recalculate energy demand values dynamically through the web platform.
- **/deploy**: This folder contains a data import module for managing the ingestion of external data sources and a PostgreSQL image used for storing the UBEM datasets.
- **/client**: A Vue.js web client for the application that displays the GIS maps and offers the user interface for interacting with the UBEM.
- **/cities**: Specific configurations and Docker Compose files are stored here. These are used to deploy and configure the model for different cities, allowing for customized setups depending on the urban area being modeled.

## How to Run the Application

There are two main ways to launch the LITHEUM application, depending on your preferences and needs:

1. ##### Using Docker Compose for Supported Cities

    The easiest way to launch the entire application for a specific city is to use the provided Docker Compose files. These files are located in every folder inside the /cities directory, where you'll also find a README explaining the steps to deploy a complete instance of the application for a given city. The Docker Compose setup allows you to spin up all necessary services in a single command.

    To use this method, simply navigate to the desired city folder under /cities, follow the instructions in the README, and execute the provided Docker Compose commands.

2. ##### Launching Each Component Individually
    If you prefer to run each component separately, you can do so by following the instructions in the respective README files for each part of the system:

    - [Importer](./flask/README.md): Instructions for running the Python data importer.
    - [Flask server](./flask/README.md): Steps to start the Python Flask server, which wraps the UBEM.
    - [Java server](./server/README.md): Guide for launching the Java backend.
    - [Web client](./client/README.md): How to run the Vue.js interface for interacting with the platform.

    ###### Important: It is crucial to run the data importer first, as it initializes the required datasets for the application. By default, the importer loads data for the city of Pontevedra