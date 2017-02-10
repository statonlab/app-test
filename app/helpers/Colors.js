/**
 * Colors library
 *
 * @type {{}}
 */

const NamedColors = {
  jungleGreen   : "#2A9D8F",
  japaneseIndigo: "#264653",
  lightRedOchre : "#E76F51",
  sandyBrown    : "#F4A261",
  hansaYellow   : "#E9C46A",

  darkerJungleGreen: "#25897d",
}

const Colors = {
  primary: NamedColors.jungleGreen,
  darkerPrimary: NamedColors.darkerJungleGreen,
  warning: NamedColors.hansaYellow,
  danger : NamedColors.lightRedOchre,
  info   : NamedColors.sandyBrown,
  success: NamedColors.jungleGreen,

  primaryText: "#ffffff",
  darkerPrimaryText: "#ffffff",
  warningText: "#1F2D3D",
  dangerText: "#ffffff",
  infoText: "#1F2D3D",
  successText: "#ffffff",

  transparentDark: "rgba(0,0,0,.5)",
}

export default Colors;