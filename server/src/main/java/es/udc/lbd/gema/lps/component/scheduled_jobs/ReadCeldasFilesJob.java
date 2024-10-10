package es.udc.lbd.gema.lps.component.scheduled_jobs;

import es.udc.lbd.gema.lps.model.service.FileService;
import jakarta.inject.Inject;
import java.io.IOException;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.operation.TransformException;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ReadCeldasFilesJob implements Job {
  @Inject FileService fileService;

  private static final Logger logger = LoggerFactory.getLogger(ReadCeldasFilesJob.class);

  @Override
  public void execute(JobExecutionContext context) throws JobExecutionException {
    try {
      fileService.readCeldaFiles();
      logger.debug("Celdas.json generated");
    } catch (IOException | FactoryException | TransformException e) {
      logger.error("Error reading spatial files: {}", e.getMessage());
    }
  }
}
