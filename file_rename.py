#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#


def replace_space_by_underscore(path):

	import os
	import glob

	for infile in glob.glob(path):

		if ' ' in infile:
			os.rename(infile, infile.replace(" ", "_"))

if __name__ == "__main__":
	import sys
	replace_space_by_underscore(sys.argv[1])
