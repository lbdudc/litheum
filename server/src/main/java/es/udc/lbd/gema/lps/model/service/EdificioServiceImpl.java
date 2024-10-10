package es.udc.lbd.gema.lps.model.service;

import static java.lang.Math.ceil;

import es.udc.lbd.gema.lps.model.domain.Edificio;
import es.udc.lbd.gema.lps.model.repository.EdificioRepository;
import es.udc.lbd.gema.lps.model.service.dto.*;
import es.udc.lbd.gema.lps.model.service.exceptions.NotFoundException;
import es.udc.lbd.gema.lps.web.rest.custom.FeatureCollectionJSON;
import es.udc.lbd.gema.lps.web.rest.custom.FeatureJSON;
import jakarta.inject.Inject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.geolatte.geom.MultiPolygon;
import org.geolatte.geom.jts.JTS;
import org.locationtech.jts.geom.Geometry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class EdificioServiceImpl implements EdificioService {

  @Inject private EdificioRepository edificioRepository;

  public EdificioFullDTO get(Long id) throws NotFoundException {
    Edificio edificio = findById(id);
    return new EdificioFullDTO(edificio);
  }

  /** PRIVATE METHODS * */
  private Edificio findById(Long id) throws NotFoundException {
    return edificioRepository
        .findById(id)
        .orElseThrow(() -> new NotFoundException("Cannot find Edificio with id " + id));
  }

  @Override
  public FeatureCollectionJSON getData(Double xmin, Double xmax, Double ymin, Double ymax) {
    List<Object[]> edificios = edificioRepository.getDataByBoundingBox(xmin, xmax, ymin, ymax);

    List<FeatureJSON> ret =
        edificios.stream()
            .map(
                e -> {
                  FeatureJSON geoJSON = new FeatureJSON();

                  Map<String, Object> properties = new HashMap<>();
                  properties.put("heating", (Double) e[3]);
                  properties.put("lighting", (Double) e[2]);
                  properties.put("cooling", (Double) e[1]);
                  properties.put("ct", (String) e[5]);
                  properties.put("tc", (String) e[4]);
                  properties.put("id", (Long) e[0]);
                  properties.put("refCat", (String) e[7]);

                  geoJSON.setProperties(properties);

                  geoJSON.setId((Long) e[0]);
                  geoJSON.setGeometry((Geometry) JTS.to((MultiPolygon) e[6]));
                  return geoJSON;
                })
            .filter(e -> e.getGeometry() != null)
            .collect(Collectors.toList());
    return new FeatureCollectionJSON(ret);
  }

  @Override
  public BoundsDTO getMaxBounds() {
    Object[] bounds = edificioRepository.getMaxBounds().get(0);
    Double xmin = (Double) bounds[0];
    Double xmax = (Double) bounds[1];
    Double ymin = (Double) bounds[2];
    Double ymax = (Double) bounds[3];
    return new BoundsDTO(xmin, xmax, ymin, ymax);
  }

  @Override
  public FullLimitsDTO getLimits(Integer intervals) {
    List<Double> heatingValues = edificioRepository.getHeatingByOrderByHeatingAsc();
    List<Double> lightingValues = edificioRepository.getLightingByOrderByHeatingAsc();
    List<Double> coolingValues = edificioRepository.getCoolingByOrderByHeatingAsc();

    List<LimitsDTO> heatingIntervals = getIntervals(heatingValues, intervals);
    List<LimitsDTO> coolingIntervals = getIntervals(coolingValues, intervals);
    List<LimitsDTO> lightingIntervals = getIntervals(lightingValues, intervals);

    return new FullLimitsDTO(coolingIntervals, lightingIntervals, heatingIntervals);
  }

  @Override
  public EdificioDTO getEdificioData(Long id) throws NotFoundException {
    Edificio edificio = findById(id);
    return new EdificioDTO(edificio);
  }

  private List<LimitsDTO> getIntervals(List<Double> values, Integer intervals) {
    double intervalSizeDbl = (double) values.size() / intervals;
    Integer intervalSize = (int) ceil(intervalSizeDbl);
    List<LimitsDTO> intervalLimits = new ArrayList<>();
    for (int i = 0; i < intervals; i++) {
      int ini = Math.max(i * intervalSize - 1, 0);
      int end = i == intervals - 1 ? values.size() - 1 : i * intervalSize + intervalSize - 1;
      LimitsDTO level = new LimitsDTO(values.get(ini), values.get(end));
      intervalLimits.add(level);
    }
    return intervalLimits;
  }
}
