 #!/usr/bin/perl


use strict;
use warnings;
use Getopt::Long;


my $usage = "$0 -i|input input text file \n";

my $input_file;

GetOptions(
	"i|input=s" => \$input_file,
);
# check for user parameters, set defaults
if( !$input_file ){
	die $usage;
}

open (FILE, $input_file);

#print start of JSON
#Start with new object...
my $startNewObject = 1;
my $startNewBody = 1;

print "descriptionCards : [\n";
while (<FILE>) {
	chomp $_;
	if (length($_) <= 1 ){

		if (!$startNewObject){
			$startNewObject = 1;
			$startNewBody =1;
			print "]\nimages : {}\n},";
			next;
		}
		next;
	}

	if ($startNewObject) {
		print "{\ntitle : \"$_\",\n";
		$startNewObject = 0;
		next;
	} 
	if ($startNewBody){
		print "body : [\"$_\"";
		$startNewBody = 0;
		next;
	}
	print ", \"$_\"";
	next;
	
}

print "}\n],";





	#descriptionCards : [
    # {
     #   title : 'Description',
     #   body  : "Ash trees share several features that can be used to distinguish them from other tree species.  Ash trees have an opposite branching pattern, where buds are positioned opposite each other on twigs.  Ash trees also have compound leaves.  Compound leaves are made up of many leaflets, each of which looks like a leaf. However leaves and leaflets can be distinguished because buds are only found at the base of the overall leaf, and not each individual leaflet.  Ashes typically have 5-9 leaflets per leaf, although this varies by species.  In addition, mature ash trees have a characteristic diamond pattern to their bark and ash seeds are distinctively shaped. ",
     #   images: {}
     # },
     # {
     #   title : "American ash species",
     #   body : "While there are many different ash species present in North America, the most common include white ash, (Fraxinus americana), green ash (Fraxinus pennsylvanica), black ash, (Fraxinus nigra), and blue ash, (Fraxinus quadrangulata).",
     #   images: {}
     # }
   	 #  ],