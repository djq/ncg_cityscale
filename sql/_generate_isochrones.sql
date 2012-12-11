-- taking in a table of driving distance, generate isochrones at define intervals

/*
INSERT INTO home_isodist (max_cost, geom) (
  SELECT 
    1500, 
    ST_ConcaveHull(ST_Collect(geom), 0.75) As geom
  FROM tmp_cost 
  WHERE cost < 1500);
*/

/***************
drop definitions
***************/
DROP TABLE _ncg_isodist;
DROP FUNCTION _ncg_isodist( integer);
DROP TYPE _ncg_isodist_table;

/***************
table definition
***************/
-- create table to store results (I think?)
CREATE TABLE _ncg_isodist (gid integer, max_cost double precision);
SELECT AddGeometryColumn('_ncg_isodist','geom',900913,'POLYGON',2);

-- create object type for _ncg_driving_distance
CREATE TYPE _ncg_isodist_table AS (
	road_id integer, 
	fishnet_id integer, 
	cost    double precision,
	geom    geometry );

/******************
function definition
*******************/
/*
CREATE OR REPLACE FUNCTION _ncg_isodist(
	id    integer
	)
RETURNS SETOF _ncg_isodist_table AS $$
BEGIN  
  RETURN QUERY 	
	WITH 
	_500 as (
	  SELECT  
	    ST_ConcaveHull(ST_Collect(d.geom), 0.75) As geom
	  FROM test_function_dist as d 
	  WHERE cost <= 500
	  AND d.road_id = id),
	_750 as (
	  SELECT  
	    ST_ConcaveHull(ST_Collect(d.geom), 0.75) As geom
	  FROM test_function_dist as d 
	  WHERE cost > 500
	  AND   cost <= 750
	  AND d.road_id = id),
	_1000 as (
	  SELECT  
	    ST_ConcaveHull(ST_Collect(d.geom), 0.75) As geom
	  FROM test_function_dist as d 
	  WHERE cost > 750
	  AND   cost <= 1000
	  AND d.road_id = id),
	_1250 as (
	  SELECT  
	    ST_ConcaveHull(ST_Collect(d.geom), 0.75) As geom
	  FROM test_function_dist as d 
	  WHERE cost > 1000
	  AND   cost <= 1250
	  AND d.road_id = id),
	_1500 as (
	  SELECT  
	    ST_ConcaveHull(ST_Collect(d.geom), 0.75) As geom
	  FROM test_function_dist as d 
	  WHERE cost > 1000
	  AND   cost <= 1500
	  AND d.road_id = id)
	-- now combine results
	  SELECT 
	    id, 
	    _500.geom,
	    _750.geom,
	    _1000.geom,
	    _1250.geom,
	    _1500.geom
	  FROM _500, _750, _1000, _1250, _1500;
  END;
$$ LANGUAGE plpgsql;
*/

CREATE OR REPLACE FUNCTION _ncg_isodist(
	id    integer
	)
RETURNS VOID AS $$ 
BEGIN    

	INSERT INTO _ncg_isodist (gid, max_cost, geom) (
	SELECT 
	id,	
	500, 
	ST_ConcaveHull(ST_Collect(geom), 0.75) As geom
	FROM test_function_dist as d
	WHERE cost < 500
	AND d.road_id = id);

	INSERT INTO _ncg_isodist (gid, max_cost, geom) (
	SELECT 
	id,	
	750, 
	ST_ConcaveHull(ST_Collect(geom), 0.75) As geom
	FROM test_function_dist as d
	WHERE cost < 750
	AND d.road_id = id);

	INSERT INTO _ncg_isodist (gid, max_cost, geom) (
	SELECT 
	id,	
	1000, 
	ST_ConcaveHull(ST_Collect(geom), 0.75) As geom
	FROM test_function_dist as d
	WHERE cost < 1000
	AND d.road_id = id);

  END;
$$ LANGUAGE plpgsql;

/************
testing query
*************/
-- test code for one ID using a 1km network distance
-- 34051 is the sample road/cell used in images
/*
SELECT * FROM _ncg_isodist(34051);
*/

/*
-- test using one column of data
SELECT _ncg_isodist(t.road_id) FROM test_function_dist as t;
*/
