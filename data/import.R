# Merge w/ our own coding
library(googledrive)
tmpfile = tempfile(pattern = "file", tmpdir = tempdir(), fileext = "")
drive_download(as_id('1TU1q_jXhUXsVcyxCr9fYGD9mK6j3he5f'), path =  'test.xlsx', overwrite=T)

raw_coding <- data.table(readxl::read_xlsx('../../data/coding/coding.xlsx'))
raw_coding[, DOI:=gsub('\n', '', DOI)]
raw_coding <- raw_coding[, c('DOI', 'Scraped','API', 'use_data_dumps', 'scraped data_source'),with=F]

# verify we have data on all coded papers
raw_coding[!DOI%in%papers$DI][,1:5]

raw_coding[is.na(Scraped), Scraped:=0]
raw_coding[is.na(API), API:=0]
raw_coding[is.na(use_data_dumps), use_data_dumps:=0]
