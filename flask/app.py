from flask import Flask, request, jsonify
from c_lth import C_LTH, RC_LTH_edif, graphics
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
        'Tc': celda[14]
    }

def get_edificio_by_refcat(refcat):
    conn = psycopg2.connect(dbname=os.getenv('POSTGRES_DB'), user=os.getenv('POSTGRES_USER'),
                password=os.getenv('POSTGRES_PASSWORD'), host=os.getenv('POSTGRES_HOST'), port=5432)
    cur = conn.cursor()
    cur.execute("select ter.gz, ter.lat, ter.mor, ter.env_n, ter.env_e, ter.env_s, ter.env_o, ter.gfa, ter.l, ter.obs_n, ter.obs_s, ter.obs_e, ter.obs_o, ter.tc, ter.ct from t_edificio_recalc ter where ter.ref_cat = '{}'".format(refcat))
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
        'OBS_O': edificio[12],
        'L': edificio[8],
        'Gz': edificio[0],
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

def load_csv(csv_filenames):
    data = {}
    for filename in csv_filenames:
        key = os.path.splitext(filename)[0]
        filepath = os.path.join(resourcesFolder, filename)
        data[key] = pd.read_csv(filepath, header=None)
    return data

@litheum.route("/recalc/celdas", methods=['POST'])
def change_malla():
    data = load_csv(['dhsr.csv', 'dnsr.csv', 'dbt.csv'])
    body = request.get_json()
    dimm = body['dimm']
    dimt = body['dimt']
    tipv = body['tipv']
    ids = body['idList']

    responseBody = []
    for id in ids:
        celda = get_celda_by_id(id)
        result = C_LTH.calculoLTH(data['dhsr'], data['dnsr'], data['dbt'], celda, dimm, dimt, tipv)

        jsonObj = {}
        jsonObj['id'] = id
        jsonObj['cooling'] = result['COOLING']
        jsonObj['heating'] = result['HEATING']
        jsonObj['lighting'] = result['LIGHTING']

        responseBody.append(jsonObj)

    return jsonify(responseBody)

@litheum.route("/recalc/edificios", methods=['POST'])
def change_edificio():
    data = load_csv(['dhsr.csv', 'dnsr.csv', 'dbt.csv'])
    body = request.get_json()
    dimm = body['dimm']
    dimt = body['dimt']
    tipv = body['tipv']
    refCats = body['refCatList']

    responseBody = []
    for refcatId in refCats:
        identifier = refcatId["id"]
        refcat = refcatId["refCat"]
        edificio = get_edificio_by_refcat(refcat)
        result = RC_LTH_edif.calculoLTH_edif(data['dhsr'], data['dnsr'], data['dbt'], edificio, dimm, dimt, tipv)
        result['data_T'] = result["data_T"].to_dict(orient="list")
        result = convert_to_json_serializable(result)

        jsonObj = {}
        jsonObj['refCat'] = refcat
        jsonObj['id'] = identifier
        jsonObj['cooling'] = result['cooling']
        jsonObj['heating'] = result['heating']
        jsonObj['lighting'] = result['lighting']
        jsonObj['demand'] = {
            "dfs_t": result['dfs_t'],
            "dsg_t": result['dsg_t'],
            "demand": result['demand'],
            "hhl_t": result['hhl_t'],
            "ihg_t": result['ihg_t']
        }
        jsonObj["radiation"] = result["data_t"]

        responseBody.append(jsonObj)

    return jsonify(responseBody)

@litheum.route("/recalc/edificios/<ref_cat>/graphs", methods=['GET'])
def get_edificio_graph_data(ref_cat):
    data = load_csv(['dhsr.csv', 'dnsr.csv', 'dbt.csv'])
    edificio = get_edificio_by_refcat(ref_cat)
    result = graphics.calculoLTH_edif(data['dhsr'], data['dnsr'], data['dbt'], edificio, '0cm', '0cm', 'sin_cambio')

    result['data_T'] = result["data_T"].to_dict(orient="list")
    result = convert_to_json_serializable(result)
    jsonObj = {}
    jsonObj['demand'] = {
        "dfs_t": result['dfs_t'],
        "dsg_t": result['dsg_t'],
        "demand": result['demand'],
        "hhl_t": result['hhl_t'],
        "ihg_t": result['ihg_t']
    }
    jsonObj["radiation"] = result["data_t"]
    return jsonify(jsonObj)

resourcesFolder = "./resources"
if __name__ == "__main__":
    prefix = ""
    if os.environ.get('FLASK_ENV') == 'production':
        prefix = "/flask"
        resourcesFolder = '/app/flask/resources'
    serve(litheum, host='0.0.0.0', port=8081, url_prefix=prefix, threads=8)
