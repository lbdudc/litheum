package es.udc.lbd.gema.lps.model.service;

import static java.lang.Math.ceil;

import es.udc.lbd.gema.lps.model.domain.Celda;
import es.udc.lbd.gema.lps.model.repository.CeldaRepository;
import es.udc.lbd.gema.lps.model.service.dto.*;
import es.udc.lbd.gema.lps.model.service.dto.CeldaDTO;
import es.udc.lbd.gema.lps.model.service.dto.CeldaFullDTO;
import es.udc.lbd.gema.lps.model.service.exceptions.NotFoundException;
import es.udc.lbd.gema.lps.web.rest.custom.FeatureCollectionJSON;
import es.udc.lbd.gema.lps.web.rest.custom.FeatureJSON;
import jakarta.inject.Inject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class CeldaServiceImpl implements CeldaService {

  @Inject private CeldaRepository celdaRepository;

  public CeldaFullDTO get(Long id) throws NotFoundException {
    Celda celda = findById(id);
    return new CeldaFullDTO(celda);
  }

  /** PRIVATE METHODS * */
  private Celda findById(Long id) throws NotFoundException {
    return celdaRepository
        .findById(id)
        .orElseThrow(() -> new NotFoundException("Cannot find Celda with id " + id));
  }

  @Override
  public FeatureCollectionJSON getCeldasLocation() {
    List<Celda> list = celdaRepository.getData();

    List<FeatureJSON> ret =
        list.stream()
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
    return new FeatureCollectionJSON(ret);
  }

  @Override
  public List<DataDTO> getData() {
    List<Celda> celdas = celdaRepository.getData();

    List<DataDTO> features =
        celdas.stream()
            .map(
                el -> {
                  return new DataDTO(
                      el.getId(), el.getHeating(), el.getLighting(), el.getCooling(), el.getTc());
                })
            .collect(Collectors.toList());
    return features;
  }

  @Override
  public FullLimitsDTO getLimits(Integer intervals) {
    List<Double> heatingValues = celdaRepository.getHeatingByOrderByHeatingAsc();
    List<Double> lightingValues = celdaRepository.getLightingByOrderByHeatingAsc();
    List<Double> coolingValues = celdaRepository.getCoolingByOrderByHeatingAsc();

    List<LimitsDTO> heatingIntervals = getIntervals(heatingValues, intervals);
    List<LimitsDTO> coolingIntervals = getIntervals(coolingValues, intervals);
    List<LimitsDTO> lightingIntervals = getIntervals(lightingValues, intervals);

    return new FullLimitsDTO(coolingIntervals, lightingIntervals, heatingIntervals);
  }

  @Override
  public CeldaDTO getCeldaData(Long id) throws NotFoundException {
    Celda celda = findById(id);
    return new CeldaDTO(celda);
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
