-- Function to calculate driving distances for a column of IDs
-- this uses the working code in file 'alpha_walkthrough'

/*
DROP TABLE tmp_cost;
CREATE TABLE tmp_cost AS
SELECT 
   d.geom,
   route.cost
   FROM dublin_traffic as d
   JOIN
   (SELECT * FROM driving_distance('
      SELECT gid AS id,
          source::int4 AS source,
          target::int4 AS target,
          length::float8 AS cost
      FROM dublin_traffic',
      4052,
      10000,
      false,
      false)) AS route
   ON
   d.target = route.vertex_id;
*/

-- this functions assumes the existence of two other tables
-- 1] dublin_traffic
-- 2] column of road_id values that can be passed in

-- drop table and function for _ncg_driving_distance
DROP FUNCTION _ncg_driving_distance( integer );
DROP TYPE _ncg_driving_distance_table;

-- create object type for _ncg_driving_distance
CREATE TYPE _ncg_driving_distance_table AS (
	road_id integer, 
	geom    geometry, 
	cost    double precision
	);

CREATE OR REPLACE FUNCTION _ncg_driving_distance(
	road_id    integer
	)
RETURNS SETOF _ncg_driving_distance_table AS $$
BEGIN  
  RETURN QUERY 
  SELECT
   road_id,
   d.geom,
   route.cost
   FROM dublin_traffic as d
   JOIN
   (SELECT * FROM driving_distance('
      SELECT gid AS id,
          source::int4 AS source,
          target::int4 AS target,
          length::float8 AS cost
      FROM dublin_traffic',
      4052,
      10000,
      false,
      false)) AS route
   ON
   d.target = route.vertex_id;
  END;
$$ LANGUAGE plpgsql;

