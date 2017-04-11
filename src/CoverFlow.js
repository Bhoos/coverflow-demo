import React, { Component, Children } from 'react';
import { TouchableOpacity, Animated, View, PanResponder, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'green',
  }
});

const pageWidth = 40;
const deceleration = 0.99; // Fast 0.998 for slow

class CoverFlow extends Component {
  static propTypes = {
    sensitivity: PropTypes.oneOf(['low', 'normal', 'high']),
    spacing: PropTypes.number,
    wingSpan: PropTypes.number,
    rotation: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.offsetX = 0;
  }

  state = {
    width: 0,
    offsetX: 0,
    currentItem: 0,
    panX: new Animated.Value(0),
  };

  onLayout = ({nativeEvent}) => {
    this.setState({
      width: nativeEvent.layout.width,
    });
  }

  onSelect = (idx) => {
    console.log('Select', idx);
    Animated.spring(this.state.panX, {
      toValue: idx * pageWidth,
    }).start();
  }

  renderItem = (item, idx) => {
    if (!this.state.width) {
      return;
    }

    const { width, panX, currentItem } = this.state;
    const count = Children.count(this.props.children);

    const distance = 100; //120;
    const spacing = 30;
    const angle = 60;

    const style = {
      // shadowColor: '#333',
      // shadowOpacity: 0.1,
      // shadowOffset: { height: 10 },
      // elevation: 10,
      transform: [
        { perspective:  700},


      { translateX: panX.interpolate({
          inputRange: [(idx - 2) * pageWidth, (idx - 1) * pageWidth, idx * pageWidth, (idx + 1) * pageWidth, (idx + 2) * pageWidth],
          outputRange: [spacing + distance, distance, 0, -distance, -distance - spacing],
        })},
      {
        rotateY: panX.interpolate({
          inputRange: [(idx - 2) * pageWidth, (idx - 1) * pageWidth, idx * pageWidth, (idx + 1) * pageWidth, (idx + 2) * pageWidth],
          outputRange: [`${-angle}deg`, `${-angle}deg`, '0deg', `${angle}deg`, `${angle}deg`],
          extrapolate: 'clamp',
        })
      },
      {
        scale: panX.interpolate({
          inputRange: [(idx - 2) * pageWidth, (idx - 1) * pageWidth, idx * pageWidth, (idx + 1) * pageWidth, (idx + 2) * pageWidth],
          outputRange: [0.75, 0.8, 1, 0.8, 0.75]
        })
      }

      //     { rotateY: panX.interpolate({
      //     inputRange: [0, idx * pageWidth, count * pageWidth],
      //     outputRange: [`${idx*10}deg`, "0deg", `${(idx-count)*10}deg`],
      //   })
      // },
      ]
    };

    return (
      <Animated.View pointerEvents="box-none" style={{position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: panX.interpolate({
        inputRange: [(idx - 1) * pageWidth, idx * pageWidth, (idx + 1) * pageWidth],
        outputRange: [-pageWidth, 0, -pageWidth],
      }),
    }}>

        <Animated.View style={style}>
          <TouchableOpacity onPress={() => this.onSelect(idx)} activeOpacity={0.8}>
            {item}
          </TouchableOpacity>
        </Animated.View>

      </Animated.View>
    )
  }

  componentWillMount() {
    const { panX } = this.state;

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => { return Math.abs(gestureState.dx) > 10; },
      onPanResponderGrant: (evt, gestureState) => {
        this.offsetX = panX.__getValue();
        console.log('Start Pan');
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        //console.log('Settin value to', this.offsetX - gestureState.dx);
        panX.setValue(this.offsetX - gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // s = ut + 1/2 at^2
        const u = -gestureState.vx;
        //console.log('Initial Velocity', u);
        const t = Math.abs(u / deceleration);
        //console.log('Time period', t);
        const displacement = (u * t / 2);
        //console.log('Displacement', displacement);

        let finalPos = panX.__getValue() + displacement;
        // Round the final Position to the nearest value
        finalPos = Math.round(finalPos / pageWidth) * pageWidth;
        if (finalPos < 0) {
          finalPos = 0;
        }
        if (finalPos > (Children.count(this.props.children) - 1) * pageWidth) {
          finalPos = (Children.count(this.props.children) - 1) * pageWidth;
        }

        // panX.setValue(finalPos);
        Animated.spring(panX, {
          toValue: finalPos,
          //duration: t * 1000,
        }).start();
      },
    })
  }

  render() {
    const { children, ...other } = this.props;
    const { scrollX } = this.state;

    return (
      <View style={styles.container} onLayout={this.onLayout} {...this.panResponder.panHandlers}>
        {Children.map(children, this.renderItem)}
      </View>
    )
  }
}

export default CoverFlow;
