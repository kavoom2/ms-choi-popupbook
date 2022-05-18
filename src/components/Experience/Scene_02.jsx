/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { memo, useMemo, useRef } from "react";
import * as THREE from "three";
import useMaterialAnimation from "./hooks/useMaterialAnimation";
import useObjectAnimation from "./hooks/useObjectAnimation";
import { materialTransitions } from "./transitionProps/materialTransitions02";
import {
  ceilHingeProps,
  contentFrontProps,
  contentMainProps,
  contentStripeTent,
  contentStripeTentTail,
} from "./transitionProps/sceneTransitions02";

function Model({ transitionState, nodes, materials, ...props }) {
  const customDepthMaterials = useRef({});

  const ceilRef = useRef(null);
  const contentMainRef = useRef(null);
  const contentFrontRef = useRef(null);
  const contentStripeTentRef = useRef(null);
  const contentStripeTentTailRef = useRef(null);

  useObjectAnimation(ceilRef, transitionState, ceilHingeProps);
  useObjectAnimation(contentMainRef, transitionState, contentMainProps);
  useObjectAnimation(contentFrontRef, transitionState, contentFrontProps);
  useObjectAnimation(contentStripeTentRef, transitionState, contentStripeTent);
  useObjectAnimation(
    contentStripeTentTailRef,
    transitionState,
    contentStripeTentTail
  );

  useMemo(() => {
    Object.values(nodes).forEach(
      (node) => node.isMesh && (node.receiveShadow = node.castShadow = true)
    );

    Object.entries(materials).forEach(([materialName, material]) => {
      customDepthMaterials.current[materialName] = new THREE.MeshDepthMaterial({
        depthPacking: THREE.RGBADepthPacking,
        map: material.map,
        alphaTest: 0.5,
        opacity: 0,
      });

      material.transparent = true;
    });

    materials.content_main.metalness = 0.1;
    materials.content_main.roughness = 0.8;

    materials.ceil_stripetent_tail.metalness = 0;
    materials.ceil_stripetent_tail.roughness = 0.8;
    materials.ceil_stripetent.metalness = 0;
    materials.ceil_stripetent.roughness = 0.8;
  }, [materials, nodes]);

  useMaterialAnimation(materials, transitionState, materialTransitions);

  return (
    <group {...props} dispose={null} rotation={[0, Math.PI / 2, 0]}>
      {/* 1. Ceil Card, Backgrounds */}
      {/* Rotation으로 Main 힌지를 조정합니다. Pre: 1, Open: 0, Next: -1 */}
      <group rotation={[0, 0, (Math.PI * 1 * 0) / 2]} ref={ceilRef}>
        <mesh
          geometry={nodes.ceil_02.geometry}
          material={materials.sheet_ceil_02}
          position={[0.05, 3.3, 0]}
          castShadow
          receiveShadow
        />

        <group position={[-0.01, 6.7, 0]}>
          {/* 1 - 1. Ceil Stripe Tent
          Rotation으로 힌지를 조정합니다. 
          Close: 2 * PI | Open: 1.4 / 2 * PI
          */}
          <group
            rotation={[0, 0, (Math.PI * 2) / 2]}
            ref={contentStripeTentRef}
          >
            <mesh
              geometry={nodes.ceil_stripetent.geometry}
              material={materials.ceil_stripetent}
              position={[0, 1, 0]}
              rotation={[0, 0, Math.PI]}
              scale={[1, 0.31, 1]}
            />
            {/* 1 - 2. Ceil Stripe Tent tail
            Rotation으로 힌지를 조정합니다.
            Close: 0 | Open: 0.6 / 2 * PI
             */}
            <group position={[0, 2.02, 0]}>
              <group
                rotation={[0, 0, (Math.PI * 0.6 * 0) / 2]}
                ref={contentStripeTentTailRef}
              >
                <mesh
                  geometry={nodes.ceil_stripetent_tail.geometry}
                  material={materials.ceil_stripetent_tail}
                  customDepthMaterial={
                    customDepthMaterials.current.ceil_stripetent_tail
                  }
                  position={[0, 0.33, 0]}
                  rotation={[0, 0, Math.PI]}
                  scale={[1, 0.1, 1]}
                />
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* 2. Floor Card and Hinged items */}
      {/* Rotation으로 Main 힌지를 조절합니다.
      Close: 0 | Open: Math.PI / 2 */}
      <group rotation={[0, 0, (Math.PI * 1 * 0) / 2]}>
        <mesh
          geometry={nodes.floor_02.geometry}
          material={materials.sheet_floor_02}
          position={[-0.05, 3.31, 0]}
        />

        <group>
          <group position={[-0.03, 2.6, 0]}>
            {/* Rotation으로 힌지를 조절합니다.
            Close: 0 | Open: -1/2 PI */}
            <group rotation={[0, 0, (-Math.PI * 0) / 2]} ref={contentMainRef}>
              <mesh
                geometry={nodes.main_02.geometry}
                material={materials.content_main}
                customDepthMaterial={customDepthMaterials.current.content_main}
                scale={[1, 0.61, 1]}
                position={[0.02, 2.05, 0]}
                castShadow
                receiveShadow
              />
            </group>
          </group>

          <group position={[-0.04, 5.2, 0]}>
            {/* Rotation으로 힌지를 조절합니다. Close: -2 * PI, Open: -1/2 * PI */}
            <group rotation={[0, 0, (-Math.PI * 2) / 2]} ref={contentFrontRef}>
              <mesh
                geometry={nodes.front_02.geometry}
                material={materials.content_front}
                customDepthMaterial={customDepthMaterials.current.content_front}
                scale={[1, 0.61, 1]}
                position={[-0.01, 2.05, 0]}
                castShadow
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

export default memo(Model);
