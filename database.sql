DROP TABLE IF EXISTS luademel;



DROP TABLE IF EXISTS produto;

DROP TABLE IF EXISTS pessoa;

CREATE DATABASE luademel;

USE luademel;

CREATE TABLE pessoa (

    id INT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL

);



CREATE TABLE produto (

    id INT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,

    categoria VARCHAR(100) NOT NULL,

    preco DECIMAL(10,2) NOT NULL,

    data_criacao DATETIME NOT NULL,

    data_modificacao DATETIME NULL

);



INSERT INTO pessoa (id, nome) VALUES

(1, 'João Silva'),

(2, 'Maria Oliveira'),

(3, 'Carlos Souza'),

(4, 'Ana Costa'),

(5, 'Pedro Santos');



INSERT INTO produto (

    id,

    nome,

    categoria,

    preco,

    data_criacao,

    data_modificacao

) VALUES



(1, 'Notebook Acer Nitro 5',

 'Informatica',

 4200.00,

 NOW(),

 NULL),



(2, 'Mouse Gamer Redragon',

 'Perifericos',

 180.00,

 NOW(),

 NULL),



(3, 'Teclado Mecânico HyperX',

 'Perifericos',

 350.00,

 NOW(),

 NULL),



(4, 'Monitor LG 24 Polegadas',

 'Informatica',

 950.00,

 NOW(),

 NULL),



(5, 'Cadeira Gamer XT Racer',

 'Moveis',

 1200.00,

 NOW(),

 NULL);