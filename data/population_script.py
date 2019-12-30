#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Nov 11 21:00:56 2019

@author: alexmiao
"""

import csv


with open('pop_zip_year.csv', 'r', encoding = "ISO-8859-1") as f, open('yearly_population_by_zip.csv', 'w') as f_out:
    
    reader = csv.reader(f, delimiter=',')
    fieldnames = ['zipcode', 'year', 'population']
    writer = csv.DictWriter(f_out, fieldnames=fieldnames)
    writer.writeheader()
    header = next(reader)
    for row in reader:
        zipcode = row[0]
        entries = len(row)
        for i in range(1, entries):
            year = header[i]
            writer.writerow({'zipcode': zipcode, 'year': year, 'population': row[i]})
            
            
