import { useImperativeHandle, useLayoutEffect, useRef, type Ref } from "react";
import { Box2, Float32BufferAttribute, Mesh, ShapeGeometry } from "three";
import type { Args } from "@react-three/fiber";

export type ShapeProps = Omit<React.JSX.IntrinsicElements["mesh"], "args"> & {
  ref?: Ref<Mesh>;
  args?: Args<typeof ShapeGeometry>;
  bbox: Box2;
};

function Shape(props: ShapeProps) {
  const { ref, args, bbox, children, ...meshProps } = props;
  const meshRef = useRef<Mesh>(null!);

  useImperativeHandle(ref, () => meshRef.current);
  useLayoutEffect(() => {
    const { geometry } = meshRef.current;
    const pos = geometry.attributes.position;
    const width = bbox.max.x - bbox.min.x;
    const height = bbox.max.y - bbox.min.y;

    const uv: number[] = [];
    let x = 0,
      y = 0,
      u = 0,
      v = 0;
    for (let i = 0; i < pos.count; i++) {
      x = pos.getX(i);
      y = pos.getY(i);
      u = (x - bbox.min.x) / width;
      v = (y - bbox.min.y) / height;
      uv.push(u, v);
    }
    geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  });

  return (
    <mesh ref={meshRef} {...meshProps}>
      <shapeGeometry attach="geometry" args={args} />
      {children}
    </mesh>
  );
}

export default Shape;
