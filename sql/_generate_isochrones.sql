-- taking in a table of driving distance, generate isochrones at define intervals

/*
INSERT INTO home_isodist (max_cost, geom) (
  SELECT 
    1500, 
    ST_Collect(geom) As geom
  FROM tmp_cost 
  WHERE cost < 1500);
*/

/***************
drop definitions
***************/
DROP TABLE _ncg_isodist_dublin;
DROP FUNCTION _ncg_isodist(integer, integer);
DROP TYPE _ncg_isodist_table;

/***************
table definition
***************/
-- create table to store results (I think?)
CREATE TABLE _ncg_isodist_dublin (fish_id integer, road_id integer, max_cost double precision);
SELECT AddGeometryColumn('_ncg_isodist_dublin','geom',900913,'GEOMETRYCOLLECTION',2);

-- create object type for _ncg_driving_distance
CREATE TYPE _ncg_isodist_table AS (
	road_id integer, 
	fish_id integer, 
	cost    double precision,
	geom    geometry );

/******************
function definition
*******************/
CREATE OR REPLACE FUNCTION _ncg_isodist(
	_fish_id    integer,
	_road_id    integer	
	)
RETURNS VOID AS $$ 
BEGIN    
	
	INSERT INTO _ncg_isodist_dublin (fish_id, road_id, max_cost, geom) (
		SELECT 
			_fish_id,	
			_road_id,
			500,
			x.cgeom as geom
		FROM
			(SELECT 
				ST_Collect(geom) As cgeom
			FROM dublin_driving_distance as d
				WHERE cost <= 500
				AND d.fish_id = _fish_id
				AND d.road_id = _road_id) as x
		WHERE GeometryType(x.cgeom) = 'GEOMETRYCOLLECTION' 
		AND ST_IsValid(x.cgeom) = TRUE);

	INSERT INTO _ncg_isodist_dublin (fish_id, road_id, max_cost, geom) (
		SELECT 
			_fish_id,	
			_road_id,
			750,
			x.cgeom as geom
		FROM
			(SELECT 
				ST_Collect(geom) As cgeom
			FROM dublin_driving_distance as d
				WHERE cost <= 750
				AND d.fish_id = _fish_id
				AND d.road_id = _road_id) as x
		WHERE GeometryType(x.cgeom) = 'GEOMETRYCOLLECTION' 
		AND ST_IsValid(x.cgeom) = TRUE);

	INSERT INTO _ncg_isodist_dublin (fish_id, road_id, max_cost, geom) (
		SELECT 
			_fish_id,	
			_road_id,
			1000,
			x.cgeom as geom
		FROM
			(SELECT 
				ST_Collect(geom) As cgeom
			FROM dublin_driving_distance as d
				WHERE cost <= 1000
				AND d.fish_id = _fish_id
				AND d.road_id = _road_id) as x
		WHERE GeometryType(x.cgeom) = 'GEOMETRYCOLLECTION' 
		AND ST_IsValid(x.cgeom) = TRUE);

	INSERT INTO _ncg_isodist_dublin (fish_id, road_id, max_cost, geom) (
		SELECT 
			_fish_id,	
			_road_id,
			1250,
			x.cgeom as geom
		FROM
			(SELECT 
				ST_Collect(geom) As cgeom
			FROM dublin_driving_distance as d
				WHERE cost <= 1250
				AND d.fish_id = _fish_id
				AND d.road_id = _road_id) as x
		WHERE GeometryType(x.cgeom) = 'GEOMETRYCOLLECTION' 
		AND ST_IsValid(x.cgeom) = TRUE);

	INSERT INTO _ncg_isodist_dublin (fish_id, road_id, max_cost, geom) (
		SELECT 
			_fish_id,	
			_road_id,
			1500,
			x.cgeom as geom
		FROM
			(SELECT 
				ST_Collect(geom) As cgeom
			FROM dublin_driving_distance as d
				WHERE cost <= 1500
				AND d.fish_id = _fish_id
				AND d.road_id = _road_id) as x
		WHERE GeometryType(x.cgeom) = 'GEOMETRYCOLLECTION' 
		AND ST_IsValid(x.cgeom) = TRUE);

	INSERT INTO _ncg_isodist_dublin (fish_id, road_id, max_cost, geom) (
		SELECT 
			_fish_id,	
			_road_id,
			1750,
			x.cgeom as geom
		FROM
			(SELECT 
				ST_Collect(geom) As cgeom
			FROM dublin_driving_distance as d
				WHERE cost <= 1750
				AND d.fish_id = _fish_id
				AND d.road_id = _road_id) as x
		WHERE GeometryType(x.cgeom) = 'GEOMETRYCOLLECTION' 
		AND ST_IsValid(x.cgeom) = TRUE);

	INSERT INTO _ncg_isodist_dublin (fish_id, road_id, max_cost, geom) (
		SELECT 
			_fish_id,	
			_road_id,
			2000,
			x.cgeom as geom
		FROM
			(SELECT 
				ST_Collect(geom) As cgeom
			FROM dublin_driving_distance as d
				WHERE cost <= 2000
				AND d.fish_id = _fish_id
				AND d.road_id = _road_id) as x
		WHERE GeometryType(x.cgeom) = 'GEOMETRYCOLLECTION' 
		AND ST_IsValid(x.cgeom) = TRUE);	

  END;
$$ LANGUAGE plpgsql;

/************
testing query
*************/
-- test code for one ID using a 1km network distance
-- 34051 is the sample road/cell used in images
/*
DROP TABLE _ncg_isodist;
CREATE TABLE _ncg_isodist (fish_id integer, road_id integer, max_cost double precision);
SELECT AddGeometryColumn('_ncg_isodist','geom',900913,'GEOMETRYCOLLECTION',2);

-- one polygon / road (it probably should not be necessary to supply both fishnet id and road id....
SELECT * FROM _ncg_isodist(1450, 34051);
*/

/*
-- test using a table of distances
DROP TABLE _ncg_isodist;
CREATE TABLE _ncg_isodist (fish_id integer, road_id integer, max_cost double precision);
SELECT AddGeometryColumn('_ncg_isodist','geom',900913,'GEOMETRYCOLLECTION',2);

SELECT  *
FROM (SELECT _ncg_isodist(t.fish_id, t.road_id) as table_dist
     FROM _fishnet_road_source_test t ) as t2;

CREATE INDEX idx_dublin_driving_distance ON _ncg_isodist (fish_id);
CREATE INDEX idx_spatial_ncg_isodist ON _ncg_isodist USING gist (geom);
*/
