import geopandas as gpd
import pandas as pd
import os
import numpy as np 
import json
import geojson
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv
from pyproj import Transformer
from c_lth import Monthly_HC_MALLA, Monthly_HC
from c_lth.climate import climate_litheum

load_dotenv()

def load_csv():
    filepath = os.path.join('./resources/csv', 'climate.csv')
    return pd.read_csv(filepath)

def execute_schema_file(cursor):
    with open("./ddl/schema.sql", 'r') as sql_file:
        sql_query = sql_file.read()
        cursor.execute(sql_query)

srid_deseado = 'EPSG:4326'  # SRID deseado (Web Mercator)
def multipolygon_converter(coordinates, srid_actual):
    transformador = Transformer.from_crs(srid_actual, srid_deseado, always_xy=True)
    transformed_coords = []
    for polygon in coordinates:
        transformed_polygon = []
        for ring in polygon:
            transformed_ring = []
            for coord in ring:
                x, y = transformador.transform(coord[0], coord[1])
                transformed_ring.append((x, y))
            transformed_polygon.append(transformed_ring)
        transformed_coords.append(transformed_polygon)
    return transformed_coords

def polygon_converter(coordinates, srid_actual):
    transformador = Transformer.from_crs(srid_actual, srid_deseado, always_xy=True)
    transformed_polygon = []
    for ring in coordinates:
        transformed_ring = []
        for coord in ring:
            x, y = transformador.transform(coord[0], coord[1])
            transformed_ring.append((x, y))
        transformed_polygon.append(transformed_ring)
    return transformed_polygon

def insert_edificios(cur):
    csv = load_csv()
    climate = climate_litheum(csv)
    i = 1
    with open("./resources/edificios.geojson") as f:
        gj = geojson.load(f)
        insertValues_geom = []
        insertValues_recalc = []
        crs = gj['crs']['properties']['name']
        for el in gj['features']:
            features = el['properties']
            if features['GFA'] < 20:
                continue

            # These are missing on the geojson datasource
            features["OBS_N"] = features['ObstN']
            features["OBS_S"] = features['ObstS']
            features["OBS_E"] = features['ObstE']
            features["OBS_W"] = features['ObstW']

            if(el['geometry']['type'] == 'Polygon'):
                el['geometry']['type'] = 'MultiPolygon'
                el['geometry']['coordinates'] = [el['geometry']['coordinates']]

            litheum_calc = Monthly_HC.edif_litheum(features, climate, 0, 0, 0, 'ONN', 20, 27)
            result = litheum_calc.calcQht()

            coordinates = el['geometry']['coordinates']
            transformed_coordinates = multipolygon_converter(coordinates, crs)

            multipolygon_str = ','.join(['(' + ','.join([' '.join([str(coord[0]), str(coord[1])]) for coord in ring]) + ')' for ring in transformed_coordinates[0]])
            insertValues_geom.append((i, "SRID=4326;MULTIPOLYGON((%s))" % multipolygon_str, features['Date_cons'], result['COOLING'], result['HEATING'], result['LIGHTING'], features['RefCat'], features['Tc'], features['Ct']))
            
            insertValues_recalc.append((i, features['RefCat'], features['Gz'], features['LAT'], features['MOR'], features['Env_N'], features['Env_E'], features['Env_S'], features['Env_O'], features['GFA'], features['L'], features['OBS_N'], features['OBS_S'], features['OBS_E'], features['OBS_W'], features['Tc'], features['Ct'], features['h_obs'], features['Env_W'], features['Use']))
            i = i + 1

        insertQuery_geom = "INSERT INTO t_edificio(id, geom, construction_year, cooling, heating, lighting, ref_cat, tc, ct) VALUES %s"
        execute_values(cur, insertQuery_geom, insertValues_geom)

        insertQuery_recalc = "INSERT INTO t_edificio_recalc(id, ref_cat, gz, lat, mor, env_n, env_e, env_s, env_o, gfa, l, obs_n, obs_s, obs_e, obs_w, tc, ct, h_obs, env_w, use) VALUES %s"
        execute_values(cur, insertQuery_recalc, insertValues_recalc)

def insert_celdas(cur):
    csv = load_csv()
    climate = climate_litheum(csv)
    with open("./resources/malla.geojson") as f:
        gj = geojson.load(f)
        insertValues_geom = []
        insertValues_recalc = []
        crs = gj['crs']['properties']['name']
        for el in gj['features']:
            features = el['properties']

            if (features['GFA'] <= 200 or features['Or'] <= 0 or features['L'] <= 0):
                continue

            coordinates = el['geometry']['coordinates']

            # These are missing on the geojson datasource
            features['Ct'] = 'grid'
            features["Use"] = "1_residential"

            litheum_calc = Monthly_HC_MALLA.edif_litheum(features, climate, 0, 0, 0)
            result = litheum_calc.calcQht()

            transformed_coordinates = polygon_converter(coordinates, crs)
        
            multipolygon_str = ','.join(['(' + ','.join([' '.join([str(coord[0]), str(coord[1])]) for coord in ring]) + ')' for ring in transformed_coordinates])
            insertValues_geom.append(("SRID=4326;POLYGON(%s)" % multipolygon_str, int(features['id']), features['Tc'], result['HEATING'], result['LIGHTING'], result['COOLING'], features['comp'], features['GSI'], features['FSI']))

            insertValues_recalc.append((int(features['id']), features['Env'], features['GFA'], features['L'], features['MOR'], features['Or'], features['LAT'], features['Gz'], features['a'], features['Ct_p_40'], features['Ct_p_60'], features['Ct_p_80'], features['Ct_p_07'], features['Ct_p_cd'], features['Tc']))

        insertQuery_geom = "INSERT INTO t_celda(geom, id, tc, heating, lighting, cooling, comp, gsi, fsi) VALUES %s"
        execute_values(cur, insertQuery_geom, insertValues_geom)

        insertQuery_recalc = "INSERT INTO t_celda_recalc(id, env, gfa, l, mor, or_c, lat, gz, a, ct_p_40, ct_p_60, ct_p_80, ct_p_07, ct_p_cd, tc) VALUES %s"
        execute_values(cur, insertQuery_recalc, insertValues_recalc)

conn = psycopg2.connect(dbname=os.getenv('POSTGRES_DB'), user=os.getenv('POSTGRES_USER'),
                    password=os.getenv('POSTGRES_PASSWORD'), host=os.getenv('POSTGRES_HOST'), port=5432)
cur = conn.cursor()

print("Loading schema...")
execute_schema_file(cur)

print("Inserting celda data...")
insert_celdas(cur)

print("Inserting edificio data...")
insert_edificios(cur)

conn.commit()
conn.close()