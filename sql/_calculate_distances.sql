-- Function to calculate driving distances for a column of IDs
-- this uses the working code in file 'alpha_walkthrough'
-- this functions assumes the existence of the 'dublin_traffic' table

/***************
drop definitions
***************/
DROP FUNCTION _ncg_driving_distance( integer, integer, double precision );
DROP TYPE _ncg_driving_distance_table;

/***************
table definition
***************/
-- create object type for _ncg_driving_distance
CREATE TYPE _ncg_driving_distance_table AS (
  fish_id integer,
	road_id integer, 
  route_id integer, 
	cost    double precision,
	geom    geometry );

/******************
function definition
*******************/
CREATE OR REPLACE FUNCTION _ncg_driving_distance(
  fish_id    integer,
	road_id    integer,
	distance   double precision
	)
RETURNS SETOF _ncg_driving_distance_table AS $$
BEGIN  
  RETURN QUERY 
  SELECT
    fish_id,
   	road_id,
    route.vertex_id,
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
/*
DROP TABLE dublin_driving_distance;
CREATE TABLE dublin_driving_distance AS
SELECT  (t2.table_dist).fish_id,
        (t2.table_dist).road_id,
        (t2.table_dist).route_id,
        (t2.table_dist).cost,
        (t2.table_dist).geom
FROM (SELECT _ncg_driving_distance(t.fish_id, t.road_id, 2000.0) as table_dist
     FROM _fishnet_road_source_test as t ) t2;
*/



