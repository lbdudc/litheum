#!/bin/bash

# Verifica el valor de la variable SKIP_IMPORTATION
if [ "$SKIP_IMPORTATION" = "true" ]; then
  echo "skipping importation"
  # Ejecuta el comando que desees cuando SKIP_IMPORTATION sea true
else
  python3 insert_data.py
  # Ejecuta el comando que desees cuando SKIP_IMPORTATION sea false o no esté definido
fi
