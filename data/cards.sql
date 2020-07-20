DROP TABLE IF EXISTS words;
CREATE TABLE IF NOT EXISTS words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255),
    definition VARCHAR(255),
    example VARCHAR(255),
    synonyms VARCHAR(255),
    list VARCHAR(255),
    img_url TEXT,
    audio TEXT
);

INSERT INTO words (word,definition,example,synonyms,list,img_url,audio) VALUES ('car','diff 1','exampTest','Synon','ListName','http//','http//');
INSERT INTO words (word,definition,example,synonyms,list,img_url,audio) VALUES ('car','diff 1','exampTest','Synon','ListName','http//','http//');
