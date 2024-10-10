package es.udc.lbd.gema.lps.model.service;

import es.udc.lbd.gema.lps.model.service.dto.BoundsDTO;
import es.udc.lbd.gema.lps.model.service.dto.EdificioDTO;
import es.udc.lbd.gema.lps.model.service.dto.EdificioFullDTO;
import es.udc.lbd.gema.lps.model.service.dto.FullLimitsDTO;
import es.udc.lbd.gema.lps.model.service.exceptions.NotFoundException;
import es.udc.lbd.gema.lps.web.rest.custom.FeatureCollectionJSON;

public interface EdificioService {

  EdificioFullDTO get(Long id) throws NotFoundException;

  FeatureCollectionJSON getData(Double xmin, Double xmax, Double ymin, Double ymax);

  BoundsDTO getMaxBounds();

  FullLimitsDTO getLimits(Integer intervals);

  EdificioDTO getEdificioData(Long id) throws NotFoundException;
}
