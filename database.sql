create database luademel;
create table luademel.pessoa(
    id int primary key,
    nome varchar(50)
);
insert into luademel.pessoa values (1,"tere");

create table luademel.produto(
  id INT PRIMARY KEY,
  nome VARCHAR(300),
  categoria VARCHAR(300),
  preco DECIMAL(10,2),
  data_criacao DATETIME,
  data_modificacao DATETIME
 );