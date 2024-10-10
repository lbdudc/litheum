DROP TABLE IF EXISTS public.t_edificio CASCADE;
DROP TABLE IF EXISTS public.t_celda;
DROP TABLE IF EXISTS public.t_edificio_recalc;
DROP TABLE IF EXISTS public.t_celda_recalc;

CREATE TABLE public.t_edificio (
	id bigserial NOT NULL,
	construction_year int4 NULL,
	cooling float8 NULL,
	ct varchar(255) NULL,
	geom public.geometry(geometry, 4326) NULL,
	heating float8 NULL,
	lighting float8 NULL,
	ref_cat varchar(255) NULL,
	tc varchar(255) NULL,
	CONSTRAINT t_edificio_pkey PRIMARY KEY (id)
);

CREATE TABLE public.t_celda (
	id int8 NOT NULL,
	comp float8 NULL,
	cooling float8 NULL,
	fsi float8 NULL,
	geom public.geometry(geometry, 4326) NULL,
	gsi float8 NULL,
	heating float8 NULL,
	lighting float8 NULL,
	tc varchar(255) NULL,
	CONSTRAINT t_celda_pkey PRIMARY KEY (id)
);

CREATE TABLE public.t_edificio_recalc (
	ref_cat varchar(255) NOT NULL,
	gz float8 NULL,
	lat float8 NULL,
	mor float8 NULL,
	env_n float8 NULL,
	env_e float8 NULL,
	env_s float8 NULL,
	env_o float8 NULL,
	gfa float8 NULL,
	l float8 NULL,
	obs_n float8 NULL,
	obs_s float8 NULL,
	obs_e float8 NULL,
	obs_o float8 NULL,
	ct varchar(255) NULL,
	tc varchar(255) NULL,
	CONSTRAINT t_edificio_recalc_pkey PRIMARY KEY (ref_cat)
);

CREATE TABLE public.t_celda_recalc (
	id int8 NOT NULL,
	env float8 NULL,
	gfa float8 NULL,
	l float8 NULL,
	mor float8 NULL,
	or_c float8 NULL,
	lat float8 NULL,
	gz float8 NULL,
	a float8 NULL,
	ct_p_40 float8 NULL,
	ct_p_60 float8 NULL,
	ct_p_80 float8 NULL,
	ct_p_07 float8 NULL,
	ct_p_cd float8 NULL,
	tc varchar(255) NULL,
	CONSTRAINT t_celda_recalc_pkey PRIMARY KEY (id)
);