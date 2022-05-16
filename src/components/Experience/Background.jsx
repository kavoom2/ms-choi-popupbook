import { ContactShadows } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Depth, LayerMaterial, Noise } from "lamina";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  sceneBgPropTypes,
  transitionStatesPropTypes,
} from "./_utils/propTypes";
import { defaultSceneBackgrounds } from "./_utils/sceneConstants";
import { animationStateTypes } from "./_utils/types";

Background.propTypes = {
  states: transitionStatesPropTypes,
  sceneBackgrounds: sceneBgPropTypes,
};

Background.defaultProps = {
  states: [],
  sceneBackgrounds: defaultSceneBackgrounds,
};

function Background({ states, sceneBackgrounds }) {
  const depthRef = useRef(null);
  const openedIdx = getOpenedIdx(states);

  const { bottomColor, topColor, contactShadowColor } = colorSelector(
    sceneBackgrounds,
    openedIdx
  );

  const [bColor, tColor, csColor] = useMemo(
    () => [
      new THREE.Color(bottomColor),
      new THREE.Color(topColor),
      new THREE.Color(contactShadowColor),
    ],
    []
  );

  useFrame(() => {
    bColor.lerp(new THREE.Color(bottomColor), 0.01);
    tColor.lerp(new THREE.Color(topColor), 0.01);
    csColor.lerp(new THREE.Color(contactShadowColor), 0.01);

    depthRef.current.colorA = tColor;
    depthRef.current.colorB = bColor;
  });

  return (
    <>
      {/* Background Mesh */}
      <mesh scale={100}>
        <boxGeometry args={[1, 1, 1]} />
        <LayerMaterial side={THREE.BackSide}>
          <Depth
            ref={depthRef}
            colorB={bColor} // BottomColor
            colorA={tColor} // TopColor
            alpha={1}
            mode="normal"
            near={0}
            far={150}
            origin={[0, 100, -100]}
          />
          <Noise
            mapping="local"
            type="white"
            scale={1000}
            colorA="white"
            colorB="black"
            mode="subtract"
            alpha={0.01}
          />
        </LayerMaterial>
      </mesh>

      {/* Contact Shadow */}
      <ContactShadows
        frames={1}
        position={[0, -3, 0]}
        opacity={1}
        width={16}
        height={8}
        blur={2.5}
        far={4}
        color={csColor}
      />
    </>
  );
}

function getOpenedIdx(states = []) {
  const min = 0;
  const max = states.length - 1;

  const idx = states.lastIndexOf(animationStateTypes.open);

  if (idx < min) return min;
  if (idx > max) return max;
  return idx;
}

function colorSelector(sceneBackgrounds, idx) {
  const { bottomColor, topColor, contactShadowColor } = sceneBackgrounds[idx];

  return {
    bottomColor,
    topColor,
    contactShadowColor,
  };
}

export default Background;