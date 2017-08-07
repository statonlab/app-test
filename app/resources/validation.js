import t from 'tcomb-validation'
import DCP from '../resources/config'

//TO DO: validate to a list of the choices instead

const DCPrules = {
  seedsBinary            : t.enums.of(DCP.seedsBinary.selectChoices, 'seed'),
  flowersBinary          : t.enums.of(DCP.flowersBinary.selectChoices, 'flowers'),
  woollyAdesPres         : t.Boolean,
  woollyAdesCoverage     : t.enums.of(DCP.woollyAdesCoverage.selectChoices, 'woollyAdesCoverage'),
  acorns                 : t.enums.of(DCP.acorns.selectChoices, 'acorns'),
  heightFirstBranch      : t.String,
  diameterNumeric        : t.String,
  heightNumeric          : t.String,
  ashSpecies             : t.enums.of(DCP.ashSpecies.selectChoices, 'ashSpecies'),
  crownHealth            : t.enums.of(DCP.crownHealth.selectChoices, 'crownHealth'),
  otherLabel             : t.String,
  treated                : t.enums.of(DCP.treated.selectChoices),
  cones                  : t.enums.of(DCP.cones.selectChoices),
  crownClassification    : t.enums.of(DCP.crownClassification.selectChoices),
  partOfStudy            : t.enums.of(DCP.partOfStudy.selectChoices),
  locationComment        : t.maybe(t.String),
  burrs                  : t.enums.of(DCP.burrs.selectChoices),
  catkins                : t.enums.of(DCP.catkins.selectChoices),
  locationCharacteristics: t.String,
  nearbyTrees            : t.String,
  emeraldAshBorer        : t.maybe(t.String),
  oakHealthProblems      : t.maybe(t.String),
  chestnutBlightSigns    : t.maybe(t.String)
  //Deprecated choices
  // surroundings           : t.enums.of(DCP.surroundings.selectChoices)
  // nearbySmall            : t.enums.of(DCP.nearbySmall.selectChoices),
  // nearbyDead             : t.enums.of(DCP.nearbyDead.selectChoices),
  // accessibility          : t.enums.of(DCP.accessibility.selectChoices),
  // nearByHemlock          : t.enums.of(DCP.nearByHemlock.selectChoices),
}
export default DCPrules