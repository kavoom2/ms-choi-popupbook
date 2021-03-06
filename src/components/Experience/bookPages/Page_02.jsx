/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import { memo, useMemo, useRef } from "react";
import useMaterialAnimation from "../hooks/useMaterialAnimation";
import useObjectAnimation from "../hooks/useObjectAnimation";

function Model({
  pageState,
  nodes,
  materials,
  depthMaterials,
  meshTransitionProps,
  materialTransitionProps,
  ...props
}) {
  /**
   * Mesh를 직접 조작하기 위해 Ref를 선언합니다.
   */
  const ceilRef = useRef(null);
  const contentMainRef = useRef(null);
  const contentFrontRef = useRef(null);
  const contentStripeTentRef = useRef(null);
  const contentStripeTentTailRef = useRef(null);

  /**
   * 상태에 따른 Animation Props를 선언합니다.
   */
  const {
    ceilHingeProps,
    contentMainProps,
    contentFrontProps,
    contentStripeTent,
    contentStripeTentTail,
  } = meshTransitionProps;

  /**
   * Page 상태에 따라 Mesh, Material 애니메이션을 재생합니다.
   */
  useObjectAnimation(ceilRef, pageState, ceilHingeProps);
  useObjectAnimation(contentMainRef, pageState, contentMainProps);
  useObjectAnimation(contentFrontRef, pageState, contentFrontProps);
  useObjectAnimation(contentStripeTentRef, pageState, contentStripeTent);
  useObjectAnimation(
    contentStripeTentTailRef,
    pageState,
    contentStripeTentTail
  );

  useMemo(() => {
    materials.ceil_stripetent_tail.metalness = 0;
    materials.ceil_stripetent_tail.roughness = 0.8;
    materials.ceil_stripetent.metalness = 0;
    materials.ceil_stripetent.roughness = 0.8;
  }, [materials]);

  useMaterialAnimation(materials, pageState, materialTransitionProps);

  /**
   * THREE JS Object 렌더링
   */
  return (
    <group {...props} dispose={null} rotation={[0, Math.PI / 2, 0]}>
      {/* 1. Ceil Card, Backgrounds */}
      {/* Rotation으로 Main 힌지를 조정합니다. Pre: 1, Open: 0, Next: -1 */}
      <group rotation={[0, 0, (Math.PI * 1 * 0) / 2]} ref={ceilRef}>
        <mesh
          geometry={nodes.ceil_02.geometry}
          material={materials.sheet_ceil_02}
          position={[0.05, 3.3, 0]}
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
                  customDepthMaterial={depthMaterials.ceil_stripetent_tail}
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
                customDepthMaterial={depthMaterials.content_main}
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
                customDepthMaterial={depthMaterials.content_front}
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
