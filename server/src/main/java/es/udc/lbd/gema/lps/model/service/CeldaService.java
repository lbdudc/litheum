package es.udc.lbd.gema.lps.model.service;

import es.udc.lbd.gema.lps.model.service.dto.CeldaDTO;
import es.udc.lbd.gema.lps.model.service.dto.CeldaFullDTO;
import es.udc.lbd.gema.lps.model.service.dto.DataDTO;
import es.udc.lbd.gema.lps.model.service.dto.FullLimitsDTO;
import es.udc.lbd.gema.lps.model.service.exceptions.NotFoundException;
import es.udc.lbd.gema.lps.web.rest.custom.FeatureCollectionJSON;
import java.util.List;

public interface CeldaService {

  CeldaFullDTO get(Long id) throws NotFoundException;

  FeatureCollectionJSON getCeldasLocation();

  List<DataDTO> getData();

  FullLimitsDTO getLimits(Integer intervals);

  CeldaDTO getCeldaData(Long id) throws NotFoundException;
}
