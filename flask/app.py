from flask import Flask, request, jsonify
from c_lth import Monthly_HC_MALLA, Monthly_HC
from c_lth.climate import climate_litheum
from c_lth.Functions_EN52016 import launch_simulation
from waitress import serve
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
from multiprocessing import Process, Queue
import os
import numpy as np 
import geopandas as gpd
import pandas as pd
import json
import psycopg2
from psycopg2.extras import execute_values

load_dotenv()
port = os.getenv('PORT')

litheum = Flask(__name__)
CORS(litheum, resources={r"/*": {"origins": ["https://litheum.citic.udc.es", "http://localhost:1234"]}})

def transform_to_list_of_lists(data):
    df_transformed = data.reset_index().pivot(index='Month', columns='hour_day', values=data.name)
    df_transformed = df_transformed.fillna(0.0)
    return {str(index + 1): row.tolist() for index, row in enumerate(df_transformed.values)}

def get_celda_by_id(id):
    conn = psycopg2.connect(dbname=os.getenv('POSTGRES_DB'), user=os.getenv('POSTGRES_USER'),
                    password=os.getenv('POSTGRES_PASSWORD'), host=os.getenv('POSTGRES_HOST'), port=5432)
    cur = conn.cursor()
    cur.execute("select tcr.id, tcr.env, tcr.gfa, tcr.l, tcr.mor, tcr.or_c, tcr.lat, tcr.gz, tcr.a, tcr.ct_p_40, tcr.ct_p_60, tcr.ct_p_80, tcr.ct_p_07, tcr.ct_p_cd, tcr.tc from t_celda_recalc tcr where tcr.id = {}".format(id))
    celda = cur.fetchone()
    conn.close()
    return {
        'LAT': celda[6],
        'MOR': celda[4],
        'GFA': celda[2],
        'Env': celda[1],
        'Or': celda[5],
        'a': celda[8],
        'L': celda[3],
        'Gz': celda[7],
        'Ct_p_40': celda[9],
        'Ct_p_60': celda[10],
        'Ct_p_80': celda[11],
        'Ct_p_07': celda[12],
        'Ct_p_cd': celda[13],
        'Tc': celda[14],
        'Ct': "grid",
        "Use": "1_residential"
    }

def get_edificio_by_id(id):
    conn = psycopg2.connect(dbname=os.getenv('POSTGRES_DB'), user=os.getenv('POSTGRES_USER'),
                password=os.getenv('POSTGRES_PASSWORD'), host=os.getenv('POSTGRES_HOST'), port=5432)
    cur = conn.cursor()
    cur.execute("select ter.gz, ter.lat, ter.mor, ter.env_n, ter.env_e, ter.env_s, ter.env_o, ter.gfa, ter.l, ter.obs_n, ter.obs_s, ter.obs_e, ter.obs_w, ter.tc, ter.ct, ter.h_obs, ter.env_w, ter.use from t_edificio_recalc ter where ter.id = '{}'".format(id))
    edificio = cur.fetchone()
    conn.close()
    return {
        'LAT': edificio[1],
        'MOR': edificio[2],
        'GFA': edificio[7],
        'Ct': edificio[14],
        'Tc': edificio[13],
        'Env_N': edificio[3],
        'Env_S': edificio[5],
        'Env_E': edificio[4],
        'Env_O': edificio[6],
        'OBS_N': edificio[9],
        'OBS_S': edificio[10],
        'OBS_E': edificio[11],
        'OBS_W': edificio[12],
        'L': edificio[8],
        'Gz': edificio[0],
        'h_obs': edificio[15],
        'Env_W': edificio[16],
        "Use": edificio[17]
    }

def convert_to_json_serializable(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key.lower(): convert_to_json_serializable(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_json_serializable(item) for item in obj]
    elif isinstance(obj, tuple):
        return tuple(convert_to_json_serializable(item) for item in obj)
    elif isinstance(obj, set):
        return {convert_to_json_serializable(item) for item in obj}
    return obj

def load_csv():
    filepath = os.path.join(resourcesFolder, 'climate.csv')
    return pd.read_csv(filepath)

@litheum.route("/recalc/celdas", methods=['POST'])
def change_malla():
    csv = load_csv()
    climate = climate_litheum(csv)
    body = request.get_json()
    dimm = body['dimm']
    dimt = body['dimt']
    tipv = body['tipv']
    ids = body['idList']

    responseBody = []
    for id in ids:
        celda = get_celda_by_id(id)

        litheum_calc = Monthly_HC_MALLA.edif_litheum(celda, climate, dimm, dimt, tipv)
        result = litheum_calc.calcQht()


        jsonObj = {}
        jsonObj['id'] = id
        jsonObj['cooling'] = result['COOLING']
        jsonObj['heating'] = result['HEATING']
        jsonObj['lighting'] = result['LIGHTING']

        responseBody.append(jsonObj)

    return jsonify(responseBody)


@litheum.route("/recalc/edificios", methods=['POST'])
def change_edificio():
    csv = load_csv()
    climate = climate_litheum(csv)

    body = request.get_json()
    dimm = body['dimm']
    dimt = body['dimt']
    tipv = body['tipv']
    detailedMode = body['detailedMode']
    vent = body['vent']
    solar = body['solar']
    heatingTherm = 0 if body['heatingTherm'] == 'None' else body['heatingTherm']
    coolingTherm = 0 if body['coolingTherm'] == 'None' else body['coolingTherm']
    refCats = body['refCatList']
    activeMode = 'OFF' if body['activeMode'] == 0 else 'ON'

    responseBody = []   
    for refcatId in refCats:
        identifier = refcatId["id"]
        refcat = refcatId["refCat"]
        edificio = get_edificio_by_id(identifier)

        litheum_calc = Monthly_HC.edif_litheum(edificio, climate, dimm, dimt, tipv, activeMode, float(heatingTherm), float(coolingTherm))
        result = litheum_calc.calcQht()
        if detailedMode == 1:
            aux = result['LIGHTING']
            result = launch_simulation(csv, edificio, 9504, 743, dimm, dimt, tipv, activeMode, float(heatingTherm), float(coolingTherm), solar, vent)
            result['lighting'] = aux

        result = convert_to_json_serializable(result)

        jsonObj = {}
        jsonObj['refCat'] = refcat
        jsonObj['id'] = identifier
        jsonObj['cooling'] = result['cooling']
        jsonObj['heating'] = result['heating']
        jsonObj['lighting'] = result['lighting']

        jsonObj['demand'] = {
            "hhl_v": result['hhl_vent'].tolist(),
            "dsg_t": result['sg_t'],
            "heating_t": result['heating_t'].tolist(),
            "cooling_T": result['cooling_t'].tolist(),
            "hhl_t": result['hhl_trans'].tolist(),
            "ihg_t": result['ihg_t'].tolist(),
            "heat_storage": result['heatstorage'].tolist()
        }

        if detailedMode == 0:
            jsonObj['radiation'] = {
                "tin": result['tint_day_month'].to_dict(orient="list"),
                "tout": result['tout_day_month'].to_dict(orient="list"),
                "solar": result['solarrad_day_month'].to_dict(orient="list"),
            }
        else:
            jsonObj['demand']["dsg_t"] = jsonObj['demand']["dsg_t"].tolist()
            jsonObj['radiation'] = {
                "tin": transform_to_list_of_lists(result['tint_day_month']),
                "tout": transform_to_list_of_lists(result['tout_day_month']),
                "solar": transform_to_list_of_lists(result['solarrad_day_month']),
            }

        responseBody.append(jsonObj)

    return jsonify(responseBody)

@litheum.route("/recalc/edificios/<id>/graphs", methods=['GET'])
def get_edificio_graph_data(id):
    csv = load_csv()
    climate = climate_litheum(csv)

    edificio = get_edificio_by_id(id)

    litheum_calc = Monthly_HC.edif_litheum(edificio, climate, 0, 0, 0, 'ON', 20, 27)
    result = litheum_calc.calcQht()

    result = convert_to_json_serializable(result)
    jsonObj = {}
    jsonObj['demand'] = {
        "hhl_v": result['hhl_vent'].tolist(),
        "dsg_t": result['sg_t'],
        "heating_t": result['heating_t'].tolist(),
        "cooling_T": result['cooling_t'].tolist(),
        "hhl_t": result['hhl_trans'].tolist(),
        "ihg_t": result['ihg_t'].tolist(),
        "heat_storage": result['heatstorage'].tolist()
    }

    jsonObj['radiation'] = {
        "tin": result['tint_day_month'].to_dict(orient="list"),
        "tout": result['tout_day_month'].to_dict(orient="list"),
        "solar": result['solarrad_day_month'].to_dict(orient="list"),
    }

    return jsonify(jsonObj)

resourcesFolder = "./resources"
if __name__ == "__main__":
    prefix = ""
    if os.environ.get('FLASK_ENV') == 'production':
        prefix = "/flask"
        resourcesFolder = '/app/flask/resources'
    serve(litheum, host='0.0.0.0', port=8081, url_prefix=prefix, threads=8)
