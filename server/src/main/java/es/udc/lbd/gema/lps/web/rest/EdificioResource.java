package es.udc.lbd.gema.lps.web.rest;

import es.udc.lbd.gema.lps.model.service.EdificioService;
import es.udc.lbd.gema.lps.model.service.dto.BoundsDTO;
import es.udc.lbd.gema.lps.model.service.dto.EdificioDTO;
import es.udc.lbd.gema.lps.model.service.dto.EdificioFullDTO;
import es.udc.lbd.gema.lps.model.service.dto.FullLimitsDTO;
import es.udc.lbd.gema.lps.model.service.exceptions.NotFoundException;
import es.udc.lbd.gema.lps.web.rest.custom.FeatureCollectionJSON;
import jakarta.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(EdificioResource.EDIFICIO_RESOURCE_URL)
public class EdificioResource {
  public static final String EDIFICIO_RESOURCE_URL = "/api/entities/edificios";

  private static final Logger logger = LoggerFactory.getLogger(EdificioResource.class);

  @Inject private EdificioService edificioService;

  @GetMapping("/data")
  public ResponseEntity<FeatureCollectionJSON> getData(
      @RequestParam(value = "xmin", required = false) Double xmin,
      @RequestParam(value = "xmax", required = false) Double xmax,
      @RequestParam(value = "ymin", required = false) Double ymin,
      @RequestParam(value = "ymax", required = false) Double ymax) {
    return new ResponseEntity<>(edificioService.getData(xmin, xmax, ymin, ymax), HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<EdificioFullDTO> get(@PathVariable Long id) {
    try {
      return new ResponseEntity<>(edificioService.get(id), HttpStatus.OK);
    } catch (NotFoundException e) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @GetMapping("/{id}/data")
  public ResponseEntity<EdificioDTO> getData(@PathVariable Long id) {
    try {
      return new ResponseEntity<>(edificioService.getEdificioData(id), HttpStatus.OK);
    } catch (NotFoundException e) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @GetMapping("/maxBounds")
  public ResponseEntity<BoundsDTO> get() {
    return new ResponseEntity<>(edificioService.getMaxBounds(), HttpStatus.OK);
  }

  @GetMapping("/intervals")
  public ResponseEntity<FullLimitsDTO> getLimits(
      @RequestParam(value = "intervalAmount", required = false) Integer intervals) {
    return new ResponseEntity<>(edificioService.getLimits(intervals), HttpStatus.OK);
  }
}
