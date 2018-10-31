import React from 'react'
import { Text, StyleSheet } from 'react-native'
import Atext from '../components/Atext'

const styles = StyleSheet.create({
  paragraph: {
    fontSize       : 14,
    paddingVertical: 8,
    paddingLeft    : 5,
    paddingRight   : 5,
    color          : '#444',
    lineHeight     : 21
  },
  bold     : {
    fontWeight: 'bold'
  }
})

export const ACFCollection = [
  <Text style={styles.paragraph}>
    In order for the American Chestnut Foundation to confirm your sample, you
    <Text style={{fontWeight: 'bold'}}> must mail in a plant sample</Text>.

    We provide a unique ID to include with the sample: this will link your mailed sample with your digital TreeSnap observation.
    When submitting an observation, please collect a leaf and twig sample. The sample should be collected and preserved as described below.
  </Text>,
  <Text style={styles.paragraph}>{'\u2022'} A 6-12" twig and attached, mature, green leaves growing in the full sun. </Text>,
  <Text style={styles.paragraph}>{'\u2022'} Press the sample flat between sheets of cardboard and place in an envelope.</Text>,
  <Text style={styles.paragraph}>{'\u2022'} Use a single paper towel between the sample and cardboard to cushion and absorb moisture.
  </Text>,
  <Text style={styles.paragraph}>{'\u2022'} Do not wrap in plastic, as samples will mold in the mail.
  </Text>,
  <Text style={styles.paragraph}>{'\u2022'} Do not ship overnight. It's not necessary and we won't ID your sample right away.
  </Text>,
  <Text style={styles.paragraph}>
    <Text style={{fontWeight: 'bold'}}>Submission address:</Text> please choose the office below closest to the tree's location.
  </Text>,
  <Text style={styles.paragraph}>
    {'\u2022'} “Southern Regional Science Coordinator, The American Chestnut Foundation, 50 N. Merrimon Ave, Suite 115, Asheville, NC 28804
  </Text>,
  <Text style={styles.paragraph}>
    {'\u2022'} TACF Mid-Atlantic Regional Science Coordinator, VA DOF, 900 Natural Resources Drive, Charlottesville, VA 22903
  </Text>,
  <Text style={styles.paragraph}>
    {'\u2022'} TACF North Central Regional Science Coordinator, Pennsylvania State University, 206 Forest Resources Lab, University Park, PA 16802
  </Text>,
  <Text style={styles.paragraph}>
    {'\u2022'} TACF New England Regional Science Coordinator, USFS Northern Research Station, 705 Spear St, South Burlington, VT 05403
  </Text>
]

export const Plants = {
  'American Chestnut': {
    image           : require('../img/am_chestnut4.jpg'),
    latinName       : 'Castanea dentata',
    images          : [
      require('../img/chestnut_id/4.jpg'),
      require('../img/chestnut_id/1.jpg'),
      require('../img/chestnut_id/2.jpg'),
      require('../img/chestnut_id/3.jpg')
    ],
    captions        : [
      'Chestnut leaves are straight with large, widely spaced and often hooked serrations on their margins. Photo credit: Linda Haugen, USDA Forest Service, Bugwood.org',
      'Chestnut flowers, called catkins are abundant and white. Photo credit: USDA Forest Service Southern Research Station , USDA Forest Service, SRS, Bugwood.org',
      'Chestnut fruits (called burs) are covered with spikes. Photo credit: Paul Wray, Iowa State University, Bugwood.org',
      'The insides of burs have large brown nuts. Photo credit: USDA Forest Service Southern Research Station, Bugwood.org'
    ],
    maps            : [require('../img/maps/am_chestnut_map.png')],
    descriptionCards: [
      {
        title : 'Species',
        body  : [<Text style={styles.paragraph}>American chestnut:
          <Text style={{fontStyle: 'italic'}}>Castanea dentata </Text></Text>],
        images: []
      }, {
        title : 'Introduction',
        body  : [
          <Text style={styles.paragraph}>American chestnut was once a dominant tree in eastern North American forests but a deadly fungal disease wiped out most of these trees in the early 1900s. Help us find resistant trees by tagging healthy chestnut trees.
            <Text style={{fontWeight: 'bold'}}>Please note you must mail a twig sample to the American Chestnut Foundation for your tagged trees to be used in their studies. </Text> Please read below for sample collection and shipping instructions.</Text>],
        images: []
      },
      {
        title : 'Description',
        body  : [
          <Text
            style={styles.paragraph}>The leaves of American chestnut are straight with large, widely spaced, often hooked, serrations on their edges. Chestnut fruits are large, green and covered with spikes on the outside, bearing three large nuts on the inside. Chestnut produces long cadkins made up of many small, pale green flowers. American chestnut twigs are hairless, reddish brown and have small white lenticels. While it is relatively common to find stump-sprouting chestnuts that have been killed by blight, health mature American chestnut trees are very rare unless outside the tree’s native range.</Text>,
          <Text style={styles.paragraph}>To learn more about identifying American chestnut and distinguishing it from similar species
            <Atext url="https://www.acf.org/resources/identification/">please visit the American Chestnut Foundation website.</Atext></Text>
        ],
        images: []
      }, {
        images: [
          require('../img/DCP/ChestnutBlight/Chestnut_blight.jpg')
        ],
        title : 'Chestnut blight',
        body  : [<Text style={styles.paragraph}>Chestnut blight is caused by the fungus
          <Text style={{fontStyle: 'italic'}}>Cryphonectria parasitica</Text>. It was introduced to North America in the early 1900s by accidentally importing infected Asian chestnut trees. Most Asian chestnuts are quite resistant to the fungus but American chestnut proved highly susceptible and by 1940 few mature chestnut trees were left.
          The fungus that causes chestnut blight grows in the vascular system of the tree, forming a canker and eventually girdling the tree. Symptoms of chestnut blight include cracked bark, sunken cankers, and fungal structures.</Text>,
          <Text style={styles.paragraph}>Several breeding programs exist to develop trees that are resistant to chestnut blight. Many of these rely of hybridizing American chestnuts with resistant Chinese of Japanese chestnuts and then back crossing to American chestnut. In addition, there has been success in producing transgenic chestnut trees with genes from wheat that provide resistance.
            Our hope is that this reporting app will let members of the public identify chestnut trees that have some natural resistance to chestnut blight. We will then collect seeds from these trees and add them to tree breeding programs to try and propagate resistant trees to use in forest restoration.</Text>]
      },
      {
        title : 'Collection Instructions',
        body  : ACFCollection,
        images: []
      }
    ],
    formProps       : {
      burrs              : true,
      catkins            : true,
      chestnutBlightSigns: true,
      // surroundings       : true,
      // accessibility      : true,
      crownHealth        : true,
      diameterNumeric    : true,
      heightNumeric      : true
    }
  },
  'Ash'              : {
    image           : require('../img/ash.jpg'),
    latinName       : 'Fraxinus sp.',
    images          : [
      require('../img/ash_id/ash_bark.jpg'),
      require('../img/ash_id/ash_buds.jpg'),
      require('../img/ash_id/ash_leaves.jpg'),
      require('../img/ash_id/ash_seeds.jpg')
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
        body  : [
          <Text style={styles.paragraph}>While there are many different ash species present in North America, the most common include:</Text>,
          <Text style={styles.paragraph}>white ash (<Text style={{fontStyle: 'italic'}}>Fraxinus americana</Text>)</Text>,
          <Text style={styles.paragraph}>green ash (<Text style={{fontStyle: 'italic'}}>Fraxinus pennsylvanica</Text>)</Text>,
          <Text style={styles.paragraph}>black ash (<Text style={{fontStyle: 'italic'}}>Fraxinus nigra</Text>)</Text>,
          <Text style={styles.paragraph}>blue ash (<Text style={{fontStyle: 'italic'}}>Fraxinus quadrangulata</Text>)</Text>],
        images: []
      },
      {
        title : 'Overview',
        body  : [
          <Text style={styles.paragraph}>There are several different species of American ash trees, all of which are susceptible to the deadly emerald ash borer. Help us find resistant trees by tagging healthy ash trees.</Text>],
        images: []
      },
      {
        title : 'Description',
        body  : [
          <Text
            style={styles.paragraph}>Ash trees share several features that can be used to distinguish them from other tree species. Ash trees have an opposite branching pattern, where buds are positioned opposite each other on twigs. Ash trees also have compound leaves. Compound leaves are made up of many leaflets, each of which looks like a leaf. However leaves and leaflets can be distinguished because buds are only found at the base of the overall leaf, and not each individual leaflet. Ashes typically have 5-9 leaflets per leaf, although this varies by species. In addition, mature ash trees have a characteristic diamond pattern to their bark and ash seeds are distinctively shaped.</Text>,
          <Text style={styles.paragraph}>Please include a photograph of dormant bud scars if they are present.</Text>],
        images: []
      }, {
        title : 'Range',
        body  : [
          <Text style={styles.paragraph}>Ash trees are present throughout Eastern and Midwestern North America. Different ash species have different distributions within this range</Text>],
        images: []
      },
      {
        title : 'Distinguishing different ash species',
        body  : [
          <Text style={styles.paragraph}>Leaf scars, twig shape, and species range can be very helpful in distinguishing ash tree species.</Text>,
          <Text
            style={styles.paragraph}>Green ash has a leaf scar below the bud while white ash has a leaf scar that wraps around the bud and is more “U”-shaped. In addition, white ash leaflets are white-colored on the undersides while green ash leaflets are green or rusty on their undersides. Blue ash can be distinguished by its thick square-shaped twigs which are often winged. Black ash has a leaf scar similar to green ash but leaflets are directly attached to the petiole without stalks to connect them. In addition, black ash has a more northern range and is typically found in wet sites.</Text>,
          <Atext style={styles.paragraph}
                 url="https://www.ars.usda.gov/midwest-area/ames/plant-introduction-research/docs/npgs-ash-conservation-project/identifying-ash/">
            Read more here.
          </Atext>
        ],
        images: []
      }, {
        title : 'Emerald ash borer',
        body  : [
          <Text style={styles.paragraph}>The reason we are looking for health ash trees is that an invasive insect, the emerald ash borer, is currently moving through North America and killing ash trees. The larvae of this beetle feed on the inner bark of ash trees, cutting off the tree’s flow of water and nutrients and eventually killing the tree. All American ash species are susceptible to the Emerald Ash Borer and so far there is very little natural resistance to the insect in our trees. </Text>,
          <Text style={styles.paragraph}>Our hope is that this reporting app will let members of the public identify ash trees that are lingering after the emerald ash borer’s arrival and which may have some natural resistance. We will then collect seeds from these trees and add them to tree breeding programs to try and propagate resistant trees that are not killed by the emerald ash borer to use in forest restoration.</Text>,
          <Atext style={styles.paragraph}
                 url="http://www.hungrypests.com/the-threat/emerald-ash-borer.php">Read more about the emerald ash borer here</Atext>
        ],
        images: [
          require('../img/DCP/EmAshBorer/EAB_tunneling.jpg'),
          require('../img/DCP/EmAshBorer/Emerald_ash_borer_adult.jpg')
        ]
      }
    ],
    formProps       : {
      ashSpecies             : true,
      locationCharacteristics: true,
      seedsBinary            : true,
      flowersBinary          : true,
      emeraldAshBorer        : true,
      nearbyTrees            : true,
      crownHealth            : true,
      diameterNumeric        : true,
      treated                : true
    }
  },
  'Hemlock'          : {
    image           : require('../img/hemlock.jpg'),
    latinName       : 'Tsuga sp.',
    images          : [
      require('../img/hemlock_id/3.jpg'),
      require('../img/hemlock_id/hemlock_cones.jpg'),
      require('../img/hemlock_id/hemlock_species.jpg')
    ],
    captions        : ['Hemlock needles are flattened, 1.5-2cm long, dark green on top and lighter on the underside with two white lines running the length of the needles.', '', ''],
    maps            : [
      require('../img/maps/hemlock_tsugcana_range.png'),
      require('../img/maps/hemlock_tsugcaro_range.png')
    ],
    descriptionCards: [
      {
        title : 'Species',
        images: [],
        body  : [
          <Text style={styles.paragraph}>Eastern hemlock (<Text style={{fontStyle: 'italic'}}>Tsuga canadensis</Text>)</Text>,
          <Text style={styles.paragraph}>Carolina hemlock (<Text style={{fontStyle: 'italic'}}>Tsuga caroliniana</Text>)</Text>]
      },
      {
        title : 'Overview',
        images: [],
        body  : [
          <Text style={styles.paragraph}>American hemlock trees are being killed by hemlock woolly adelgids. Help fight these invasive insects by tagging healthy hemlock trees.</Text>]
      }, {
        title : 'Description',
        images: [],
        body  : [
          <Text style={styles.paragraph}>Hemlock is an evergreen conifer. Its needles are 1.5-2 cm long, dark green on top and lighter on the underside with two white lines running the length of the needle. Hemlocks produce small distinctive cones. These trees prefer shade and are often found along creeks and steams in mature forests</Text>,
          <Text style={styles.paragraph}>There are two different hemlock species native to North American, Eastern hemlock and Carolina hemlock. Eastern hemlock is larger and has a much broader distribution than Carolina hemlock, which is endemic to the southern Appalachians.</Text>]
      }, {
        title : 'Hemlock woolly adelgid',
        body  : [
          <Text style={styles.paragraph}>This insect sucks the sap of hemlock trees, weakening trees, preventing new growth, and eventually killing trees. In addition, hemlock woolly adelgids are thought to inject a toxin when feeding that further damages hemlock trees by drying them out. Infested trees loose needles and branches and typically die 4-10 years after initial adelgid arrival unless treated.</Text>,
          <Text style={styles.paragraph}>The hemlock woolly adelgid’s name comes from the insect’s egg sacs, which hang from the undersides of branches at certain times of year and look like small woolly tufts. These insects are invasive in North America, introduced from Japan.</Text>,
          <Text style={styles.paragraph}>Our hope is that this reporting app will let members of the public identify hemlock trees that have some natural resistance to hemlock woolly adelgid. We will then collect seeds from these trees and add them to tree breeding programs to try and propagate resistant trees to use in forest restoration.</Text>],
        images: [
          require('../img/DCP/HemWoolly/HWA_photo_1.jpg'),
          require('../img/DCP/HemWoolly/HWA_photo_2.jpg')
        ]
      }
    ],
    formProps       : {
      hemlockSpecies         : true,
      woollyAdesCoverage     : true,
      cones                  : true,
      crownClassification    : true,
      locationCharacteristics: true,
      nearbyTrees            : true,
      crownHealth            : true,
      diameterNumeric        : true,
      treated                : true
      // partOfStudy            : true,
      // treated                : true,
      // accessibility          : true,
      //locationComment        : true
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
        body  : [<Text style={styles.paragraph}>Submissions for all other trees.</Text>],
        images: []
      }
    ],
    formProps       : {
      diameterNumeric        : true,
      otherLabel             : true,
      locationCharacteristics: true
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
      // require('../img/white_oak_id/5.jpg'),
      require('../img/white_oak_id/6.jpg')
    ],
    captions        : ['White oaks take many years to reach sexual maturity, and large crops of acorns are not produced until trees are 50 years old.  Photo credit: Paul Wray, Iowa State University, Bugwood.org',
      'White oak bark on mature trees is light gray in color with rectangular furrows. Photo credit: Paul Wray, Iowa State University, Bugwood.org',
      'White oak leaves have rounded lobes and are 5-8.5 inches in length.  Photo credit: Chris Evans, University of Illinois, Bugwood.org',
      'When they first emerge, white oak leaves are covered with hairs and pinkish in color.  Photo credit: Paul Bolstad, University of Minnesota, Bugwood.org',
      'White oak typically grow 80-100 feet although much taller individuals have also been recorded.  Photo credit: David Stephens, Bugwood.org'
    ],
    latinName       : 'Quercus alba',
    maps            : [require('../img/maps/oak_queralba_range.png')],
    descriptionCards: [
      {
        title : 'Species',
        body  : [<Text style={[styles.paragraph, {fontStyle: 'italic'}]}>Quercus alba </Text>],
        images: []
      },
      {
        title : 'Overview',
        body  : [
          <Text style={styles.paragraph}>White oak is an extremely important tree species. It provides wood for lumber, (including bourbon barrels) and is also a key food source for wildlife. Help us breed better white oak by tagging big, healthy trees.</Text>],
        images: []
      },
      {
        title : 'Description',
        body  : [<Text style={styles.paragraph}>American white oak,
          <Text style={{fontStyle: 'italic'}}>Quercus alba</Text>, is a central component of the central hardwood forests. Mature white oaks typically grow very large, 80-100 feet high, and have broad, full canopies. White oaks can live a very long time and some trees have been found that are over 400 years old.
        </Text>,
          <Text style={styles.paragraph}>The leaves of white oak have alternate branching and seven to nine rounded lobes. This is different from red oaks, which typically have pointed lobes with a small hair on each tip.</Text>,
          <Text style={styles.paragraph}>It is important to note that there are several species in the “white oak” group that share this leaf shape (including swamp white oak and bur oak) and that oaks frequently hybridize, sometimes making it challenging to know which oak species you are looking at.</Text>],
        images: []
      },
      {
        title : 'Range',
        images: [],
        body  : [
          <Text style={styles.paragraph}>White oak trees are present throughout Eastern and Midwestern North America. However, this range overlaps with many other oak species.</Text>]
      }
    ],
    formProps       : {
      acorns           : true,
      heightFirstBranch: true,
      crownHealth      : true,
      diameterNumeric  : true,
      oakHealthProblems: true
    }
  },

  'American Elm'   : {
    image           : require('../img/elm.jpg'),
    latinName       : 'Ulmus americana',
    maps            : [require('../img/maps/elm_map.png')],
    images          : [
      require('../img/elm_id/elmBark.jpg'),
      require('../img/elm_id/elmLeaf.jpg'),
      require('../img/elm_id/elmFlowers.jpg'),
      require('../img/elm_id/elmNonNative.jpg'),
      require('../img/elm_id/elmother.jpg'),
      require('../img/elm_id/elmTree.jpg'),
      require('../img/elm_id/elmTwig.jpg'),
      require('../img/elm_id/Elm_seeds.jpg')
    ],
    captions        : [
      null, //bark
      null, //leaf
      null, //flowers
      null, // nonnative
      null, //elmOther
      null, //elmTree
      null, //elmTwig
      'Elms produce seeds that are small, oval, papery samaras. Paul Wray, Iowa State University, Bugwood.org'//seeds
    ],
    descriptionCards: [
      {
        title : 'Species',
        body  : [<Text style={styles.paragraph}>American elm: <Text style={{fontStyle: 'italic'}}>Ulmus americana</Text></Text>],
        images: []
      }, {
        title : 'Introduction',
        body  : [
          <Text style={styles.paragraph}>American elm is a native species to North America that was once the dominant tree species along city and suburban streets. The American elm were known for their beautiful canopies and tolerance to poor soil conditions. After the introduction of Dutch elm disease in the 1930's, American elms have disappeared from the American cityscape.</Text>],
        images: []
      }, {
        title : 'Photo credits',
        body  : [
          <Text style={styles.paragraph}>Photo credits: Matt Levin, Wikimedia commons, CCBY-SA 2.0 License. Distribution maps courtesy of USGS.</Text>
        ],
        images: []
      }
    ],
    formProps       : {
      seedsBinary            : true,
      flowersBinary          : true,
      nearbyTrees            : true,
      // treated                : true,
      locationCharacteristics: true,
      crownHealth            : true,
      diameterNumeric        : true
    }
  },
  'Florida Torreya': {
    image           : require('../img/torreya/Three_Rivers_SP_11282010_034_Torreya_taxifolia_group_campground.jpg'),
    latinName       : 'Torreya taxifolia',
    maps            : [
      require('../img/maps/torreya_usa_circle_arrow.png'),
      require('../img/maps/torreya_little.png')
    ],
    images          : [
      require('../img/torreya/fnai_illustrations.jpg'),
      require('../img/torreya/top_leaves.jpg'),
      // require('../img/torreya/Torreya_taxifolia_at_Torreya_State_Park_04012018_Diana_Picklesimer_IMG_7421.png'),
      // require('../img/torreya/Gholson_Nature_Park,_Florida_Torreya_and_Helen_Roth_02102018.jpg'),
      require('../img/torreya/Three_Rivers_SP_11282010_034_Torreya_taxifolia_group_campground.jpg'),
      // require('../img/torreya/torreya_male.jpg'),
      require('../img/torreya/Three_Rivers_SP_11282010_031_Torreya_taxifolia_male_cones_group_campground.jpg'),
      //   require('../img/torreya/Torreya_seed.jpg'),
      require('../img/torreya/Torreya_taxifolia4.jpg'),
      require('../img/torreya/Torreya_taxifolia5.jpg')
      //   require('../img/torreya/torreya1_mark_schwartz_lg.jpg'),
      //   require('../img/torreya/torreya2_mark_schwartz_lg.jpg'),
      //   require('../img/torreya/2004-canker.jpg'),
      //  require('../img/torreya/fl-madroneDisease-x.jpg')
    ],
    captions        : ['Illustrations of Florida Torreya leaves, male and female cones, and underside of leaf.  Image credit: Field Guide to the Rare Plants of Florida, Florida Natural Areas Inventory, 2000.',
      'Top side of Florida Torreya leaves.  Photo credit: Leigh Brooks.',
      // 'Florida Torreya caged root sprout at Torreya State Park.  Photo credit: Diana Picklesimer.',
      // 'Helen Roth with Florida Torreya root sprout at Angus K. Gholson, Jr. Nature Park in Chattahoochee.  Photo credit: Leigh Brooks.',
      'Healthy Florida Torreya tree planted at Three Rivers State Park near Sneads.  Photo credit: Leigh Brooks.',
      //   'Under side of Florida Torreya leaves showing male sporangia in cone-like structures.  Photo credit: Dr. Loran C. Anderson.',
      'Under side of Florida Torreya leaves and buds of male cones.  Photo credit: Leigh Brooks.',
      // 'Seed of female Florida Torreya.  Photo credit: Dr. Loran C. Anderson',
      'Seed of female Florida Torreya.  Photo credit: Guy Anglin, Atlas of Florida Plants, Institute for Systematic Botany, University of South Florida, Tampa.',
      'Female Florida Torreya branches with seeds.  Photo credit: Guy Anglin, Atlas of Florida Plants, Institute for Systematic Botany, University of South Florida, Tampa.'
      //    'Close up of diseased needles on Florida Torreya.  Photo credit: Mark Schwartz, USDA USFS web page “Why Are Some Plants Rare?”',
      //    'Diseased Florida Torreya tree.  Photo credit: Mark Schwartz, USDA USFS web page “Why Are Some Plants Rare?”',
      //   'Close up of stem cankers on Florida Torreya.  Photo credit: Connie Barlow, Torreya Guardians web site',
      //  'Close up of diseased stem of Florida Torreya.  Photo credit: Connie Barlow, Torreya Guardians web site'
    ],
    descriptionCards: [
      {
        title: 'Overview',
        body : [<Text style={styles.paragraph}> Florida Torreya; Gopherwood; Stinking Cedar; Florida nutmeg</Text>,
          <Text style={styles.paragraph}>Florida Torreya is one of the rarest tree species in the US, with distribution limited to a very narrow area of the upper Apalachicola River basin in Florida and just into Georgia. It used to be the dominant mid-story tree in the Apalachicola bluffs and ravines region, but in the 1950s the trees began dying off from a fungal blight and now only a fraction of trees remain. Help us by providing locations and measurements of trees on private property, and especially to find disease-free trees.</Text>
        ]
      },
      {
        title: 'Description',
        body : [
          <Text style={styles.paragraph}>Florida Torreya is an evergreen conifer. Its needle-like leaves are glossy dark green above, 0.5 to 1.5 inches long, stiff, <Text
            style={styles.bold}>prickly at the tips</Text>, arranged in flat sprays along the branch when fully developed. Disease-free trees can grow up to 60 feet tall in a conical shape with a trunk diameter of 1 foot or more and luxuriant whorled branches, but most trees in wild native habitat are root sprouts just a few feet tall, or if taller they lack lower branches or leaves on lower branches and the trunk may be less than 1 inch diameter. Seeds on female trees are roundish green drupes about the size of a large olive, tiny cones on male trees grow along branches, but these features are rarely seen in the wild.</Text>
        ]
      },
      {
        title: 'Fusarium torreyae',
        body : [
          <Text style={styles.paragraph}>
            The deadly fungus has been identified as Fusarium torreyae, thought to be imported from Asia, and appears to be ubiquitous in the ravines area. Root sprouts die before reaching maturity and producing fruit, so the species will go extinct in the wild without intervention. Researchers will coordinate with you to take cuttings of your trees which will be grown offsite to save the most genetic diversity possible. Of utmost importance is finding trees that do not exhibit cankers or other signs of disease stress so that genes for disease resistance can be found and used in a breeding program.</Text>,


          <Text style={styles.paragraph}> More information can be found at:</Text>,

          <Text style={styles.paragraph}>{'\u2022'} <Atext url="www.torreyatreeoflife.com">
            Torreya Tree Of Life
          </Atext> </Text>,
          <Text style={styles.paragraph}>{'\u2022'}<Atext url="explorer.natureserve.org/"> NatureServe Explorer </Atext>
          </Text>,
          <Text style={styles.paragraph}>{'\u2022'}<Atext url="www.fnai.org/FieldGuide/pdf/Torreya_taxifolia.PDF"> Florida Natural Areas Inventory </Atext>
          </Text>,
          <Text style={styles.paragraph}>{'\u2022'}<Atext url="www.fws.gov/panamacity/listedplants.html#Torreya"> U.S. Fish and Wildlife: Panama City Field Office </Atext>
          </Text>
        ]
      }
    ],
    formProps       : {
      heightNumeric      : true,
      diameterNumeric    : true,
      numberRootSprouts  : true,
      seedsBinary        : true,
      conesMaleFemale    : true,
      deerRub            : true,
      torreyaFungalBlight: true
    }
  },


  'Pacific Madrone': {
    image           : require('../img/madrone/ARME_flowers-min.jpg'),
    latinName       : 'Arbutus menziesii',
    maps            : [
      require('../img/madrone/madrone_map.jpg')
    ],
    images          : [
      require('../img/madrone/ARME_bark-min.jpg'),
      require('../img/madrone/ARME_berries_01-min.jpg'),
      require('../img/madrone/ARME_berries_02-min.jpg'),
      require('../img/madrone/ARME_crown-min.jpg'),
      require('../img/madrone/ARME_flowers-min.jpg'),
      require('../img/madrone/ARME_foliage-min.jpg'),
    ],
    captions        : [
      'Multi-stemmed trunk and/or peeling bark. Michael Yadrick, City of Seattle',
      'Red berries, fruits on terminal clusters. Marianne Elliott, WSU (01); Michael Yadrick, City of Seattle (02)',
      'Red berries, fruits on terminal clusters. Marianne Elliott, WSU (01); Michael Yadrick, City of Seattle (02)',
      'Growth structure rounded, spreading crown. Michael Yadrick, City of Seattle',
      'White urn-shaped flowers. Michael Yadrick, City of Seattle',
      'Ovular, leathery leaves retained throughout the year (evergreen). Michael Yadrick, City of Seattle',
    ],
    descriptionCards: [
      {
        title: 'Overview',
        body : [
          <Text style={styles.paragraph}> Arbutus menziesii Pursh (Ericaceae) Pacific madrone, madrone, madrona, arbutus</Text>,
          <Text style={styles.paragraph}>The Pacific madrone (Arbutus menziesii Pursh) tree is the largest member of the family Ericaceae. It is the most distinctive hardwood tree native to the West Coast of North America, ranging from southwestern British Columbia to southern California. In natural forest ecosystems, the tree is rarely dominant, but it is diagnostic of unique plant communities found on drier, lower elevation sites as well as on coastal bluffs and mountains. The tree is relatively drought tolerant and fast growing, but does not tolerate extreme temperature changes.</Text>
        ]
      },
      {
        title: 'Description',
        body : [
          <Text style={styles.paragraph}>Madrone stem(s) twist and lean, and its bark can display a range of colors (orange, green, red to deep-brown cinnamon), peeling with age. Madrones have ovular, leathery leaves that are retained throughout the year and rounded, spreading crowns. White flowers appear in April to May on terminal clusters. Certain birds feed on the largish red berries that mature in late fall.</Text>
        ]
      },
      {
        title: 'Challenges',
        body : [
          <Text style={styles.paragraph}>Thinning stands, soil loss and compaction, fire suppression and other urban impacts increase susceptibility of this species to diseases, leaving it vulnerable to heart rot, butt rot, leaf diseases and cankers. Increased disease may also be connected to more frequent extended drought periods and a higher frequency of warmer, wetter spring weather. TreeSnap data will help with conservation and restoration of this species by classifying individual tree health to understand disease tolerance while also identifying a true range for the species.</Text>,
          <Text style={styles.paragraph}>Elliott, M. (1999). Diseases of Pacific madrone. In: Adams, A. B.; Hamilton, Clement W., eds. The Decline of Pacific Madrone (Arbutus Menziesii Pursh): Current Theory and Research Directions: Proceedings of the April 28, 1995 Symposium Held at the Center for Urban Horticulture, University of Washington, Seattle, Washington & Subsequent Research Papers (p. 140). Save Magnolia's Madrones. <Atext
            url="http://depts.washington.edu/hortlib/collections/madrone/ch07_el.pdf">http://depts.washington.edu/hortlib/collections/madrone/ch07_el.pdf</Atext></Text>,
          <Text style={styles.paragraph}>Reeves, Sonja L. "Arbutus menziesii". Fire Effects Information System. U.S. Department of Agriculture, Forest Service, Rocky Mountain Research Station, Fire Sciences Laboratory. Retrieved September 22, 2012. <Atext
            url="https://www.fs.fed.us/database/feis/plants/tree/arbmen/all.html">https://www.fs.fed.us/database/feis/plants/tree/arbmen/all.html</Atext></Text>,
          <Text style={styles.paragraph}>Washington State University Extension Pacific Madrone Research <Atext url="https://ppo.puyallup.wsu.edu/pmr">https://ppo.puyallup.wsu.edu/pmr</Atext></Text>
        ]
      }
    ],
    formProps       : {
      heightNumeric  : true,
      diameterNumeric: true,
      standDiversity : true,
      crownAssessment: true,
      madroneDisease :         true
    }
  },


  'Eastern Larch': {
    image           : require('../img/eastern_larch/id.png'),
    latinName       : 'Larix laricina',
    maps            : [
      require('../img/eastern_larch/dist-map.png')
    ],
    images          : [
      require('../img/eastern_larch/leaves.png'),
      require('../img/eastern_larch/autumn-leaves.png'),
      require('../img/eastern_larch/cones.png'),
      require('../img/eastern_larch/bark.png'),
      require('../img/eastern_larch/adult.png')
    ],
    captions        : [
      'Eastern Larch needles grow in clusters ranging from 10-20, 1”  needles on short shoots. Tamaracks on Barnum Bog at the Paul Smiths VIC (12 July 2012).',
      'In Autumn, Eastern Larch needles turn a golden-yellow color. Tamaracks on Barnum Bog at the Paul Smiths VIC (12 July 2012).',
      'A comparison of young and mature cones found on Eastern Larches. Cook, William. Eastern Larch Cones from Michigan State University, (9 July 2009).',
      'Eastern Larch’s bark is dark gray and flaky, and the trunk is very tall and straight with little taper. Cook, William. Eastern Larch Bark from Michigan State University, (9 July 2009).',
      'An adult Eastern Larch mid-color change. Drasher, Tamarack tree located at the University of Vermont. (2014).'
    ],
    descriptionCards: [
      {
        title: 'Overview',
        body : [
          <Text style={styles.paragraph}>
            Eastern larch (Larix laricina) is common in New England, the upper Midwest, and much of Canada. It often goes by the alternative common names of Tamarack and American Larch. Eastern larch is one of the few evergreens that loses its leaves in the fall. The reason for this, and process, in Eastern larch is not well understood. Researchers are aiming to investigate this by collecting samples throughout the annual cycle of individual trees, to study both their physical and genetic characteristics.
          </Text>,
          <Text style={styles.paragraph}>
            The needle dropping period occurs very soon after the needles change color from green-blue to golden-yellow. The specific timing of this period can vary due to changes in temperatures and daylight patterns. Needle samples will be collected in the Fall for sequencing and it is important to document the color changes and needle drop to further our understanding of this phenomenon.
          </Text>
        ]
      },
      {
        title: 'Description',
        body : [
          <Text style={styles.paragraph}>The Eastern Larch grows to be about 20 meters tall with a tall, slender, straight trunk while the bark on young trees tend to be gray and smooth and older trees adopt a more gray-brown hue with flakes. The 1” needles are bound in groups of 10-20 on short shoots, and change from a pale green-blue to a golden-yellow in the fall. Seed cones are 0.5” long and form in clusters about the shoots.</Text>,
          <Text style={styles.paragraph}>The process of Autumn leaf senescence in eastern larches are not well understood. Researchers are aiming to investigate this by collecting samples throughout the annual cycle of individual trees, then to study both their physical and genetic characteristics.</Text>,
          <Text style={styles.paragraph}>More information can be found at:</Text>,
          <Text style={styles.paragraph}>{'\u2022'}<Atext url="http://curiousnature.info/A1-Larch.htm">A Conifer That Thinks It's a Broadleaf</Atext></Text>,
          <Text style={styles.paragraph}>{'\u2022'}<Atext url="https://www.lakeforest.edu/academics/programs/environmental/courses/es204/larix_laricina.php">Larix laricina (Tamarack, American Larch) Pinaceae</Atext></Text>
        ]
      }
    ],
    formProps       : {
      // heightNumeric      : true,
      diameterNumeric: true,
      needleColor    : true,
      needleAmount   : true
    }
  },

  'Tan Oak': {
    image           : require('../img/tanoak/Healthytanoak_Sarah_Navarro-min.JPG'),
    latinName       : 'Notholithocarpus densiflorus',
    maps            : [
      require('../img/tanoak/distributionmap.jpg')
    ],
    images          : [
      require('../img/tanoak/Closeupacorns_PatBreen-min.jpg'),
      require('../img/tanoak/ealryacornandcatkinclose_PatBreen-min.JPG'),
      require('../img/tanoak/Earlyacornsandcatkins_PatBreenOSU-min.jpg'),
      require('../img/tanoak/HealthySpringTanoakLeaves_SarahNavarro-min.jpg'),
      require('../img/tanoak/Healthytanoak_Sarah_Navarro-min.JPG'),
      require('../img/tanoak/Leafcloseup_PatBreenOSU-min.jpg'),
      require('../img/tanoak/Seedandflower_PatBreenOSU-min.jpg'),
    ],
    captions        : [
      'Close up of acorns. Photo by Pat Breen@OSU',
      'Early acorn and catkin close up. Photo by Pat Breen@OSU',
      'Early acorn and catkins. Photo by Pat Breen@OSU',
      'Healthy spring tanoak leaves.  Photo by Sarah Navarro, ODF',
      'Healthy Tanoak. Photo by Sarah Navarro, ODF',
      'Leaf close up showing wavy toothed margins and straight parallel sunken veins. Photo by Pat Breen@OSU',
      'Seed and flower. Photo by Pat Breen@OSU',
    ],
    descriptionCards: [
      {
        title: 'Overview',
        body : [
          <Text style={styles.paragraph}>Notholithocarpus densiflorus, tanoak, tanbark oak</Text>,
          <Text style={styles.paragraph}>Tanoak trees are being killed by sudden oak death.  Help fight this introduced disease by tagging healthy tanoak trees.</Text>,
          <Text style={styles.paragraph}>We are asking citizen scientists to identify and record locations of healthy mature tanoaks in areas impacted by Sudden Oak Death in Curry County, Oregon. Identifying healthy mature tanoaks in areas with prolonged pathogen infestation is the first step in identifying trees that may have natural resistance to the disease.</Text>
        ]
      },
      {
        title: 'Description',
        body : [
          <Text style={styles.paragraph}>Tanoak is a broadleaf evergreen tree most commonly found in coastal locations in southern Oregon, its range extends east to the Siskiyou and Klamath mountains.</Text>,
          <Text style={styles.paragraph}>Oblong leaves are thick and leathery with a wavy-toothed border, shiny light green above, whitish beneath, 6-13 cm long, 2-6 cm wide.  Flowers are unisexual, male flowers are in catkins 5-10 cm long, white but turning rust colored, with an unpleasant odor; greenish-yellow female flowers are found at the base of catkins.  Acorns are egg-shaped, 2-3 cm long, shallow saucer-shaped cup, covered with dense bristles; mature in the second year. From OSU landscape plants; <Atext url="https://landscapeplants.oregonstate.edu/plants/notholithocarpus-densiflorus">https://landscapeplants.oregonstate.edu/plants/notholithocarpus-densiflorus</Atext></Text>
        ]
      },
      {
        title: 'Challenges',
        body : [
          <Text style={styles.paragraph}>Tanoak is an important native hardwood species in southern Oregon, with significant ecological and cultural values.  This species is suffering significant mortality from Phytophthora ramorum, the introduced pathogen that causes Sudden Oak Death.</Text>,
          <Text style={styles.paragraph}>Healthy mature tanoaks identified in this program will be assessed for acorn collection. Acorns will be grown in seedling trials to determine genetic resistance to Sudden Oak Death with the goal of propagating resistant trees to use in forest restoration.</Text>,
          <Text style={styles.paragraph}>For additional information refer to Sudden Oak Death: Prevention, Recognition, Restoration (EM 9216) <AText url="https://catalog.extension.oregonstate.edu/em9216">https://catalog.extension.oregonstate.edu/em9216</AText></Text>
        ]
      }
    ],
    formProps       : {
      // heightNumeric  : true,
      diameterNumeric: true,
      crownClassification : true,
      canopyHealth: true,
      acorns: true,
      treated: true,
    }
  },
}

