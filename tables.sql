CREATE TABLE competitions (
 competition_id integer PRIMARY KEY,
 name text NOT NULL
 );
 
CREATE TABLE rounds (
 round_id integer PRIMARY KEY,
 competition_id integer,
 FOREIGN KEY (competition_id) REFERENCES competition (competition_id)
);

CREATE TABLE players (
 player_id integer PRIMARY KEY,
 name text NOT NULL
 );
 
CREATE TABLE participants (
 participants_id integer PRIMARY KEY,
 competition_id integer,
 FOREIGN KEY (competition_id) REFERENCES competitions (competition_id)
);

CREATE TABLE ends (
 end_id integer integer,
 round_id integer,
 player_id integer,
 PRIMARY KEY (end_id,round_id,player_id),
 FOREIGN KEY (round_id) REFERENCES rounds (round_id)
 FOREIGN KEY (player_id) REFERENCES players (player_id)
 );

