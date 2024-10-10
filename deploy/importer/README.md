# Data importer

The Data Importer is a crucial component of the LITHEUM project, responsible for loading initial datasets into the PostgreSQL database. It prepares the data necessary for the Urban Building Energy Model and ensures that the application has the required information to operate effectively.

## Installation

To set up the Data Importer, first install the required dependencies by executing the following command:

```
pip install -r requirements.txt
```
This will install all necessary libraries for the importer to function properly.

## Configuration

You can configure the database connection settings in the .env file. This file should contain the following parameters: 

```
POSTGRES_DB=litheum
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_HOST=localhost
```

Make sure to adjust these values according to your PostgreSQL setup to ensure a successful connection.

## Execution

After installing the dependencies and configuring the connection, you can run the Data Importer with the following command:

```
python insert_data.py
```