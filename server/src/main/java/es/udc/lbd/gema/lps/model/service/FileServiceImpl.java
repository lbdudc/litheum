package es.udc.lbd.gema.lps.model.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import es.udc.lbd.gema.lps.model.domain.Celda;
import es.udc.lbd.gema.lps.web.rest.custom.FeatureCollectionJSON;
import es.udc.lbd.gema.lps.web.rest.custom.FeatureJSON;
import jakarta.inject.Inject;
import java.io.*;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import org.geotools.geojson.geom.GeometryJSON;
import org.geotools.geometry.jts.JTS;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.geotools.referencing.CRS;
import org.geotools.util.factory.Hints;
import org.locationtech.jts.geom.Geometry;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FileServiceImpl implements FileService {

  private static final String DIRECTORY = "/src/main/resources/spatial/";
  private static final int SOURCE_SRID = 25829;
  private static final int TARGET_SRID = 4326;
  private static final Logger logger = LoggerFactory.getLogger(FeatureJSON.class);
  @Inject private CeldaService celdaService;

  @Inject private EdificioService edificioService;

  @Override
  public void writeSpatialFiles(List<Celda> celdas) throws IOException {
    List<FeatureJSON> ret =
        celdas.stream()
            .map(
                e -> {
                  FeatureJSON geoJSON = new FeatureJSON();
                  geoJSON.setProperties(new HashMap());

                  geoJSON.setId(e.getId());
                  geoJSON.setGeometry(e.getGeom());
                  return geoJSON;
                })
            .filter(e -> e.getGeometry() != null)
            .collect(Collectors.toList());
    writeDataToFile(new FeatureCollectionJSON(ret), "celda.json");
  }

  @Override
  public void readCeldaFiles() throws IOException, FactoryException, TransformException {
    FeatureCollectionJSON celdasJSON = celdaService.getCeldasLocation();
    this.writeDataToFile(celdasJSON, "celda.json");
  }

  private List<Celda> readCeldas() throws IOException, FactoryException, TransformException {
    ObjectMapper objectMapper = new ObjectMapper();
    GeometryJSON gjson = new GeometryJSON();
    InputStream inputStream = getClass().getResourceAsStream("/spatial/celda.geojson");
    JsonNode root = objectMapper.readTree(inputStream);
    JsonNode features = root.path("features");
    List<Celda> celdas = new ArrayList<>();
    for (JsonNode feature : features) {
      JsonNode properties = feature.path("properties");
      JsonNode geometry = feature.path("geometry");
      Reader reader = new StringReader(geometry.toString());

      Geometry originalGeometry = gjson.readMultiPolygon(reader);
      Geometry transformedGeometry = this.changeSRID(originalGeometry);

      Celda celda = new Celda();
      celda.setId(properties.path("id").asLong());
      celda.setTc(properties.path("Tc").asText());
      celda.setHeating(properties.path("Heating").asDouble());
      celda.setCooling(properties.path("Cooling").asDouble());
      celda.setLighting(properties.path("Lighting").asDouble());
      celda.setGsi(properties.path("GSI").asDouble());
      celda.setFsi(properties.path("FSI").asDouble());
      celda.setComp(properties.path("comp").asDouble());
      celda.setGeom(transformedGeometry);

      celdas.add(celda);
    }

    return celdas;
  }

  private Geometry changeSRID(Geometry originalGeometry)
      throws FactoryException, TransformException {
    Hints hints = new Hints(Hints.FORCE_LONGITUDE_FIRST_AXIS_ORDER, Boolean.TRUE);
    JTSFactoryFinder.getGeometryFactory(hints);

    CoordinateReferenceSystem sourceCRS = CRS.decode("EPSG:" + SOURCE_SRID);
    CoordinateReferenceSystem targetCRS = CRS.decode("EPSG:" + TARGET_SRID);
    MathTransform transform = CRS.findMathTransform(sourceCRS, targetCRS, true);

    return JTS.transform(originalGeometry, transform);
  }

  private void writeDataToFile(FeatureCollectionJSON featureCollection, String fileName)
      throws IOException {
    String rootPath = System.getProperty("user.dir");
    File file = new File(rootPath + DIRECTORY + fileName);
    file.createNewFile();
    ObjectMapper mapper = new ObjectMapper();
    mapper.writeValue(file, featureCollection);
  }
}
