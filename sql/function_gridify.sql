-- table for storing result
DROP FUNCTION _ncg_gridify(text, double precision, text, geometry);
DROP TYPE _ncg_gridified;

CREATE TYPE _ncg_gridified AS (
	gid 	integer,	
	val		double precision,
	geom    geometry
);

-- create function to gridify polygons
-- this function takes in a table of polygons, a grid, and a column with a density value for the polygons
CREATE OR REPLACE FUNCTION _ncg_gridify(
	table_name     text, 
	dens_val	   double precision, 
	grid 		   text,
	geom   geometry)
RETURNS SETOF _gridified AS $$
BEGIN
   EXECUTE '
     SELECT * FROM ' || table_name::regclass || ' LIMIT 10';
END;
$$ LANGUAGE plpgsql;


--
SELECT _ncg_gridify('elecdistricts', pop_den, '_fishnet_dublin_test', _fishnet_dublin_test.geom) 
FROM elecdistricts, _fishnet_dublin_test