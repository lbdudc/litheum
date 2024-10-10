package es.udc.lbd.gema.lps.config;

import es.udc.lbd.gema.lps.component.scheduled_jobs.ReadCeldasFilesJob;
import java.util.Map;
import javax.sql.DataSource;
import org.quartz.Trigger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.quartz.QuartzProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.*;

@Configuration
@EnableAutoConfiguration
public class SpringScheduler {

  @Autowired private QuartzProperties quartzProperties;
  @Autowired private ApplicationContext applicationContext;

  @Bean
  public SpringBeanJobFactory springBeanJobFactory() {
    AutoWiringSpringBeanJobFactory jobFactory = new AutoWiringSpringBeanJobFactory();

    jobFactory.setApplicationContext(applicationContext);
    return jobFactory;
  }

  @Bean
  public SchedulerFactoryBean scheduler(DataSource quartzDataSource) {

    SchedulerFactoryBean schedulerFactory = new SchedulerFactoryBean();

    schedulerFactory.setJobFactory(springBeanJobFactory());
    schedulerFactory.setSchedulerName("qrtz_scheduler");
    schedulerFactory.setQuartzProperties(asProperties(quartzProperties.getProperties()));

    // All jobs to schedule
    Trigger[] triggers = {
      readCeldaFilesTrigger().getObject(),
    };
    schedulerFactory.setTriggers(triggers);
    schedulerFactory.setDataSource(quartzDataSource);

    return schedulerFactory;
  }

  /*
   * Jobs & triggers
   */
  @Bean
  public JobDetailFactoryBean readCeldaFilesJobDetail() {
    JobDetailFactoryBean jobDetailFactory = new JobDetailFactoryBean();
    jobDetailFactory.setJobClass(ReadCeldasFilesJob.class);
    jobDetailFactory.setDurability(true);
    jobDetailFactory.setGroup("initial-data");
    return jobDetailFactory;
  }

  @Bean
  public SimpleTriggerFactoryBean readCeldaFilesTrigger() {
    SimpleTriggerFactoryBean trigger = new SimpleTriggerFactoryBean();
    trigger.setJobDetail(readCeldaFilesJobDetail().getObject());
    trigger.setGroup("initial-data");
    trigger.setPriority(0);
    trigger.setRepeatCount(0);
    return trigger;
  }

  /*
   * Util methods
   */

  private java.util.Properties asProperties(Map source) {
    java.util.Properties properties = new java.util.Properties();
    properties.putAll(source);
    return properties;
  }
}
