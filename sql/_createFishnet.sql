-- Source:
-- http://trac.osgeo.org/postgis/wiki/UsersWikiCreateFishnet

/*
Where:

	nrow integer
	number of rows in y-direction
	ncol integer
	number of columns in x-direction
	xsize float8
	cell size length in x-direction
	ysize float8
	cell size length in x-direction
	x0 float8 (optional)
	origin offset in x-direction; DEFAULT is 0
	y0 float8 (optional)
	origin offset in y-direction; DEFAULT is 0

Example:

	SELECT ST_Collect(cells)
	FROM ST_CreateFishnet(4,6,10,10) AS cells;
*/

CREATE OR REPLACE FUNCTION ST_CreateFishnet(
        nrow integer, ncol integer,
        xsize float8, ysize float8,
        x0 float8 DEFAULT 0, y0 float8 DEFAULT 0)
    RETURNS SETOF geometry AS
$$
SELECT ST_Translate(cell, j * $3 + $5, i * $4 + $6)
FROM generate_series(0, $1 - 1) AS i,
     generate_series(0, $2 - 1) AS j,
(
SELECT ('POLYGON((0 0, 0 '||$4||', '||$3||' '||$4||', '||$3||' 0,0 0))')::geometry AS cell
) AS foo;
$$ LANGUAGE sql IMMUTABLE STRICT;