-- drop function and table 
DROP FUNCTION _ncg_alpha(integer);
DROP TYPE     _ncg_alpha_table;
CREATE TYPE   _ncg_alpha_table AS (
	geom_15  geometry,
	geom_30  geometry,
	geom_45  geometry,	
	geom_60  geometry	
);

-- create function to calculate alpha shapes from node, limited by driving time distance of four steps
CREATE OR REPLACE FUNCTION _ncg_alpha(
	address_id integer)
RETURNS SETOF _ncg_alpha_table AS $$
BEGIN
  RETURN QUERY 
  WITH 
	_alpha_15 as (
   		SELECT 
			gid,
			alpha AS geom	     	
	   	FROM  X
	   	WHERE Y ),
	_alpha_30 as (
   		SELECT 
			gid,
			alpha AS geom	     	
	   	FROM  X
	   	WHERE Y ),
	_alpha_45 as (
   		SELECT 
			gid,
			alpha AS geom	     	
	   	FROM  X
	   	WHERE Y ),
	_alpha_60 as (
   		SELECT 
			gid,
			alpha AS geom	     	
	   	FROM  X
	   	WHERE Y )
	SELECT 
		address_id,
		a15.geom as geom_15,
		a30.geom as geom_30,
		a45.geom as geom_45,
		a60.geom as geom_60
	FROM 
		_alpha_15 as a15,
		_alpha_30 as a30,
		_alpha_45 as a45,
		_alpha_60 as a60;
	END;
$$ LANGUAGE plpgsql;


