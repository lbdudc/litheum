package es.udc.lbd.gema.lps.model.service;

import es.udc.lbd.gema.lps.model.domain.Celda;
import java.io.IOException;
import java.util.List;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.operation.TransformException;

public interface FileService {
  public void writeSpatialFiles(List<Celda> celdas) throws IOException;

  public void readCeldaFiles() throws IOException, FactoryException, TransformException;
}
