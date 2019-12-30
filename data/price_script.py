#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Nov 10 15:25:52 2019

@author: alexmiao
"""

import csv


with open('Zip_Zhvi_AllHomes.csv', 'r', encoding = "ISO-8859-1") as f, open('Zillow_Price.csv', 'w') as f_out:
    
    reader = csv.reader(f, delimiter=',')
    fieldnames = ['zipcode', 'year', 'month', 'avg_price']
    writer = csv.DictWriter(f_out, fieldnames=fieldnames)
    writer.writeheader()
    header = next(reader)
    for row in reader:
        zipcode = row[1]
        entries = len(row)
        for i in range(7, entries):
            date = header[i].split('-')
            writer.writerow({'zipcode': zipcode, 'year': date[0], 'month': date[1], 'avg_price': row[i]})
            
            
