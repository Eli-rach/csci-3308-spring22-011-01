-- Written By Noah Solano, Steven Wilmes
-- Last Update: 3/28/22 
-- In Progress 

--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;



SET default_tablespace = '';

SET default_with_oids = false;


---
--- drop tables
---


DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS journal_entries;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE if not exists accounts 
(
  account_name VARCHAR(40) NOT NULL,
  account_password VARCHAR(30),
  account_email VARCHAR(30),
  account_id serial
);


--
-- Name: journal_entries; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

create table if not exists journal_entries
(
  entry_id serial primary key,
  entry_date date not null,
  entry_time time not null,
  entry_user int not null,
  entry_mood int,
  entry_mood_word text,
  entry_description text not null
);