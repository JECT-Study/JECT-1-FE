import Svg, {
  Defs,
  FeBlend,
  FeColorMatrix,
  FeComposite,
  FeFlood,
  FeGaussianBlur,
  FeOffset,
  Filter,
  G,
  Path,
} from "react-native-svg";

export default function HeartIcon() {
  return (
    <Svg width="27" height="25" viewBox="0 0 27 25" fill="none">
      <Defs>
        <Filter
          id="filter0_d_2116_4589"
          x="0.45"
          y="0.471484"
          width="26.1"
          height="24.0561"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset />
          <FeGaussianBlur stdDeviation="0.65" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 0.186223 0 0 0 0 0.167135 0 0 0 0 0.167135 0 0 0 0.21 0"
          />
          <FeBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2116_4589"
          />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2116_4589"
            result="shape"
          />
        </Filter>
      </Defs>
      <G filter="url(#filter0_d_2116_4589)">
        <Path
          d="M22.1044 2.97035C21.0023 2.19448 19.6608 1.77405 18.2792 1.77148C17.1 1.78302 15.9492 2.12354 14.9734 2.74969C14.3774 3.13144 13.8386 3.58677 13.3719 4.1033C13.1317 3.89527 12.8689 3.67306 12.5798 3.43512C11.3722 2.43271 9.81423 1.87929 8.19732 1.87839C7.38671 1.8818 6.58479 2.04329 5.84249 2.3526C5.10019 2.66191 4.43374 3.11229 3.88544 3.67513C1.42329 6.19819 1.08012 9.74917 2.90867 13.7074C4.10398 16.3034 6.56875 18.6697 8.42567 20.2005C9.71147 21.2586 11.3127 22.4697 12.4759 22.9817L12.4675 22.9981C12.7578 23.1516 13.0865 23.2306 13.4206 23.2269C13.591 23.2336 13.7614 23.21 13.9228 23.1575C14.0393 23.1274 14.1523 23.0861 14.2599 23.0344C14.8766 22.7585 15.9283 22.0932 17.8736 20.4866C19.9485 18.8112 21.7836 16.8907 23.3325 14.7735C24.3143 13.3027 24.9484 11.6527 25.1917 9.93542C25.3595 8.62024 25.1636 7.28852 24.6229 6.0686C24.0821 4.84867 23.2148 3.78166 22.1044 2.97035Z"
          fill="#6C4DFF"
        />
      </G>
    </Svg>
  );
}
