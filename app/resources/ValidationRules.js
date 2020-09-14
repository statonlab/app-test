import t from 'tcomb-validation'
import DCP from './FormElements'

// TODO: validate to a list of the choices instead

// Instructions:
// SINGLE CHOICE should be t.enums.of().
// MULTIPLE CHOICE must be t.string.
// OPTIONAL choices should be wrapped in t.maybe().


const ValidationRules = {
//  seedsBinary            : t.enums.of(DCP.seedsBinary.selectChoices, 'seed'),
  seedsBinary            : t.enums.of(DCP.seedsBinary.selectChoices),
  flowersBinary          : t.enums.of(DCP.flowersBinary.selectChoices, 'flowers'),
  woollyAdesPres         : t.Boolean,
  woollyAdesCoverage     : t.enums.of(DCP.woollyAdesCoverage.selectChoices, 'woollyAdesCoverage'),
  hemlockSpecies         : t.enums.of(DCP.hemlockSpecies.selectChoices, 'hemlockSpecies'),
  acorns                 : t.enums.of(DCP.acorns.selectChoices, 'acorns'),
  heightFirstBranch      : t.String,
  diameterNumeric        : t.String,
  heightNumeric          : t.String,
  ashSpecies             : t.enums.of(DCP.ashSpecies.selectChoices, 'ashSpecies'),
  ashFrequency           : t.enums.of(DCP.ashFrequency.selectChoices, 'ashFrequency'),
  oregonAshHealth        : t.enums.of(DCP.oregonAshHealth.selectChoices, 'oregonAshHealth'),
  seedCollected          : t.enums.of(DCP.seedCollected.selectChoices, 'seedCollected'),
  crownHealth            : t.enums.of(DCP.crownHealth.selectChoices, 'crownHealth'),
  crownPortion           : t.maybe(t.String),
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
  chestnutBlightSigns    : t.maybe(t.String),
  numberRootSprouts      : t.String,
  deerRub                : t.enums.of(DCP.deerRub.selectChoices),
  conesMaleFemale        : t.enums.of(DCP.conesMaleFemale.selectChoices),
  torreyaFungalBlight    : t.maybe(t.String),
  needleColor            : t.enums.of(DCP.needleColor.selectChoices),
  needleAmount           : t.enums.of(DCP.needleAmount.selectChoices),
  standDiversity         : t.enums.of(DCP.standDiversity.selectChoices),
  crownAssessment        : t.enums.of(DCP.crownAssessment.selectChoices),
  madroneDisease         : t.String,
  canopyHealth           : t.enums.of(DCP.canopyHealth.selectChoices),
  standTagging           : t.enums.of(DCP.standTagging.selectChoices),
  plantedWild            : t.enums.of(DCP.plantedWild.selectChoices),
  bearingFruit           : t.enums.of(DCP.bearingFruit.selectChoices),
  crownDieback           : t.enums.of(DCP.crownDieback.selectChoices),
  hybridAttributes       : t.enums.of(DCP.hybridAttributes.selectChoices),
  hybridTraits           : t.maybe(t.String),
  breastNumeric          : t.String,
  canopyCones            : t.enums.of(DCP.canopyCones.selectChoices),
  conesOpenClosed        : t.enums.of(DCP.conesOpenClosed.selectChoices),
  neighborCones          : t.enums.of(DCP.neighborCones.selectChoices),
  neighborHealth         : t.enums.of(DCP.neighborHealth.selectChoices),


  //Deprecated choices
  // surroundings           : t.enums.of(DCP.surroundings.selectChoices)
  // nearbySmall            : t.enums.of(DCP.nearbySmall.selectChoices),
  // nearbyDead             : t.enums.of(DCP.nearbyDead.selectChoices),
  // accessibility          : t.enums.of(DCP.accessibility.selectChoices),
  // nearByHemlock          : t.enums.of(DCP.nearByHemlock.selectChoices),
}
export default ValidationRules
