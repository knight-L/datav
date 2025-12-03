import { useLayoutEffect } from "react";
import styled from "styled-components";
import autofit from "autofit.js";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

export default function AutoFit(
  props: Omit<typeof Wrapper.defaultProps, "id">
) {
  const id = `autofit_${Date.now().toString(36)}`;

  useLayoutEffect(() => {
    autofit.init({ el: `#${id}` });

    return () => {
      autofit.off();
    };
  }, []);

  return <Wrapper id={id} {...props} />;
}
