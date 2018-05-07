#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
#In a single directory replace whitespace in filenames with underscores

def replace_space_by_underscore(path):

	import os
	import glob

	for infile in os.listdir(path):

		if ' ' in infile:
			os.rename(infile, infile.replace(" ", "_"))

if __name__ == "__main__":
	import sys

	if len(sys.argv) > 1:
		path = sys.argv[1]
	else: 
		path = "."

	replace_space_by_underscore(path)
