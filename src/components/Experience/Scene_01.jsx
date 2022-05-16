/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import { useGLTF } from "@react-three/drei";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import useObjectAnimation from "./useObjectAnimation";
import {
  ceilHingeProps,
  contentBackProps,
  contentFrontProps,
  contentMainProps,
} from "./_utils/sceneTransitions01";

export default function Model({ transitionState, ...props }) {
  const { nodes, materials } = useGLTF("/static/models/glb/scene_01.glb");
  const customDepthMaterials = useRef({});

  const ceilRef = useRef(null);
  const contentMainRef = useRef(null);
  const contentFrontRef = useRef(null);
  const contentBackRef = useRef(null);

  useObjectAnimation(ceilRef, transitionState, ceilHingeProps);
  useObjectAnimation(contentMainRef, transitionState, contentMainProps);
  useObjectAnimation(contentFrontRef, transitionState, contentFrontProps);
  useObjectAnimation(contentBackRef, transitionState, contentBackProps);

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
    });

    Object.values(materials).forEach((material) => {
      // 특정 Object가 사라지도록 transparency를 조절할 수 있습니다. (content 요소)
      material.opacity = 1;
      material.transparent = true;
    });
  }, [materials, nodes]);

  return (
    <group {...props} dispose={null} rotation={[0, Math.PI / 2, 0]}>
      {/* 1. Ceil Card, Backgrounds */}
      {/* Rotation으로 Main 힌지를 조정합니다. Pre: 1, Open: 0, Next: -1 */}
      <group rotation={[0, 0, (-Math.PI * 0) / 2]} ref={ceilRef}>
        <mesh
          geometry={nodes.ceil.geometry}
          material={materials.sheet_ceil}
          position={[0.05, 3.3, 0]}
          castShadow
          receiveShadow
        />
        <mesh
          ref={contentBackRef}
          geometry={nodes.back.geometry}
          material={materials.content_back}
          customDepthMaterial={customDepthMaterials.current.content_back}
          // PositionX가 보여지는 경우 -0.2, 비활성인 경우 -0.02로 변경되어야 합니다.
          position={[-0.02, 4.61, 0]}
          scale={[1, 0.67, 1.09]}
          castShadow
          receiveShadow
        />
      </group>

      {/* 2. Floor Card and Hinged items */}
      {/* Rotation으로 Main 힌지를 조절합니다.
      Close: 0 | Open: Math.PI / 2 */}
      <group rotation={[0, 0, (Math.PI * 1 * 0) / 2]}>
        <mesh
          geometry={nodes.floor.geometry}
          material={materials.sheet_floor}
          position={[-0.05, 3.31, 0]}
          castShadow
          receiveShadow
        />

        <group>
          <group position={[-0.03, 2.4, 0]}>
            {/* Rotation으로 힌지를 조절합니다.
            Close: 0 | Open: -1/2 PI */}
            <group rotation={[0, 0, (-Math.PI * 0) / 2]} ref={contentMainRef}>
              <mesh
                geometry={nodes.main.geometry}
                material={materials.content_main}
                customDepthMaterial={customDepthMaterials.current.content_main}
                scale={[1, 0.61, 1]}
                position={[0.02, 2.05, 0]}
                castShadow
                receiveShadow
              />
            </group>
          </group>

          <group position={[-0.04, 4.8, 0]}>
            {/* Rotation으로 힌지를 조절합니다. Close: -PI, Open: -1/2 * PI */}
            <group rotation={[0, 0, (-Math.PI * 2) / 2]} ref={contentFrontRef}>
              <mesh
                geometry={nodes.front.geometry}
                material={materials.content_front}
                customDepthMaterial={customDepthMaterials.current.content_front}
                scale={[1, 0.61, 1]}
                position={[-0.01, 2.05, 0]}
                castShadow
                receiveShadow
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// useGLTF.preload("/static/models/glb/scene_01.glb");