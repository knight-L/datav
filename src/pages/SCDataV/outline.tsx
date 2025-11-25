import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Extrude } from "@react-three/drei";
import { useControls } from "leva";
import { Color, Shape, Vector2, type IUniform } from "three";
import { type GeoProjection } from "d3-geo";

import scOutlineData from "@/assets/sc_outline.json";

export function OutLineAnimated() {
  const controls = useControls({
    background: { label: "侧边颜色", value: "#0e171a" },
    background1: {
      label: "侧边扫光颜色",
      value: "#90aba7",
      transient: false,
      onChange: (v) => {
        uniformsRef.current.uRiseColor.value = new Color(v);
      },
    },
  });
  const uniformsRef = useRef<{
    uRiseTime: IUniform<number>;
    uRiseColor: IUniform<Color>;
  }>({
    uRiseTime: { value: -0.8 },
    uRiseColor: { value: new Color(controls.background1) },
  });

  useFrame(() => {
    uniformsRef.current.uRiseTime.value =
      uniformsRef.current.uRiseTime.value >= 0.5
        ? -0.8
        : uniformsRef.current.uRiseTime.value + 0.003;
  });

  return (
    <meshPhysicalMaterial
      transparent
      opacity={0.9}
      color={controls.background}
      onBeforeCompile={(shader) => {
        shader.uniforms = {
          ...shader.uniforms,
          ...uniformsRef.current,
        };

        shader.vertexShader = shader.vertexShader
          .replace(
            "#include <common>",
            `
                #include <common>
                varying vec3 vTransformedNormal;
                varying float vHeight;
              `
          )
          .replace(
            "#include <begin_vertex>",
            `
                #include <begin_vertex>
                vTransformedNormal = normalize(normal);
                vHeight = transformed.z;
              `
          );

        shader.fragmentShader = shader.fragmentShader
          .replace(
            "#include <common>",
            `
            #include <common>
            uniform vec3 uRiseColor;
            uniform float uRiseTime;
            varying float vHeight;
            varying vec3 vTransformedNormal;

            vec3 riseLine() {
                float smoothness = 0.5;
                float speed = uRiseTime;
                bool isTopBottom = (vTransformedNormal.z > 0.0 || vTransformedNormal.z < 0.0) && vTransformedNormal.x == 0.0 && vTransformedNormal.y == 0.0;
                float ratio = isTopBottom ? 0.0 : smoothstep(speed, speed + smoothness, vHeight) - smoothstep(speed + smoothness, speed + smoothness * 2.0, vHeight);
                return uRiseColor * ratio;
            }
            `
          )
          .replace(
            "#include <dithering_fragment>",
            `
                #include <dithering_fragment>
                gl_FragColor = gl_FragColor + vec4(riseLine(), 1.0);
              `
          );
      }}
    />
  );
}

export default function OutLine({ projection }: { projection: GeoProjection }) {
  return (
    <group renderOrder={1}>
      {scOutlineData.features.map((feature) =>
        feature.geometry.coordinates[0].map((coordinates, coordinatesIndex) => (
          <Extrude
            key={`${feature.properties.name}--${coordinatesIndex}`}
            args={[
              new Shape(
                coordinates.map((coord) => {
                  const [x, y] = projection(coord as [number, number])!;
                  return new Vector2(x, -y);
                })
              ),
              { depth: 0.5, bevelEnabled: false },
            ]}>
            <OutLineAnimated />
          </Extrude>
        ))
      )}
    </group>
  );
}
