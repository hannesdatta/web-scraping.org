# Merge w/ our own coding
library(googledrive)
library(data.table)
library(jsonify)

drive_download(as_id('1TU1q_jXhUXsVcyxCr9fYGD9mK6j3he5f'), path =  'raw_coding.xlsx', overwrite=T)

raw_coding <- data.table(readxl::read_xlsx('raw_coding.xlsx'))
raw_coding[, DOI:=gsub('\n', '', DOI)]
#raw_coding <- raw_coding[, c('DOI', 'Scraped','API', 'use_data_dumps', 'scraped data_source'),with=F]

public_coding <- raw_coding[, c('Authors_WoS', 'PY_WoS', 'Journal', 'Title', 'DOI','Scraped','API'),with=F]
colnames(public_coding) <- tolower(colnames(public_coding))

setnames(public_coding, 'authors_wos', 'authors')
setnames(public_coding, 'py_wos', 'year')
public_coding[grepl('JCP', journal), journal_long := 'Journal of Consumer Psychology']
public_coding[grepl('JCR', journal), journal_long := 'Journal of Consumer Research']
public_coding[grepl('JM', journal), journal_long := 'Journal of Marketing']
public_coding[grepl('MktSci', journal), journal_long := 'Marketing Science']
public_coding[grepl('JMR', journal), journal_long := 'Journal of Marketing Research']
public_coding[is.na(scraped), scraped:=0]
public_coding[is.na(api), api:=0]

public_coding[,scraped:=as.logical(scraped)]
public_coding[,api:=as.logical(api)]

public_coding[, type:= '']
public_coding[scraped==0&api==0, type:= 'Manual extraction']
public_coding[scraped==1&api==0, type:= 'Web scraping']
public_coding[scraped==0&api==1, type:= 'API']
public_coding[scraped==1&api==1, type:= 'Both web scraping and API']
public_coding[year>=2021, type:='Not classified whether web scraping or API']

public_coding <- public_coding[, c('year','journal','doi','authors','title', 'type')]
public_coding = unique(public_coding, by = c('doi'))

sink('bib.json')
to_json(public_coding, digits=0, unbox=T)
sink()
