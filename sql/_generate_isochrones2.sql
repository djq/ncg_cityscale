DROP FUNCTION _ncg_isodist(integer, integer, integer);

CREATE OR REPLACE FUNCTION _ncg_isodist(
	_fish_id    integer,
	_road_id    integer,
	_cost        integer	
	)
RETURNS VOID AS $$ 
BEGIN    	

	INSERT INTO _ncg_isodist_dublin (fish_id, road_id, max_cost, geom) (
		SELECT 
			_fish_id,	
			_road_id,
			_cost,
			x.cgeom as geom
		FROM
			(SELECT 
				ST_Collect(geom) As cgeom
			FROM dublin_driving_distance as d
				WHERE d.cost <= _cost
				AND d.fish_id = _fish_id
				AND d.road_id = _road_id) as x
		WHERE GeometryType(x.cgeom) = 'GEOMETRYCOLLECTION' 
		AND ST_IsValid(x.cgeom) = TRUE);

  END;
$$ LANGUAGE plpgsql;

/*
SELECT  *
FROM (SELECT _ncg_isodist(t.fish_id, t.road_id, 750) as table_dist
     FROM dublin_driving_distance as t ) as t2;
*/

create table _test_convex_500 as
SELECT fish_id,	
	road_id,
	max_cost,
	ST_ConcaveHull(ST_buffer(geom, 1), 0.85) as geom
FROM _ncg_isodist_dublin as d
WHERE max_cost = 500