-- Function to calculate driving distances for a column of IDs
-- this uses the working code in file 'alpha_walkthrough'
-- this functions assumes the existence of the 'dublin_traffic' table

/***************
drop definitions
***************/
DROP FUNCTION _ncg_driving_distance( integer, double precision );
DROP TYPE _ncg_driving_distance_table;

/***************
table definition
***************/
-- create object type for _ncg_driving_distance
CREATE TYPE _ncg_driving_distance_table AS (
	road_id integer, 
	cost    double precision,
	geom    geometry );

/******************
function definition
*******************/
CREATE OR REPLACE FUNCTION _ncg_driving_distance(
	road_id    integer,
	distance   double precision
	)
RETURNS SETOF _ncg_driving_distance_table AS $$
BEGIN  
  RETURN QUERY 
  SELECT
   	road_id,
   	route.cost,
   	d.geom   
  FROM 
  	dublin_traffic as d
   JOIN
   (SELECT * FROM driving_distance('
      SELECT gid AS id,
          source::int4 AS source,
          target::int4 AS target,
          length::float8 AS cost
      FROM dublin_traffic',
      road_id,
      distance,
      false,
      false)) AS route
   ON
   d.target = route.vertex_id;
  END;
$$ LANGUAGE plpgsql;

/************
testing query
*************/
-- test code for one ID using a 1km network distance
/*
SELECT * FROM _ncg_driving_distance(4052, 1000.0);
*/

-- testing using a column of IDs is more complicated


