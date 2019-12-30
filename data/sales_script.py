#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Nov 10 18:18:49 2019

@author: alexmiao
"""
  
import csv


with open('Sale_Counts_Zip.csv', 'r', encoding = "ISO-8859-1") as f, open('Zillow_Sales.csv', 'w') as f_out:
    
    reader = csv.reader(f, delimiter=',')
    fieldnames = ['zipcode', 'year', 'month', 'num_sales']
    writer = csv.DictWriter(f_out, fieldnames=fieldnames)
    header = next(reader)
    writer.writeheader()
    for row in reader:
        zipcode = row[1]
        entries = len(row)
        for i in range(4, entries):
            date = header[i].split('-')
            writer.writerow({'zipcode': zipcode, 'year': date[0], 'month': date[1], 'num_sales': row[i]})
            
            
