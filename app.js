/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Slider,
  Alert,
} from 'react-native';

import CoverFlow from 'react-native-coverflow';

/* eslint-disable global-require */
const CARDS = {
  '1C': require('./assets/1C.png'),
  '1S': require('./assets/1S.png'),
  '3S': require('./assets/3S.png'),
  '8H': require('./assets/8H.png'),
  '9C': require('./assets/9C.png'),
  'JC': require('./assets/JC.png'),
  'JH': require('./assets/JH.png'),
  'KH': require('./assets/KH.png'),
  'MJ': require('./assets/MJ.png'),
  'QS': require('./assets/QS.png'),
  'TS': require('./assets/TS.png'),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: 64 * 2.5,
    height: 90 * 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
  },
});

const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={{ color: 'white' }}>{title}</Text>
  </View>
);

export default class CoverFlowDemo extends Component {
  constructor(props) {
    super(props);

    const values = {
      spacing: 100,
      wingSpan: 80,
      rotation: 50,
      midRotation: 50,
      scaleDown: 0.8,
      scaleFurther: 0.75,
      perspective: 800,
      cards: 11,
    };

    this.V = ({ name, caption, min, max, step, value }) => (
      <View style={{ flex: 1 }}>
        <Text>{caption}:{value}</Text>
        <Slider
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={v => this.setState({ [name]: v })}
        />
      </View>
    );

    this.state = values;
  }

  onChange = (item) => {
    console.log(`'Current Item', ${item}`);
  }

  onPress = (item) => {
    Alert.alert(`Pressed on current item ${item}`);
  }

  getCards(count) {
    const res = [];
    const keys = Object.keys(CARDS);
    for (let i = 0; i < count && i < keys.length; i += 1) {
      const card = keys[i];
      console.log('Rendering Card', card);
      res.push(
        <Image
          key={card}
          source={CARDS[card]}
          resizeMode="contain"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '90%',
          }}
        />);
    }
    return res;
  }

  render() {
    const V = this.V;
    const { spacing, wingSpan, rotation, perspective, scaleDown, scaleFurther, midRotation, cards } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <CoverFlow
          style={styles.container}
          onChange={this.onChange}
          onPress={this.onPress}
          spacing={spacing}
          wingSpan={wingSpan}
          rotation={rotation}
          midRotation={midRotation}
          scaleDown={scaleDown}
          scaleFurther={scaleFurther}
          perspective={perspective}
          initialSelection={5}
        >
          {this.getCards(cards)}
        </CoverFlow>
        <View style={{ flexDirection: 'row' }}>
          <V caption="Spacing" name="spacing" min={0} max={200} step={1} value={spacing} />
          <V caption="Rotation" name="rotation" min={0} max={90} step={1} value={rotation} />
          <V caption="ScaleDown" name="scaleDown" min={0.2} max={1} step={0.01} value={scaleDown} />
          <V caption="Perspective" name="perspective" min={200} max={1500} step={10} value={perspective} />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <V caption="WingSpan" name="wingSpan" min={0} max={200} step={1} value={wingSpan} />
          <V caption="Mid Rotation" name="midRotation" min={0} max={90} step={1} value={midRotation} />
          <V caption="ScaleFurther" name="scaleFurther" min={0.2} max={1} step={0.01} value={scaleFurther} />
          <V caption="Cards" name="cards" min={1} max={11} step={1} value={cards} />
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('CoverFlow', () => CoverFlowDemo);
