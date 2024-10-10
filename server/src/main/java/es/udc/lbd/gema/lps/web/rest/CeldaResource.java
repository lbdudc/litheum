package es.udc.lbd.gema.lps.web.rest;

import es.udc.lbd.gema.lps.model.service.CeldaService;
import es.udc.lbd.gema.lps.model.service.dto.CeldaDTO;
import es.udc.lbd.gema.lps.model.service.dto.CeldaFullDTO;
import es.udc.lbd.gema.lps.model.service.dto.DataDTO;
import es.udc.lbd.gema.lps.model.service.dto.FullLimitsDTO;
import es.udc.lbd.gema.lps.model.service.exceptions.NotFoundException;
import jakarta.inject.Inject;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(CeldaResource.CELDA_RESOURCE_URL)
public class CeldaResource {
  public static final String CELDA_RESOURCE_URL = "/api/entities/celdas";

  private static final Logger logger = LoggerFactory.getLogger(CeldaResource.class);

  @Inject private CeldaService celdaService;

  @GetMapping("/data")
  public ResponseEntity<List<DataDTO>> getData() {
    return new ResponseEntity<>(celdaService.getData(), HttpStatus.OK);
  }

  @GetMapping("/{id}/data")
  public ResponseEntity<CeldaDTO> getData(@PathVariable Long id) {
    try {
      return new ResponseEntity<>(celdaService.getCeldaData(id), HttpStatus.OK);
    } catch (NotFoundException e) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<CeldaFullDTO> get(@PathVariable Long id) {
    try {
      return new ResponseEntity<>(celdaService.get(id), HttpStatus.OK);
    } catch (NotFoundException e) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @GetMapping("/intervals")
  public ResponseEntity<FullLimitsDTO> getLimits(
      @RequestParam(value = "intervalAmount", required = false) Integer intervals) {
    return new ResponseEntity<>(celdaService.getLimits(intervals), HttpStatus.OK);
  }
}
