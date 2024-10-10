package es.udc.lbd.gema.lps.model.repository;

import es.udc.lbd.gema.lps.model.domain.Celda;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CeldaRepository
    extends JpaRepository<Celda, Long>, JpaSpecificationExecutor<Celda> {

  Optional<Celda> findById(Long pk);

  Page<Celda> findByIdIn(List<Long> pk, Pageable pageable);

  @Query("select tc from t_celda tc where tc.cooling > 0 or tc.heating > 0 or tc.lighting > 0")
  List<Celda> getData();

  @Query(
      "select min(heating), max(heating), min(cooling), max(cooling), min(lighting), max(lighting) from t_celda")
  List<Object[]> getMinMax();

  @Query(value = "select distinct heating from t_celda order by heating asc", nativeQuery = true)
  List<Double> getHeatingByOrderByHeatingAsc();

  @Query(value = "select distinct cooling from t_celda order by cooling asc", nativeQuery = true)
  List<Double> getCoolingByOrderByHeatingAsc();

  @Query(value = "select distinct lighting from t_celda order by lighting asc", nativeQuery = true)
  List<Double> getLightingByOrderByHeatingAsc();

  @Modifying
  @Query(value = "UPDATE t_celda SET geom = ST_FlipCoordinates(geom)", nativeQuery = true)
  void flipGeomCoordinates();
}
