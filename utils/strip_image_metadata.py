#!/usr/bin/python3
def strip_metadata(path):
	
	from gi.repository import GExiv2
	import os
	for infile in os.listdir(path):
		exif = GExiv2.Metadata(infile)
		exif.clear_exif()
		exif.clear_xmp()
		exif.save_file()

if __name__ == "__main__":
	import sys
	if len(sys.argv) > 1:
		path = sys.argv[1]
	else: 
		path = "."

	strip_metadata(path)
