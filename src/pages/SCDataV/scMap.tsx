import { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { geoMercator } from "d3-geo";
import { gsap } from "gsap";
import type { CityGeoJSON } from "@/pages/SCDataV/map";

import scMapData from "@/assets/sc.json";
import BaseMap from "./baseMap";
import OutLine from "./outline";
import FlyLine from "./flyLine";

const data = scMapData as CityGeoJSON;

export default function SCMap() {
  const camera = useThree((state) => state.camera);

  const projection = useMemo(() => {
    return geoMercator()
      .center(data.features[0].properties.centroid)
      .scale(80)
      .translate([1.5, 0]);
  }, []);

  useLayoutEffect(() => {
    const tween = gsap.fromTo(
      camera.position,
      { x: -5, y: 5, z: 15 },
      { duration: 1.5, x: 0, y: 8, z: 10, ease: "sine.inOut" }
    );

    return () => {
      tween.kill();
    };
  }, [camera]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <BaseMap projection={projection} />

      <OutLine projection={projection} />
      <FlyLine projection={projection} />
    </group>
  );
}
