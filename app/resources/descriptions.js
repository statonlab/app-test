import React, {Component, PropTypes} from 'react'
import {View, ScrollView, StyleSheet, TextInput, Text, DeviceEventEmitter} from 'react-native'

const Plants = {
  'American Chestnut': {
    image           : require('../img/am_chestnut4.jpg'),
    latinName       : 'Castanea dentata',
    images          : [
      require('../img/chestnut_id/1.jpg'),
      require('../img/chestnut_id/2.jpg'),
      require('../img/chestnut_id/3.jpg'),
      require('../img/chestnut_id/4.jpg')
    ],
    maps            : [require('../img/maps/am_chestnut_map.png')],
    descriptionCards: [
      {
        title : 'Species',
        body  : [<Text>American chestnut: <Text style={{fontStyle: 'italic'}}>Castanea dentata </Text></Text>],
        images: {}
      }, {
        title : 'Introduction',
        body  : [<Text>American chestnut was once a dominant tree in eastern North American forests but a deadly fungal disease wiped out most of these trees in the early 1900s. Help us find resistant trees by tagging healthy chestnut trees.</Text>],
        images: {}
      }, {
        title : 'Description',
        body  : [
          <Text>The leaves of American chestnut are straight with large, widely spaced, often hooked, serrations on their edges. Chestnut fruits are large, green and covered with spikes on the outside, bearing three large nuts on the inside. Chestnut produces long cadkins made up of many small, pale green flowers. American chestnut twigs are hairless, reddish brown and have small white lenticels. While it is relatively common to find stump-sprouting chestnuts that have been killed by blight, health mature American chestnut trees are very rare unless outside the tree’s native range.</Text>,
          <Text>To learn more about identifying American chestnut and distinguishing it from similar species visit: https://www.acf.org/resources/identification/</Text>],
        images: {}
      }, {
        images: {},
        title : 'Chestnut blight',
        body  : [<Text>Chestnut blight is caused by the fungus <Text style={{fontStyle: 'italic'}}>Cryphonectria parasitica</Text>. It was introduced to North America in the early 1900s by accidentally importing infected Asian chestnut trees. Most Asian chestnuts are quite resistant to the fungus but American chestnut proved highly susceptible and by 1940 few mature chestnut trees were left.
          The fungus that causes chestnut blight grows in the vascular system of the tree, forming a canker and eventually girdling the tree. Symptoms of chestnut blight include cracked bark, sunken cankers, and fungal structures.</Text>,
          <Text>Several breeding programs exist to develop trees that are resistant to chestnut blight. Many of these rely of hybridizing American chestnuts with resistant Chinese of Japanese chestnuts and then back crossing to American chestnut. In addition, there has been success in producing transgenic chestnut trees with genes from wheat that provide resistance.
            Our hope is that this reporting app will let members of the public identify chestnut trees that have some natural resistance to chestnut blight. We will then collect seeds from these trees and add them to tree breeding programs to try and propagate resistant trees to use in forest restoration.</Text>]
      }
    ],
    formProps       : {
      seedsBinary        : true,
      flowersBinary      : true,
      chestnutBlightSigns: true,
      crownHealth        : true,
      diameterNumeric    : true
    }
  },
  'Ash'              : {
    image           : require('../img/ash.jpg'),
    latinName       : 'Fraxinus sp.',
    images          : [
      require('../img/ash_id/1.jpg'),
      require('../img/ash_id/2.jpg'),
      require('../img/ash_id/3.jpg'),
      require('../img/ash_id/4.jpg'),
      require('../img/ash_id/5.jpg'),
      require('../img/ash_id/6.jpg'),
      require('../img/ash_id/7.jpg'),
      require('../img/ash_id/8.jpg'),
      require('../img/ash_id/9.jpg'),
      require('../img/ash_id/10.jpg'),
      require('../img/ash_id/11.jpg'),
    ],
    maps            : [
      require('../img/maps/ash_fraxamer_range.png'),
      require('../img/maps/ash_fraxnigr_range.png'),
      require('../img/maps/ash_fraxpenn_range.png'),
      require('../img/maps/ash_fraxquad_range.png')
    ],
    descriptionCards: [
      {
        title : 'Species',
        body  : [<Text>While there are many different ash species present in North America, the most common include:</Text>, <Text>white ash (<Text style={{fontStyle: 'italic'}}>Fraxinus americana</Text>)</Text>, <Text>green ash (<Text style={{fontStyle: 'italic'}}>Fraxinus pennsylvanica</Text>)</Text>, <Text>black ash (<Text style={{fontStyle: 'italic'}}>Fraxinus nigra</Text>)</Text>, <Text>blue ash (<Text style={{fontStyle: 'italic'}}>Fraxinus quadrangulata</Text>)</Text>],
        images: {}
      },
      {
        title : 'Overview',
        body  : [<Text>There are several different species of American ash trees, all of which are susceptible to the deadly emerald ash borer. Help us find resistant trees by tagging healthy ash trees.</Text>],
        images: {}
      },
      {
        title : 'Description',
        body  : [
          <Text>Ash trees share several features that can be used to distinguish them from other tree species. Ash trees have an opposite branching pattern, where buds are positioned opposite each other on twigs. Ash trees also have compound leaves. Compound leaves are made up of many leaflets, each of which looks like a leaf. However leaves and leaflets can be distinguished because buds are only found at the base of the overall leaf, and not each individual leaflet. Ashes typically have 5-9 leaflets per leaf, although this varies by species. In addition, mature ash trees have a characteristic diamond pattern to their bark and ash seeds are distinctively shaped.</Text>],
        images: {}
      }, {
        title : 'Range',
        body  : [<Text>Ash trees are present throughout Eastern and Midwestern North America. Different ash species have different distributions within this range</Text>],
        images: {}
      },
      {
        title : 'Distinguishing different ash species',
        body  : ['Leaf scars, twig shape, and species range can be very helpful in distinguishing ash tree species.',
          'Green ash has a leaf scar below the bud while white ash has a leaf scar that wraps around the bud and is more “U”-shaped.  In addition, white ash leaflets are white-colored on the undersides while green ash leaflets are green or rusty on their undersides. Blue ash can be distinguished by its thick square-shaped twigs which are often winged.  Black ash has a leaf scar similar to green ash but leaflets are directly attached to the petiole without stalks to connect them.  In addition, black ash has a more northern range and is typically found in wet sites.',
          'Read more about distinguishing American ash species here. ( https://www.ars.usda.gov/midwest-area/ames/plant-introduction-research/docs/npgs-ash-conservation-project/identifying-ash/)'
        ],
        images: {}
      }, {
        title : 'Emerald ash borer',
        body  : ['The reason we are looking for health ash trees is that an invasive insect, the emerald ash borer, is currently moving through North America and killing ash trees.  The larvae of this beetle feed on the inner bark of ash trees, cutting off the tree’s flow of water and nutrients and eventually killing the tree.  All American ash species are susceptible to the Emerald Ash Borer and so far there is very little natural resistance to the insect in our trees.  ',
          'Our hope is that this reporting app will let members of the public identify ash trees that are lingering after the emerald ash borer’s arrival and which may have some natural resistance.  We will then collect seeds from these trees and add them to tree breeding programs to try and propagate resistant trees that are not killed by the emerald ash borer to use in forest restoration.',
          'Read more about the emerald ash borer: http://www.hungrypests.com/the-threat/emerald-ash-borer.php'
        ],
        images: {}
      }
    ],
    formProps       : {
      ashSpecies     : true,
      seedsBinary    : true,
      flowersBinary  : true,
      emeraldAshBorer: true,
      crownHealth    : true,
      diameterNumeric: true
    }
  },
  'Hemlock'          : {
    image           : require('../img/hemlock.jpg'),
    latinName       : 'Tsuga sp.',
    images          : [
      require('../img/hemlock_id/1.jpg'),
      require('../img/hemlock_id/2.jpg'),
      require('../img/hemlock_id/3.jpg')
    ],
    maps            : [
      require('../img/maps/hemlock_tsugcana_range.png'),
      require('../img/maps/hemlock_tsugcaro_range.png')
    ],
    descriptionCards: [
      {
        title : 'Species',
        images: {},
        body  : [<Text>Eastern hemlock (<Text style={{fontStyle: 'italic'}}>Tsuga canadensis</Text>)</Text>, <Text>Carolina hemlock (<Text style={{fontStyle: 'italic'}}>Tsuga caroliniana</Text>)</Text>]
      },
      {
        title : 'Overview',
        images: {},
        body  : ['American hemlock trees are being killed by hemlock wooly adelgids.  Help fight these invasive insects by tagging health hemlock trees.']
      }, {
        title : 'Description',
        images: {},
        body  : ['Hemlock is an evergreen conifer. Its needles are 1.5-2 cm long, dark green on top and lighter on the underside with two white lines running the length of the needle.  Hemlocks produce small distinctive cones. These trees prefer shade and are often found along creeks and steams in mature forests', 'There are two different hemlock species native to North American, Eastern hemlock and Carolina hemlock.  Eastern hemlock is larger and has a much broader distribution than Carolina hemlock, which is endemic to the southern Appalachians.']
      }, {
        title : 'Range',
        images: {},
        body  : ['']
      }, {
        title : 'Hemlock wooly adelgid',
        body  : ['This insect sucks the sap of hemlock trees, weakening trees, preventing new growth, and eventually killing trees. In addition, hemlock wooly adelgids are thought to inject a toxin when feeding that further damages hemlock trees by drying them out.  Infested trees loose needles and branches and typically die 4-10 years after initial adelgid arrival unless treated.', 'The hemlock wooly adelgid’s name comes from the insect’s egg sacs, which hang from the undersides of branches at certain times of year and look like small wooly tufts.  These insects are invasive in North America, introduced from Japan.', 'Our hope is that this reporting app will let members of the public identify hemlock trees that have some natural resistance to hemlock wooly adelgid.  We will then collect seeds from these trees and add them to tree breeding programs to try and propagate resistant trees to use in forest restoration.'],
        images: {}
      }
    ],
    formProps       : {
      woolyAdesCoverage: true,
      crownHealth      : true,
      diameterNumeric  : true
    }
  }
  ,
  'Other'            : {
    image           : require('../img/forest.jpg'),
    images          : [],
    maps            : [],
    descriptionCards: [
      {
        title : 'Other',
        body  : ['Submissions for all other trees.'],
        images: {}
      }
    ],
    formProps       : {
      diameterNumeric: true
    }
  }
  ,
  'White Oak'        : {
    image           : require('../img/white_oak.jpg'),
    images          : [
      require('../img/white_oak_id/1.jpg'),
      require('../img/white_oak_id/2.jpg'),
      require('../img/white_oak_id/3.jpg'),
      require('../img/white_oak_id/4.jpg'),
      require('../img/white_oak_id/5.jpg'),
      require('../img/white_oak_id/6.jpg'),
    ],
    latinName       : 'Quercus alba',
    maps            : [require('../img/maps/oak_queralba_range.png')],
    descriptionCards: [
      {
        title : 'Species',
        body  : [<Text style={{fontstyle: 'italic'}}>Quercus alba </Text>],
        images: {}
      },
      {
        title : 'Overview',
        body  : ['White oak is an extremely important tree species.  It provides wood for lumber, (including bourbon barrels) and is also a key food source for wildlife.  Help us breed better white oak by tagging big, healthy trees.'],
        images: {}
      },
      {
        title : 'Description',
        body  : [<Text>American white oak, <Text style={{fontstyle: 'italic'}}>Quercus alba</Text>, is a central component of the central hardwood forests. Mature white oaks typically grow very large, 80-100 feet high, and have broad, full canopies. White oaks can live a very long time and some trees have been found that are over 400 years old.
        </Text>, 'The leaves of white oak have alternate branching and seven to nine rounded lobes.  This is different from red oaks, which typically have pointed lobes with a small hair on each tip.  ', 'It is important to note that there are several species in the “white oak” group that share this leaf shape (including swamp white oak and bur oak) and that oaks frequently hybridize, sometimes making it challenging to know which oak species you are looking at.'],
        images: {}
      },
      {
        title : 'Range',
        images: {},
        body  : ['White oak trees are present throughout Eastern and Midwestern North America.  However, this range overlaps with many other oak species.']
      }]
  }
}

export default Plants