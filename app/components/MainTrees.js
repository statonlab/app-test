import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, TouchableOpacity, StyleSheet, Image, Text} from 'react-native'
import TreesList from '../resources/treesList'
import States from '../resources/states'
import Elevation from '../helpers/Elevation'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../helpers/Colors'

export default class MainTrees extends Component {
  /**
   * Set state.
   *
   * @param props
   */
  constructor(props) {
    super(props)

    this.cached = null

    this.state = {
      trees       : [],
      filteredData: true,
      showAll     : false
    }
  }

  /**
   * Get the location when the component mounts.
   */
  componentDidMount() {
    this._getLocation()
  }

  /**
   * Render the component.
   *
   * @return {any[]}
   */
  render() {
    return (
      <View>
        {this.state.trees.map(this._renderTree.bind(this))}
        {this.state.filteredData ?
          <View style={[styles.flexHorizontal, {
            justifyContent  : 'space-between',
            alignItems      : 'center',
            marginHorizontal: 5
          }]}>
            <TouchableOpacity
              style={styles.button}
              onPress={this._toggle.bind(this)}>
              <Text style={styles.buttonText}>
                {this.state.showAll ? 'SHOW LESS' : 'SHOW ALL'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.helpText}>
              {this.state.showAll ? 'Showing all available trees' : 'Showing trees based on current location'}
            </Text>
          </View>
          : null}
      </View>
    )
  }

  /**
   * Render a tree item.
   *
   * @param tree
   * @param index
   * @return {*}
   * @private
   */
  _renderTree(tree, index) {
    return (
      <TouchableOpacity
        style={styles.card}
        key={index}
        onPress={() => {
          this.props.onPress(tree)
        }}>
        <View style={[styles.flexHorizontal]}>
          <Image source={tree.image} style={styles.cardImage}/>
          <View style={[styles.cardBody, styles.flexHorizontal, styles.flexSpace]}>
            <View>
              <Text style={styles.cardTitle}>
                {tree.title}
              </Text>
              <Text
                style={tree.title !== 'Other' ? [styles.cardBodyText, styles.italics] : styles.cardBodyText}
                numberOfLines={3}>
                {tree.latinName}
              </Text>
            </View>
            <View>
              <Icon name="ios-arrow-forward" size={24} style={styles.icon}/>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  /**
   * Get the user location coordinates.
   *
   * @private
   */
  _getLocation() {
    // Before attempting to obtain location, let's make sure that trees need the location
    // This avoids the delay that may be caused by getting the location
    let needsLocation = 0
    TreesList.map(tree => {
      if (typeof tree.locations.alwaysShow !== 'undefined' && tree.locations.alwaysShow) {
        return
      }
      needsLocation++
    })

    if (needsLocation === 0) {
      this._setTrees(null)
      return
    }

    navigator
      .geolocation
      .getCurrentPosition(this._locationChanged.bind(this), error => {
        console.log(error)
        this._setTrees(null)
      }, {
        // Set a timeout of 1 second
        timeout           : 1000,
        enableHighAccuracy: false
      })
  }

  /**
   * Handle location changes.
   *
   * @param data
   * @private
   */
  _locationChanged(data) {
    this._setTrees({
      lat: data.coords.latitude,
      lng: data.coords.longitude
    })
  }

  /**
   * Find the user state based on the given coordinates.
   *
   * @param location
   * @private
   */
  _setTrees(location) {
    if (location === null) {
      this.setState({
        trees       : TreesList,
        filteredData: false
      })
      this.cached = TreesList
      this.props.onReady()
      return
    }

    let userStates = []
    for (let state in States) {
      if (!States.hasOwnProperty(state)) {
        continue
      }

      const bounds = States[state]
      if (this._contains(bounds, location)) {
        userStates.push(state)
      }
    }

    if (userStates.length === 0) {
      this.cached = TreesList
      this.setState({
        trees       : TreesList,
        filteredData: false
      })
      this.props.onReady()
      return
    }

    let trees = TreesList.filter(tree => {
      // check if we should always show the tree
      if (typeof tree.locations.alwaysShow !== 'undefined' && tree.locations.alwaysShow) {
        return true
      }

      // Check if the tree should be shown in all states except the listed
      if (typeof tree.locations.except !== 'undefined') {
        return userStates.filter(userState => {
          return tree.locations.except.indexOf(userState) === -1
        }).length > 0
      }

      // Check if the tree is in a state of interest
      if (typeof tree.locations.only !== 'undefined') {
        return userStates.filter(userState => {
          return tree.locations.only.indexOf(userState) > -1
        }).length > 0
      }

      // None of the above options is available, so by default we'll have always show
      return true
    })

    this.cached = trees
    this.setState({trees, filteredData: trees.length !== TreesList.length})
    this.props.onReady()
  }

  /**
   * Handle the show all button
   *
   * @private
   */
  _toggle() {
    // Do nothing if we don't have a cache yet
    if (this.cached === null) {
      return
    }

    let showAll = !this.state.showAll
    if (showAll) {
      this.setState({
        trees: TreesList,
        showAll
      })
      return
    }

    this.setState({
      showAll,
      trees: this.cached
    })
  }

  /**
   * Check if the location is within the given bounds.
   *
   * @param bounds
   * @param location
   * @return {boolean}
   * @private
   */
  _contains(bounds, location) {
    const inSouthWest = location.lat > bounds.southWest.lat && location.lng > bounds.southWest.lng
    const inNorthEast = location.lat < bounds.northEast.lat && location.lng < bounds.northEast.lng

    return inNorthEast && inSouthWest
  }
}

MainTrees.propTypes = {
  onPress: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  flexHorizontal: {
    flexDirection: 'row'
  },

  flexSpace: {
    justifyContent: 'space-between'
  },

  card: {
    ...(new Elevation(2)),
    backgroundColor : '#fff',
    marginBottom    : 10,
    marginHorizontal: 5,
    borderRadius    : 3
  },

  cardImage: {
    resizeMode: 'cover',
    flex      : 0,
    height    : 70,
    width     : 70
  },

  cardTitle: {
    backgroundColor: 'transparent',
    fontSize       : 16,
    flex           : 0,
    paddingLeft    : 5,
    fontWeight     : '500',
    marginBottom   : 5,
    color          : '#444'
  },

  cardBody: {
    flexDirection: 'column',
    flex         : 1,
    padding      : 5,
    alignItems   : 'center'
  },

  cardBodyText: {
    color        : '#777',
    paddingBottom: 10,
    paddingLeft  : 5,
    fontSize     : 14
  },

  icon: {
    color: '#777',
    width: 20
  },

  italics: {
    fontStyle: 'italic'
  },

  button: {
    backgroundColor: Colors.primary,
    padding        : 10,
    borderRadius   : 2,
    ...(new Elevation(2))
  },

  buttonText: {
    fontSize  : 14,
    color     : Colors.primaryText,
    fontWeight: 'bold'
  },

  helpText: {
    color   : '#888',
    fontSize: 12
  }
})
